import React, { useMemo, useState } from 'react';
import { StockHistory } from '@/types/api';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

interface VisualEngineProps {
  history: StockHistory[];
  isLoading: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-[#0d0f14] border border-gray-200 dark:border-white/10 p-3 rounded-lg shadow-2xl">
        <p className="text-gray-500 dark:text-gray-400 text-xs mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
              {entry.name === 'Close' ? 'Price' : entry.name === 'sma_20' ? 'Avg Cost' : entry.name}
            </span>
            <span className="text-sm font-black text-gray-900 dark:text-white">
              ${Number(entry.value).toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CustomLabel = (props: any) => {
  const { x, y, width, value, index, totalLength, data } = props;
  
  // Only show labels for local maxima peaks to avoid clutter, or the last terminal bar
  let isPeak = false;
  if (data && index > 0 && index < totalLength - 1) {
    if (value > data[index - 1].Close && value > data[index + 1].Close) {
      isPeak = true;
    }
  }
  
  if (!isPeak && index !== totalLength - 1) return null;

  return (
    <g>
      <rect 
        x={x + width / 2 - 25} 
        y={y - 25} 
        width="50" 
        height="20" 
        fill="#161a22" 
        rx="4" 
        stroke="#ffffff20"
      />
      <text 
        x={x + width / 2} 
        y={y - 11} 
        fill="#fff" 
        fontSize="10" 
        fontWeight="bold" 
        textAnchor="middle"
      >
        {Math.round(value)}
      </text>
    </g>
  );
};

export function VisualEngine({ history, isLoading }: VisualEngineProps) {
  const [timeframe, setTimeframe] = useState<'7D' | '1M' | '3M' | '6M' | '1Y'>('1M');

  const slicedData = useMemo(() => {
    let days = 21; // Default 1M (trading days)
    switch (timeframe) {
      case '7D': days = 5; break; // 5 trading days
      case '1M': days = 21; break; // ~21 trading days
      case '3M': days = 63; break; // ~63 trading days
      case '6M': days = 126; break; // ~126 trading days
      case '1Y': days = history.length; break;
    }
    return history.slice(-days);
  }, [history, timeframe]);

  if (isLoading || !history.length) {
    return (
      <div className="w-full h-80 bg-gray-100 dark:bg-[#161a22] rounded-2xl border border-gray-200 dark:border-white/5 animate-pulse flex items-center justify-center">
        <span className="text-gray-400 dark:text-gray-600 font-bold tracking-widest text-sm">LOADING ENGINE...</span>
      </div>
    );
  }

  // Calculate min and max based on BOTH Close price and the SMA line
  const allValues = slicedData.flatMap(d => [d.Close, d.sma_20].filter(v => v !== undefined && v !== null));
  const minPrice = Math.min(...allValues) * 0.95;
  const maxPrice = Math.max(...allValues) * 1.15; // Dynamic offset margin to prevent top edge clipping

  return (
    <div className="w-full bg-white dark:bg-[#161a22] rounded-2xl border border-gray-200 dark:border-white/5 p-6 shadow-xl relative transition-colors duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 relative">
        <div>
          <h3 className="text-gray-900 dark:text-white font-black text-lg tracking-wide">Price Trend</h3>
          <p className="text-xs text-gray-500 font-medium">Cost Curve & Historical Movement</p>
        </div>
        
        {/* Timeframe Filters */}
        <div className="flex bg-gray-100 dark:bg-black/20 p-1 rounded-xl border border-gray-200 dark:border-white/5">
          {(['7D', '1M', '3M', '6M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                timeframe === tf 
                  ? 'bg-white dark:bg-[#161a22] text-blue-600 dark:text-blue-400 shadow-sm border border-gray-200 dark:border-white/10' 
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-[350px] w-full mt-6">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={slicedData} margin={{ top: 30, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="barGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4b5563" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#1f2937" stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="Date" 
              tick={{ fill: '#6b7280', fontSize: 10 }} 
              tickLine={false}
              axisLine={{ stroke: '#ffffff20' }}
              minTickGap={20}
            />
            <YAxis 
              domain={[minPrice, maxPrice]} 
              tick={{ fill: '#6b7280', fontSize: 10 }} 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${Math.round(value)}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
            
            {/* The Bars simulating the data points in the image */}
            <Bar 
              dataKey="Close" 
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            >
              {slicedData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={index === slicedData.length - 1 ? '#22c55e' : 'url(#barGlow)'} 
                />
              ))}
              {timeframe === '7D' || timeframe === '1M' ? (
                <CustomLabel totalLength={slicedData.length} data={slicedData} />
              ) : null}
            </Bar>

            {/* The Cost Curve */}
            <Line 
              type="monotone" 
              dataKey="sma_20" 
              stroke="#fbbf24" 
              strokeWidth={3} 
              dot={false}
              name="sma_20"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center gap-2 mt-4 px-2">
        <div className="w-4 h-1 bg-[#fbbf24] rounded-full"></div>
        <span className="text-xs text-gray-400 font-medium">Cost Curve (20-Day SMA)</span>
      </div>
    </div>
  );
}
