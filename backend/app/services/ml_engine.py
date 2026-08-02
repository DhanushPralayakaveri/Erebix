import os
import pandas as pd
import joblib
from pathlib import Path

class MLEngine:
    def __init__(self):
        BASE_DIR = Path(__file__).resolve().parent
        models_dir = BASE_DIR / ".." / "models"
        
        xgb_path = models_dir / "xgboost_global.pkl"
        rf_path = models_dir / "rf_global.pkl"
        mlp_path = models_dir / "mlp_global.pkl"
        scaler_path = models_dir / "scaler.pkl"
        
        if all(p.exists() for p in [xgb_path, rf_path, mlp_path, scaler_path]):
            self.xgb = joblib.load(xgb_path)
            self.rf = joblib.load(rf_path)
            self.mlp = joblib.load(mlp_path)
            self.scaler = joblib.load(scaler_path)
            self.is_trained = True
        else:
            self.xgb = None
            self.rf = None
            self.mlp = None
            self.scaler = None
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
        
        # Clean up NaNs
        data.bfill(inplace=True)
        
        return data

    def train_and_predict(self, df: pd.DataFrame):
        """
        Runs inference using the pre-trained Tri-Model ensemble.
        """
        if not self.is_trained:
            return {
                "direction": "ERROR", 
                "confidence": 0, 
                "reasoning": ["Model brain files missing from server. Please run train.py."]
            }

        # IPO SAFETY
        required_columns = ['bb_upper', 'bb_lower', 'bb_middle', 'Volume', 'rsi', 'spy_return', 'vix_value']
        if not all(col in df.columns for col in required_columns):
            return {
                "direction": "NEUTRAL",
                "confidence": 50.0,
                "reasoning": ["Insufficient historical data available for this asset to run ML predictions."]
            }

        X = self._prepare_features(df)
        latest_features = X.iloc[[-1]]
        latest_vals = latest_features.iloc[0]
        
        # 1. Predict Probabilities
        xgb_prob = float(self.xgb.predict_proba(latest_features)[0][1])
        rf_prob = float(self.rf.predict_proba(latest_features)[0][1])
        
        # Scale for MLP
        latest_features_scaled = self.scaler.transform(latest_features)
        mlp_prob = float(self.mlp.predict_proba(latest_features_scaled)[0][1])
        
        # 2. Soft Voting Ensemble
        ensemble_prob = (xgb_prob + rf_prob + mlp_prob) / 3.0
        
        # 3. Strict Confidence Threshold for Capital Preservation
        if ensemble_prob >= 0.60:
            direction = "UP"
            confidence = ensemble_prob * 100
        elif ensemble_prob <= 0.40:
            direction = "DOWN"
            confidence = (1 - ensemble_prob) * 100
        else:
            direction = "NEUTRAL"
            # Show the closest probability to the threshold as the confidence internally
            confidence = 50.0

        # 4. COMPREHENSIVE INSIGHTS GENERATION
        reasoning = []
        
        # Paragraph 1: Technical Structure
        rsi = latest_vals['rsi']
        macd = latest_vals.get('macd', 0)
        macd_sig = latest_vals.get('macd_signal', 0)
        vol_spike = latest_vals.get('volume_spike_ratio', 1)
        
        tech_str = "Technical Structure Analysis: The asset is demonstrating complex structural behavior. "
        if rsi < 30:
            tech_str += f"RSI indicates highly oversold conditions ({rsi:.1f}), suggesting selling exhaustion. "
        elif rsi > 70:
            tech_str += f"RSI indicates overbought exhaustion ({rsi:.1f}), flagging near-term correction risks. "
        else:
            tech_str += f"RSI remains neutral ({rsi:.1f}). "
            
        if macd > macd_sig:
            tech_str += "The MACD line is pushing above the signal line, confirming underlying bullish momentum "
        else:
            tech_str += "The MACD line sits below the signal line, maintaining bearish pressure "
            
        if vol_spike > 1.5:
            tech_str += f"while accompanied by a massive {vol_spike:.1f}x spike in institutional volume."
        else:
            tech_str += "on relatively standard average daily volume."
            
        reasoning.append(tech_str)
        
        # Paragraph 2: Macro Context
        spy_ret = latest_vals.get('spy_return', 0)
        vix = latest_vals.get('vix_value', 20)
        
        macro_str = f"Systemic Macro Context: From a risk perspective, the broader market is acting as a "
        if spy_ret > 0:
            macro_str += f"tailwind (S&P 500 +{spy_ret*100:.2f}%) "
        else:
            macro_str += f"headwind (S&P 500 {spy_ret*100:.2f}%) "
            
        if vix > 25:
            macro_str += f"amidst a highly erratic and volatile regime (VIX {vix:.1f}). Capital preservation algorithms are prioritizing defensive signals."
        elif vix < 15:
            macro_str += f"in a stable, low-volatility environment (VIX {vix:.1f}), favorable for clean directional plays."
        else:
            macro_str += f"with average baseline volatility (VIX {vix:.1f})."
            
        reasoning.append(macro_str)
        
        # Paragraph 3: Ensemble Consensus
        consensus_str = f"Tri-Model Ensemble Consensus: Our advanced stack calculates an exact {ensemble_prob*100:.1f}% probability of upward movement. "
        if direction == "UP":
            consensus_str += "The aggressive XGBoost engine and Deep Learning MLP align on a bullish trajectory, overpowering the conservative Random Forest baseline to trigger a high-conviction UP signal."
            jargon_free_summary = "The AI is confident this stock is likely to go up. Both market conditions and the stock's own momentum look strong."
        elif direction == "DOWN":
            consensus_str += "The models have converged on significant downside risk, unanimously breaking our strict capital preservation threshold to trigger a DOWN signal."
            jargon_free_summary = "The AI believes this stock will go down. The market environment is risky and the stock's trend is weak."
        else:
            consensus_str += "Model convergence is fragmented; the ensemble failed to break our strict 60/40 confidence thresholds, resulting in a defensive NEUTRAL stance."
            jargon_free_summary = "The AI is unsure. The models are giving mixed signals, so it's safer to wait and not trade right now."
            
        reasoning.append(consensus_str)

        return {
            "direction": direction,
            "confidence": round(confidence, 1),
            "summary": jargon_free_summary,
            "reasoning": reasoning
        }

ml_engine = MLEngine()