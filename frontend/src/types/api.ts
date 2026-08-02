export interface StockMetadata {
  companyName: string;
  sector: string;
  currentPrice: number;
  change: number;
  percentageChange: number;
  currency: string;
}

export interface StockHistory {
  Date: string;
  Open: number;
  High: number;
  Low: number;
  Close: number;
  Volume: number;
  Dividends: number;
  "Stock Splits": number;
  sma_20: number;
  sma_50: number;
  ema_12: number;
  macd: number;
  macd_signal: number;
  macd_hist: number;
  bb_middle: number;
  bb_upper: number;
  bb_lower: number;
  rsi: number;
}

export interface StockDataResponse {
  symbol: string;
  meta: StockMetadata;
  history: StockHistory[];
}

export interface MarketPredictionResponse {
  symbol: string;
  prediction: 'UP' | 'DOWN' | 'NEUTRAL' | 'ERROR';
  confidence: string; // e.g., "75.5%" or just "75.5" depending on backend
  summary: string;
  insights: string[];
}

export interface SearchResult {
  symbol: string;
  shortname: string;
  exchange: string;
  type: string;
}

export interface SearchResponse {
  results: SearchResult[];
}
