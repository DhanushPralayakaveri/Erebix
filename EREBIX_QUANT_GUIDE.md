# 🧠 Erebix: The Definitive Quant & Architecture Guide

Welcome to the **Erebix Quant Guide**. This document serves as the ultimate 0-to-100 educational resource for the Erebix project. Whether you need to understand the underlying React architecture, revise how a Neural Network operates, or learn how MACD indicates bullish momentum, everything is documented here.

---

## 🏗️ 1. Project Architecture (The Big Picture)

Erebix is designed to emulate an institutional-grade trading dashboard and portfolio simulator. It operates on a multi-service architecture:

### A. The Frontend (Next.js / React)
- **Role:** The user-facing dashboard.
- **Tech:** Next.js App Router, React, Tailwind CSS for styling, and Recharts for the dynamic, glowing financial charts.
- **Key Files:** `src/components/AIInsights/IntelligencePanel.tsx` handles the display of AI analysis, while `VisualEngine.tsx` handles the charts.

### B. The ML Data Microservice (Python / FastAPI)
- **Role:** The "Brain" of Erebix. It crunches massive amounts of historical stock data, calculates mathematical indicators natively (bypassing slow third-party libraries), and runs the Machine Learning ensemble to predict stock movements.
- **Tech:** FastAPI, Pandas, scikit-learn, XGBoost, yfinance.
- **Key Files:** `app/services/ml_engine.py` (The inference engine) and `train.py` (The offline training script).

### C. The Core API Gateway (Future Phase - Java Spring Boot)
- **Role:** The traffic controller. It will handle user authentication, database connections (PostgreSQL) to save simulated portfolios, and route requests between the frontend and the Python ML service.

---

## 📈 2. Quantitative Finance 101

Before we dive into the AI, we need to understand the data it looks at. The AI isn't looking at "stocks"; it's looking at **features** (mathematical transformations of price and volume).

### Technical Indicators (Micro Context)
These indicators look *only* at the target stock's own history.

1. **SMA (Simple Moving Average):** The average price over a set period (e.g., 20 days). It smoothes out random noise to show the true trend.
2. **MACD (Moving Average Convergence Divergence):** Measures momentum. It subtracts a long-term average (26-day) from a short-term average (12-day). 
   - *Bullish:* When MACD crosses *above* its signal line.
   - *Bearish:* When MACD crosses *below* its signal line.
3. **RSI (Relative Strength Index):** Measures how fast a stock is changing price on a scale of 0 to 100.
   - *Oversold (< 30):* The stock has dropped too fast and might "bounce" up.
   - *Overbought (> 70):* The stock has risen too fast and might correct downwards.
4. **Bollinger Bands:** Measures volatility. It places a band 2 standard deviations above and below the SMA. When the bands "squeeze" (tighten), a massive breakout is usually imminent.

### Macroeconomic Indicators (Macro Context)
A stock doesn't exist in a vacuum. If the whole market crashes, even a good stock will fall. Our AI considers the broader environment:

1. **SPY (S&P 500 Index):** Tracks the 500 largest US companies. We use its daily percentage change to tell the AI if the market is currently a "tailwind" (pushing stocks up) or a "headwind" (pulling them down).
2. **VIX (Volatility Index / The "Fear Gauge"):** Measures expected market volatility.
   - *VIX < 15:* Calm, stable market. Good for directional trading.
   - *VIX > 25:* Erratic, fearful market. Capital preservation is prioritized.

---

## 🤖 3. Machine Learning 101

**Machine Learning (ML)** is a subset of Artificial Intelligence where we don't write explicit rules (like `if RSI < 30 then BUY`). Instead, we feed the computer historical data (`X`) and the historical outcomes (`y`), and the algorithm *learns* the rules itself.

- **Features (X):** The inputs (RSI, MACD, Volume, SPY returns).
- **Target (y):** What we are trying to predict (Did the stock go UP or DOWN the next day?).
- **Training:** The process of the algorithm finding the hidden math linking `X` to `y`.
- **Inference/Prediction:** Giving the trained model *today's* `X` so it can guess *tomorrow's* `y`.

