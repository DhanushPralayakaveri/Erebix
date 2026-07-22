"use client";

import React from 'react';
import { useWatchlist } from '@/context/WatchlistContext';
import { Bookmark, Activity, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function WatchlistPage() {
  const { watchlist, removeStock } = useWatchlist();
  const router = useRouter();

  return (
    <div className="w-full animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto py-6">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-white/10 shadow-sm">
          <Bookmark className="w-5 h-5 text-gray-500 dark:text-gray-300" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-wide transition-colors">
            My Watchlist
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Your personal collection of saved assets</p>
        </div>
      </div>

      {watchlist.length === 0 ? (
        <div className="w-full bg-white dark:bg-[#161a22] rounded-2xl border border-dashed border-gray-300 dark:border-white/10 p-12 text-center flex flex-col items-center justify-center shadow-sm">
          <Bookmark className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No stocks saved yet</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto mb-6">
            Search for an asset in the top bar or use the global dashboard, and click the bookmark icon on the asset's profile to save it here.
          </p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-gray-900 text-white dark:bg-white dark:text-gray-900 font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-transform"
          >
            Go to Dashboard
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-2">
          {watchlist.map((symbol) => (
            <div
              key={symbol}
              className="group relative w-full bg-white dark:bg-[#161a22] hover:bg-gray-50 dark:hover:bg-[#1a1f29] rounded-2xl border border-gray-200 dark:border-white/5 p-6 text-left transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between h-40 cursor-pointer"
              onClick={() => router.push(`/stock/${symbol}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50 dark:from-transparent dark:to-transparent opacity-100 dark:opacity-0 -z-10" />

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {symbol}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    removeStock(symbol);
                  }}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors z-10"
                  title="Remove from Watchlist"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-white/5 mt-auto">
                <span className="text-xs text-gray-500 dark:text-gray-600 font-bold flex items-center gap-1">
                  <Activity className="w-4 h-4" /> Ready for AI Analysis
                </span>
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-white transition-colors relative z-10">
                  Analyze Target &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
