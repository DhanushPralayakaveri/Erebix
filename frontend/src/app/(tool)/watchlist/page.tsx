"use client";

import React from 'react';
import { useWatchlist } from '@/context/WatchlistContext';
import { Bookmark, Activity, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/Layout/Topbar';

export default function WatchlistPage() {
  const { watchlist, removeStock } = useWatchlist();
  const router = useRouter();

  return (
    <>
      <Topbar />
      <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto py-6">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="p-2 bg-muted rounded-lg border border-border shadow-sm">
          <Bookmark className="w-5 h-5 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-foreground tracking-wide transition-colors">
            My Watchlist
          </h2>
          <p className="text-sm text-muted-foreground font-medium">Your personal collection of saved assets</p>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="w-full bg-card rounded-2xl border border-dashed border-border p-12 text-center flex flex-col items-center justify-center shadow-sm">
          <Bookmark className="w-12 h-12 text-muted-foreground opacity-50 mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">No stocks saved yet</h3>
          <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
            Search for an asset in the top bar or use the global dashboard, and click the bookmark icon on the asset's profile to save it here.
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-foreground text-background font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {watchlist.map((symbol) => (
            <div
              key={symbol}
              className="group relative w-full bg-card hover:bg-muted/50 rounded-2xl border border-border p-6 text-left transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between h-40 cursor-pointer"
              onClick={() => router.push(`/stock/${symbol}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-card to-muted opacity-100 dark:opacity-0 -z-10" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">
                    {symbol}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    removeStock(symbol);
                  }}
                  className="p-1.5 text-muted-foreground hover:text-danger hover:bg-danger/10 rounded-lg transition-colors z-10"
                  title="Remove from Watchlist"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                <span className="text-xs text-muted-foreground opacity-80 font-bold flex items-center gap-1">
                  <Activity className="w-4 h-4" /> Ready for AI Analysis
                </span>
                <span className="text-sm font-semibold text-primary group-hover:text-primary-foreground transition-colors relative z-10">
                  Analyze Target &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
}
