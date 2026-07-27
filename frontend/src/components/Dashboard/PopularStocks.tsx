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
          <div className="p-2 bg-muted rounded-lg border border-border shadow-sm">
            <Globe className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-foreground tracking-wide transition-colors">
              Global Equities Watchlist
            </h2>
            <p className="text-sm text-muted-foreground font-medium">Real-time simulated market data flow</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/20 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          <span className="text-success text-xs font-bold uppercase tracking-wider hidden sm:block">Markets Open</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {POPULAR_STOCKS.map((stock) => (
          <button
            key={stock.symbol}
            onClick={() => onSelect(stock.symbol)}
            className="group relative w-full bg-card hover:bg-muted/50 rounded-2xl cyber:rounded-none cyber:cyber-clip border border-border p-6 text-left transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 cyber:cyber-glitch-hover"
          >
            {/* Fancy Gradient Background in Light Mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-card to-muted opacity-100 dark:opacity-0 -z-10" />

            {/* Hover Glow Effect */}
            <div className={clsx(
              "absolute -top-10 -right-10 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-30 dark:group-hover:opacity-20 transition-opacity duration-500 pointer-events-none",
              stock.isUp ? "bg-success" : "bg-danger"
            )} />

            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-black text-foreground group-hover:text-success transition-colors">
                  {stock.symbol}
                </h3>
                <p className="text-sm text-muted-foreground">{stock.name}</p>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold text-foreground">
                  ${stock.price.toFixed(2)}
                </span>
                <div className={clsx(
                  "flex items-center justify-end gap-1 text-sm font-bold mt-1 px-2 py-0.5 rounded-md",
                  stock.isUp ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                )}>
                  {stock.isUp ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>}
                  {stock.isUp ? '+' : ''}{stock.pct.toFixed(2)}%
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-xs text-muted-foreground font-bold flex items-center gap-1">
                <Activity className="w-4 h-4" /> VOL {stock.volume}
              </span>
              <span className="text-sm font-semibold text-primary group-hover:text-primary-foreground transition-colors">
                Analyze Target &rarr;
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
