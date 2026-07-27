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
      <div className="w-full h-24 bg-card rounded-2xl cyber:rounded-none cyber:cyber-clip border border-border animate-pulse mt-4"></div>
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
    <div className="w-full bg-card rounded-2xl cyber:rounded-none cyber:cyber-clip hades:rounded-sm border border-border hades:border-2 p-6 hades:p-8 mt-6 shadow-xl hades:shadow-[0_0_30px_var(--glow-red)] transition-all duration-500">
      <div className="flex flex-wrap items-center justify-between gap-8">
        
        {/* Left Group: Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-8 w-full lg:w-auto shrink-0">
          {/* Column 1: Quantity Slider */}
          <div className="flex flex-col gap-3 w-full sm:w-48 xl:w-64">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground font-bold tracking-widest text-xs uppercase hades:font-serif">
              Simulate QTY
            </span>
            <span className="text-foreground font-black text-lg bg-muted px-3 hades:px-4 py-1 rounded-lg hades:rounded-sm cyber:rounded-none cyber:cyber-clip border border-border hades:shadow-[0_0_10px_var(--glow-red)]">
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
            className="w-full h-2 hades:h-1 bg-muted rounded-lg hades:rounded-none appearance-none cursor-pointer accent-primary hades:shadow-[0_0_10px_var(--glow-red)]"
          />
        </div>

          {/* Column 2: Custom Cost Input */}
          <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-8 w-full sm:w-48 xl:w-64">
          <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider hades:tracking-widest mb-2 hades:font-serif">
            Your Avg Cost
          </span>
          <div className="relative flex items-center">
             <span className="absolute left-3 text-muted-foreground font-bold">$</span>
             <input 
               type="number"
               value={customCost}
               onChange={(e) => setCustomCost(e.target.value)}
               className="w-full pl-7 pr-3 py-2 bg-muted/50 border border-border hades:border-b-2 hades:border-t-0 hades:border-x-0 rounded-lg hades:rounded-none text-foreground font-bold hades:font-black focus:outline-none focus:ring-2 focus:ring-primary/50 hades:focus:ring-0 hades:focus:border-primary transition-all text-lg hades:text-xl hades:shadow-[0_4px_10px_-4px_var(--glow-red)]"
             />
             <Edit2 className="w-4 h-4 text-muted-foreground absolute right-3 pointer-events-none" />
          </div>
        </div>

          </div>

        {/* Right Group: Total Gains */}
        <div className="flex flex-col items-start lg:items-end border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8 flex-1 min-w-[250px]">
          <span className="text-[10px] text-muted-foreground opacity-80 font-bold uppercase tracking-wider hades:tracking-widest mb-2 hades:font-serif">
            Total Simulated Gains
          </span>
          
          <div className="flex flex-col lg:items-end gap-1 w-full mt-1">
            <span className={twMerge(
              "text-3xl xl:text-4xl font-black tracking-tight break-all",
              isPositive 
                ? "text-success drop-shadow-[0_0_12px_var(--glow-green)] hades:font-serif" 
                : "text-danger drop-shadow-[0_0_12px_var(--glow-red)] hades:font-serif"
            )}>
              {isPositive ? '+' : ''}${totalGains.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            
            <div className={twMerge(
              "flex items-center gap-1 px-2.5 py-1 rounded-md hades:rounded-sm text-sm font-bold shadow-sm whitespace-nowrap self-end border",
              isPositive 
                ? "bg-success/10 text-success border-success/20 shadow-[0_0_10px_var(--glow-green)]" 
                : "bg-danger/10 text-danger border-danger/20 shadow-[0_0_10px_var(--glow-red)]"
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
