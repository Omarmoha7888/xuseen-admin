import {
  User,
  Customer,
  Order,
  Payment,
  Transaction,
  Conversation,
  Message,
  ActivityLog,
  NotificationItem,
  DashboardMetrics,
  OrderStatus,
  ServiceType,
} from '../types';

interface LocalDB {
  users: (User & { password_plain: string })[];
  customers: Customer[];
  orders: Order[];
  payments: Payment[];
  transactions: Transaction[];
  conversations: Conversation[];
  messages: Message[];
  notifications: NotificationItem[];
  activity_logs: ActivityLog[];
}

const LOCAL_STORAGE_KEY = 'balcad_crm_local_db_v3';
const ACTIVE_USER_KEY = 'balcad_crm_active_user_v3';

function createInitialLocalDB(): LocalDB {
  const users: (User & { password_plain: string })[] = [
    {
      id: 'usr-admin-01',
      username: 'blc00001',
      role: 'super_admin',
      status: 'active',
      failed_login_attempts: 0,
      created_at: '2026-01-01T08:00:00Z',
      last_login: new Date().toISOString(),
      password_plain: 'xuseen.50',
      profile: {
        id: 'prof-01',
        user_id: 'usr-admin-01',
        full_name: 'Hussein Mohamud Ali',
        phone: '612483838',
        email: 'balcadtravel@gmail.com',
        department: 'Executive Management',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      },
    },
    {
      id: 'usr-staff-01',
      username: 'mohamed',
      role: 'employee',
      status: 'active',
      failed_login_attempts: 0,
      created_at: '2026-01-10T09:30:00Z',
      last_login: new Date(Date.now() - 3600000).toISOString(),
      password_plain: 'password123',
      profile: {
        id: 'prof-02',
        user_id: 'usr-staff-01',
        full_name: 'Mohamed Abdullahi',
        phone: '612141414',
        email: 'mohamed.abdullahi@balcadtravel.so',
        department: 'Ticketing & Flights',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      },
    },
    {
      id: 'usr-staff-02',
      username: 'sarah',
      role: 'employee',
      status: 'active',
      failed_login_attempts: 0,
      created_at: '2026-01-15T11:00:00Z',
      last_login: new Date(Date.now() - 7200000).toISOString(),
      password_plain: 'password123',
      profile: {
        id: 'prof-03',
        user_id: 'usr-staff-02',
        full_name: 'Sarah Warsame',
        phone: '612998877',
        email: 'sarah.warsame@balcadtravel.so',
        department: 'Visa Operations',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      },
    },
  ];

  const customers: Customer[] = [
    {
      id: 'cust-01',
      full_name: 'Ahmed Hassan Farah',
      phone: '615112233',
      email: 'ahmed.farah@gmail.com',
      country: 'Somalia',
      city: 'Mogadishu',
      notes: 'Frequent business traveler to Nairobi and Dubai.',
      created_at: '2026-01-12T10:00:00Z',
      orders_count: 3,
      total_debt: 250,
      last_order_date: '2026-02-18T14:30:00Z',
    },
    {
      id: 'cust-02',
      full_name: 'Khadija Omar Elmi',
      phone: '615445566',
      email: 'khadija.elmi@yahoo.com',
      country: 'Somalia',
      city: 'Hargeisa',
      notes: 'Family travel coordinator.',
      created_at: '2026-01-18T11:20:00Z',
      orders_count: 2,
      total_debt: 0,
      last_order_date: '2026-02-20T09:15:00Z',
    },
    {
      id: 'cust-03',
      full_name: 'Yusuf Abdi Warsame',
      phone: '615778899',
      email: 'yusuf.abdi@gmail.com',
      country: 'Kenya',
      city: 'Nairobi',
      notes: 'Requires Turkey medical visa and flight package.',
      created_at: '2026-01-25T15:40:00Z',
      orders_count: 2,
      total_debt: 420,
      last_order_date: '2026-02-22T16:00:00Z',
    },
    {
      id: 'cust-04',
      full_name: 'Faiza Nur Mohamed',
      phone: '615990011',
      email: 'faiza.nur@outlook.com',
      country: 'Somalia',
      city: 'Mogadishu',
      notes: 'Umrah group booking lead.',
      created_at: '2026-02-02T08:30:00Z',
      orders_count: 1,
      total_debt: 0,
      last_order_date: '2026-02-15T10:00:00Z',
    },
    {
      id: 'cust-05',
      full_name: 'Mustafa Jama Ali',
      phone: '615223344',
      email: 'mustafa.jama@gmail.com',
      country: 'United Arab Emirates',
      city: 'Dubai',
      notes: 'Business merchant, prompt payment history.',
      created_at: '2026-02-05T13:10:00Z',
      orders_count: 2,
      total_debt: 180,
      last_order_date: '2026-02-23T11:45:00Z',
    },
  ];

  const orders: Order[] = [
    {
      id: 'ord-1001',
      order_number: 'ORD-1001',
      customer_id: 'cust-01',
      customer: customers[0],
      service_type: 'Flight Ticket',
      status: 'Confirmed',
      payment_type: 'Debt',
      created_by: 'blc00001',
      created_by_user_id: 'usr-admin-01',
      assigned_staff: 'mohamed',
      assigned_staff_id: 'usr-staff-01',
      total_price: 450,
      amount_paid: 200,
      outstanding_debt: 250,
      currency: 'USD',
      service_details: {
        passenger_name: 'Ahmed Hassan Farah',
        route: 'Mogadishu (MGQ) -> Nairobi (NBO)',
        airline: 'Daallo Airlines',
        departure_date: '2026-03-05',
      },
      notes: 'Deposit received. Balance $250 due on March 1st.',
      price_entered_by: 'blc00001',
      price_entered_at: '2026-02-18T14:30:00Z',
      created_at: '2026-02-18T14:30:00Z',
      updated_at: '2026-02-19T10:00:00Z',
    },
    {
      id: 'ord-1002',
      order_number: 'ORD-1002',
      customer_id: 'cust-02',
      customer: customers[1],
      service_type: 'Visa Service',
      status: 'Completed',
      payment_type: 'Paid',
      created_by: 'blc00001',
      created_by_user_id: 'usr-admin-01',
      assigned_staff: 'sarah',
      assigned_staff_id: 'usr-staff-02',
      total_price: 320,
      amount_paid: 320,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        destination_country: 'United Arab Emirates',
        visa_type: '30 Days Tourist Visa',
      },
      notes: 'Visa approved. Full payment settled.',
      price_entered_by: 'blc00001',
      price_entered_at: '2026-02-20T09:15:00Z',
      created_at: '2026-02-20T09:15:00Z',
      updated_at: '2026-02-21T16:00:00Z',
    },
    {
      id: 'ord-1003',
      order_number: 'ORD-1003',
      customer_id: 'cust-03',
      customer: customers[2],
      service_type: 'Travel Package',
      status: 'In Progress',
      payment_type: 'Debt',
      created_by: 'blc00001',
      created_by_user_id: 'usr-admin-01',
      assigned_staff: 'sarah',
      assigned_staff_id: 'usr-staff-02',
      total_price: 1200,
      amount_paid: 780,
      outstanding_debt: 420,
      currency: 'USD',
      service_details: {
        destination: 'Istanbul, Turkey',
        hotel_name: 'Grand Halic Hotel',
      },
      notes: 'Embassy appointment confirmed. Remaining balance $420.',
      price_entered_by: 'blc00001',
      price_entered_at: '2026-02-22T16:00:00Z',
      created_at: '2026-02-22T16:00:00Z',
      updated_at: '2026-02-23T08:30:00Z',
    },
    {
      id: 'ord-1004',
      order_number: 'ORD-1004',
      customer_id: 'cust-04',
      customer: customers[3],
      service_type: 'Travel Package',
      status: 'Completed',
      payment_type: 'Paid',
      created_by: 'blc00001',
      created_by_user_id: 'usr-admin-01',
      assigned_staff: 'mohamed',
      assigned_staff_id: 'usr-staff-01',
      total_price: 1850,
      amount_paid: 1850,
      outstanding_debt: 0,
      currency: 'USD',
      service_details: {
        destination: 'Makkah & Madinah, KSA',
      },
      notes: 'Umrah package. Fully paid.',
      price_entered_by: 'blc00001',
      price_entered_at: '2026-02-15T10:00:00Z',
      created_at: '2026-02-15T10:00:00Z',
      updated_at: '2026-02-18T12:00:00Z',
    },
    {
      id: 'ord-1005',
      order_number: 'ORD-1005',
      customer_id: 'cust-05',
      customer: customers[4],
      service_type: 'Flight Ticket',
      status: 'Pending',
      payment_type: 'Debt',
      created_by: 'blc00001',
      created_by_user_id: 'usr-admin-01',
      assigned_staff: 'mohamed',
      assigned_staff_id: 'usr-staff-01',
      total_price: 680,
      amount_paid: 500,
      outstanding_debt: 180,
      currency: 'USD',
      service_details: {
        route: 'Mogadishu (MGQ) -> Dubai (DXB)',
        airline: 'Flydubai',
      },
      notes: 'Deposit of $500 paid. Remaining balance $180.',
      price_entered_by: 'blc00001',
      price_entered_at: '2026-02-23T11:45:00Z',
      created_at: '2026-02-23T11:45:00Z',
      updated_at: '2026-02-23T11:45:00Z',
    },
  ];

  const payments: Payment[] = [
    {
      id: 'pay-01',
      order_id: 'ord-1001',
      amount: 200,
      currency: 'USD',
      payment_method: 'EVC Plus',
      payment_note: 'Initial booking deposit',
      received_by: 'mohamed',
      payment_date: '2026-02-18T14:40:00Z',
      created_at: '2026-02-18T14:40:00Z',
    },
    {
      id: 'pay-02',
      order_id: 'ord-1002',
      amount: 320,
      currency: 'USD',
      payment_method: 'Zaad',
      payment_note: 'Full payment for Dubai visa',
      received_by: 'sarah',
      payment_date: '2026-02-20T09:20:00Z',
      created_at: '2026-02-20T09:20:00Z',
    },
    {
      id: 'pay-03',
      order_id: 'ord-1003',
      amount: 780,
      currency: 'USD',
      payment_method: 'Bank Transfer',
      payment_note: 'Package deposit',
      received_by: 'sarah',
      payment_date: '2026-02-22T16:15:00Z',
      created_at: '2026-02-22T16:15:00Z',
    },
  ];

  const transactions: Transaction[] = [
    {
      id: 'tx-01',
      order_id: 'ord-1001',
      customer_name: 'Ahmed Hassan Farah',
      transaction_type: 'Payment Received',
      previous_balance: 450,
      payment_amount: 200,
      new_balance: 250,
      total_paid_before: 0,
      total_paid_after: 200,
      currency: 'USD',
      changed_by: 'mohamed',
      created_at: '2026-02-18T14:40:00Z',
      notes: 'Initial booking deposit',
    },
    {
      id: 'tx-02',
      order_id: 'ord-1002',
      customer_name: 'Khadija Omar Elmi',
      transaction_type: 'Debt Fully Paid',
      previous_balance: 320,
      payment_amount: 320,
      new_balance: 0,
      total_paid_before: 0,
      total_paid_after: 320,
      currency: 'USD',
      changed_by: 'sarah',
      created_at: '2026-02-20T09:20:00Z',
      notes: 'Full payment for Dubai visa',
    },
  ];

  const conversations: Conversation[] = [
    {
      id: 'conv-01',
      type: 'group',
      title: 'Agency Operations & Ticketing',
      status: 'open',
      created_by: 'usr-admin-01',
      created_by_username: 'blc00001',
      participants: [
        {
          id: 'part-01',
          conversation_id: 'conv-01',
          user_id: 'usr-admin-01',
          username: 'blc00001',
          full_name: 'Hussein Mohamud Ali',
          phone: '612483838',
          joined_at: '2026-01-01T08:00:00Z',
          participant_status: 'active',
        },
      ],
      created_at: '2026-01-01T08:00:00Z',
      updated_at: '2026-02-23T12:00:00Z',
    },
  ];

  const messages: Message[] = [
    {
      id: 'msg-01',
      conversation_id: 'conv-01',
      sender_id: 'usr-admin-01',
      sender_username: 'blc00001',
      sender_name: 'Hussein Mohamud Ali',
      message_text: 'Ku soo dhawaada nidaamka CRM-ka Balcad Travel Agency.',
      created_at: '2026-02-23T12:00:00Z',
    },
  ];

  const notifications: NotificationItem[] = [
    {
      id: 'notif-01',
      type: 'order',
      title: 'Order Status Confirmed',
      message: 'Order ORD-1001 for Ahmed Hassan Farah has been confirmed.',
      read: false,
      created_at: '2026-02-19T10:00:00Z',
      related_record_id: 'ord-1001',
    },
  ];

  const activity_logs: ActivityLog[] = [
    {
      id: 'act-01',
      user_id: 'usr-admin-01',
      username: 'blc00001',
      action: 'System Initialized',
      entity_type: 'system',
      details: 'Super Admin Hussein Mohamud Ali configured CRM data store.',
      created_at: '2026-01-01T08:00:00Z',
    },
  ];

  return {
    users,
    customers,
    orders,
    payments,
    transactions,
    conversations,
    messages,
    notifications,
    activity_logs,
  };
}

