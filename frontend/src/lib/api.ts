import { StockDataResponse, MarketPredictionResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export class InsufficientDataError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'InsufficientDataError';
  }
}

export async function fetchMarketData(ticker: string): Promise<StockDataResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/market/${ticker}`);
  
  if (!response.ok) {
    if (response.status === 400) {
      throw new InsufficientDataError('Insufficient historical data available for this asset to run ML predictions.');
    }
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.detail || 'Failed to fetch market data.');
  }

  return response.json();
}

export async function fetchMarketPrediction(ticker: string): Promise<MarketPredictionResponse> {
  const response = await fetch(`${API_BASE_URL}/api/v1/market/predict/${ticker}`);
  
  if (!response.ok) {
    if (response.status === 400) {
      throw new InsufficientDataError('Insufficient historical data available for this asset to run ML predictions.');
    }
    const errData = await response.json().catch(() => null);
    throw new Error(errData?.detail || 'Failed to fetch market prediction.');
  }

  return response.json();
}
