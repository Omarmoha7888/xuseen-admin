import { User, Order, Customer, Payment, Transaction, Conversation, Message, ActivityLog, DashboardMetrics } from '../types';
import { localCrmEngine } from './localCrmEngine';

const API_BASE = '/api';

function getHeaders(): HeadersInit {
  const token = localStorage.getItem('balcad_crm_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// In-memory cache for ultra-fast, responsive UI
const cache = new Map<string, { data: any; expiry: number }>();
const CACHE_TTL = 30000; // 30 seconds fresh cache

function getCached<T>(key: string): T | null {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() > item.expiry) {
    cache.delete(key);
    return null;
  }
  return item.data as T;
}

function setCached<T>(key: string, data: T, ttl: number = CACHE_TTL): void {
  cache.set(key, { data, expiry: Date.now() + ttl });
}

export function clearApiCache(prefix?: string): void {
  if (!prefix) {
    cache.clear();
  } else {
    for (const key of cache.keys()) {
      if (key.startsWith(prefix)) {
        cache.delete(key);
      }
    }
  }
}

async function parseResponse(res: Response): Promise<any> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: text || `HTTP error ${res.status}` };
  }
}

// Resilient API client with network retry, safe JSON parsing, and automatic session cleanup
async function request<T>(endpoint: string, options: RequestInit = {}, retries = 1): Promise<T> {
  const url = endpoint.startsWith('http')
    ? endpoint
    : `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = {
    ...getHeaders(),
    ...(options.headers || {}),
  };

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { ...options, headers });
      const data = await parseResponse(res);

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem('balcad_crm_token');
          window.dispatchEvent(new CustomEvent('balcad_auth_expired'));
          throw new Error(data.error || 'Unauthorized session');
        }

        const errorText = String(data.error || '');
        const isServerlessOrHostError =
          res.status >= 500 ||
          res.status === 404 ||
          errorText.includes('FUNCTION_INVOCATION_FAILED') ||
          errorText.includes('<!DOCTYPE') ||
          errorText.includes('Internal Server Error');

        if (isServerlessOrHostError) {
          console.warn(`[Balcad CRM] Serverless endpoint ${endpoint} returned ${res.status}. Falling back to client-side storage engine.`);
          return localCrmEngine.handle<T>(endpoint, options);
        }

        throw new Error(data.error || `Server error (${res.status})`);
      }

      return data as T;
    } catch (err: any) {
      const isNetworkError =
        err.name === 'TypeError' ||
        err.message?.includes('fetch') ||
        err.message?.includes('network') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('FUNCTION_INVOCATION_FAILED');

      if (isNetworkError && attempt < retries) {
        await new Promise((resolve) => setTimeout(resolve, 200 * (attempt + 1)));
        continue;
      }

      if (isNetworkError) {
        console.warn(`[Balcad CRM] Network/Serverless connection issue for ${endpoint}. Falling back to client-side storage engine.`);
        try {
          return localCrmEngine.handle<T>(endpoint, options);
        } catch (localErr: any) {
          throw localErr;
        }
      }
      throw err;
    }
  }
  return localCrmEngine.handle<T>(endpoint, options);
}

export const api = {
  // Auth
  async login(username: string, password: string): Promise<{ token: string; user: User; message: string }> {
    clearApiCache();
    const data = await request<{ token: string; user: User; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }, 0);
    localStorage.setItem('balcad_crm_token', data.token);
    return data;
  },

  async getMe(): Promise<{ user: User | null }> {
    const token = localStorage.getItem('balcad_crm_token');
    if (!token) {
      return { user: null };
    }
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await parseResponse(res);
        if (data && data.user) return data;
      }
    } catch {
      // Ignored, fallback to local below
    }

    try {
      return localCrmEngine.handle<{ user: User | null }>('/auth/me');
    } catch {
      return { user: null };
    }
  },

  async logout(): Promise<void> {
    try {
      await request('/auth/logout', { method: 'POST' }, 0);
    } catch {
      // Ignored on logout
    } finally {
      clearApiCache();
      localStorage.removeItem('balcad_crm_token');
      window.dispatchEvent(new CustomEvent('balcad_auth_expired'));
    }
  },

  async changeMyPassword(newPass: string, confirmPass: string, currentPass?: string): Promise<{ success: boolean; message: string }> {
    return request<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({
        new_password: newPass,
        confirm_new_password: confirmPass,
        current_password: currentPass,
      }),
    });
  },

  // Employees (Super Admin)
  async getEmployees(): Promise<any[]> {
    const cacheKey = 'employees';
    const cached = getCached<any[]>(cacheKey);
    if (cached) return cached;

    const data = await request<any[]>('/employees');
    setCached(cacheKey, data);
    return data;
  },

  async addEmployee(data: any): Promise<any> {
    clearApiCache('employees');
    clearApiCache('reports');
    return request<any>('/employees', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateEmployee(id: string, data: any): Promise<any> {
    clearApiCache('employees');
    return request<any>(`/employees/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  async changeEmployeePassword(id: string, newPass: string, confirmPass: string): Promise<any> {
    return request<any>(`/employees/${id}/change-password`, {
      method: 'POST',
      body: JSON.stringify({ new_password: newPass, confirm_new_password: confirmPass }),
    });
  },

  async deleteEmployee(id: string): Promise<any> {
    clearApiCache('employees');
    return request<any>(`/employees/${id}`, {
      method: 'DELETE',
    });
  },

  async getEmployeeActivity(id: string): Promise<ActivityLog[]> {
    return request<ActivityLog[]>(`/employees/${id}/activity`);
  },

  // Orders
  async getOrders(params?: Record<string, string>): Promise<Order[]> {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const cacheKey = `orders_${qs}`;
    const cached = getCached<Order[]>(cacheKey);
    if (cached) return cached;

    const data = await request<Order[]>(`/orders${qs}`);
    setCached(cacheKey, data, 10000);
    return data;
  },

  async getOrder(id: string): Promise<Order> {
    const cacheKey = `order_${id}`;
    const cached = getCached<Order>(cacheKey);
    if (cached) return cached;

    const data = await request<Order>(`/orders/${id}`);
    setCached(cacheKey, data, 10000);
    return data;
  },

  async createOrder(data: any): Promise<Order> {
    clearApiCache('orders');
    clearApiCache('reports');
    clearApiCache('ar');
    clearApiCache('customers');
    clearApiCache('transactions');
    return request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateOrderStatus(id: string, status: string, reason?: string): Promise<Order> {
    clearApiCache('orders');
    clearApiCache(`order_${id}`);
    clearApiCache('reports');
    clearApiCache('ar');
    return request<Order>(`/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, reason }),
    });
  },

  async assignOrder(id: string, staff_username: string | null, reason?: string): Promise<Order> {
    clearApiCache('orders');
    clearApiCache(`order_${id}`);
    clearApiCache('reports');
    clearApiCache('ar');
    return request<Order>(`/orders/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ staff_username, reason }),
    });
  },

  async deleteOrder(id: string): Promise<any> {
    clearApiCache();
    const result = await request<any>(`/orders/${id}`, {
      method: 'DELETE',
    });
    clearApiCache();
    return result;
  },

  // Financials & AR
  async getARReport(params?: Record<string, string>): Promise<{ summary: any; orders: any[] }> {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const cacheKey = `ar_${qs}`;
    const cached = getCached<{ summary: any; orders: any[] }>(cacheKey);
    if (cached) return cached;

    const data = await request<{ summary: any; orders: any[] }>(`/ar${qs}`);
    setCached(cacheKey, data, 10000);
    return data;
  },

  async addPayment(orderId: string, paymentData: any): Promise<{ message: string; payment: Payment; order: Order }> {
    clearApiCache('orders');
    clearApiCache(`order_${orderId}`);
    clearApiCache('ar');
    clearApiCache('reports');
    clearApiCache('transactions');
    clearApiCache('customers');
    return request<{ message: string; payment: Payment; order: Order }>(`/orders/${orderId}/payments`, {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },

  async adjustFinancial(orderId: string, adjustmentData: any): Promise<any> {
    clearApiCache('orders');
    clearApiCache(`order_${orderId}`);
    clearApiCache('ar');
    clearApiCache('reports');
    clearApiCache('transactions');
    return request<any>(`/orders/${orderId}/adjustments`, {
      method: 'POST',
      body: JSON.stringify(adjustmentData),
    });
  },

  async getTransactions(params?: Record<string, string>): Promise<Transaction[]> {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const cacheKey = `transactions_${qs}`;
    const cached = getCached<Transaction[]>(cacheKey);
    if (cached) return cached;

    const data = await request<Transaction[]>(`/transactions${qs}`);
    setCached(cacheKey, data, 10000);
    return data;
  },

  // Customers
  async getCustomers(search?: string): Promise<Customer[]> {
    const qs = search ? `?search=${encodeURIComponent(search)}` : '';
    const cacheKey = `customers_${qs}`;
    const cached = getCached<Customer[]>(cacheKey);
    if (cached) return cached;

    const data = await request<Customer[]>(`/customers${qs}`);
    setCached(cacheKey, data, 15000);
    return data;
  },

  async getCustomer(id: string): Promise<{ customer: Customer; orders: Order[] }> {
    const cacheKey = `customer_${id}`;
    const cached = getCached<{ customer: Customer; orders: Order[] }>(cacheKey);
    if (cached) return cached;

    const data = await request<{ customer: Customer; orders: Order[] }>(`/customers/${id}`);
    setCached(cacheKey, data, 15000);
    return data;
  },

  async createCustomer(data: any): Promise<Customer> {
    clearApiCache('customers');
    return request<Customer>('/customers', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Messaging (Internal Staff only)
  async searchStaff(q: string): Promise<User[]> {
    return request<User[]>(`/staff/search?q=${encodeURIComponent(q)}`);
  },

  async getConversations(): Promise<Conversation[]> {
    return request<Conversation[]>('/conversations');
  },

  async startDirectConversation(targetUserId: string): Promise<Conversation> {
    return request<Conversation>('/conversations/direct', {
      method: 'POST',
      body: JSON.stringify({ target_user_id: targetUserId }),
    });
  },

  async createGroupConversation(title: string, participantUserIds: string[]): Promise<Conversation> {
    return request<Conversation>('/conversations/group', {
      method: 'POST',
      body: JSON.stringify({ title, participant_user_ids: participantUserIds }),
    });
  },

  async getMessages(conversationId: string): Promise<Message[]> {
    return request<Message[]>(`/conversations/${conversationId}/messages`);
  },

  async sendMessage(conversationId: string, text: string, attachments?: any[]): Promise<Message> {
    return request<Message>(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message_text: text, attachments }),
    });
  },

  async toggleConversationStatus(conversationId: string, status: 'open' | 'closed'): Promise<Conversation> {
    return request<Conversation>(`/conversations/${conversationId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Documents
  async uploadDocument(data: any): Promise<any> {
    clearApiCache('orders');
    return request<any>('/documents/upload', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Dashboard & Reports
  async getDashboardMetrics(): Promise<DashboardMetrics> {
    const cacheKey = 'dashboard_metrics';
    const cached = getCached<DashboardMetrics>(cacheKey);
    if (cached) return cached;

    const data = await request<DashboardMetrics>('/reports/dashboard');
    setCached(cacheKey, data, 10000);
    return data;
  },

  async getGeneralReports(params?: Record<string, string>): Promise<any> {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    const cacheKey = `general_reports_${qs}`;
    const cached = getCached<any>(cacheKey);
    if (cached) return cached;

    const data = await request<any>(`/reports/general${qs}`);
    setCached(cacheKey, data, 10000);
    return data;
  },

  async getDailyReport(date?: string): Promise<any> {
    const qs = date ? `?date=${encodeURIComponent(date)}` : '';
    return request<any>(`/reports/daily${qs}`);
  },

  // Activity Logs
  async getActivityLogs(params?: Record<string, string>): Promise<ActivityLog[]> {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return request<ActivityLog[]>(`/activity${qs}`);
  },

  // Notifications
  async getNotifications(): Promise<any[]> {
    return request<any[]>('/notifications');
  },

  async markNotificationRead(id: string): Promise<void> {
    await request<any>(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  async markAllNotificationsRead(): Promise<void> {
    await request<any>('/notifications/mark-all-read', {
      method: 'POST',
    });
  },
};
