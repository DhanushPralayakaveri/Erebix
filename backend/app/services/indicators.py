import pandas as pd

def calculate_technical_indicators(df: pd.DataFrame) -> pd.DataFrame:
    """
    Calculates technical indicators natively using Pandas.
    Bypasses the need for fragile third-party wrapper libraries.
    """
    if len(df) < 50:
        return df

    # We need a copy to avoid SettingWithCopy warnings
    df = df.copy()

    # 1. Moving Averages
    df['sma_20'] = df['Close'].rolling(window=20).mean()
    df['sma_50'] = df['Close'].rolling(window=50).mean()
    df['ema_12'] = df['Close'].ewm(span=12, adjust=False).mean()
    
    # We need ema_26 for MACD
    ema_26 = df['Close'].ewm(span=26, adjust=False).mean()

    # 2. MACD (Moving Average Convergence Divergence)
    df['macd'] = df['ema_12'] - ema_26
    df['macd_signal'] = df['macd'].ewm(span=9, adjust=False).mean()
    df['macd_hist'] = df['macd'] - df['macd_signal']

    # 3. Bollinger Bands
    # Standard deviation over 20 days
    rolling_std = df['Close'].rolling(window=20).std()
    df['bb_middle'] = df['sma_20']
    df['bb_upper'] = df['sma_20'] + (rolling_std * 2)
    df['bb_lower'] = df['sma_20'] - (rolling_std * 2)

    # 4. RSI (Relative Strength Index)
    # Calculate price differences
    delta = df['Close'].diff()
    
    # Separate gains and losses
    gains = delta.where(delta > 0, 0.0)
    losses = -delta.where(delta < 0, 0.0)
    
    # Calculate the Exponential Moving Average of gains and losses (Wilder's Smoothing)
    avg_gain = gains.ewm(alpha=1/14, adjust=False).mean()
    avg_loss = losses.ewm(alpha=1/14, adjust=False).mean()
    
    # Calculate RS and RSI
    rs = avg_gain / avg_loss
    df['rsi'] = 100 - (100 / (1 + rs))

    # 5. Clean up initial NaN values caused by lookback periods
    df.bfill(inplace=True)
    df.ffill(inplace=True)

    return df