import yfinance as yf
import pandas as pd
import joblib
from xgboost import XGBClassifier
from sklearn.ensemble import RandomForestClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.preprocessing import StandardScaler
import os

# Import our pure math engine
from app.services.indicators import calculate_technical_indicators

def build_training_dataset():
    """
    Downloads historical data for a diverse mix of stocks,
    injects technical indicators, and adds "Context Awareness" features including Macro.
    """
    symbols = [
        "AAPL", "MSFT", "RELIANCE.NS", "HDFCBANK.NS",  # Stable
        "GME", "AMC", "ZOM", "SUZLON.NS"               # Volatile
    ]
    
    print("Downloading historical data and engineering features...")
    
    # Fetch Macro Context Data
    spy = yf.Ticker("^GSPC").history(period="5y")
    vix = yf.Ticker("^VIX").history(period="5y")
    spy.reset_index(inplace=True)
    vix.reset_index(inplace=True)
    if spy['Date'].dt.tz is not None:
        spy['Date'] = spy['Date'].dt.tz_localize(None)
    if vix['Date'].dt.tz is not None:
        vix['Date'] = vix['Date'].dt.tz_localize(None)
    spy = spy[['Date', 'Close']].rename(columns={'Close': 'spy_close'})
    vix = vix[['Date', 'Close']].rename(columns={'Close': 'vix_value'})
    
    all_data = []
    
    for symbol in symbols:
        ticker = yf.Ticker(symbol)
        df = ticker.history(period="5y")
        
        if df.empty or len(df) < 50:
            continue
            
        df.reset_index(inplace=True)
        if df['Date'].dt.tz is not None:
            df['Date'] = df['Date'].dt.tz_localize(None)
            
        # Merge Macro Data
        df = pd.merge(df, spy, on='Date', how='left')
        df = pd.merge(df, vix, on='Date', how='left')
        df['spy_return'] = df['spy_close'].pct_change()
        df['vix_value'] = df['vix_value'].ffill().bfill()
        df['spy_return'] = df['spy_return'].ffill().bfill()
            
        # 1. Base Indicators
        df = calculate_technical_indicators(df)
        
        # 2. CONTEXT FEATURES
        df['volatility_width'] = (df['bb_upper'] - df['bb_lower']) / df['bb_middle']
        df['volume_sma_20'] = df['Volume'].rolling(window=20).mean()
        df['volume_spike_ratio'] = df['Volume'] / df['volume_sma_20']
        
        # 3. Define the Target
        df['Target'] = (df['Close'].shift(-1) > df['Close']).astype(int)
        
        df.dropna(inplace=True)
        
        features = df.drop(columns=['Date', 'Target'])
        target = df['Target']
        
        all_data.append((features, target))
        print(f"Processed {symbol} - {len(features)} valid trading days")

    X_list, y_list = zip(*all_data)
    X = pd.concat(X_list, ignore_index=True)
    y = pd.concat(y_list, ignore_index=True)
    
    return X, y

def train_and_save_model():
    """
    Trains the Tri-Model Stack and exports the brains to files.
    """
    X, y = build_training_dataset()
    
    print("\nTraining Tri-Model Stack...")
    
    os.makedirs('app/models', exist_ok=True)
    
    # Standardize features for MLP
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, 'app/models/scaler.pkl')
    
    xgb = XGBClassifier(n_estimators=200, max_depth=4, learning_rate=0.05, random_state=42, eval_metric='logloss')
    rf = RandomForestClassifier(n_estimators=200, max_depth=5, random_state=42)
    mlp = MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=500, random_state=42)
    
    print("Training XGBoost...")
    xgb.fit(X, y)
    print("Training Random Forest...")
    rf.fit(X, y)
    print("Training MLP Neural Network...")
    mlp.fit(X_scaled, y)
    
    joblib.dump(xgb, 'app/models/xgboost_global.pkl')
    joblib.dump(rf, 'app/models/rf_global.pkl')
    joblib.dump(mlp, 'app/models/mlp_global.pkl')
    
    print(f"[SUCCESS] Models trained successfully on {len(X)} historical data points!")
    print(f"[SUCCESS] Brains saved to: app/models/")

if __name__ == "__main__":
    train_and_save_model()