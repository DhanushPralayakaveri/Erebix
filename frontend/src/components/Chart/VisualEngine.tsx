import React, { useMemo, useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
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
      <div className="bg-card border border-border p-3 rounded-lg shadow-2xl">
        <p className="text-muted-foreground text-xs mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center justify-between gap-4">
            <span className="text-sm font-bold text-muted-foreground">
              {entry.name === 'Close' ? 'Price' : entry.name === 'sma_20' ? 'Avg Cost' : entry.name}
            </span>
            <span className="text-sm font-black text-foreground">
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
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isHades = mounted && (theme?.startsWith('hades') || resolvedTheme?.startsWith('hades'));

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
      <div className="w-full h-80 bg-card rounded-2xl border border-border animate-pulse flex items-center justify-center">
        <span className="text-muted-foreground font-bold tracking-widest text-sm">LOADING ENGINE...</span>
      </div>
    );
  }

  // Calculate min and max based on BOTH Close price and the SMA line
  const allValues = slicedData.flatMap(d => [d.Close, d.sma_20].filter(v => v !== undefined && v !== null));
  const minPrice = Math.min(...allValues) * 0.95;
  const maxPrice = Math.max(...allValues) * 1.15; // Dynamic offset margin to prevent top edge clipping

  return (
    <div className="w-full bg-card rounded-2xl hades:rounded-sm border border-border hades:border-t-2 hades:border-b-2 hades:border-x-0 p-6 shadow-xl hades:shadow-[0_0_30px_var(--glow-red)] relative transition-all duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 relative">
        <div>
          <h3 className="text-foreground font-black text-lg hades:text-xl tracking-wide hades:tracking-widest hades:uppercase hades:font-serif hades:drop-shadow-[0_0_10px_var(--glow-red)]">Price Trend</h3>
          <p className="text-xs text-muted-foreground font-medium hades:font-bold hades:uppercase hades:tracking-widest hades:mt-1">Cost Curve & Historical Movement</p>
        </div>
        
        {/* Timeframe Filters */}
        <div className="flex bg-muted p-1 rounded-xl hades:rounded-sm border border-border">
          {(['7D', '1M', '3M', '6M', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 hades:px-4 py-1.5 text-xs font-bold rounded-lg hades:rounded-sm transition-all hades:uppercase hades:tracking-wider ${
                timeframe === tf 
                  ? 'bg-card text-primary shadow-sm hades:shadow-[0_0_10px_var(--glow-red)] border border-border' 
                  : 'text-muted-foreground hover:text-foreground border border-transparent'
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
                <stop offset="0%" stopColor={isHades ? "#991b1b" : "#4b5563"} stopOpacity={isHades ? 0.6 : 0.8} />
                <stop offset="100%" stopColor={isHades ? "#450a0a" : "#1f2937"} stopOpacity={isHades ? 0.1 : 0.2} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isHades ? "#ff000010" : "#ffffff10"} vertical={false} />
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
                  fill={index === slicedData.length - 1 ? (isHades ? 'var(--color-warning)' : 'var(--color-success)') : 'url(#barGlow)'} 
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
              stroke={isHades ? "var(--color-warning)" : "var(--color-warning)"} 
              strokeWidth={3} 
              dot={false}
              style={{ filter: isHades ? 'drop-shadow(0px 0px 5px var(--color-glow-red))' : 'none' }}
              name="sma_20"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex items-center gap-2 mt-4 px-2">
        <div className="w-4 h-1 bg-warning rounded-full"></div>
        <span className="text-xs text-muted-foreground font-medium">Cost Curve (20-Day SMA)</span>
      </div>
    </div>
  );
}