### The Problem with Single Models (Overfitting vs. Underfitting)
- **Overfitting:** The model memorizes the past perfectly but fails completely on new, unseen data (like a student memorizing a practice test but failing the real exam).
- **Underfitting:** The model is too simple to capture complex market patterns.

To solve this, Erebix uses an **Ensemble**—a committee of different models that vote together to eliminate individual weaknesses.

---

## 🧠 4. The Tri-Model Stack Explained

Erebix's engine utilizes three entirely different mathematical architectures to make its decisions. 

### A. XGBoost (Extreme Gradient Boosting)
*The Aggressive Alpha Generator.*
- **How it works (Trees):** It builds "Decision Trees". A tree asks a series of Yes/No questions (e.g., "Is RSI > 50? -> Is Volume > 1.5x?").
- **How it works (Boosting):** It builds one tree. That tree gets some predictions wrong. XGBoost then builds a *second* tree specifically designed to fix the mistakes of the first tree. It repeats this hundreds of times.
- **Why we use it:** It is the undisputed king of finding highly complex, non-linear relationships in tabular data.

### B. Random Forest
*The Conservative Stabilizer.*
- **How it works (Bagging):** Instead of building trees sequentially to fix errors, Random Forest builds hundreds of trees completely independently at the exact same time, using random subsets of data. It then takes the average of all their predictions.
- **Why we use it:** Random Forest drastically reduces **Variance**. If the market acts weirdly, a single XGBoost tree might panic and make a wild prediction. Random Forest acts as a stable, conservative anchor that prevents the engine from making catastrophic bets during regime changes.

### C. MLP (Multi-Layer Perceptron) Neural Network
*The Deep Pattern Recognizer.*
- **How it works (Deep Learning):** An MLP mimics the human brain. It consists of an Input Layer (our features), "Hidden Layers" of neurons, and an Output Layer (UP/DOWN). Data flows through the network, being multiplied by "weights". During training, the network adjusts these weights via a process called *backpropagation* until it gets the answers right.
- **Why we use it:** Decision trees (XGB/RF) draw hard, square boundaries in data (e.g., exactly `RSI > 30`). Financial markets aren't square; they are smooth, continuous geometries. The Neural Network can recognize abstract, fluid patterns that trees are mathematically blind to.

### ⚖️ The Soft Voting Consensus
When you request a prediction on the frontend:
1. All three models analyze the data independently and output a probability (e.g., XGBoost says 70% UP, RF says 55% UP, MLP says 65% UP).
2. The engine averages these probabilities (Soft Voting) = `63.3% UP`.
3. **Capital Preservation Threshold:** Erebix enforces a strict rule. If the final average is between 40% and 60%, the engine refuses to guess and outputs `NEUTRAL`. It will only signal an `UP` or `DOWN` trend if the probability breaks `> 0.60` or `< 0.40`.

---

## 🛠️ 5. Developer Guide: Running Erebix Locally

To work on Erebix, you need both the Frontend and the Backend running simultaneously.

### Starting the Machine Learning Backend
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd d:\JOB-Stuff\projects\Erebix\backend
   ```
2. Activate the Python Virtual Environment (this isolates our dependencies like `scikit-learn`):
   ```bash
   venv\Scripts\activate
   ```
3. Start the FastAPI server on port 8000:
   ```bash
   uvicorn app.main:app --reload
   ```

*Note: If you change the features in `indicators.py` or `market.py`, you MUST re-train the AI brains by running `python train.py` while the virtual environment is activated!*

### Starting the Frontend UI
1. Open a *second* terminal and navigate to the frontend folder:
   ```bash
   cd d:\JOB-Stuff\projects\Erebix\frontend
   ```
2. Start the Next.js development server:
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:3000`.

---

## 🔮 6. The Roadmap
- **PR #1:** Frontend Interactivity & API Integration *(Completed)*
- **PR #2:** Quant-Grade Tri-Model Stack & Macro Features *(Completed)*
- **PR #3:** Java Spring Boot Core Gateway (PostgreSQL persistence for portfolios).
- **PR #4:** Real-time WebSocket Simulator Engine (Executing trades against live data).
