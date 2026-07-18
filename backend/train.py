import yfinance as yf
import pandas as pd
import joblib
from xgboost import XGBClassifier
import os

# Import our pure math engine from PR #1
from app.services.indicators import calculate_technical_indicators

def build_training_dataset():
    """
    Downloads historical data for a diverse mix of stocks,
    injects technical indicators, and adds "Context Awareness" features.
    """
    # The Training Universe: A mix of stable giants and erratic movers
    symbols = [
        "AAPL", "MSFT", "RELIANCE.NS", "HDFCBANK.NS",  # The Whales (Stable)
        "GME", "AMC", "ZOM", "SUZLON.NS"               # The Minnows (Volatile)
    ]
    
    all_data = []
    
    print("Downloading historical data and engineering features...")
    for symbol in symbols:
        ticker = yf.Ticker(symbol)
        # 5 years of data is perfect for this baseline (~1,250 rows per stock)
        df = ticker.history(period="5y")
        
        if df.empty or len(df) < 50:
            continue
            
        df.reset_index(inplace=True)
        if df['Date'].dt.tz is not None:
            df['Date'] = df['Date'].dt.tz_localize(None)
            
        # 1. Base Indicators: Run our standard math engine
        df = calculate_technical_indicators(df)
        
        # 2. CONTEXT FEATURES: Tell the AI what "type" of stock this is today
        # Volatility Context: How wide are the Bollinger Bands relative to the price?
        df['volatility_width'] = (df['bb_upper'] - df['bb_lower']) / df['bb_middle']
        
        # Volume Context: Is volume spiking relative to its 20-day average?
        df['volume_sma_20'] = df['Volume'].rolling(window=20).mean()
        df['volume_spike_ratio'] = df['Volume'] / df['volume_sma_20']
        
        # 3. Define the Target: 1 if tomorrow closes higher than today, 0 if lower
        df['Target'] = (df['Close'].shift(-1) > df['Close']).astype(int)
        
        # Clean up NaNs created by rolling windows and shifting
        df.dropna(inplace=True)
        
        # Drop the strings and target from our features matrix
        features = df.drop(columns=['Date', 'Target'])
        target = df['Target']
        
        all_data.append((features, target))
        print(f"Processed {symbol} - {len(features)} valid trading days")

    # Combine all individual stock data into one massive dataset
    X_list, y_list = zip(*all_data)
    X = pd.concat(X_list, ignore_index=True)
    y = pd.concat(y_list, ignore_index=True)
    
    return X, y

def train_and_save_model():
    """
    Trains the XGBoost classifier and exports the 'brain' to a file.
    """
    X, y = build_training_dataset()
    
    print("\nTraining Context-Aware XGBoost Model...")
    
    # We restrict max_depth to prevent it from over-memorizing the past (Overfitting)
    model = XGBClassifier(
        n_estimators=200,
        max_depth=4,
        learning_rate=0.05,
        random_state=42,
        eval_metric='logloss'
    )
    
    model.fit(X, y)
    
    # Create a models directory and save the trained brain
    os.makedirs('app/models', exist_ok=True)
    model_path = 'app/models/xgboost_global.pkl'
    joblib.dump(model, model_path)
    
    print(f"✅ Model trained successfully on {len(X)} historical data points!")
    print(f"✅ Brain saved to: {model_path}")

if __name__ == "__main__":
    train_and_save_model()