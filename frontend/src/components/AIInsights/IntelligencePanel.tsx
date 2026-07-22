import React from 'react';
import { MarketPredictionResponse } from '@/types/api';
import { BrainCircuit, Activity, BarChart2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface IntelligencePanelProps {
  predictionData: MarketPredictionResponse | null;
  isLoading: boolean;
}

export function IntelligencePanel({ predictionData, isLoading }: IntelligencePanelProps) {
  if (isLoading || !predictionData) {
    return (
      <div className="w-full h-64 bg-gray-100 dark:bg-[#161a22] rounded-2xl border border-gray-200 dark:border-white/5 animate-pulse flex flex-col p-6 mt-6"></div>
    );
  }

  const { prediction, confidence, insights } = predictionData;

  const isUp = prediction === 'UP';
  const isDown = prediction === 'DOWN';
  const isNeutral = prediction === 'NEUTRAL';

  return (
    <div className="w-full bg-white dark:bg-[#161a22] rounded-2xl border border-gray-200 dark:border-white/5 p-6 relative overflow-hidden shadow-xl transition-colors duration-300">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/5">
        <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20 shadow-sm">
          <BrainCircuit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h3 className="text-gray-900 dark:text-white font-black text-lg tracking-wide">AI Quant Engine</h3>
          <p className="text-xs text-gray-500 font-medium">Machine Learning Technical Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Metrics & Summary */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Metric 1: Prediction */}
            <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-2">Signal</span>
              <div className={twMerge(
                "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border font-black text-sm uppercase tracking-wider w-full shadow-sm",
                isUp && "bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/30",
                isDown && "bg-red-100 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/30",
                isNeutral && "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/30"
              )}>
                {isUp && <TrendingUp className="w-4 h-4" />}
                {isDown && <TrendingDown className="w-4 h-4" />}
                {isNeutral && <Minus className="w-4 h-4" />}
                {prediction}
              </div>
            </div>

            {/* Metric 2: Confidence */}
            <div className="bg-gray-50 dark:bg-black/20 rounded-xl p-4 border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest mb-1">Confidence</span>
              <span className="text-gray-900 dark:text-white font-black text-2xl tracking-tight mt-1">{confidence}</span>
            </div>
          </div>

          {/* Jargon-Free Summary */}
          <div className="p-4 rounded-xl bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/20">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-widest mb-2 block">Quick Summary</span>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 leading-snug">
              {predictionData.summary || "The AI is currently analyzing this asset."}
            </p>
          </div>
        </div>

        {/* Right Side: Actionable Insights List */}
        <div className="lg:col-span-2 flex flex-col border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-white/5 pt-6 lg:pt-0 lg:pl-8">
          <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-4">Comprehensive Quant Report</span>
          <div className="space-y-4">
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
    </div>
  );
}
