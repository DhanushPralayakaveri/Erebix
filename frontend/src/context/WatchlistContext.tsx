"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface WatchlistContextType {
  watchlist: string[];
  addStock: (ticker: string) => void;
  removeStock: (ticker: string) => void;
  isInWatchlist: (ticker: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem('erebix_watchlist');
      if (saved) {
        try {
          setWatchlist(JSON.parse(saved));
        } catch {
          console.error('Failed to parse watchlist');
        }
      }
      setIsLoaded(true);

      // If user is authenticated, sync with relational database via Spring Boot Gateway
      if (user) {
        fetch(`/api/v1/watchlist?userId=${user.id}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setWatchlist(data);
              localStorage.setItem('erebix_watchlist', JSON.stringify(data));
            }
          })
          .catch(() => {
            // Keep offline localStorage list if backend is unreachable
          });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [user]);

  const addStock = (ticker: string) => {
    const upper = ticker.toUpperCase();
    if (!watchlist.includes(upper)) {
      const newList = [...watchlist, upper];
      setWatchlist(newList);
      localStorage.setItem('erebix_watchlist', JSON.stringify(newList));

      if (user) {
        fetch('/api/v1/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, symbol: upper })
        }).catch(err => console.error('Watchlist sync error:', err));
      }
    }
  };

  const removeStock = (ticker: string) => {
    const upper = ticker.toUpperCase();
    const newList = watchlist.filter(t => t !== upper);
    setWatchlist(newList);
    localStorage.setItem('erebix_watchlist', JSON.stringify(newList));

    if (user) {
      fetch(`/api/v1/watchlist?userId=${user.id}&symbol=${encodeURIComponent(upper)}`, {
        method: 'DELETE'
      }).catch(err => console.error('Watchlist delete error:', err));
    }
  };

  const isInWatchlist = (ticker: string) => {
    return watchlist.includes(ticker.toUpperCase());
  };

  if (!isLoaded) return null;

  return (
    <WatchlistContext.Provider value={{ watchlist, addStock, removeStock, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
