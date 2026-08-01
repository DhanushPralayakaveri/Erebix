import React from 'react';
import { MarketPredictionResponse } from '@/types/api';
import { BrainCircuit, BarChart2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

interface IntelligencePanelProps {
  predictionData: MarketPredictionResponse | null;
  isLoading: boolean;
}

export function IntelligencePanel({ predictionData, isLoading }: IntelligencePanelProps) {
  if (isLoading || !predictionData) {
    return (
      <div className="w-full h-64 bg-card rounded-2xl border border-border animate-pulse flex flex-col p-6 mt-6"></div>
    );
  }

  const { prediction, confidence, insights } = predictionData;

  const isUp = prediction === 'UP';
  const isDown = prediction === 'DOWN';
  const isNeutral = prediction === 'NEUTRAL';

  return (
    <div className="w-full flex flex-col bg-card rounded-2xl hades:rounded-sm border border-border hades:border-2 p-6 hades:p-8 relative overflow-hidden shadow-xl hades:shadow-[0_0_30px_var(--glow-red)] transition-all duration-500">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
        <div className="p-2 hades:p-3 bg-primary/10 rounded-lg hades:rounded-none border border-primary/20 shadow-sm hades:shadow-[0_0_15px_var(--glow-red)]">
          <BrainCircuit className="w-5 h-5 hades:w-6 hades:h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-foreground font-black text-lg hades:text-xl tracking-wide hades:tracking-widest hades:uppercase hades:font-serif hades:drop-shadow-[0_0_10px_var(--glow-red)]">AI Quant Engine</h3>
          <p className="text-xs text-muted-foreground font-medium hades:font-bold hades:uppercase hades:tracking-widest hades:mt-1">Machine Learning Technical Analysis</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Metrics & Summary */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Metric 1: Prediction */}
            <div className="bg-muted/50 rounded-xl hades:rounded-sm p-4 border border-border flex flex-col items-center justify-center text-center hades:shadow-inner">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-2 hades:font-serif">Signal</span>
              <div className={twMerge(
                "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg hades:rounded-sm border font-black text-sm uppercase tracking-wider w-full shadow-sm",
                isUp && "bg-success/10 text-success border-success/20 shadow-[0_0_15px_var(--glow-green)]",
                isDown && "bg-danger/10 text-danger border-danger/20 shadow-[0_0_15px_var(--glow-red)]",
                isNeutral && "bg-muted text-muted-foreground border-border"
              )}>
                {isUp && <TrendingUp className="w-4 h-4" />}
                {isDown && <TrendingDown className="w-4 h-4" />}
                {isNeutral && <Minus className="w-4 h-4" />}
                {prediction}
              </div>
            </div>

            {/* Metric 2: Confidence */}
            <div className="bg-muted/50 rounded-xl hades:rounded-sm p-4 border border-border flex flex-col items-center justify-center text-center hades:shadow-inner">
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-1 hades:font-serif">Confidence</span>
              <span className="text-warning font-black text-2xl hades:text-3xl tracking-tight hades:tracking-widest mt-1 hades:drop-shadow-[0_0_10px_var(--glow-red)] hades:font-serif">{confidence}</span>
            </div>
          </div>

          {/* Jargon-Free Summary */}
          <div className="p-4 rounded-xl hades:rounded-sm bg-primary/10 border border-primary/20 hades:border-0 hades:border-l-2 hades:border-primary/50">
            <span className="text-[10px] text-primary font-bold uppercase tracking-widest mb-2 block hades:font-serif">Quick Summary</span>
            <p className="text-sm font-medium text-foreground opacity-90 leading-snug hades:leading-relaxed">
              {predictionData.summary || "The AI is currently analyzing this asset."}
            </p>
          </div>
        </div>

        {/* Right Side: Actionable Insights List */}
        <div className="lg:col-span-2 flex flex-col border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-8">
          <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider hades:tracking-widest block mb-4 hades:font-serif">Comprehensive Quant Report</span>
          <div className="space-y-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="flex items-start gap-4 group">
                <div className="mt-1 shrink-0 p-1.5 bg-muted rounded-md hades:rounded-none border border-border group-hover:border-primary/50 transition-colors hades:shadow-sm">
                  <BarChart2 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="text-muted-foreground group-hover:text-foreground text-sm leading-relaxed font-medium transition-colors">
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
