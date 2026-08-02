"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  History,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ShieldAlert,
  PlusCircle,
  ExternalLink
} from 'lucide-react';
import { TradeModal } from '@/components/Dashboard/TradeModal';

interface HoldingItem {
  id: number;
  symbol: string;
  quantity: number;
  averageCost: number;
  currentPrice?: number;
}

interface TradeHistoryItem {
  id: number;
  tradeType?: string;
  type?: string;
  symbol: string;
  quantity: number;
  price: number;
  totalValue?: number;
  executedAt?: string;
  timestamp?: string;
}

interface PortfolioSummary {
  userId: number;
  cashBalance: number;
  startingCash: number;
  holdings: HoldingItem[];
}

export default function PortfolioPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [history, setHistory] = useState<TradeHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [livePrices, setLivePrices] = useState<Record<string, number>>({});
  const [selectedTradeSymbol, setSelectedTradeSymbol] = useState<string | null>(null);
  const [selectedTradePrice, setSelectedTradePrice] = useState<number>(0);

  const fetchPortfolioData = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const [portRes, histRes] = await Promise.all([
        fetch(`/api/v1/portfolio?userId=${user.id}`),
        fetch(`/api/v1/portfolio/history?userId=${user.id}`)
      ]);

      if (portRes.ok) {
        const portData = await portRes.json();
        setPortfolio(portData);

        // Fetch live quotes for holdings
        if (portData.holdings && Array.isArray(portData.holdings)) {
          const prices: Record<string, number> = {};
          for (const h of portData.holdings) {
            try {
              const quoteRes = await fetch(`/api/v1/market/${h.symbol}`);
              if (quoteRes.ok) {
                const quote = await quoteRes.json();
                prices[h.symbol] = quote.currentPrice || h.averageCost;
              } else {
                prices[h.symbol] = h.averageCost;
              }
            } catch {
              prices[h.symbol] = h.averageCost;
            }
          }
          setLivePrices(prices);
        }
      }

      if (histRes.ok) {
        const histData = await histRes.json();
        setHistory(Array.isArray(histData) ? histData : []);
      }
    } catch (err) {
      console.error('Failed to load quantitative portfolio:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchPortfolioData();
    }
  }, [user, authLoading]);

  if (authLoading || isLoading) {
    return (
      <div className="p-8 space-y-8 animate-pulse">
        <div className="h-10 bg-muted rounded-xl w-64" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="h-32 bg-card border border-border rounded-2xl" />
          <div className="h-32 bg-card border border-border rounded-2xl" />
          <div className="h-32 bg-card border border-border rounded-2xl" />
          <div className="h-32 bg-card border border-border rounded-2xl" />
        </div>
      </div>
    );
  }

  const cash = portfolio?.cashBalance || 100000;
  const startingCash = portfolio?.startingCash || 100000;

  // Calculate market equity value
  const holdings = portfolio?.holdings || [];
  const equityValue = holdings.reduce((sum, h) => {
    const price = livePrices[h.symbol] || h.averageCost;
    return sum + price * h.quantity;
  }, 0);

  const totalPortfolioValue = cash + equityValue;
  const totalPnL = totalPortfolioValue - startingCash;
  const totalPnLPercent = startingCash > 0 ? (totalPnL / startingCash) * 100 : 0;
  const isPositivePnL = totalPnL >= 0;

  // Asset allocation percentages
  const cashPercent = totalPortfolioValue > 0 ? (cash / totalPortfolioValue) * 100 : 100;
  const equityPercent = totalPortfolioValue > 0 ? (equityValue / totalPortfolioValue) * 100 : 0;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Top Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg bg-primary/20 text-primary text-xs font-black uppercase tracking-wider">
              {user?.username || 'Trader-01'}
            </span>
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
              INSTITUTIONAL QUANT SUITE
            </span>
          </div>
          <h1 className="text-3xl font-black text-foreground mt-1">
            Portfolio Command Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchPortfolioData}
            className="px-4 py-2.5 rounded-xl bg-card border border-border hover:border-primary/50 text-foreground font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all hover:bg-muted/40"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Valuation
          </button>
          <button
            onClick={() => router.push('/watchlist')}
            className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_var(--glow-cyan)]"
          >
            <PlusCircle className="w-3.5 h-3.5" /> Watchlist
          </button>
        </div>
      </div>

      {/* Hero Financial Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Portfolio Value */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-lg relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Net Asset Value
            </span>
            <Wallet className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-black text-foreground">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            Cash + Live Equity Market Value
          </p>
        </div>

        {/* Invested Equity Value */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-lg relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Invested Equity
            </span>
            <PieChart className="w-5 h-5 text-primary" />
          </div>
          <div className="text-3xl font-black text-foreground">
            ${equityValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            {holdings.length} Active Position{holdings.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Cash Balance */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-lg relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Available Cash
            </span>
            <DollarSign className="w-5 h-5 text-success" />
          </div>
          <div className="text-3xl font-black text-foreground">
            ${cash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <p className="text-xs text-muted-foreground mt-2 font-medium">
            Ready for Trade Execution
          </p>
        </div>

        {/* All-Time P&L */}
        <div className="p-6 rounded-2xl bg-card border border-border shadow-lg relative overflow-hidden group hover:border-primary/50 transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Total Realized + Unrealized P&L
            </span>
            {isPositivePnL ? (
              <TrendingUp className="w-5 h-5 text-success" />
            ) : (
              <TrendingDown className="w-5 h-5 text-danger" />
            )}
          </div>
          <div className={`text-3xl font-black flex items-center gap-1.5 ${isPositivePnL ? 'text-success' : 'text-danger'}`}>
            <span>{isPositivePnL ? '+' : ''}${totalPnL.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${isPositivePnL ? 'text-success' : 'text-danger'}`}>
            <span>({isPositivePnL ? '+' : ''}{totalPnLPercent.toFixed(2)}%)</span>
            <span>vs Starting Capital</span>
          </p>
        </div>
      </div>

      {/* Asset Allocation Bar */}
      <div className="p-6 rounded-2xl bg-card border border-border shadow-lg space-y-3">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <span className="text-foreground">Asset Allocation</span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              Stocks ({equityPercent.toFixed(1)}%)
            </span>
            <span className="flex items-center gap-1.5 text-success">
              <span className="w-2.5 h-2.5 rounded-full bg-success" />
              Cash ({cashPercent.toFixed(1)}%)
            </span>
          </div>
        </div>
        <div className="w-full h-4 rounded-xl bg-muted/40 overflow-hidden flex border border-border/60">
          <div
            style={{ width: `${equityPercent}%` }}
            className="h-full bg-primary transition-all duration-500 shadow-[0_0_10px_var(--glow-cyan)]"
          />
          <div
            style={{ width: `${cashPercent}%` }}
            className="h-full bg-success transition-all duration-500 shadow-[0_0_10px_var(--glow-green)]"
          />
        </div>
      </div>

      {/* Active Holdings Table */}
      <div className="rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
          <div>
            <h3 className="text-lg font-black text-foreground uppercase tracking-wider">
              Active Positions
            </h3>
            <p className="text-xs text-muted-foreground font-medium">
              Real-time weighted average cost basis &amp; P&amp;L accounting
            </p>
          </div>
        </div>

        {holdings.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldAlert className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
            <h4 className="text-base font-bold text-foreground">No Active Stock Positions</h4>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              You are currently 100% in cash. Search for stocks in the Erebix terminal to execute BUY orders.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Symbol</th>
                  <th className="p-4">Shares</th>
                  <th className="p-4">Avg Cost Basis</th>
                  <th className="p-4">Current Price</th>
                  <th className="p-4">Market Value</th>
                  <th className="p-4">Unrealized P&amp;L</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm font-semibold">
                {holdings.map((item) => {
                  const currentPrice = livePrices[item.symbol] || item.averageCost;
                  const marketValue = currentPrice * item.quantity;
                  const costBasis = item.averageCost * item.quantity;
                  const pnl = marketValue - costBasis;
                  const pnlPercent = costBasis > 0 ? (pnl / costBasis) * 100 : 0;
                  const isPos = pnl >= 0;

                  return (
                    <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 font-black text-foreground">
                        <button
                          onClick={() => router.push(`/stock/${item.symbol}`)}
                          className="hover:text-primary transition-colors flex items-center gap-1.5"
                        >
                          {item.symbol} <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                        </button>
                      </td>
                      <td className="p-4 text-foreground">{item.quantity}</td>
                      <td className="p-4 text-muted-foreground">
                        ${item.averageCost.toFixed(2)}
                      </td>
                      <td className="p-4 text-foreground font-black">
                        ${currentPrice.toFixed(2)}
                      </td>
                      <td className="p-4 text-foreground font-bold">
                        ${marketValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black ${
                          isPos
                            ? 'bg-success/10 text-success border border-success/30'
                            : 'bg-danger/10 text-danger border border-danger/30'
                        }`}>
                          {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                          <span>{isPos ? '+' : ''}${pnl.toFixed(2)} ({isPos ? '+' : ''}{pnlPercent.toFixed(2)}%)</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedTradeSymbol(item.symbol);
                            setSelectedTradePrice(currentPrice);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-card border border-border hover:border-primary text-foreground hover:text-primary text-xs font-black uppercase tracking-wider transition-all shadow-sm"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Execution History Log Table */}
      <div className="rounded-2xl bg-card border border-border shadow-lg overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-black text-foreground uppercase tracking-wider">
              Immutable Trade Audit Log
            </h3>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="p-8 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider">
            No trade execution history recorded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <th className="p-4">Timestamp</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Symbol</th>
                  <th className="p-4">Shares</th>
                  <th className="p-4">Execution Price</th>
                  <th className="p-4">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm font-semibold">
                {history.map((record) => {
                  const tradeType = record.tradeType || record.type || 'BUY';
                  const isBuy = tradeType === 'BUY';
                  const timeVal = record.executedAt || record.timestamp;
                  const dateStr = timeVal
                    ? new Date(timeVal).toLocaleString()
                    : 'Just now';
                  const priceVal = Number(record.price) || 0;
                  const qtyVal = Number(record.quantity) || 0;
                  const totalValueVal = Number(record.totalValue ?? (priceVal * qtyVal)) || 0;

                  return (
                    <tr key={record.id} className="hover:bg-muted/20 transition-colors">
                      <td className="p-4 text-xs font-medium text-muted-foreground">{dateStr}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase ${
                          isBuy
                            ? 'bg-success/15 text-success border border-success/30'
                            : 'bg-danger/15 text-danger border border-danger/30'
                        }`}>
                          {tradeType}
                        </span>
                      </td>
                      <td className="p-4 font-black text-foreground">{record.symbol}</td>
                      <td className="p-4 text-foreground">{qtyVal}</td>
                      <td className="p-4 text-muted-foreground">${priceVal.toFixed(2)}</td>
                      <td className="p-4 font-black text-foreground">
                        ${totalValueVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedTradeSymbol && (
        <TradeModal
          symbol={selectedTradeSymbol}
          currentPrice={selectedTradePrice}
          isOpen={!!selectedTradeSymbol}
          onClose={() => setSelectedTradeSymbol(null)}
          onSuccess={fetchPortfolioData}
        />
      )}
    </div>
  );
}
