"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, Bell, Loader2, Flame, Palette, Zap, User, Shield } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { searchStocks } from '@/lib/api';
import { SearchResult } from '@/types/api';
import { useAuth } from '@/context/AuthContext';

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
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
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

  const handleSelectSymbol = (symbol: string) => {
    if (onSearch) {
      onSearch(symbol);
    } else {
      router.push(`/stock/${symbol}`);
    }
    setTickerInput('');
    setShowDropdown(false);
  };

  const themes = [
    { id: 'dark', name: 'Standard Cyber', icon: Zap, color: 'bg-[#00f0ff]' },
    { id: 'hades-dark', name: 'Hades Red', icon: Flame, color: 'bg-[#ff003c]' },
    { id: 'light', name: 'Light Terminal', icon: Sun, color: 'bg-[#090d16]' },
    { id: 'hades-light', name: 'Hades Light', icon: Palette, color: 'bg-[#d90429]' },
  ];

  return (
    <header className="w-full bg-card/60 backdrop-blur-md border-b border-border sticky top-0 z-40 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-6">
        
        {/* Brand */}
        <div 
          onClick={() => router.push('/')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-success/20 flex items-center justify-center border border-success/50 group-hover:scale-105 transition-transform shadow-[0_0_20px_var(--glow-green)]">
            <span className="text-success font-black text-xl tracking-tighter">E</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-widest text-foreground uppercase group-hover:text-primary transition-colors">
              Erebix
            </span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest -mt-1 uppercase">
              Quant Engine
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="flex-1 max-w-xl relative" ref={dropdownRef}>
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (tickerInput.trim()) {
                handleSelectSymbol(tickerInput.trim().toUpperCase());
              }
            }}
            className="relative flex items-center w-full"
          >
            <Search className="w-5 h-5 text-muted-foreground absolute left-4 pointer-events-none" />
            <input 
              type="text" 
              value={tickerInput}
              onChange={(e) => setTickerInput(e.target.value)}
              onFocus={() => {
                if (suggestions.length > 0) setShowDropdown(true);
              }}
              placeholder="Search ticker or company (e.g., AAPL, TSLA, INFY.NS, NVDA)..." 
              className="w-full h-12 bg-muted/50 hover:bg-muted focus:bg-muted text-foreground placeholder:text-muted-foreground pl-12 pr-24 rounded-xl border border-border focus:border-primary/50 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm font-semibold shadow-inner"
            />
            <button
              type="submit"
              disabled={isLoading || !tickerInput.trim()}
              className="absolute right-2 px-4 py-1.5 bg-foreground text-background font-black text-xs rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              SEARCH
            </button>
          </form>

          {/* Search Dropdown */}
          {showDropdown && (
            <div className="absolute top-14 left-0 right-0 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              {isSearching ? (
                <div className="p-4 text-center text-sm font-medium text-muted-foreground">
                  Searching institutional database...
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="max-h-80 overflow-y-auto divide-y divide-border/50">
                  {suggestions.map((item) => (
                    <li key={item.symbol}>
                      <button
                        type="button"
                        onClick={() => handleSelectSymbol(item.symbol)}
                        className="w-full px-4 py-3 text-left hover:bg-muted/70 flex items-center justify-between gap-4 transition-colors group"
                      >
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-black text-foreground truncate group-hover:text-primary transition-colors">
                            {item.shortname}
                          </span>
                          <span className="text-xs text-muted-foreground font-semibold">
                            {item.exchange} • {item.type}
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
                  No assets found matching &quot;{tickerInput}&quot;
                </div>
              )}
            </div>
          )}
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

        {mounted && (
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-2xl bg-card border border-border hover:border-primary/50 text-foreground hover:text-primary transition-all text-xs font-black tracking-wider uppercase shadow-sm shrink-0"
            title="Institutional Account / Switch Profile"
          >
            {user ? (
              <>
                <span className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_var(--glow-green)] shrink-0" />
                <span className="truncate max-w-[110px]">{user.username}</span>
              </>
            ) : (
              <>
                <User className="w-4 h-4 text-primary" />
                <span>Sign In</span>
              </>
            )}
          </button>
        )}
      </div>
      </div>
    </header>
  );
}
