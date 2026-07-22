import React, { useState, useEffect } from 'react';
import { StockMetadata, StockHistory } from '@/types/api';
import { Wallet, TrendingUp, TrendingDown, Edit2 } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface SimulatorPanelProps {
  meta: StockMetadata | null;
  history: StockHistory[] | null;
  isLoading: boolean;
}

export function SimulatorPanel({ meta, history, isLoading }: SimulatorPanelProps) {
  const [quantity, setQuantity] = useState(100);
  const [customCost, setCustomCost] = useState<string>('');

  useEffect(() => {
    if (history && history.length > 0) {
      setCustomCost(history[history.length - 1].sma_20.toFixed(2));
    }
  }, [history, meta?.companyName]);

  if (isLoading || !meta || !history || history.length === 0) {
    return (
      <div className="w-full h-24 bg-gray-100 dark:bg-[#161a22] rounded-2xl border border-gray-200 dark:border-white/5 animate-pulse mt-4"></div>
    );
  }

  const currentPrice = meta.currentPrice;
  const parsedCost = parseFloat(customCost) || currentPrice;
  
  const totalCost = quantity * parsedCost;
  const totalValue = quantity * currentPrice;
  const totalGains = totalValue - totalCost;
  const percentageGain = totalCost > 0 ? (totalGains / totalCost) * 100 : 0;
  
  const isPositive = totalGains >= 0;

  return (
    <div className="w-full bg-white dark:bg-[#161a22] rounded-2xl border border-gray-200 dark:border-white/5 p-6 mt-6 shadow-xl transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        
        {/* Column 1: Quantity Slider */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-500 dark:text-gray-400 font-bold tracking-widest text-xs uppercase">
              Simulate QTY
            </span>
            <span className="text-gray-900 dark:text-white font-black text-lg bg-gray-100 dark:bg-black/50 px-3 py-1 rounded-lg border border-gray-200 dark:border-white/10">
              {quantity}
            </span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="1000" 
            step="1"
            value={quantity} 
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 dark:bg-black rounded-lg appearance-none cursor-pointer accent-green-500"
          />
        </div>

        {/* Column 2: Custom Cost Input */}
        <div className="flex flex-col border-t md:border-t-0 md:border-l border-gray-200 dark:border-white/10 pt-4 md:pt-0 md:pl-8">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-2">
            Your Avg Cost
          </span>
          <div className="relative flex items-center">
             <span className="absolute left-3 text-gray-500 font-bold">$</span>
             <input 
               type="number"
               value={customCost}
               onChange={(e) => setCustomCost(e.target.value)}
               className="w-full pl-7 pr-3 py-2 bg-gray-50 dark:bg-black/40 border border-gray-300 dark:border-white/10 rounded-lg text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all text-lg"
             />
             <Edit2 className="w-4 h-4 text-gray-400 absolute right-3 pointer-events-none" />
          </div>
        </div>

        {/* Column 3: Total Gains */}
        <div className="flex flex-col items-end border-t md:border-t-0 md:border-l border-gray-200 dark:border-white/10 pt-4 md:pt-0 md:pl-8">
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider mb-2">
            Total Simulated Gains
          </span>
          
          <div className="flex flex-wrap items-center justify-end gap-3 w-full">
            <span className={twMerge(
              "text-3xl font-black tracking-tight drop-shadow-md",
              isPositive 
                ? "text-green-500 dark:text-green-400 dark:drop-shadow-[0_0_12px_rgba(74,222,128,0.4)]" 
                : "text-red-500 dark:text-red-400 dark:drop-shadow-[0_0_12px_rgba(248,113,113,0.4)]"
            )}>
              {isPositive ? '+' : ''}${totalGains.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            
            <div className={twMerge(
              "flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-bold shadow-sm whitespace-nowrap",
              isPositive 
                ? "bg-green-100 text-green-700 border border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20" 
                : "bg-red-100 text-red-700 border border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20"
            )}>
              {isPositive ? <TrendingUp className="w-4 h-4"/> : <TrendingDown className="w-4 h-4"/>}
              {Math.abs(percentageGain).toFixed(1)}%
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
