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
    <div className="w-full bg-white dark:bg-[#161a22] rounded-2xl border border-gray-200 dark:border-white/5 p-6 mt-6 relative overflow-hidden shadow-xl transition-colors duration-300">
      
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

      <div className="grid grid-cols-2 gap-4 mb-6">
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

      {/* Actionable Insights List */}
      <div>
        <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-3">Key Drivers</span>
        <div className="space-y-2">
          {insights.map((insight, idx) => (
            <div key={idx} className="flex items-start gap-3 p-2 group">
              <div className="mt-0.5">
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
