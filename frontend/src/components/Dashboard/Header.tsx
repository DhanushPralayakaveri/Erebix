import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, Loader2, Flame, Palette, Zap } from 'lucide-react';
import { useTheme } from 'next-themes';
import { searchStocks } from '@/lib/api';
import { SearchResult } from '@/types/api';

interface HeaderProps {
  onSearch: (ticker: string) => void;
  onHome: () => void;
  isLoading: boolean;
}

export function Header({ onSearch, onHome, isLoading }: HeaderProps) {
  const [tickerInput, setTickerInput] = useState('');
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
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
      if (!(event.target as Element).closest('.theme-dropdown-container')) {
        setShowThemeDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search logic
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
      onSearch(tickerInput.trim().toUpperCase());
      setTickerInput('');
      setShowDropdown(false);
    }
  };

  const handleSelectSuggestion = (symbol: string) => {
    onSearch(symbol.toUpperCase());
    setTickerInput('');
    setShowDropdown(false);
  };

  return (
    <header className="flex items-center justify-between p-6 border-b border-border bg-background transition-colors duration-300 shadow-sm z-50">
      <button onClick={onHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left">
        <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center border border-success/50 shadow-[0_0_15px_var(--glow-green)]">
          <span className="text-success font-black text-sm">E</span>
        </div>
        <h1 className="text-xl font-black tracking-widest text-foreground uppercase transition-colors">
          Erebix
        </h1>
      </button>

      <div className="flex items-center gap-4 w-full max-w-md justify-end">
        <div className="relative w-full" ref={dropdownRef}>
          <form onSubmit={handleSubmit} className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-border rounded-xl leading-5 bg-card text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all sm:text-sm shadow-inner"
              placeholder="Search Company or Ticker (e.g., Apple)"
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
              className="absolute inset-y-1 right-1 px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-lg border border-primary/20 hover:bg-primary/20 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Wait...' : 'Search'}
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showDropdown && (tickerInput.trim().length > 1) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 text-center text-sm font-medium text-muted-foreground">
                  Searching market data...
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="max-h-64 overflow-y-auto custom-scrollbar">
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
                        <span className="px-2 py-1 bg-muted rounded text-xs font-black text-foreground border border-border shrink-0 group-hover:border-primary/30 group-hover:text-primary transition-colors">
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

        {mounted && (
          <div className="relative theme-dropdown-container">
            <button
              onClick={() => setShowThemeDropdown(!showThemeDropdown)}
              className="p-2 rounded-xl bg-muted border border-border text-foreground hover:bg-accent transition-colors"
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
