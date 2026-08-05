'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  AuthUser,
  fetchMe,
  clearToken,
  login as loginRequest,
  register as registerRequest,
} from '@/lib/auth-client';

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  // Starts true so consumers can distinguish "checking" from "signed out"
  // and avoid flashing a signed-out UI on every page load.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchMe()
      .then((me) => {
        if (active) setUser(me);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setUser(await loginRequest(email, password));
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    setUser(await registerRequest(email, password, name));
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside <AuthProvider>');
  }
  return context;
}
