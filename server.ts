import express, { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { dbManager } from './src/server/dataStore';
import { User } from './src/types';

// Persistent and cryptographically verifiable session store
interface SessionData {
  userId: string;
  username: string;
  role: string;
  expiresAt: number;
}

const SESSIONS_FILE = process.env.VERCEL
  ? path.join('/tmp', '.sessions_cache.json')
  : path.join(process.cwd(), '.sessions_cache.json');
const HMAC_SECRET = process.env.SESSION_SECRET || 'balcad-crm-secure-session-key-2026';

const sessions: Map<string, SessionData> = new Map();

function loadSessionsFromDisk() {
  try {
    if (fs.existsSync(SESSIONS_FILE)) {
      const raw = fs.readFileSync(SESSIONS_FILE, 'utf-8');
      const list: [string, SessionData][] = JSON.parse(raw);
      const now = Date.now();
      for (const [id, data] of list) {
        if (data && data.expiresAt > now) {
          sessions.set(id, data);
        }
      }
    }
  } catch (e) {
    console.warn('Could not load sessions cache from disk:', e);
  }
}

function saveSessionsToDisk() {
  try {
    const list = Array.from(sessions.entries());
    fs.writeFileSync(SESSIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not save sessions cache to disk:', e);
  }
}

loadSessionsFromDisk();

function createSignedSessionToken(data: SessionData): string {
  const randomSuffix = crypto.randomBytes(8).toString('hex');
  const payloadStr = JSON.stringify({ ...data, rnd: randomSuffix });
  const b64 = Buffer.from(payloadStr).toString('base64url');
  const sig = crypto.createHmac('sha256', HMAC_SECRET).update(b64).digest('base64url');
  return `sess_${sig}_${b64}`;
}

function verifySignedSessionToken(token: string): SessionData | null {
  try {
    if (!token.startsWith('sess_')) return null;
    const parts = token.split('_');
    if (parts.length !== 3) return null;
    const [_, sig, b64] = parts;
    const expectedSig = crypto.createHmac('sha256', HMAC_SECRET).update(b64).digest('base64url');
    if (sig !== expectedSig) return null;
    const parsed = JSON.parse(Buffer.from(b64, 'base64url').toString('utf8'));
    if (!parsed.userId || !parsed.expiresAt || parsed.expiresAt < Date.now()) {
      return null;
    }
    return {
      userId: parsed.userId,
      username: parsed.username,
      role: parsed.role,
      expiresAt: parsed.expiresAt,
    };
  } catch {
    return null;
  }
}

// Rate limiting & lockout tracker
interface LoginAttemptTracker {
  attempts: number;
  lockoutUntil?: number;
}
const loginAttempts: Map<string, LoginAttemptTracker> = new Map();

const app = express();
const PORT = 3000;

// Universal CORS & Preflight middleware (supports Cloud Run proxy, iframe, and local dev origins)
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');
  }
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Session-ID, Cache-Control, Pragma, If-None-Match'
  );
  res.setHeader('Access-Control-Max-Age', '86400');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  next();
});

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// URL normalization for serverless functions on Vercel
app.use((req: Request, _res: Response, next: NextFunction) => {
  if (process.env.VERCEL && req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? req.url : `/${req.url}`}`;
  }
  next();
});

// Auth Middleware
function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const sessionCookie = req.headers['x-session-id'] as string;
  const sessionId = token || sessionCookie;

  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized: Missing session credentials.' });
  }

  let session = sessions.get(sessionId);
  if (!session) {
    // Attempt cryptographic signature recovery for resilience across restarts
    const verified = verifySignedSessionToken(sessionId);
    if (verified) {
      session = verified;
      sessions.set(sessionId, session);
      saveSessionsToDisk();
    }
  }

  if (!session || session.expiresAt < Date.now()) {
    if (session) {
      sessions.delete(sessionId);
      saveSessionsToDisk();
    }
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  const user = dbManager.findUserById(session.userId);
  if (!user) {
    sessions.delete(sessionId);
    saveSessionsToDisk();
    return res.status(401).json({ error: 'User not found.' });
  }

  if (user.status === 'disabled') {
    sessions.delete(sessionId);
    saveSessionsToDisk();
    return res.status(403).json({ error: 'This user is disabled.' });
  }

  (req as any).user = user;
  (req as any).sessionId = sessionId;
  next();
}

function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as User;
  if (!user || user.role !== 'super_admin') {
    return res.status(403).json({ error: 'You do not have permission to perform this action.' });
  }
  next();
}

// -------------------------------------------------------------
// 1. AUTHENTICATION (USERNAME & PASSWORD ONLY)
// -------------------------------------------------------------
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const cleanUsername = username.trim().toLowerCase();

  // Rate Limiting / Lockout Check
  const attemptInfo = loginAttempts.get(cleanUsername) || { attempts: 0 };
  if (attemptInfo.lockoutUntil && attemptInfo.lockoutUntil > Date.now()) {
    const remainingSecs = Math.ceil((attemptInfo.lockoutUntil - Date.now()) / 1000);
    return res.status(429).json({
      error: `Too many failed attempts. Temporary lockout active. Try again in ${remainingSecs} seconds.`,
    });
  }

  const user = dbManager.findUserByUsername(cleanUsername);
  if (!user) {
    attemptInfo.attempts += 1;
    if (attemptInfo.attempts >= 5) {
      attemptInfo.lockoutUntil = Date.now() + 60000; // 1 minute lockout
    }
    loginAttempts.set(cleanUsername, attemptInfo);
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  // Account status check
  if (user.status === 'disabled') {
    return res.status(403).json({ error: 'This user is disabled.' });
  }

  // Password verification
  const isMatch = bcrypt.compareSync(password, user.password_hash);
  if (!isMatch) {
    attemptInfo.attempts += 1;
    if (attemptInfo.attempts >= 5) {
      attemptInfo.lockoutUntil = Date.now() + 60000; // 1 minute lockout
    }
    loginAttempts.set(cleanUsername, attemptInfo);
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  // Reset login attempt counter on success
  loginAttempts.delete(cleanUsername);

  // Update last login
  user.last_login = new Date().toISOString();

  // Create session
  const sessionData: SessionData = {
    userId: user.id,
    username: user.username,
    role: user.role,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  const sessionId = createSignedSessionToken(sessionData);
  sessions.set(sessionId, sessionData);
  saveSessionsToDisk();

  // Log activity
  dbManager.logActivity({
    user_id: user.id,
    username: user.username,
    action: 'Login',
    entity_type: 'auth',
    entity_id: user.id,
    details: `${user.role === 'super_admin' ? 'Super Admin' : 'Staff'} logged in: ${user.username}`,
  });

  const { password_hash, ...safeUser } = user;
  res.json({
    token: sessionId,
    user: safeUser,
    message: 'Login successful',
  });
});

app.get('/api/auth/me', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { password_hash, ...safeUser } = user as any;
  res.json({ user: safeUser });
});

app.post('/api/auth/logout', authenticateUser, (req: Request, res: Response) => {
  const sessionId = (req as any).sessionId;
  const user = (req as any).user as User;
  if (sessionId) {
    sessions.delete(sessionId);
    saveSessionsToDisk();
  }

  dbManager.logActivity({
    user_id: user.id,
    username: user.username,
    action: 'Logout',
    entity_type: 'auth',
    entity_id: user.id,
    details: `User logged out: ${user.username}`,
  });

  res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/api/auth/change-password', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { current_password, new_password, confirm_new_password } = req.body;

  if (!new_password || new_password !== confirm_new_password) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }
  if (new_password.length < 5) {
    return res.status(400).json({ error: 'Password must be at least 5 characters long.' });
  }

  // If current password provided, verify it
  if (current_password) {
    const fullUser = dbManager.getDb().users.find((u) => u.id === user.id);
    if (fullUser && !bcrypt.compareSync(current_password, fullUser.password_hash)) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
  }

  try {
    dbManager.changeEmployeePassword(user.id, new_password, user.username);
    res.json({ success: true, message: 'Password has been successfully updated.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update password.' });
  }
});

// -------------------------------------------------------------
// 2. EMPLOYEE MANAGEMENT (SUPER ADMIN ONLY)
// -------------------------------------------------------------
app.get('/api/employees', authenticateUser, requireSuperAdmin, (req: Request, res: Response) => {
  const staff = dbManager.getStaffList();
  res.json(staff);
});

app.post('/api/employees', authenticateUser, requireSuperAdmin, (req: Request, res: Response) => {
  const admin = (req as any).user as User;
  try {
    const { username, password, full_name, phone, email, department } = req.body;
    if (!username || !password || !full_name || !phone || !email || !department) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const newEmp = dbManager.addEmployee({
      username,
      password,
      full_name,
      phone,
      email,
      department,
      adminUsername: admin.username,
    });
    res.status(201).json(newEmp);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to add employee.' });
  }
});

app.patch('/api/employees/:id', authenticateUser, requireSuperAdmin, (req: Request, res: Response) => {
  const admin = (req as any).user as User;
  try {
    const updated = dbManager.updateEmployee(req.params.id, req.body, admin.username);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update employee.' });
  }
});

app.post('/api/employees/:id/change-password', authenticateUser, requireSuperAdmin, (req: Request, res: Response) => {
  const admin = (req as any).user as User;
  const { new_password, confirm_new_password } = req.body;

  if (!new_password || new_password !== confirm_new_password) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }
  if (new_password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    dbManager.changeEmployeePassword(req.params.id, new_password, admin.username);
    res.json({ success: true, message: 'Employee password has been successfully changed.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to change password.' });
  }
});

app.delete('/api/employees/:id', authenticateUser, requireSuperAdmin, (req: Request, res: Response) => {
  const admin = (req as any).user as User;
  try {
    dbManager.deleteEmployee(req.params.id, admin.username);
    res.json({ success: true, message: 'Employee removed successfully.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to remove employee.' });
  }
});

app.get('/api/employees/:id/activity', authenticateUser, requireSuperAdmin, (req: Request, res: Response) => {
  const emp = dbManager.findUserById(req.params.id);
  if (!emp) return res.status(404).json({ error: 'Employee not found.' });

  const logs = dbManager.getActivityLogs((req as any).user, { username: emp.username });
  res.json(logs);
});

// -------------------------------------------------------------
// 3. ORDER MANAGEMENT
// -------------------------------------------------------------
app.get('/api/orders', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const orders = dbManager.getOrders(user, req.query);
  res.json(orders);
});

app.get('/api/orders/:id', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const order = dbManager.getOrderById(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found.' });

  // Permissions check
  if (user.role !== 'super_admin' && order.created_by !== user.username && order.assigned_staff !== user.username) {
    return res.status(403).json({ error: 'You do not have permission to perform this action.' });
  }

  res.json(order);
});

app.post('/api/orders', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  try {
    const order = dbManager.createOrder(req.body, user);
    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Something went wrong. Please try again.' });
  }
});

app.patch('/api/orders/:id/status', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { status, reason } = req.body;
  try {
    const updated = dbManager.updateOrderStatus(req.params.id, status, reason || '', user);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Something went wrong. Please try again.' });
  }
});

app.patch('/api/orders/:id/assign', authenticateUser, requireSuperAdmin, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { staff_username, reason } = req.body;
  try {
    const updated = dbManager.assignOrder(req.params.id, staff_username, reason || '', user);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Something went wrong. Please try again.' });
  }
});

app.delete('/api/orders/:id', authenticateUser, requireSuperAdmin, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  try {
    dbManager.deleteOrder(req.params.id, user);
    res.json({ success: true, message: 'Order successfully deleted.' });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to delete order.' });
  }
});

// -------------------------------------------------------------
// 4. FINANCIALS & PAYMENTS & AR REPORT
// -------------------------------------------------------------
app.get('/api/ar', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const report = dbManager.getARReport(user, req.query);
  res.json(report);
});

app.post('/api/orders/:id/payments', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  try {
    const result = dbManager.addPayment(req.params.id, req.body, user);
    res.status(201).json({
      message: 'Payment successfully recorded.',
      ...result,
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Something went wrong. Please try again.' });
  }
});

app.post('/api/orders/:id/adjustments', authenticateUser, requireSuperAdmin, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  try {
    const order = dbManager.adjustFinancial(req.params.id, req.body, user);
    res.json({ message: 'Debt successfully updated.', order });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Something went wrong. Please try again.' });
  }
});

app.get('/api/transactions', authenticateUser, (req: Request, res: Response) => {
  let list = dbManager.getDb().transactions;
  const user = (req as any).user as User;
  if (user.role !== 'super_admin') {
    // Filter transactions relevant to employee
    list = list.filter((t) => t.changed_by === user.username);
  }
  if (req.query.type) {
    list = list.filter((t) => t.transaction_type === req.query.type);
  }
  if (req.query.search) {
    const q = (req.query.search as string).toLowerCase();
    list = list.filter(
      (t) =>
        t.order_id.toLowerCase().includes(q) ||
        t.customer_name.toLowerCase().includes(q) ||
        t.changed_by.toLowerCase().includes(q)
    );
  }
  res.json(list);
});

// -------------------------------------------------------------
// 5. CUSTOMERS
// -------------------------------------------------------------
app.get('/api/customers', authenticateUser, (req: Request, res: Response) => {
  let list = dbManager.getDb().customers;
  if (req.query.search) {
    const q = (req.query.search as string).toLowerCase();
    list = list.filter(
      (c) =>
        c.full_name.toLowerCase().includes(q) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q)
    );
  }
  res.json(list);
});

app.get('/api/customers/:id', authenticateUser, (req: Request, res: Response) => {
  const cust = dbManager.getDb().customers.find((c) => c.id === req.params.id);
  if (!cust) return res.status(404).json({ error: 'Customer not found.' });

  const orders = dbManager.getDb().orders.filter((o) => o.customer_id === cust.id);
  res.json({
    customer: cust,
    orders,
  });
});

app.post('/api/customers', authenticateUser, (req: Request, res: Response) => {
  const { full_name, phone, email, country, city, notes } = req.body;
  if (!full_name || !phone) {
    return res.status(400).json({ error: 'Full name and phone are required.' });
  }

  const newCust = {
    id: `cust-${Date.now()}`,
    full_name,
    phone,
    email: email || '',
    country: country || 'Somalia',
    city: city || 'Mogadishu',
    notes: notes || '',
    created_at: new Date().toISOString(),
    orders_count: 0,
    total_debt: 0,
    last_order_date: new Date().toISOString().split('T')[0],
  };

  dbManager.getDb().customers.unshift(newCust);
  res.status(201).json(newCust);
});

// -------------------------------------------------------------
// 6. INTERNAL STAFF MESSAGING (NO CUSTOMER CHAT)
// -------------------------------------------------------------
app.get('/api/staff/search', authenticateUser, (req: Request, res: Response) => {
  const q = (req.query.q as string) || '';
  const staff = dbManager.searchStaff(q);
  res.json(staff);
});

app.get('/api/conversations', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const conversations = dbManager.getConversations(user);
  res.json(conversations);
});

app.post('/api/conversations/direct', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { target_user_id } = req.body;
  try {
    const conv = dbManager.startDirectConversation(target_user_id, user);
    res.status(201).json(conv);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to start conversation.' });
  }
});

app.post('/api/conversations/group', authenticateUser, requireSuperAdmin, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { title, participant_user_ids } = req.body;
  if (!title) return res.status(400).json({ error: 'Group title is required.' });

  try {
    const group = dbManager.createGroupConversation(title, participant_user_ids || [], user);
    res.status(201).json(group);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to create group.' });
  }
});

app.get('/api/conversations/:id/messages', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  try {
    const messages = dbManager.getMessages(req.params.id, user);
    res.json(messages);
  } catch (err: any) {
    res.status(403).json({ error: err.message || 'Forbidden.' });
  }
});

app.post('/api/conversations/:id/messages', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { message_text, attachments } = req.body;

  if (!message_text && (!attachments || attachments.length === 0)) {
    return res.status(400).json({ error: 'Message cannot be empty.' });
  }

  try {
    const msg = dbManager.sendMessage(req.params.id, message_text || '', attachments || [], user);
    res.status(201).json(msg);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to send message.' });
  }
});

app.patch('/api/conversations/:id/status', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { status } = req.body;
  try {
    const conv = dbManager.toggleConversationStatus(req.params.id, status, user);
    res.json(conv);
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to update conversation status.' });
  }
});

// -------------------------------------------------------------
// 7. DOCUMENTS
// -------------------------------------------------------------
app.post('/api/documents/upload', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const { order_id, file_name, file_type, file_size, file_url } = req.body;

  const newDoc = {
    id: `doc-${Date.now()}`,
    order_id: order_id || '',
    file_name: file_name || 'document.pdf',
    file_type: file_type || 'application/pdf',
    file_size: Number(file_size) || 1024,
    file_url: file_url || '/docs/uploaded_doc.pdf',
    uploaded_by: user.username,
    uploaded_at: new Date().toISOString(),
  };

  dbManager.getDb().documents.push(newDoc);
  dbManager.logActivity({
    user_id: user.id,
    username: user.username,
    action: 'Document Uploaded',
    entity_type: 'order',
    entity_id: order_id,
    details: `Uploaded by: ${user.username} | ${newDoc.file_name} (${Math.round(newDoc.file_size / 1024)} KB)`,
  });

  res.status(201).json(newDoc);
});

app.get('/api/documents/:orderId', authenticateUser, (req: Request, res: Response) => {
  const docs = dbManager.getDb().documents.filter((d) => d.order_id === req.params.orderId);
  res.json(docs);
});

// -------------------------------------------------------------
// 8. DASHBOARD & REPORTS & ACTIVITY
// -------------------------------------------------------------
app.get('/api/reports/dashboard', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const metrics = dbManager.getDashboardMetrics(user);
  res.json(metrics);
});

app.get('/api/reports/general', authenticateUser, (req: Request, res: Response) => {
  const reports = dbManager.getReports(req.query);
  res.json(reports);
});

app.get('/api/reports/daily', authenticateUser, (req: Request, res: Response) => {
  const dateStr = req.query.date as string;
  const report = dbManager.getDailyReport(dateStr);
  res.json(report);
});

app.get('/api/activity', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const logs = dbManager.getActivityLogs(user, req.query);
  res.json(logs);
});

// -------------------------------------------------------------
// 9. NOTIFICATIONS
// -------------------------------------------------------------
app.get('/api/notifications', authenticateUser, (req: Request, res: Response) => {
  const user = (req as any).user as User;
  const notifs = dbManager.getNotifications(user.id);
  res.json(notifs);
});

app.patch('/api/notifications/:id/read', authenticateUser, (req: Request, res: Response) => {
  dbManager.markNotificationRead(req.params.id);
  res.json({ success: true });
});

app.post('/api/notifications/mark-all-read', authenticateUser, (req: Request, res: Response) => {
  dbManager.markAllNotificationsRead();
  res.json({ success: true });
});

// -------------------------------------------------------------
// 10. EXTERNAL CUSTOMER REQUESTS API (FOR FUTURE SEPARATE WEBSITE)
// -------------------------------------------------------------
app.post('/api/customer-requests', (req: Request, res: Response) => {
  // Public webhook / API endpoint for the future customer website
  const { name, phone, email, service_type, details } = req.body;
  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone are required.' });
  }

  // Auto-generate notification and initial draft order
  const draftId = `REQ-${Date.now().toString().slice(-5)}`;
  dbManager.createNotification({
    type: 'order',
    title: 'New Website Inquiry Received',
    message: `Inquiry from ${name} (${phone}) for ${service_type || 'General Service'}. Check customer requests.`,
    related_record_id: draftId,
  });

  res.status(200).json({
    success: true,
    message: 'Request received. Balcad Travel Agency staff will process the booking internally.',
    reference_id: draftId,
  });
});

// Global Express Error Handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled server error:', err);
  if (!res.headersSent) {
    res.status(err.status || 500).json({
      error: err.message || 'Internal server error occurred.',
    });
  }
});

// -------------------------------------------------------------
// VITE DEV SERVER / STANDALONE PRODUCTION SERVER
// -------------------------------------------------------------
async function startServer() {
  if (process.env.VERCEL) {
    return; // Standalone server loop is not used in Vercel Serverless environment
  }

  const serverPort = Number(process.env.PORT) || PORT;

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(serverPort, '0.0.0.0', () => {
    console.log(`Balcad Travel Agency CRM Server running on port ${serverPort}`);
  });
}

if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('Failed to start CRM server:', err);
  });
}

export default app;
