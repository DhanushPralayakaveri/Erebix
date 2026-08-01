"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/context/AuthContext';
import {
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Shield,
  Plus,
  Minus,
  Briefcase
} from 'lucide-react';

interface TradeModalProps {
  symbol: string;
  currentPrice: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function TradeModal({ symbol, currentPrice, isOpen, onClose, onSuccess }: TradeModalProps) {
  const { user } = useAuth();
  const [tradeType, setTradeType] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState<number>(10);
  const [cashBalance, setCashBalance] = useState<number>(100000);
  const [ownedQuantity, setOwnedQuantity] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [mounted, setMounted] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch current portfolio & cash balance from Spring Boot Core Gateway
  useEffect(() => {
    if (!isOpen || !user) return;
    setError('');
    setSuccessMsg('');
    setQuantity(10);
    fetch(`/api/v1/portfolio?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.cashBalance === 'number') {
          setCashBalance(data.cashBalance);
        }
        if (data && Array.isArray(data.holdings)) {
          const found = data.holdings.find((h: { symbol: string; quantity: number }) => h.symbol === symbol);
          setOwnedQuantity(found ? found.quantity : 0);
        }
      })
      .catch(err => {
        console.error('Failed to fetch user portfolio summary:', err);
      });

    // Auto-focus the quantity input box when modal opens
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    }, 50);
  }, [isOpen, user, symbol]);

  if (!isOpen || !mounted) return null;

  const totalValue = currentPrice * (quantity || 0);
  const hasEnoughCash = tradeType === 'BUY' ? cashBalance >= totalValue : true;
  const hasEnoughShares = tradeType === 'SELL' ? ownedQuantity >= quantity : true;

  const adjustQty = (delta: number) => {
    setQuantity(prev => Math.max(1, (prev || 0) + delta));
    setError('');
  };

  const handleExecuteTrade = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!quantity || quantity <= 0) {
      setError('Please enter a share quantity greater than 0');
      return;
    }
    if (tradeType === 'BUY' && !hasEnoughCash) {
      setError('Insufficient available cash to complete BUY order');
      return;
    }
    if (tradeType === 'SELL' && !hasEnoughShares) {
      setError(`Cannot sell more than owned shares (${ownedQuantity})`);
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = tradeType === 'BUY' ? '/api/v1/portfolio/buy' : '/api/v1/portfolio/sell';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id || 1,
          symbol: symbol.toUpperCase(),
          quantity,
          price: currentPrice
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || 'Order execution failed');
      }

      const updated = await res.json();
      if (updated && typeof updated.cashBalance === 'number') {
        setCashBalance(updated.cashBalance);
      }
      setSuccessMsg(`Executed ${tradeType} ${quantity} ${symbol} @ $${currentPrice.toFixed(2)}`);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Order execution failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-card border border-border/80 rounded-2xl shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden relative z-[100000]">
        {/* Modal Topbar - Sleek & Compact */}
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-xs font-black tracking-wider shadow-[0_0_10px_var(--glow-cyan)]">
              {symbol}
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-foreground">${currentPrice.toFixed(2)}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">USD</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title="Close Trade Terminal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Main Compact Body */}
        <div className="p-5 space-y-4">
          {/* BUY / SELL Tab Selector */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted/50 border border-border">
            <button
              type="button"
              onClick={() => { setTradeType('BUY'); setError(''); }}
              className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                tradeType === 'BUY'
                  ? 'bg-success text-success-foreground shadow-[0_0_15px_var(--glow-green)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> BUY ORDER
            </button>
            <button
              type="button"
              onClick={() => { setTradeType('SELL'); setError(''); }}
              className={`py-2 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                tradeType === 'SELL'
                  ? 'bg-danger text-danger-foreground shadow-[0_0_15px_rgba(255,0,60,0.5)]'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" /> SELL ORDER
            </button>
          </div>

          {/* Sleek Single-Line Account Summary Bar */}
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-muted/30 border border-border/60 text-xs">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5 text-success" />
              <span>Cash: <strong className="text-foreground font-black">${cashBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              <span>Owned: <strong className="text-primary font-black">{ownedQuantity}</strong></span>
            </div>
          </div>

          {/* Compact Quantity Input Form */}
          <form onSubmit={handleExecuteTrade} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Share Quantity
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => adjustQty(-10)}
                  className="w-10 h-10 rounded-xl bg-muted/40 border border-border hover:border-primary/50 text-foreground font-bold text-xs transition-colors flex items-center justify-center shrink-0"
                  title="Subtract 10 shares"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => adjustQty(-1)}
                  className="w-10 h-10 rounded-xl bg-muted/40 border border-border hover:border-primary/50 text-foreground font-bold text-xs transition-colors flex items-center justify-center shrink-0"
                  title="Subtract 1 share"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                <input
                  ref={inputRef}
                  type="number"
                  min="1"
                  step="1"
                  value={quantity || ''}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    setQuantity(isNaN(val) ? 0 : val);
                    setError('');
                  }}
                  className="w-full h-10 px-3 bg-card border-2 border-primary/50 rounded-xl text-center text-foreground text-lg font-black focus:outline-none focus:border-primary transition-all shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <button
                  type="button"
                  onClick={() => adjustQty(1)}
                  className="w-10 h-10 rounded-xl bg-muted/40 border border-border hover:border-primary/50 text-foreground font-bold text-xs transition-colors flex items-center justify-center shrink-0"
                  title="Add 1 share"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => adjustQty(10)}
                  className="w-10 h-10 rounded-xl bg-muted/40 border border-border hover:border-primary/50 text-foreground font-bold text-xs transition-colors flex items-center justify-center shrink-0"
                  title="Add 10 shares"
                >
                  +10
                </button>
              </div>

              {/* Quick Preset Share Buttons */}
              <div className="grid grid-cols-5 gap-1.5 mt-2">
                {[5, 10, 25, 50, 100].map(preset => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => {
                      setQuantity(preset);
                      setError('');
                    }}
                    className={`py-1 rounded-lg text-[11px] font-bold transition-all border ${
                      quantity === preset
                        ? 'bg-primary/20 text-primary border-primary/60'
                        : 'bg-muted/30 border-border/60 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Estimated Cost Bar */}
            <div className="px-4 py-3 rounded-xl bg-card border border-border flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-muted-foreground">
                Total Value
              </span>
              <span className="text-lg font-black text-foreground">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-danger/15 border border-danger/40 text-danger text-xs font-bold flex items-center gap-2 shadow-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3 rounded-xl bg-success/15 border border-success/40 text-success text-xs font-bold flex items-center gap-2 shadow-sm">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !quantity || quantity <= 0 || (tradeType === 'BUY' && !hasEnoughCash) || (tradeType === 'SELL' && !hasEnoughShares)}
              className={`w-full py-3.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
                tradeType === 'BUY'
                  ? 'bg-success text-success-foreground hover:opacity-95 shadow-[0_0_15px_var(--glow-green)]'
                  : 'bg-danger text-danger-foreground hover:opacity-95 shadow-[0_0_15px_rgba(255,0,60,0.5)]'
              }`}
            >
              {isSubmitting
                ? 'Executing Order...'
                : `CONFIRM ${tradeType} ${quantity} SHARES ($${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`}
            </button>
          </form>

          {/* Compliance Footer */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
            <Shield className="w-3 h-3 text-success" />
            <span>ACID Shielded • 0 USD Free-Tier Compliant</span>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
