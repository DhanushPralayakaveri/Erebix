import numpy as np
import pandas as pd
from xgboost import XGBClassifier
from sklearn.preprocessing import StandardScaler

class MLEngine:
    def __init__(self):
        # We initialize the model with standard hyperparameters for financial tabular data
        self.model = XGBClassifier(
            n_estimators=100,
            max_depth=3,
            learning_rate=0.05,
            random_state=42,
            eval_metric='logloss'
        )
        self.scaler = StandardScaler()
        self.is_trained = False

    def _prepare_data(self, df: pd.DataFrame):
        """
        Cleans the DataFrame, creates the binary target variable (1 if tomorrow's 
        close is higher than today's, 0 otherwise), and splits features.
        """
        # Create a copy to avoid mutating the original dataframe
        data = df.copy()
        
        # Sort by date to ensure historical chronological order
        if 'Date' in data.columns:
            data = data.sort_values('Date').reset_index(drop=True)
            data = data.drop(columns=['Date'])
            
        # Target: Did the price go UP tomorrow? (Shift close prices back by 1)
        data['Target'] = (data['Close'].shift(-1) > data['Close']).astype(int)
        
        # Drop rows with NaN values (like the last row which has no tomorrow target, 
        # or early rows missing rolling indicators)
        data = data.dropna()
        
        if len(data) < 10:
            raise ValueError("Not enough historical data to extract features and train.")
            
        X = data.drop(columns=['Target'])
        y = data['Target']
        
        return X, y

    def train_and_predict(self, df: pd.DataFrame):
        """
        Trains the model on the historical data and predicts the next directional movement.
        Also returns the key features that drove the decision.
        """
        # 1. Prepare Features and Targets
        X, y = self._prepare_data(df)
        
        # Keep the absolute latest row of data *before* fitting to predict tomorrow's move
        # (We use the real latest data point, matching the features available right now)
        latest_features = X.iloc[[-1]]
        
        # 2. Train the model on history
        # Note: In production, you'd load a pre-trained model, but fitting a light 
        # XGBoost on a single stock's tabular history is fast enough for development!
        self.model.fit(X, y)
        self.is_trained = True
        
        # 3. Predict Probability
        # predict_proba returns [prob_of_0, prob_of_1]
        probabilities = self.model.predict_proba(latest_features)[0]
        up_probability = float(probabilities[1])
        
        # Determine Direction and Confidence
        if up_probability >= 0.55:
            direction = "UP"
            confidence = up_probability * 100
        elif up_probability <= 0.45:
            direction = "DOWN"
            confidence = (1 - up_probability) * 100
        else:
            direction = "NEUTRAL"
            confidence = 50.0

        # 4. The Literacy Layer: Generate SHAP-lite Explanations
        # Get feature importances from XGBoost
        importances = self.model.feature_importances_
        feature_names = X.columns
        
        # Map them together and sort by importance weight
        feature_ranking = sorted(
            zip(feature_names, importances), 
            key=lambda x: x[1], 
            reverse=True
        )
        
        # Generate plain English reasonings for the top 3 driving features
        reasoning = []
        latest_vals = latest_features.iloc[0]
        
        for feature, weight in feature_ranking[:3]:
            if weight == 0:
                continue
            
            if feature == 'rsi':
                val = latest_vals['rsi']
                if val < 30:
                    reasoning.append(f"RSI is highly oversold ({val:.1f}), prompting a potential upward technical bounce.")
                elif val > 70:
                    reasoning.append(f"RSI indicates overbought conditions ({val:.1f}), flashing a short-term correction risk.")
                else:
                    reasoning.append(f"RSI is stabilizing at {val:.1f}, supporting current momentum weights.")
                    
            elif 'macd' in feature:
                # Assuming macd and macd_signal columns exist from PR #1
                val = latest_vals.get('macd', 0)
                sig = latest_vals.get('macd_signal', 0)
                if val > sig:
                    reasoning.append("MACD line crossed above the signal line, confirming bullish momentum.")
                else:
                    reasoning.append("MACD line remains below the signal line, suggesting lingering bearish pressure.")
                    
            elif 'MA' in feature or 'ma' in feature:
                reasoning.append(f"The asset's position relative to its Moving Averages is acting as a primary weight container.")

        # Default fallbacks if no features have weights yet
        if not reasoning:
            reasoning.append("The model is weighing macro historical price consolidation patterns equally.")

        return {
            "direction": direction,
            "confidence": round(confidence, 1),
            "reasoning": reasoning
        }

# Instantiate a singleton instance to use across routes
ml_engine = MLEngine()