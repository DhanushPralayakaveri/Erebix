import React from 'react';
import { StockMetadata } from '@/types/api';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AssetProfileProps {
  meta: StockMetadata | null;
  isLoading: boolean;
}

export function AssetProfile({ meta, isLoading }: AssetProfileProps) {
  if (isLoading || !meta) {
    return (
      <div className="w-full h-32 bg-[#161a22] rounded-2xl border border-white/5 animate-pulse flex flex-col justify-center px-6">
        <div className="h-6 bg-white/10 rounded w-1/4 mb-4"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-white/10 rounded w-32"></div>
          <div className="h-10 bg-white/10 rounded w-24"></div>
        </div>
      </div>
    );
  }

  const isPositive = meta.change >= 0;
  
  return (
    <div className="w-full bg-white dark:bg-[#161a22] rounded-2xl border border-gray-200 dark:border-white/5 p-6 flex flex-col md:flex-row justify-between items-start md:items-center shadow-xl relative overflow-hidden transition-colors duration-300">
      {/* Decorative neon glow behind */}
      <div className={twMerge(
        "absolute -top-10 -right-10 w-40 h-40 rounded-full blur-[80px] opacity-10 dark:opacity-20 pointer-events-none",
        isPositive ? "bg-green-500" : "bg-red-500"
      )} />

      <div className="flex flex-col mb-4 md:mb-0 z-10">
        <div className="flex items-center gap-3 mb-1">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {meta.companyName}
          </h2>
          <span className="px-2 py-0.5 rounded bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 text-sm font-bold border border-gray-200 dark:border-white/10">
            {meta.sector}
          </span>
        </div>
        <p className="text-gray-500 font-medium text-sm flex items-center gap-1 mt-2">
          <Activity className="w-4 h-4 text-blue-500" /> Live Market Data
        </p>
      </div>

      <div className="flex items-end gap-6 z-10">
        <div className="flex flex-col items-end">
          <span className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Price Today</span>
          <div className="flex items-center gap-1">
            <span className="text-gray-400 dark:text-gray-500"><DollarSign className="w-6 h-6"/></span>
            <span className="text-4xl font-black text-gray-900 dark:text-white">
              {meta.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Vs. Cost</span>
          <div className={twMerge(
            "flex items-center gap-1 px-3 py-1.5 rounded-lg border font-bold text-sm",
            isPositive 
              ? "bg-green-100 text-green-700 border-green-200 shadow-sm dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20 dark:shadow-[0_0_10px_rgba(34,197,94,0.1)]" 
              : "bg-red-100 text-red-700 border-red-200 shadow-sm dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 dark:shadow-[0_0_10px_rgba(239,68,68,0.1)]"
          )}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            <span>
              {isPositive ? '+' : ''}{meta.change.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
            <span className="ml-1 opacity-80">
              ({isPositive ? '+' : ''}{meta.percentageChange.toFixed(2)}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
