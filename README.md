# Erebix | AI-Powered Market Intelligence

Erebix is a full-stack, algorithmic stock analysis platform. It combines a multi-model machine learning ensemble (LSTM, Prophet, XGBoost) with a gamified, financial-literacy-first user interface to provide explainable market predictions.

## 🧠 Core Architecture

Erebix does not just output a price target. It explains *why* using an ensemble of models and SHAP values, giving retail investors institutional-grade transparency.

*   **LSTM Neural Network:** Captures sequential price patterns and momentum.
*   **Facebook Prophet:** Models seasonality, holidays, and macro market trends.
*   **XGBoost:** Analyzes technical indicators (RSI, MACD, Bollinger Bands) for directional classification.

## 💻 Tech Stack

**Frontend**
*   React & TypeScript
*   Tailwind CSS (Dark-theme, gamified UI)
*   TradingView Lightweight Charts

**Backend & ML**
*   FastAPI (Python)
*   TensorFlow / Keras & Scikit-Learn
*   Pandas-TA (Technical Analysis)
*   YFinance (NSE & NYSE Market Data)

**Infrastructure**
*   PostgreSQL (Neon) for User Portfolios & Authentication
*   Redis for API Response Caching
*   Docker & Vercel / Render Deployment

## 🚀 Local Development Setup

### Prerequisites
*   Python 3.11+
*   Node.js 18+
*   PostgreSQL

### Backend (FastAPI)
1. Navigate to the backend directory: `cd backend`
2. Create a virtual environment: `python -m venv venv`
3. Activate the environment: `source venv/bin/activate` (Mac/Linux) or `venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Start the server: `uvicorn main:app --reload`

### Frontend (React)
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`