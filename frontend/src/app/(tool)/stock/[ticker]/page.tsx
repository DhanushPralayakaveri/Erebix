"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Topbar } from '@/components/Layout/Topbar';
import { AssetProfile } from '@/components/Dashboard/AssetProfile';
import { VisualEngine } from '@/components/Chart/VisualEngine';
import { SimulatorPanel } from '@/components/Dashboard/SimulatorPanel';
import { IntelligencePanel } from '@/components/AIInsights/IntelligencePanel';
import { StockDataResponse, MarketPredictionResponse } from '@/types/api';
import { fetchMarketData, fetchMarketPrediction, InsufficientDataError } from '@/lib/api';

export default function StockDetailPage({ params }: { params: Promise<{ ticker: string }> }) {
  const { ticker } = React.use(params);
  
  const [stockData, setStockData] = useState<StockDataResponse | null>(null);
  const [predictionData, setPredictionData] = useState<MarketPredictionResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const [marketData, predictData] = await Promise.all([
          fetchMarketData(ticker),
          fetchMarketPrediction(ticker).catch(err => {
            console.error('Prediction failed', err);
            return null; // Return null if prediction fails but market data succeeds, unless it's a 400
          })
        ]);

        setStockData(marketData);
        setPredictionData(predictData);

      } catch (err: any) {
        console.error(err);
        if (err instanceof InsufficientDataError) {
          setError(err.message);
        } else {
          setError(err.message || 'Failed to connect to the backend API.');
        }
        setStockData(null);
        setPredictionData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ticker]);

  return (
    <>
      <Topbar isLoading={isLoading} />
      
      <div className="p-8 max-w-6xl mx-auto w-full space-y-6">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {error && (
          <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl text-danger font-medium text-sm flex items-center gap-3 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-danger animate-pulse shrink-0"></span>
            {error}
          </div>
        )}

        {(!error && (stockData || isLoading)) && (
          <>
            <div className="flex flex-col gap-6">
              <AssetProfile symbol={stockData?.symbol || ticker} meta={stockData?.meta || null} isLoading={isLoading} />
              <VisualEngine history={stockData?.history || []} isLoading={isLoading} />
              <SimulatorPanel 
                meta={stockData?.meta || null} 
                history={stockData?.history || null} 
                isLoading={isLoading} 
              />
              <IntelligencePanel predictionData={predictionData} isLoading={isLoading} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
