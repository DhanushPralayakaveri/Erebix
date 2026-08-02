"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/Layout/Topbar';
import { PopularStocks } from '@/components/Dashboard/PopularStocks';
import { useAuth } from '@/context/AuthContext';
import {
  Wallet,
  Activity,
  ArrowRight
} from 'lucide-react';

interface PortfolioSummary {
  cashBalance: number;
  holdings: { symbol: string; quantity: number; averageCost: number }[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch(`/api/v1/portfolio?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.cashBalance === 'number') {
          setPortfolio(data);
        }
      })
      .catch(err => {
        console.error('Failed to load portfolio on dashboard:', err);
      });
  }, [user]);

  const handleSelectTicker = (symbol: string) => {
    router.push(`/stock/${symbol}`);
  };

  const cash = portfolio?.cashBalance || 100000;
  const holdingsCount = portfolio?.holdings?.length || 0;

  return (
    <>
      <Topbar />
      <div className="p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
        
        {/* Top Header & Institutional Quant Status Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/60 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-black uppercase tracking-wider shadow-[0_0_10px_var(--glow-cyan)]">
                {user?.username || 'Trader-01'}
              </span>
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                QUANTITATIVE COMMAND CENTER
              </span>
            </div>
            <h1 className="text-3xl font-black text-foreground">
              Institutional Market Overview
            </h1>
          </div>

          {/* Quant Portfolio Quick Actions Strip */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/portfolio')}
              className="px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary text-foreground font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm hover:bg-muted/30"
            >
              <Wallet className="w-4 h-4 text-success" />
              <span>Cash: ${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="text-muted-foreground">• {holdingsCount} Pos</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60" />
            </button>

            <button
              onClick={() => router.push('/watchlist')}
              className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_var(--glow-cyan)]"
            >
              <Activity className="w-4 h-4" />
              <span>Saved Watchlist</span>
            </button>
          </div>
        </div>

        {/* Global Equities Watchlist & Screener */}
        <div className="pt-2">
          <PopularStocks onSelect={handleSelectTicker} />
        </div>

      </div>
    </>
  );
}
