import os
import pandas as pd
import joblib
from pathlib import Path  # <-- Indestructible cross-platform paths

class MLEngine:
    def __init__(self):
        # Using Path(__file__) guarantees this works on Windows, Linux, and Cloud Containers
        BASE_DIR = Path(__file__).resolve().parent
        model_path = BASE_DIR / ".." / "models" / "xgboost_global.pkl"
        
        if model_path.exists():
            self.model = joblib.load(model_path)
            self.is_trained = True
        else:
            self.model = None
            self.is_trained = False

    def _prepare_features(self, df: pd.DataFrame):
        """
        Injects the exact same Context Awareness features that the model was trained on.
        """
        data = df.copy()
        
        # Sort chronologically and drop the string date
        if 'Date' in data.columns:
            data = data.sort_values('Date').reset_index(drop=True)
            data = data.drop(columns=['Date'])
            
        # Inject Context Features
        data['volatility_width'] = (data['bb_upper'] - data['bb_lower']) / data['bb_middle']
        data['volume_sma_20'] = data['Volume'].rolling(window=20).mean()
        data['volume_spike_ratio'] = data['Volume'] / data['volume_sma_20']
        
        # Clean up NaNs from rolling averages so the model doesn't crash
        data.bfill(inplace=True)
        
        return data

    def train_and_predict(self, df: pd.DataFrame):
        """
        Runs lightning-fast inference using the pre-trained global model.
        """
        if not self.is_trained:
            return {
                "direction": "ERROR", 
                "confidence": 0, 
                "reasoning": ["Model brain file missing from server."]
            }

        # IPO SAFETY: If the stock is too new and missing indicators, catch it before it crashes XGBoost
        required_columns = ['bb_upper', 'bb_lower', 'bb_middle', 'Volume', 'rsi']
        if not all(col in df.columns for col in required_columns):
            return {
                "direction": "NEUTRAL",
                "confidence": 50.0,
                "reasoning": ["Insufficient historical data available for this asset to run ML predictions."]
            }

        # 1. Prepare features
        X = self._prepare_features(df)
        
        # 2. Extract TODAY's data to predict TOMORROW
        latest_features = X.iloc[[-1]]
        
        # 3. Predict Probability
        probabilities = self.model.predict_proba(latest_features)[0]
        up_probability = float(probabilities[1])
        
        # 4. Determine Direction
        if up_probability >= 0.55:
            direction = "UP"
            confidence = up_probability * 100
        elif up_probability <= 0.45:
            direction = "DOWN"
            confidence = (1 - up_probability) * 100
        else:
            direction = "NEUTRAL"
            confidence = 50.0

        # 5. The Smarter Literacy Layer
        importances = self.model.feature_importances_
        feature_names = X.columns
        
        # Rank features by how heavily the AI relied on them for this specific prediction
        feature_ranking = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
        
        reasoning = []
        latest_vals = latest_features.iloc[0]
        
        # Translate the top 3 driving features into English
        for feature, weight in feature_ranking[:3]:
            if weight == 0:
                continue
                
            if feature == 'volatility_width':
                val = latest_vals['volatility_width']
                if val > 0.10:
                    reasoning.append("High historical volatility detected, suggesting an erratic price environment.")
                else:
                    reasoning.append("Bollinger Bands are tight, indicating stable price consolidation.")
                    
            elif feature == 'volume_spike_ratio':
                val = latest_vals['volume_spike_ratio']
                if val > 1.5:
                    reasoning.append(f"Trading volume is surging ({val:.1f}x normal), signaling strong institutional participation.")
                elif val < 0.8:
                    reasoning.append("Trading volume is below average, indicating a lack of strong directional conviction.")
                    
            elif feature == 'rsi':
                val = latest_vals['rsi']
                if val < 30:
                    reasoning.append(f"RSI is highly oversold ({val:.1f}), prompting a potential upward technical bounce.")
                elif val > 70:
                    reasoning.append(f"RSI indicates overbought conditions ({val:.1f}), flashing a short-term correction risk.")
                    
            elif 'macd' in feature:
                val = latest_vals.get('macd', 0)
                sig = latest_vals.get('macd_signal', 0)
                if val > sig:
                    reasoning.append("MACD line remains above the signal line, confirming bullish momentum.")
                else:
                    reasoning.append("MACD line is below the signal line, suggesting lingering bearish pressure.")

        if not reasoning:
            reasoning.append("The model is weighing macro historical price consolidation patterns equally.")

        return {
            "direction": direction,
            "confidence": round(confidence, 1),
            "reasoning": reasoning
        }

# Instantiate the singleton
ml_engine = MLEngine()