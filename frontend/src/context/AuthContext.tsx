"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  isDemo: boolean;
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (username?: string, email?: string, isDemo?: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEMO_USER: UserProfile = {
  id: 1,
  username: 'Trader-01',
  email: 'institutional.trader@erebix.quant',
  isDemo: true,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('erebix_user');
      if (saved) {
        try {
          setUser(JSON.parse(saved));
        } catch {
          console.error('Failed to parse saved user profile');
          setUser(DEMO_USER); // Fallback default institutional demo user
        }
      } else {
        // Automatically default to Institutional Demo Trader so user can immediately trade & use watchlist
        setUser(DEMO_USER);
        localStorage.setItem('erebix_user', JSON.stringify(DEMO_USER));
      }
      setIsLoading(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const login = (username = 'Trader-01', email = 'trader01@erebix.quant', isDemo = true) => {
    const profile: UserProfile = {
      id: isDemo ? 1 : Math.floor(Math.random() * 9000) + 100,
      username: username.trim() || 'Trader-01',
      email: email.trim() || 'trader01@erebix.quant',
      isDemo,
    };
    setUser(profile);
    localStorage.setItem('erebix_user', JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('erebix_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
