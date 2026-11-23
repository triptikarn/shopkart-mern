import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('shopkart_user'));
    } catch {
      return null;
    }
  });

  const persist = (token, nextUser) => {
    localStorage.setItem('shopkart_token', token);
    localStorage.setItem('shopkart_user', JSON.stringify(nextUser));
    setUser(nextUser);
  };

  const login = async (email, password) => {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    persist(data.token, data.user);
    return data.user;
  };

  const register = async (name, email, password) => {
    const data = await api('/auth/register', { method: 'POST', body: { name, email, password } });
    persist(data.token, data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('shopkart_token');
    localStorage.removeItem('shopkart_user');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, login, register, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
