"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface WatchlistContextType {
  watchlist: string[];
  addStock: (ticker: string) => void;
  removeStock: (ticker: string) => void;
  isInWatchlist: (ticker: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export function WatchlistProvider({ children }: { children: React.ReactNode }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('erebix_watchlist');
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse watchlist');
      }
    }
    setIsLoaded(true);
  }, []);

  const addStock = (ticker: string) => {
    const upper = ticker.toUpperCase();
    if (!watchlist.includes(upper)) {
      const newList = [...watchlist, upper];
      setWatchlist(newList);
      localStorage.setItem('erebix_watchlist', JSON.stringify(newList));
    }
  };

  const removeStock = (ticker: string) => {
    const upper = ticker.toUpperCase();
    const newList = watchlist.filter(t => t !== upper);
    setWatchlist(newList);
    localStorage.setItem('erebix_watchlist', JSON.stringify(newList));
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