class LocalCRMEngine {
  private db: LocalDB;

  constructor() {
    this.db = this.loadDB();
  }

  private loadDB(): LocalDB {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const admin = parsed.users?.find((u: any) => u.role === 'super_admin');
        if (admin) {
          if (admin.username !== 'blc00001') {
            admin.username = 'blc00001';
            admin.profile.full_name = 'Hussein Mohamud Ali';
            admin.password_plain = 'xuseen.50';
          }
        }
        return parsed;
      }
    } catch {}
    const initial = createInitialLocalDB();
    this.saveDB(initial);
    return initial;
  }

  private saveDB(data?: LocalDB): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data || this.db));
    } catch (e) {
      console.warn('Could not save local DB to localStorage:', e);
    }
  }

  private getActiveUser(): User {
    try {
      const stored = localStorage.getItem(ACTIVE_USER_KEY);
      if (stored) return JSON.parse(stored);
    } catch {}
    const admin = this.db.users.find((u) => u.role === 'super_admin') || this.db.users[0];
    const { password_plain, ...safeUser } = admin;
    return safeUser;
  }

  private setActiveUser(user: User): void {
    try {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
    } catch {}
  }

  public handle<T>(endpoint: string, options: RequestInit = {}): T {
    const method = (options.method || 'GET').toUpperCase();
    const cleanEndpoint = endpoint.replace(/^\/api/, '').split('?')[0];
    const urlObj = new URL('http://local' + (endpoint.startsWith('/') ? endpoint : `/${endpoint}`));
    const searchParams = urlObj.searchParams;
    let body: any = {};
    if (options.body && typeof options.body === 'string') {
      try {
        body = JSON.parse(options.body);
      } catch {}
    }

    // 1. Auth: Login
    if (cleanEndpoint === '/auth/login' && method === 'POST') {
      const { username, password } = body;
      const cleanUser = (username || '').trim().toLowerCase();
      const user = this.db.users.find(
        (u) =>
          u.username.toLowerCase() === cleanUser ||
          (cleanUser === 'blc00001' && u.role === 'super_admin') ||
          (cleanUser === 'admin' && u.role === 'super_admin')
      );

      if (!user) {
        throw new Error('Username-ka ama password-ka ma saxana (Invalid username or password).');
      }

      const isSuperAdmin = user.role === 'super_admin';
      const passwordMatches =
        password === user.password_plain ||
        (isSuperAdmin && (password === 'xuseen.50' || password === user.password_plain));

      if (!passwordMatches) {
        throw new Error('Password-ka ma saxana (Incorrect password).');
      }

      user.username = 'blc00001';
      user.profile.full_name = 'Hussein Mohamud Ali';
      user.last_login = new Date().toISOString();
      const { password_plain, ...safeUser } = user;
      this.setActiveUser(safeUser);
      this.saveDB();

      const token = `sess_local_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      return {
        token,
        user: safeUser,
        message: 'Login successful',
      } as unknown as T;
    }

    // 2. Auth: Me
    if (cleanEndpoint === '/auth/me') {
      const active = this.getActiveUser();
      return { user: active } as unknown as T;
    }

    // 3. Auth: Change Password
    if (cleanEndpoint === '/auth/change-password' && method === 'POST') {
      const { new_password, confirm_new_password } = body;
      if (!new_password || new_password !== confirm_new_password) {
        throw new Error('Passwords do not match or are empty.');
      }
      const active = this.getActiveUser();
      const user = this.db.users.find((u) => u.id === active.id || u.role === 'super_admin');
      if (user) {
        user.password_plain = new_password;
        this.saveDB();
      }
      return { success: true, message: 'Password-kaaga si guul leh ayaa loo badalay!' } as unknown as T;
    }

    // 4. Dashboard Metrics
    if (cleanEndpoint === '/reports/dashboard' || cleanEndpoint === '/dashboard') {
      const totalDebt = this.db.orders.reduce((sum, o) => sum + (o.outstanding_debt || 0), 0);
      const pendingCount = this.db.orders.filter((o) => o.status === 'Pending').length;
      const inProgressCount = this.db.orders.filter((o) => o.status === 'In Progress').length;
      const availableCount = this.db.orders.filter((o) => o.status === 'Available').length;
      const confirmedCount = this.db.orders.filter((o) => o.status === 'Confirmed').length;
      const completedCount = this.db.orders.filter((o) => o.status === 'Completed').length;
      const rejectedCount = this.db.orders.filter((o) => o.status === 'Rejected').length;
      const debtOrdersCount = this.db.orders.filter((o) => (o.outstanding_debt || 0) > 0).length;

      const services: Record<ServiceType, number> = {
        'Flight Ticket': 0,
        'Visa Service': 0,
        'Hotel': 0,
        'Travel Package': 0,
        'Airport Transfer': 0,
        'Other': 0,
      };
      this.db.orders.forEach((o) => {
        if (services[o.service_type] !== undefined) {
          services[o.service_type]++;
        }
      });

      const metrics: DashboardMetrics = {
        new_requests: 1,
        pending_orders: pendingCount,
        in_progress_orders: inProgressCount,
        available_orders: availableCount,
        confirmed_orders: confirmedCount,
        completed_orders: completedCount,
        rejected_orders: rejectedCount,
        debt_orders: debtOrdersCount,
        total_outstanding_debt: totalDebt,
        todays_requests: 2,
        todays_orders: this.db.orders.length,
        active_employees: this.db.users.length,
        orders_by_service: Object.entries(services).map(([svc, count]) => ({
          service: svc as ServiceType,
          count,
          percentage: this.db.orders.length ? Math.round((count / this.db.orders.length) * 100) : 0,
        })),
        orders_by_status: [
          { status: 'Confirmed' as OrderStatus, count: confirmedCount, percentage: 30 },
          { status: 'Completed' as OrderStatus, count: completedCount, percentage: 40 },
          { status: 'In Progress' as OrderStatus, count: inProgressCount, percentage: 20 },
          { status: 'Pending' as OrderStatus, count: pendingCount, percentage: 10 },
        ],
        orders_by_day: [
          { date: '2026-02-20', count: 2 },
          { date: '2026-02-21', count: 1 },
          { date: '2026-02-22', count: 3 },
          { date: '2026-02-23', count: 4 },
        ],
        payments_and_debt_by_week: [
          { week: 'Week 1', payments: 2400, debt: 450 },
          { week: 'Week 2', payments: 3100, debt: 620 },
          { week: 'Week 3', payments: 2850, debt: 850 },
        ],
      };
      return metrics as unknown as T;
    }

    // 5. Orders: List
    if (cleanEndpoint === '/orders' && method === 'GET') {
      let list = [...this.db.orders];
      const status = searchParams.get('status');
      const search = searchParams.get('search');
      if (status) {
        list = list.filter((o) => o.status.toLowerCase() === status.toLowerCase());
      }
      if (search) {
        const q = search.toLowerCase();
        list = list.filter(
          (o) =>
            (o.customer?.full_name || '').toLowerCase().includes(q) ||
            o.order_number.toLowerCase().includes(q) ||
            (o.customer?.phone || '').includes(q)
        );
      }
      return list as unknown as T;
    }

    // 6. Orders: Create
    if (cleanEndpoint === '/orders' && method === 'POST') {
      const active = this.getActiveUser();
      const count = this.db.orders.length + 1;
      const orderNumber = `ORD-${1000 + count}`;
      const selling = Number(body.total_price || body.selling_price) || 0;
      const paid = Number(body.amount_paid || body.paid_amount) || 0;
      const debt = Math.max(0, selling - paid);

      const cust = this.db.customers.find((c) => c.id === body.customer_id) || this.db.customers[0];

      const newOrder: Order = {
        id: `ord-${Date.now()}`,
        order_number: orderNumber,
        customer_id: cust.id,
        customer: cust,
        service_type: body.service_type || 'Flight Ticket',
        status: body.status || 'New',
        payment_type: debt > 0 ? 'Debt' : 'Paid',
        created_by: active.username,
        created_by_user_id: active.id,
        assigned_staff: body.assigned_staff || active.username,
        assigned_staff_id: active.id,
        total_price: selling,
        amount_paid: paid,
        outstanding_debt: debt,
        currency: 'USD',
        service_details: body.service_details || {},
        notes: body.notes || '',
        price_entered_by: active.username,
        price_entered_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      this.db.orders.unshift(newOrder);

      if (paid > 0) {
        this.db.transactions.unshift({
          id: `tx-${Date.now()}`,
          order_id: newOrder.id,
          customer_name: cust.full_name,
          transaction_type: 'Payment Received',
          previous_balance: selling,
          payment_amount: paid,
          new_balance: debt,
          total_paid_before: 0,
          total_paid_after: paid,
          currency: 'USD',
          changed_by: active.username,
          created_at: new Date().toISOString(),
          notes: `Initial deposit for ${newOrder.order_number}`,
        });
      }

      this.saveDB();
      return newOrder as unknown as T;
    }

    // 7. Orders: Single Order (GET & DELETE)
    const orderMatch = cleanEndpoint.match(/^\/orders\/([^\/]+)$/);
    if (orderMatch && method === 'GET') {
      const id = orderMatch[1];
      const ord = this.db.orders.find((o) => o.id === id || o.order_number === id);
      if (!ord) throw new Error('Order not found');
      return ord as unknown as T;
    }

    if (orderMatch && method === 'DELETE') {
      const id = orderMatch[1];
      const active = this.getActiveUser();
      if (active.role !== 'super_admin') {
        throw new Error('You do not have permission to delete orders (Super Admin only).');
      }
      const idx = this.db.orders.findIndex((o) => o.id === id || o.order_number === id);
      if (idx !== -1) {
        const deleted = this.db.orders.splice(idx, 1)[0];

        // Clean up customer stats
        const cust = this.db.customers.find((c) => c.id === deleted.customer_id);
        if (cust) {
          cust.orders_count = Math.max(0, (cust.orders_count || 1) - 1);
          cust.total_debt = Math.max(0, (cust.total_debt || 0) - (deleted.outstanding_debt || 0));
        }

        // Remove associated payments
        this.db.payments = this.db.payments.filter((p) => p.order_id !== deleted.id && p.order_id !== deleted.order_number);

        // Remove associated transactions
        this.db.transactions = this.db.transactions.filter((t) => t.order_id !== deleted.id && t.order_id !== deleted.order_number);

        // Log activity
        this.db.activity_logs.unshift({
          id: `act-${Date.now()}`,
          user_id: active.id,
          username: active.username,
          action: 'Order Deleted',
          entity_type: 'order',
          entity_id: deleted.order_number,
          details: `Deleted by: ${active.username} | Deleted order ${deleted.order_number}`,
          created_at: new Date().toISOString(),
        });

        this.saveDB();
      }
      return { success: true, message: 'Order successfully deleted.' } as unknown as T;
    }

    // 7b. Orders: Financial Adjustments
    const adjustMatch = cleanEndpoint.match(/^\/orders\/([^\/]+)\/adjustments$/);
    if (adjustMatch && method === 'POST') {
      const id = adjustMatch[1];
      const ord = this.db.orders.find((o) => o.id === id || o.order_number === id);
      if (!ord) throw new Error('Order not found');
      const active = this.getActiveUser();
      if (active.role !== 'super_admin') {
        throw new Error('You do not have permission to adjust financials.');
      }
      if (body.new_price !== undefined) {
        ord.total_price = Number(body.new_price);
        ord.outstanding_debt = Math.max(0, ord.total_price - ord.amount_paid);
      } else if (body.adjustment_amount !== undefined) {
        ord.outstanding_debt = Math.max(0, ord.outstanding_debt + Number(body.adjustment_amount));
        ord.total_price = ord.amount_paid + ord.outstanding_debt;
      }
      ord.payment_type = ord.outstanding_debt > 0 ? 'Debt' : 'Paid';
      ord.updated_at = new Date().toISOString();
      this.saveDB();
      return { message: 'Debt updated successfully', order: ord } as unknown as T;
    }

    // 8. Orders: Update status
    const statusMatch = cleanEndpoint.match(/^\/orders\/([^\/]+)\/status$/);
    if (statusMatch && method === 'PATCH') {
      const id = statusMatch[1];
      const ord = this.db.orders.find((o) => o.id === id || o.order_number === id);
      if (!ord) throw new Error('Order not found');
      ord.status = body.status;
      ord.updated_at = new Date().toISOString();
      this.saveDB();
      return ord as unknown as T;
    }

    // 9. Orders: Assign
    const assignMatch = cleanEndpoint.match(/^\/orders\/([^\/]+)\/assign$/);
    if (assignMatch && method === 'PATCH') {
      const id = assignMatch[1];
      const ord = this.db.orders.find((o) => o.id === id || o.order_number === id);
      if (!ord) throw new Error('Order not found');
      ord.assigned_staff = body.staff_username;
      ord.updated_at = new Date().toISOString();
      this.saveDB();
      return ord as unknown as T;
    }

    // 10. Orders: Add Payment
    const paymentMatch = cleanEndpoint.match(/^\/orders\/([^\/]+)\/payments$/);
    if (paymentMatch && method === 'POST') {
      const id = paymentMatch[1];
      const ord = this.db.orders.find((o) => o.id === id || o.order_number === id);
      if (!ord) throw new Error('Order not found');
      const amount = Number(body.amount) || 0;
      ord.amount_paid += amount;
      ord.outstanding_debt = Math.max(0, ord.total_price - ord.amount_paid);
      if (ord.outstanding_debt === 0) {
        ord.payment_type = 'Paid';
      }
      ord.updated_at = new Date().toISOString();

      const payment: Payment = {
        id: `pay-${Date.now()}`,
        order_id: ord.id,
        amount,
        currency: 'USD',
        payment_method: body.payment_method || 'EVC Plus',
        payment_note: body.payment_note || body.notes || '',
        received_by: this.getActiveUser().username,
        payment_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
      };
      this.db.payments.unshift(payment);

      this.db.transactions.unshift({
        id: `tx-${Date.now()}`,
        order_id: ord.id,
        customer_name: ord.customer?.full_name || 'Customer',
        transaction_type: ord.outstanding_debt === 0 ? 'Debt Fully Paid' : 'Payment Received',
        previous_balance: ord.outstanding_debt + amount,
        payment_amount: amount,
        new_balance: ord.outstanding_debt,
        total_paid_before: ord.amount_paid - amount,
        total_paid_after: ord.amount_paid,
        currency: 'USD',
        changed_by: this.getActiveUser().username,
        created_at: new Date().toISOString(),
        notes: body.notes || `Payment for ${ord.order_number}`,
      });

      this.saveDB();
      return { message: 'Payment recorded successfully', payment, order: ord } as unknown as T;
    }

    // 11. Customers: List & Search
    if (cleanEndpoint === '/customers' && method === 'GET') {
      const q = (searchParams.get('search') || '').toLowerCase();
      let list = [...this.db.customers];
      if (q) {
        list = list.filter(
          (c) =>
            c.full_name.toLowerCase().includes(q) ||
            c.phone.includes(q) ||
            c.email.toLowerCase().includes(q)
        );
      }
      return list as unknown as T;
    }

    // 12. Customers: Create
    if (cleanEndpoint === '/customers' && method === 'POST') {
      const newCust: Customer = {
        id: `cust-${Date.now()}`,
        full_name: body.full_name,
        phone: body.phone,
        email: body.email || '',
        country: body.country || 'Somalia',
        city: body.city || 'Mogadishu',
        notes: body.notes || '',
        created_at: new Date().toISOString(),
        orders_count: 0,
        total_debt: 0,
      };
      this.db.customers.unshift(newCust);
      this.saveDB();
      return newCust as unknown as T;
    }

    // 13. Customers: Single with Orders (GET & DELETE)
    const custMatch = cleanEndpoint.match(/^\/customers\/([^\/]+)$/);
    if (custMatch && method === 'GET') {
      const id = custMatch[1];
      const customer = this.db.customers.find((c) => c.id === id);
      if (!customer) throw new Error('Customer not found');
      const orders = this.db.orders.filter((o) => o.customer_id === id);
      return { customer, orders } as unknown as T;
    }

    if (custMatch && method === 'DELETE') {
      const id = custMatch[1];
      const active = this.getActiveUser();
      if (active.role !== 'super_admin') {
        throw new Error('Only Super Admin can delete customers.');
      }
      this.db.customers = this.db.customers.filter((c) => c.id !== id);
      this.saveDB();
      return { success: true, message: 'Customer deleted successfully' } as unknown as T;
    }

    // 14. AR Report
    if (cleanEndpoint === '/ar' || cleanEndpoint === '/reports/ar') {
      const debtOrders = this.db.orders.filter((o) => (o.outstanding_debt || 0) > 0);
      const totalReceivable = debtOrders.reduce((sum, o) => sum + (o.outstanding_debt || 0), 0);
      return {
        summary: {
          total_debt: totalReceivable,
          debtors_count: debtOrders.length,
          overdue_30_days: Math.round(totalReceivable * 0.4),
          overdue_60_days: Math.round(totalReceivable * 0.25),
        },
        orders: debtOrders,
      } as unknown as T;
    }

    // 15. Transactions
    if (cleanEndpoint === '/transactions') {
      return this.db.transactions as unknown as T;
    }

    // 16. Employees (List, Create, Update, Delete)
    if (cleanEndpoint === '/employees' && method === 'GET') {
      return this.db.users.map(({ password_plain, ...u }) => u) as unknown as T;
    }

    if (cleanEndpoint === '/employees' && method === 'POST') {
      const active = this.getActiveUser();
      if (active.role !== 'super_admin') {
        throw new Error('Only Super Admin can create employees.');
      }
      const newEmp: User & { password_plain: string } = {
        id: `usr-emp-${Date.now()}`,
        username: (body.username || '').toLowerCase().trim(),
        role: body.role || 'employee',
        status: 'active',
        failed_login_attempts: 0,
        password_plain: body.password || '123456',
        created_at: new Date().toISOString(),
        profile: {
          id: `prof-${Date.now()}`,
          user_id: `usr-emp-${Date.now()}`,
          full_name: body.full_name || body.username,
          phone: body.phone || '',
          email: body.email || '',
          department: body.department || 'Operations',
          avatar: '',
        },
      };
      this.db.users.push(newEmp);
      this.saveDB();
      const { password_plain, ...safeEmp } = newEmp;
      return safeEmp as unknown as T;
    }

    const empMatch = cleanEndpoint.match(/^\/employees\/([^\/]+)$/);
    if (empMatch && method === 'PATCH') {
      const id = empMatch[1];
      const emp = this.db.users.find((u) => u.id === id);
      if (!emp) throw new Error('Employee not found');
      if (body.full_name) emp.profile.full_name = body.full_name;
      if (body.phone) emp.profile.phone = body.phone;
      if (body.department) emp.profile.department = body.department;
      if (body.status) emp.status = body.status;
      this.saveDB();
      const { password_plain, ...safeEmp } = emp;
      return safeEmp as unknown as T;
    }

    if (empMatch && method === 'DELETE') {
      const id = empMatch[1];
      const active = this.getActiveUser();
      if (active.role !== 'super_admin') {
        throw new Error('Only Super Admin can delete employees.');
      }
      const idx = this.db.users.findIndex((u) => u.id === id);
      if (idx !== -1 && this.db.users[idx].role !== 'super_admin') {
        this.db.users.splice(idx, 1);
        this.saveDB();
      }
      return { success: true, message: 'Employee removed successfully' } as unknown as T;
    }

    const empPassMatch = cleanEndpoint.match(/^\/employees\/([^\/]+)\/change-password$/);
    if (empPassMatch && method === 'POST') {
      const id = empPassMatch[1];
      const emp = this.db.users.find((u) => u.id === id);
      if (!emp) throw new Error('Employee not found');
      emp.password_plain = body.new_password || '123456';
      this.saveDB();
      return { success: true, message: 'Password updated successfully' } as unknown as T;
    }

    const empActMatch = cleanEndpoint.match(/^\/employees\/([^\/]+)\/activity$/);
    if (empActMatch && method === 'GET') {
      const id = empActMatch[1];
      const emp = this.db.users.find((u) => u.id === id);
      if (!emp) return [] as unknown as T;
      return this.db.activity_logs.filter((a) => a.username === emp.username) as unknown as T;
    }

    // 17. Conversations & Messaging
    if (cleanEndpoint === '/conversations') {
      return this.db.conversations as unknown as T;
    }

    const messagesMatch = cleanEndpoint.match(/^\/conversations\/([^\/]+)\/messages$/);
    if (messagesMatch && method === 'GET') {
      const convId = messagesMatch[1];
      return this.db.messages.filter((m) => m.conversation_id === convId) as unknown as T;
    }

    if (messagesMatch && method === 'POST') {
      const convId = messagesMatch[1];
      const active = this.getActiveUser();
      const msg: Message = {
        id: `msg-${Date.now()}`,
        conversation_id: convId,
        sender_id: active.id,
        sender_username: active.username,
        sender_name: active.profile.full_name,
        message_text: body.message_text || '',
        attachments: body.attachments,
        created_at: new Date().toISOString(),
      };
      this.db.messages.push(msg);
      this.saveDB();
      return msg as unknown as T;
    }

    // 18. Notifications
    if (cleanEndpoint === '/notifications') {
      return this.db.notifications as unknown as T;
    }

    // 19. Activity Logs
    if (cleanEndpoint === '/activity') {
      return this.db.activity_logs as unknown as T;
    }

    // 20. Staff search
    if (cleanEndpoint === '/staff/search') {
      const q = (searchParams.get('q') || '').toLowerCase();
      const staff = this.db.users
        .filter((u) => u.username.toLowerCase().includes(q) || u.profile.full_name.toLowerCase().includes(q))
        .map(({ password_plain, ...u }) => u);
      return staff as unknown as T;
    }

    return {} as unknown as T;
  }
}

export const localCrmEngine = new LocalCRMEngine();
