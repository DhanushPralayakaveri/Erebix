"use client";

import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon, Bell } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

interface TopbarProps {
  onSearch?: (ticker: string) => void;
  isLoading?: boolean;
}

export function Topbar({ onSearch, isLoading }: TopbarProps) {
  const [tickerInput, setTickerInput] = useState('');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      if (onSearch) {
        onSearch(tickerInput.trim().toUpperCase());
      } else {
        router.push(`/stock/${tickerInput.trim().toUpperCase()}`);
      }
      setTickerInput('');
    }
  };

  return (
    <header className="flex items-center justify-between p-6 bg-white/80 dark:bg-[#0a0c10]/80 backdrop-blur-md transition-colors duration-300 sticky top-0 z-50 border-b border-gray-200 dark:border-white/5 h-24 shrink-0">
      <div className="flex items-center gap-4 w-full max-w-xl">
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-white/10 rounded-2xl leading-5 bg-gray-50 dark:bg-[#161a22] text-gray-900 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all font-medium shadow-inner"
            placeholder="Search Ticker (e.g., AAPL) or Company"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            disabled={isLoading || !tickerInput.trim()}
            className="absolute inset-y-1.5 right-1.5 px-4 py-1.5 bg-green-500/10 text-green-700 dark:text-green-400 text-sm font-bold rounded-xl border border-green-500/20 hover:bg-green-500/20 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Wait...' : 'Analyze'}
          </button>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 rounded-2xl bg-gray-50 dark:bg-[#161a22] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors relative">
          <Bell className="w-5 h-5" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-gray-50 dark:border-[#161a22]"></div>
        </button>

        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-3 rounded-2xl bg-gray-50 dark:bg-[#161a22] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
      </div>
    </header>
  );
}
