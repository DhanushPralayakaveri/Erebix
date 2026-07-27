"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, Bell, Loader2, Flame, Palette, Zap } from 'lucide-react';
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
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      // Simple way to close theme dropdown when clicking anywhere else
      if (!(event.target as Element).closest('.theme-dropdown-container')) {
        setShowThemeDropdown(false);
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
    <header className="flex items-center justify-between p-6 bg-background/80 backdrop-blur-md transition-colors duration-300 sticky top-0 z-50 border-b border-border h-24 shrink-0">
      <div className="flex items-center gap-4 w-full max-w-xl">
        <div className="relative w-full" ref={dropdownRef}>
          <form onSubmit={handleSubmit} className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 border border-border rounded-2xl leading-5 bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all font-medium shadow-inner"
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
              className="absolute inset-y-1.5 right-1.5 px-4 py-1.5 bg-primary/10 text-primary text-sm font-bold rounded-xl border border-primary/20 hover:bg-primary/20 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Wait...' : 'Analyze'}
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showDropdown && (tickerInput.trim().length > 1) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 flex items-center justify-center text-muted-foreground gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium text-muted-foreground">Searching market data...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="max-h-[300px] overflow-y-auto custom-scrollbar">
                  {suggestions.map((item, idx) => (
                    <li key={idx}>
                      <button
                        type="button"
                        onClick={() => handleSelectSuggestion(item.symbol)}
                        className="w-full text-left px-4 py-3 hover:bg-muted transition-colors border-b border-border last:border-0 flex items-center justify-between group"
                      >
                        <div className="flex flex-col truncate pr-4">
                          <span className="text-sm font-bold text-foreground truncate">
                            {item.shortname}
                          </span>
                          <span className="text-xs text-muted-foreground font-medium mt-0.5">
                            {item.exchange}
                          </span>
                        </div>
                        <span className="px-2 py-1 bg-muted rounded-lg text-xs font-black text-foreground border border-border shrink-0 group-hover:border-primary/30 group-hover:text-primary transition-colors">
                          {item.symbol}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 text-center text-sm font-medium text-muted-foreground">
                  No matches found for "{tickerInput}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-3 rounded-2xl bg-card border border-border text-muted-foreground hover:text-foreground transition-colors relative">
          <Bell className="w-5 h-5" />
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-danger border-2 border-card"></div>
        </button>

        {mounted && (
          <div className="relative theme-dropdown-container">
            <button
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              className="p-3 rounded-2xl bg-card border border-border text-muted-foreground hover:text-foreground transition-colors"
              title="Change Theme"
            >
              <Palette className="w-5 h-5" />
            </button>
            
            {showThemeDropdown && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 flex flex-col py-1">
                <button
                  onClick={() => { setTheme('light'); setShowThemeDropdown(false); }}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors ${theme === 'light' ? 'text-primary font-bold' : 'text-foreground'}`}
                >
                  <Sun className="w-4 h-4 text-primary" /> Base Light
                </button>
                <button
                  onClick={() => { setTheme('dark'); setShowThemeDropdown(false); }}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors ${theme === 'dark' ? 'text-primary font-bold' : 'text-foreground'}`}
                >
                  <Moon className="w-4 h-4 text-primary" /> Base Dark
                </button>
                <div className="h-px bg-border my-1 mx-2" />
                <button
                  onClick={() => { setTheme('hades'); setShowThemeDropdown(false); }}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors ${theme === 'hades' ? 'text-primary font-bold' : 'text-foreground'}`}
                >
                  <Flame className="w-4 h-4 text-primary" /> Hades
                </button>
                <div className="h-px bg-border my-1 mx-2" />
                <button
                  onClick={() => { setTheme('cyber'); setShowThemeDropdown(false); }}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium hover:bg-muted transition-colors ${theme === 'cyber' ? 'text-primary font-bold' : 'text-foreground'}`}
                >
                  <Zap className="w-4 h-4 text-primary" /> Cyber
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
