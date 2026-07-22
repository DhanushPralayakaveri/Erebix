"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, Bell, Loader2 } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { searchStocks } from '@/lib/api';
import { SearchResult } from '@/types/api';

interface TopbarProps {
  onSearch?: (ticker: string) => void;
  isLoading?: boolean;
}

export function Topbar({ onSearch, isLoading }: TopbarProps) {
  const [tickerInput, setTickerInput] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (tickerInput.trim().length > 1) {
        setIsSearching(true);
        try {
          const res = await searchStocks(tickerInput.trim());
          setSuggestions(res.results);
          setShowDropdown(true);
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [tickerInput]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      if (onSearch) {
        onSearch(tickerInput.trim().toUpperCase());
      } else {
        router.push(`/stock/${tickerInput.trim().toUpperCase()}`);
      }
      setTickerInput('');
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (symbol: string) => {
    if (onSearch) {
      onSearch(symbol.toUpperCase());
    } else {
      router.push(`/stock/${symbol.toUpperCase()}`);
    }
    setTickerInput('');
    setShowDropdown(false);
  };

  return (
    <header className="flex items-center justify-between p-6 bg-white/80 dark:bg-[#0a0c10]/80 backdrop-blur-md transition-colors duration-300 sticky top-0 z-50 border-b border-gray-200 dark:border-white/5 h-24 shrink-0">
      <div className="flex items-center gap-4 w-full max-w-xl">
        <div className="relative w-full" ref={dropdownRef}>
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
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
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

          {/* Autocomplete Dropdown */}
          {showDropdown && (tickerInput.trim().length > 1) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#161a22] border border-gray-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 flex items-center justify-center text-gray-500 dark:text-gray-400 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Searching market data...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {suggestions.map((item, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => handleSelectSuggestion(item.symbol)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border-b border-gray-100 dark:border-white/5 last:border-0 flex items-center justify-between group"
                      >
                        <div className="flex flex-col truncate pr-4">
                          <span className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {item.shortname}
                          </span>
                          <span className="text-xs text-gray-500 font-medium mt-0.5">
                            {item.exchange}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-gray-100 dark:bg-black/40 rounded-lg text-xs font-black text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 shrink-0 group-hover:border-green-500/30 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                          {item.symbol}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-sm font-medium text-gray-500 dark:text-gray-400">
                  No matches found for "{tickerInput}"
                </div>
              )}
            </div>
          )}
        </div>
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
