import React, { useState, useEffect, useRef } from 'react';
import { Search, Sun, Moon, Loader2 } from 'lucide-react';
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
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
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
    <header className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-white/5 bg-white dark:bg-[#0d0f14] transition-colors duration-300 shadow-sm z-50">
      <button onClick={onHome} className="flex items-center gap-2 hover:opacity-80 transition-opacity text-left">
        <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          <span className="text-green-600 dark:text-green-400 font-black text-sm">E</span>
        </div>
        <h1 className="text-xl font-black tracking-widest text-gray-900 dark:text-white uppercase transition-colors">
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
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-white/10 rounded-xl leading-5 bg-gray-50 dark:bg-[#161a22] text-gray-900 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all sm:text-sm shadow-inner"
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
              className="absolute inset-y-1 right-1 px-3 py-1 bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-semibold rounded-lg border border-green-500/20 hover:bg-green-500/20 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Wait...' : 'Search'}
            </button>
          </form>

          {/* Autocomplete Dropdown */}
          {showDropdown && (tickerInput.trim().length > 1) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-[#161a22] border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              {isSearching ? (
                <div className="p-4 flex items-center justify-center text-gray-500 dark:text-gray-400 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm font-medium">Searching market data...</span>
                </div>
              ) : suggestions.length > 0 ? (
                <ul className="max-h-64 overflow-y-auto custom-scrollbar">
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
                        <span className="px-2 py-1 bg-gray-100 dark:bg-black/40 rounded text-xs font-black text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 shrink-0 group-hover:border-green-500/30 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
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

        {mounted && (
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-xl bg-gray-100 dark:bg-[#161a22] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
      </div>
    </header>
  );
}
