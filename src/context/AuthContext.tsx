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
    const handleAuthExpired = () => {
      localStorage.removeItem('balcad_crm_token');
      setUser(null);
    };
    window.addEventListener('balcad_auth_expired', handleAuthExpired);
    return () => window.removeEventListener('balcad_auth_expired', handleAuthExpired);
  }, []);

  const login = async (username: string, pass: string) => {
    setError(null);
    try {
      const res = await api.login(username, pass);
      setUser(res.user);
    } catch (err: any) {
      setError(err.message || 'Invalid username or password.');
      throw err;
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
