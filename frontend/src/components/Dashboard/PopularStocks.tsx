import React from 'react';
import { TrendingUp, TrendingDown, Activity, Globe } from 'lucide-react';
import { clsx } from 'clsx';

const POPULAR_STOCKS = [
  { symbol: 'NVDA', name: 'Nvidia Corp', price: 125.82, change: 4.50, pct: 3.71, isUp: true, volume: '45.2M' },
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.45, change: -1.20, pct: -0.63, isUp: false, volume: '32.1M' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 175.22, change: 8.40, pct: 5.03, isUp: true, volume: '88.5M' },
  { symbol: 'MSFT', name: 'Microsoft Corp', price: 415.30, change: 2.15, pct: 0.52, isUp: true, volume: '18.9M' },
  { symbol: 'AMZN', name: 'Amazon.com', price: 182.15, change: -3.40, pct: -1.83, isUp: false, volume: '22.4M' },
  { symbol: 'META', name: 'Meta Platforms', price: 475.20, change: 12.30, pct: 2.66, isUp: true, volume: '15.6M' },
];

export function PopularStocks({ onSelect }: { onSelect: (symbol: string) => void }) {
  return (
    <div className="w-full mt-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
            <Globe className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-wide transition-colors">
              Global Equities Watchlist
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Real-time simulated market data flow</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-500/10 border border-green-300 dark:border-green-500/20 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider hidden sm:block">Markets Open</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POPULAR_STOCKS.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => onSelect(stock.symbol)}
            className="group relative w-full bg-white dark:bg-[#161a22] hover:bg-gray-50 dark:hover:bg-[#1a1f29] rounded-2xl border border-gray-200 dark:border-white/5 p-6 text-left transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            {/* Fancy Gradient Background in Light Mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-transparent dark:to-transparent opacity-100 dark:opacity-0 -z-10" />

            {/* Hover Glow Effect */}
            <div className={clsx(
              "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 dark:group-hover:opacity-20 transition-opacity duration-500 pointer-events-none",
              stock.isUp ? "bg-green-400" : "bg-red-400"
            )} />

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  {stock.symbol}
                </h3>
                <p className="text-sm text-gray-500">{stock.name}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  ${stock.price.toFixed(2)}
                </span>
                <div className={clsx(
                  "flex items-center justify-end gap-1 text-sm font-bold mt-1 px-2 py-0.5 rounded-md",
                  stock.isUp ? "bg-green-100 text-green-700 dark:bg-transparent dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-transparent dark:text-red-400"
                )}>
                  {stock.isUp ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                  {stock.isUp ? '+' : ''}{stock.pct.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5">
              <span className="text-xs text-gray-500 dark:text-gray-600 font-bold flex items-center gap-1">
                <Activity className="w-4 h-4" /> VOL {stock.volume}
              </span>
              <span className="text-sm font-semibold text-blue-600 dark:text-gray-400 group-hover:text-blue-700 dark:group-hover:text-white transition-colors">
                Analyze Target &rarr;
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
