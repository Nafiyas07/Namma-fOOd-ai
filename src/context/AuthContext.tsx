import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types.js';
import { api, getStoredToken } from '../lib/api.js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, confirmPass?: string) => Promise<void>;
  loginAsDemo: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: { name?: string; preferredLanguage?: 'en' | 'ta' }) => Promise<void>;
  isAuthModalOpen: boolean;
  authModalTab: 'login' | 'register';
  openAuthModal: (tab?: 'login' | 'register') => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    async function loadUser() {
      const token = getStoredToken();
      if (!token) {
        // Auto-login as demo user on first visit for zero-friction experience
        try {
          const res = await api.login('nafiya@foodlens.ai', 'password123');
          setUser(res.user);
        } catch (e) {
          // not critical
        }
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.getMe();
        setUser(res.user);
      } catch (err) {
        console.warn('Stored token invalid, cleared:', err);
        // Fallback to demo
        try {
          const res = await api.login('nafiya@foodlens.ai', 'password123');
          setUser(res.user);
        } catch (e) {
          // ignore
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await api.login(email, pass);
      setUser(res.user);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, pass: string, confirmPass?: string) => {
    setIsLoading(true);
    try {
      const res = await api.register(name, email, pass, confirmPass);
      setUser(res.user);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loginAsDemo = async () => {
    setIsLoading(true);
    try {
      const res = await api.login('nafiya@foodlens.ai', 'password123');
      setUser(res.user);
      setIsAuthModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await api.logout();
    setUser(null);
  };

  const updateProfile = async (updates: { name?: string; preferredLanguage?: 'en' | 'ta' }) => {
    const res = await api.updateProfile(updates);
    setUser(res);
  };

  const openAuthModal = (tab: 'login' | 'register' = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        loginAsDemo,
        logout,
        updateProfile,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
