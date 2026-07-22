import React from 'react';
import { MarketPredictionResponse } from '@/types/api';
import { BarChart2 } from 'lucide-react';

interface AIReportProps {
  predictionData: MarketPredictionResponse | null;
  isLoading: boolean;
}

export function AIReport({ predictionData, isLoading }: AIReportProps) {
  if (isLoading || !predictionData) {
    return (
      <div className="w-full h-full min-h-[200px] bg-gray-100 dark:bg-[#161a22] rounded-2xl border border-gray-200 dark:border-white/5 animate-pulse"></div>
    );
  }

  const { insights } = predictionData;

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-[#161a22] rounded-2xl border border-gray-200 dark:border-white/5 p-6 relative overflow-hidden shadow-xl transition-colors duration-300">
      
      {/* Jargon-Free Summary */}
      <div className="mb-6 p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20 shrink-0">
        <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-2 block">Quick Summary</span>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">
          {predictionData.summary || "The AI is currently analyzing this asset."}
        </p>
      </div>

      {/* Actionable Insights List */}
      <div className="flex-1 flex flex-col min-h-0">
        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-4">Comprehensive Quant Report</span>
        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-4 group">
              <div className="mt-1 shrink-0 p-1.5 bg-gray-50 dark:bg-white/5 rounded-md border border-gray-200 dark:border-white/10 group-hover:border-blue-200 dark:group-hover:border-blue-500/30 transition-colors">
                <BarChart2 className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed font-medium">
                {insight}
              </p>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
