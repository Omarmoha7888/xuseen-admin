import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('balcad_crm_token');
    if (!token) {
      setLoading(false);
      return;
    }

    api.getMe()
      .then((res) => {
        if (res && res.user) {
          setUser(res.user);
        } else {
          localStorage.removeItem('balcad_crm_token');
          setUser(null);
        }
      })
      .catch(() => {
        localStorage.removeItem('balcad_crm_token');
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleAuthExpired = (e?: any) => {
      localStorage.removeItem('balcad_crm_token');
      localStorage.removeItem('balcad_crm_active_user');
      localStorage.removeItem('balcad_crm_active_user_v3');
      setUser(null);
      const msg = e?.detail?.message || localStorage.getItem('balcad_auth_disabled_msg');
      if (msg) {
        setError(msg);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'balcad_crm_token' && !e.newValue) {
        setUser(null);
      }
    };

    window.addEventListener('balcad_auth_expired', handleAuthExpired);
    window.addEventListener('storage', handleStorage);

    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel('balcad_auth');
      channel.onmessage = (event) => {
        if (event.data?.type === 'USER_DISABLED') {
          // Instantly query server to verify active status
          api.getMe()
            .then((res) => {
              if (!res || !res.user || res.user.status === 'disabled') {
                localStorage.setItem('balcad_auth_disabled_msg', 'This user is disabled, please contact the Administrator');
                localStorage.removeItem('balcad_crm_token');
                localStorage.removeItem('balcad_crm_active_user');
                localStorage.removeItem('balcad_crm_active_user_v3');
                setUser(null);
                setError('This user is disabled, please contact the Administrator');
                window.dispatchEvent(new CustomEvent('balcad_auth_expired', { detail: { message: 'This user is disabled, please contact the Administrator' } }));
              }
            })
            .catch(() => {
              localStorage.setItem('balcad_auth_disabled_msg', 'This user is disabled, please contact the Administrator');
              localStorage.removeItem('balcad_crm_token');
              localStorage.removeItem('balcad_crm_active_user');
              localStorage.removeItem('balcad_crm_active_user_v3');
              setUser(null);
              setError('This user is disabled, please contact the Administrator');
              window.dispatchEvent(new CustomEvent('balcad_auth_expired', { detail: { message: 'This user is disabled, please contact the Administrator' } }));
            });
        }
      };
    } catch {}

    return () => {
      window.removeEventListener('balcad_auth_expired', handleAuthExpired);
      window.removeEventListener('storage', handleStorage);
      try {
        channel?.close();
      } catch {}
    };
  }, []);

  // Periodic user status heartbeat (instantly boots disabled employees)
  useEffect(() => {
    if (!user || user.role === 'super_admin') return;

    const checkActiveStatus = async () => {
      try {
        const res = await api.getMe();
        if (res && res.user && res.user.status === 'disabled') {
          localStorage.setItem('balcad_auth_disabled_msg', 'This user is disabled, please contact the Administrator');
          localStorage.removeItem('balcad_crm_token');
          localStorage.removeItem('balcad_crm_active_user');
          localStorage.removeItem('balcad_crm_active_user_v3');
          setUser(null);
          setError('This user is disabled, please contact the Administrator');
          window.dispatchEvent(new CustomEvent('balcad_auth_expired', { detail: { message: 'This user is disabled, please contact the Administrator' } }));
        }
      } catch (err: any) {
        const msg = String(err.message || '').toLowerCase();
        if (msg.includes('disabled') || msg.includes('revoked')) {
          localStorage.setItem('balcad_auth_disabled_msg', 'This user is disabled, please contact the Administrator');
          localStorage.removeItem('balcad_crm_token');
          localStorage.removeItem('balcad_crm_active_user');
          localStorage.removeItem('balcad_crm_active_user_v3');
          setUser(null);
          setError('This user is disabled, please contact the Administrator');
          window.dispatchEvent(new CustomEvent('balcad_auth_expired', { detail: { message: 'This user is disabled, please contact the Administrator' } }));
        }
      }
    };

    const interval = setInterval(checkActiveStatus, 3000);
    return () => clearInterval(interval);
  }, [user]);

  const login = async (username: string, pass: string) => {
    setError(null);
    try {
      const res = await api.login(username, pass);
      setUser(res.user);
    } catch (err: any) {
      const msg = String(err.message || '');
      const finalMsg = (msg.toLowerCase().includes('disabled') || msg.toLowerCase().includes('administrator'))
        ? 'This user is disabled, please contact the Administrator'
        : (err.message || 'Invalid username or password.');
      setError(finalMsg);
      throw new Error(finalMsg);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {
      // Ignored
    } finally {
      localStorage.removeItem('balcad_crm_token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        error,
        clearError: () => setError(null),
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
