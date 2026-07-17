from fastapi import APIRouter, HTTPException, Query
import yfinance as yf
from app.services.indicators import calculate_technical_indicators
from typing import Dict, Any

router = APIRouter(prefix="/market", tags=["Market Data"])

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
        ticker = yf.Ticker(symbol.upper())
        # We enforce a solid history window if indicators are requested, ensuring math validity
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
            
        # 1. Run our feature engineering tool across the data frame
        df = calculate_technical_indicators(df)
        
        # 2. Stringify dates for JSON serialization
        df['Date'] = df['Date'].dt.strftime('%Y-%m-%d')
        
        # Extract live values from the absolute tail of the dataset
        current_row = df.iloc[-1]
        previous_row = df.iloc[-2] if len(df) > 1 else current_row
        
        price_change = current_row['Close'] - previous_row['Close']
        percentage_change = (price_change / previous_row['Close']) * 100
        
        # Convert full metrics dataframe to dictionary
        records = df.to_dict(orient="records")
        
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