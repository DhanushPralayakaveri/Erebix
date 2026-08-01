import React, { useState } from 'react';
import { StockMetadata } from '@/types/api';
import { TrendingUp, TrendingDown, Activity, DollarSign, Bookmark, BookmarkCheck } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useWatchlist } from '@/context/WatchlistContext';
import { TradeModal } from '@/components/Dashboard/TradeModal';

interface AssetProfileProps {
  symbol: string | null;
  meta: StockMetadata | null;
  isLoading: boolean;
}

export function AssetProfile({ symbol, meta, isLoading }: AssetProfileProps) {
  const [isTradeModalOpen, setIsTradeModalOpen] = useState(false);
  const { isInWatchlist, addStock, removeStock } = useWatchlist();

  if (isLoading || !meta || !symbol) {
    return (
      <div className="w-full h-32 bg-card rounded-2xl cyber:rounded-none cyber:cyber-clip border border-border animate-pulse flex flex-col justify-center px-6">
        <div className="h-6 bg-muted rounded w-1/4 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-muted rounded w-32"></div>
          <div className="h-10 bg-muted rounded w-24"></div>
        </div>
      </div>
    );
  }

  const isPositive = meta.change >= 0;
  const isSaved = isInWatchlist(symbol);

  return (
    <div className="w-full bg-card rounded-2xl cyber:rounded-none cyber:cyber-clip hades:rounded-sm border border-border hades:border-t-2 hades:border-b-2 hades:border-x-0 p-6 hades:p-8 flex flex-col md:flex-row justify-between items-start md:items-center shadow-xl hades:shadow-[0_0_40px_var(--glow-red)] relative overflow-hidden transition-all duration-500 cyber:cyber-glitch-hover">
      {/* Decorative neon glow behind */}
      <div className={twMerge(
        "absolute -top-10 -right-10 hades:-top-20 hades:-right-20 w-40 h-40 hades:w-64 hades:h-64 rounded-full blur-[80px] hades:blur-[100px] opacity-10 dark:opacity-20 pointer-events-none",
        isPositive ? "bg-success" : "bg-danger"
      )} />

      <div className="flex flex-col mb-4 md:mb-0 z-10">
        <div className="flex flex-wrap items-center gap-3 hades:gap-4 mb-1">
          <h2 className="text-2xl md:text-3xl hades:text-3xl hades:md:text-4xl font-black text-foreground tracking-tight hades:tracking-widest leading-tight hades:uppercase hades:font-serif max-w-xl">
            {meta.companyName}
          </h2>
          <span className="px-2 py-0.5 hades:px-3 hades:py-1 rounded hades:rounded-sm bg-muted text-muted-foreground text-sm hades:text-xs font-bold border border-border hades:uppercase hades:tracking-widest">
            {meta.sector}
          </span>
          <button
            onClick={() => isSaved ? removeStock(symbol) : addStock(symbol)}
            className={twMerge(
              "ml-2 p-1.5 hades:p-2 rounded-lg hades:rounded-sm border transition-all duration-300 cyber:rounded-none cyber:cyber-clip-button cyber:cyber-glitch-hover",
              isSaved
                ? "bg-warning/10 text-warning border-warning/20 shadow-[0_0_10px_var(--glow-red)]"
                : "bg-muted/50 text-muted-foreground border-border hover:bg-muted hover:text-foreground"
            )}
            title={isSaved ? "Remove from Watchlist" : "Add to Watchlist"}
          >
            {isSaved ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsTradeModalOpen(true)}
            className="ml-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition-all font-black text-xs uppercase tracking-wider shadow-[0_0_15px_var(--glow-cyan)] flex items-center gap-1.5"
            title="Execute Quant Trade / Add to Portfolio"
          >
            <DollarSign className="w-4 h-4" />
            <span>Trade / Add to Portfolio</span>
          </button>
        </div>

        <TradeModal
          symbol={symbol}
          currentPrice={meta.currentPrice}
          isOpen={isTradeModalOpen}
          onClose={() => setIsTradeModalOpen(false)}
        />
        <p className="text-muted-foreground font-medium text-sm hades:text-xs flex items-center gap-1 hades:gap-2 mt-2 hades:mt-3 hades:uppercase hades:tracking-widest">
          <Activity className="w-4 h-4 text-primary hades:animate-pulse" /> Live Market Data
        </p>
      </div>

      <div className="flex items-end gap-6 hades:gap-8 z-10">
        <div className="flex flex-col items-end">
          <span className="text-muted-foreground text-sm hades:text-xs font-bold uppercase tracking-wider hades:tracking-widest mb-1 hades:mb-2">Price Today</span>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground opacity-50"><DollarSign className="w-6 h-6" /></span>
            <span className="text-4xl font-black text-foreground hades:font-serif">
              {meta.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-muted-foreground text-sm hades:text-xs font-bold uppercase tracking-wider hades:tracking-widest mb-1 hades:mb-2">Daily Change</span>
          <div className={twMerge(
            "flex items-center gap-1 hades:gap-2 px-3 py-1.5 hades:px-4 hades:py-2 rounded-lg hades:rounded-sm border font-bold hades:font-black text-sm hades:tracking-wider hades:uppercase shadow-sm hades:shadow-xl",
            isPositive
              ? "bg-success/10 text-success border-success/20 shadow-[0_0_15px_var(--glow-green)]"
              : "bg-danger/10 text-danger border-danger/20 shadow-[0_0_15px_var(--glow-red)]"
          )}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>
              {isPositive ? '+' : ''}{meta.change.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="ml-1 opacity-80 hades:opacity-70">
              ({isPositive ? '+' : ''}{meta.percentageChange.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
