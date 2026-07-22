import React, { useState, useEffect } from 'react';
import { Search, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

interface HeaderProps {
  onSearch: (ticker: string) => void;
  onHome: () => void;
  isLoading: boolean;
}

export function Header({ onSearch, onHome, isLoading }: HeaderProps) {
  const [tickerInput, setTickerInput] = useState('');
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tickerInput.trim()) {
      onSearch(tickerInput.trim().toUpperCase());
      setTickerInput('');
    }
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
        <form 
          onSubmit={handleSubmit} 
          className="relative w-full"
        >
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-white/10 rounded-xl leading-5 bg-gray-50 dark:bg-[#161a22] text-gray-900 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all sm:text-sm shadow-inner"
            placeholder="Search Ticker (e.g., AAPL)"
            value={tickerInput}
            onChange={(e) => setTickerInput(e.target.value)}
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
