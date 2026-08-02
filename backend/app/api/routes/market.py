from fastapi import APIRouter, HTTPException, Query
import yfinance as yf
import pandas as pd
import requests
from app.services.indicators import calculate_technical_indicators
from app.services.ml_engine import ml_engine
from typing import Dict, Any

# Keep your prefix setup intact
router = APIRouter(prefix="/market", tags=["Market Data"])

def fetch_and_prepare_df(symbol: str, period: str = "1y") -> pd.DataFrame:
    """
    Helper function shared by both routes to download stock data 
    and compute technical indicators.
    """
    ticker = yf.Ticker(symbol.upper())
    df = ticker.history(period=period)
    
    if df.empty:
        raise HTTPException(
            status_code=404, 
            detail=f"Ticker symbol '{symbol}' not found or contains no historical entries."
        )
        
    # Standardize structural properties
    df.reset_index(inplace=True)
    if df['Date'].dt.tz is not None:
        df['Date'] = df['Date'].dt.tz_localize(None)
        
    # Fetch Macro Context Data
    spy = yf.Ticker("^GSPC").history(period=period)
    vix = yf.Ticker("^VIX").history(period=period)
    
    if not spy.empty and not vix.empty:
        spy.reset_index(inplace=True)
        vix.reset_index(inplace=True)
        if spy['Date'].dt.tz is not None:
            spy['Date'] = spy['Date'].dt.tz_localize(None)
        if vix['Date'].dt.tz is not None:
            vix['Date'] = vix['Date'].dt.tz_localize(None)
            
        spy = spy[['Date', 'Close']].rename(columns={'Close': 'spy_close'})
        vix = vix[['Date', 'Close']].rename(columns={'Close': 'vix_value'})
        
        df = pd.merge(df, spy, on='Date', how='left')
        df = pd.merge(df, vix, on='Date', how='left')
        
        df['spy_return'] = df['spy_close'].pct_change()
        df['vix_value'] = df['vix_value'].ffill().bfill()
        df['spy_return'] = df['spy_return'].ffill().bfill()
    else:
        df['vix_value'] = 20.0
        df['spy_return'] = 0.0
        
    # Run the feature engineering tool across the data frame
    df = calculate_technical_indicators(df)
    return df, ticker

# --- ENDPOINTS ---

@router.get("/search")
async def search_symbols(q: str = Query(..., min_length=1)):
    """
    Search Yahoo Finance for matching symbols based on company name or ticker.
    """
    try:
        url = f"https://query2.finance.yahoo.com/v1/finance/search?q={q}"
        headers = {'User-Agent': 'Mozilla/5.0'}
        resp = requests.get(url, headers=headers)
        resp.raise_for_status()
        data = resp.json()
        
        results = []
        for quote in data.get('quotes', []):
            if quote.get('quoteType') in ['EQUITY', 'ETF']:
                results.append({
                    "symbol": quote.get("symbol"),
                    "shortname": quote.get("shortname", quote.get("longname", quote.get("symbol"))),
                    "exchange": quote.get("exchDisp", "Unknown"),
                    "type": quote.get("quoteType")
                })
                
        return {"results": results[:8]} # Return top 8 matches
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")

@router.get("/{symbol}", response_model=Dict[str, Any])
async def get_stock_data(
    symbol: str, 
    period: str = Query("1y", description="Time period (use 1y+ for ML features)")
):
    """
    Fetches real-time price history and injects standardized technical analysis features.
    Ready for both frontend charts and ML model ingestion.
    """
    try:
        # Call the helper function
        df, ticker = fetch_and_prepare_df(symbol, period)
        
        # Stringify dates for JSON serialization (after creating a copy or formatting directly)
        export_df = df.copy()
        export_df['Date'] = export_df['Date'].dt.strftime('%Y-%m-%d')
        
        # Extract live values from the absolute tail of the dataset
        current_row = export_df.iloc[-1]
        previous_row = export_df.iloc[-2] if len(export_df) > 1 else current_row
        
        price_change = current_row['Close'] - previous_row['Close']
        percentage_change = (price_change / previous_row['Close']) * 100
        
        # Convert full metrics dataframe to dictionary
        records = export_df.to_dict(orient="records")
        
        # Extract metadata profile safely
        company_info = ticker.info
        
        return {
            "symbol": symbol.upper(),
            "meta": {
                "companyName": company_info.get('shortName', symbol.upper()),
                "sector": company_info.get('sector', 'Unknown'),
                "currentPrice": round(float(current_row['Close']), 2),
                "change": round(float(price_change), 2),
                "percentageChange": round(float(percentage_change), 2),
                "currency": company_info.get('currency', 'INR')
            },
            "history": records
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500, 
            detail=f"Quant Data Engine error processing symbol {symbol}: {str(e)}"
        )

@router.get("/predict/{symbol}")
async def get_market_prediction(symbol: str):
    """
    Feeds the structural technical data frame directly into the XGBoost engine 
    to extract actionable direction probabilities and plain English insights.
    """
    try:
        # 1. Fetch data using the shared helper function (defaulting to 1y window for ML stability)
        df, _ = fetch_and_prepare_df(symbol, period="1y")
        
        # 2. Pass the data safely through the Machine Learning engine
        prediction_result = ml_engine.train_and_predict(df)
        
        return {
            "symbol": symbol.upper(),
            "prediction": prediction_result["direction"],
            "confidence": f"{prediction_result['confidence']}%",
            "summary": prediction_result.get("summary", ""),
            "insights": prediction_result["reasoning"]
        }
        
    except HTTPException as he:
        raise he
    except ValueError as ve:
        # Catch data scale/IPO issues cleanly
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        # General safety net
        raise HTTPException(status_code=500, detail=f"Prediction Engine failure: {str(e)}")