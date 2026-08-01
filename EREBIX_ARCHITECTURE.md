# EREBIX QUANT PLATFORM — INSTITUTIONAL ARCHITECTURE & SYSTEM BLUEPRINT

> **Version:** 3.0.0-PROD  
> **Classification:** Institutional Quantitative Analytics & Trading Gateway  
> **Compliance Standard:** Zero-Cost Free-Tier Database Shield (Neon/AWS PostgreSQL) & Bot DoS Mitigation  

---

## 1. Executive System Overview & Multi-Service Topology

Erebix operates as a high-performance **3-Tier Quant Platform** separating UI presentation, transactional business logic & security, and intensive mathematical/ML modeling into decoupled microservices.

```mermaid
graph TB
    subgraph FrontendTier ["1. Presentation Layer (Next.js 16 / React 19 - Port 3000)"]
        UI_Topbar["Institutional Topbar (Theme & User Badge)"]
        UI_Login["Login / Account Switcher (/login)"]
        UI_Stock["Stock Terminal (/stock/[ticker])"]
        UI_Modal["Quant Trade Execution Modal (BUY / SELL)"]
        UI_Portfolio["Quant Portfolio Command Center (/portfolio)"]
        UI_Watchlist["Watchlist Relational Manager (/watchlist)"]
    end

    subgraph GatewayTier ["2. Core API Gateway & Security Firewall (Java Spring Boot 3 - Port 8080)"]
        FW_Shield["Token Bucket Rate Limiter & SQL Sanitizer"]
        GW_Auth["Authentication & User Session Controller"]
        GW_Portfolio["Portfolio & Trade Execution Controller (/api/v1/portfolio/**)"]
        GW_Watchlist["Watchlist Relational Controller (/api/v1/watchlist/**)"]
        GW_Market["Market Gateway Proxy Controller (/api/v1/market/**)"]
        DB_JPA[("Relational Database (H2 Local / Neon PostgreSQL Prod)\nUser | Portfolio | Holding | WatchlistItem | TradeHistory")]
    end

    subgraph MLTier ["3. Quantitative ML Engine (Python FastAPI - Port 8000)"]
        ML_Market["Market Data Extraction API (/api/v1/market/[ticker])"]
        ML_Predict["Tri-Model Ensemble AI API (/api/v1/market/predict/[ticker])"]
        ML_Search["Institutional Search API (/api/v1/market/search)"]
        Ext_YF["YFinance / NSE & NYSE Global Exchanges"]
        Ext_Models["XGBoost + Random Forest + MLP Neural Network Ensemble"]
    end

    %% Client Routing via Next.js Proxy Rewrites (Zero Hardcoded URLs)
    UI_Login -->|"1. Session & Auth API"| FW_Shield
    UI_Modal -->|"2. POST /api/v1/portfolio/(buy|sell)"| FW_Shield
    UI_Portfolio -->|"3. GET /api/v1/portfolio & history"| FW_Shield
    UI_Watchlist -->|"4. GET/POST/DELETE /api/v1/watchlist/**"| FW_Shield
    UI_Stock -->|"5. GET /api/v1/market/** (Data & Predict)"| FW_Shield

    %% Internal Gateway Routing
    FW_Shield --> GW_Auth
    FW_Shield --> GW_Portfolio
    FW_Shield --> GW_Watchlist
    FW_Shield --> GW_Market

    %% Database Persistence
    GW_Auth <--> DB_JPA
    GW_Portfolio <--> DB_JPA
    GW_Watchlist <--> DB_JPA

    %% Upstream Microservice Proxying via RestTemplate
    GW_Market -->|"6. Reverse Proxy Market Request"| ML_Market
    GW_Market -->|"7. Reverse Proxy ML Inference"| ML_Predict
    GW_Market -->|"8. Reverse Proxy Symbol/Name Search"| ML_Search

    %% ML Engine Upstream Integration
    ML_Market <--> Ext_YF
    ML_Predict <--> Ext_Models
```

---

## 2. Security Compliance & Free-Tier Zero-Cost Firewall

To guarantee **$0 billing** on cloud production databases (such as Neon PostgreSQL free tier) and prevent automated botting, query flooding, and SQL injection, Erebix implements an in-memory defense layer inside the Java Spring Boot Core Gateway.

```mermaid
flowchart TD
    Req["Incoming API Request (/api/v1/**)"] --> Shield["Spring Boot Security Firewall (RateLimitInterceptor)"]

    subgraph RateLimiting ["In-Memory Token Bucket Rate Limiter (Zero DB Hits)"]
        RL_Check{"Request Rate Within Limits?"}
        RL_Auth["Login / Auth: Max 10 req/min per IP"]
        RL_Trade["Trade Executions: Max 30 req/min per User"]
        RL_Search["Search / Market Queries: Max 60 req/min per IP"]
    end

    Shield --> RL_Check
    RL_Check -- "No (Rate Exceeded)" --> Block["HTTP 429 Too Many Requests\n(Request Dropped in Memory)"]
    RL_Check -- "Yes" --> Sanitize["Input Sanitization & Query Validation"]

    subgraph Sanitization ["Query Sanitization & Validation"]
        San_Search["Search Query (q): Max 64 Chars\n(Supports full company names e.g. Societ.Nat.de Gaze Nat.Romgaz N)\nStrips SQL/HTML injection characters"]
        San_Ticker["Ticker Symbol: Alphanumeric Regex ^[A-Z0-9.\\-]{1,15}$"]
    end

    Sanitize --> San_Search
    Sanitize --> San_Ticker
    San_Search --> DB_Pool["Database Execution Layer"]
    San_Ticker --> DB_Pool

    subgraph FreeTierProtection ["Neon PostgreSQL Free-Tier Connection Pool Shield"]
        Pool_Limit["HikariCP Connection Pool Capped:\nmaximum-pool-size: 5\nconnection-timeout: 30000ms"]
        Query_Limit["Bounded Queries (LIMIT & Pagination)\nNo unbounded table scans"]
    end

    DB_Pool --> Pool_Limit
    Pool_Limit --> Query_Limit
    Query_Limit --> Exec_OK["Transaction Successful (0 USD Cost)"]
```

### Key Security Policies:
1. **64-Character Search Query Limit**: Expanded from 15 to 64 characters to support long international company names (e.g., `Societ.Nat.de Gaze Nat.Romgaz N`) while preventing multi-kilobyte DOS payload attacks.
2. **In-Memory Token Bucket**: Bots attempting to flood login, trade, or search endpoints are dropped in memory (`HTTP 429`) before establishing any database connection.
3. **Capped HikariCP Connection Pool (`maximum-pool-size: 5`)**: Even during traffic spikes, Spring Boot will never exceed Neon PostgreSQL's free-tier concurrent connection limits.

---

## 3. Quantitative BUY & SELL Trading Execution Architecture

The Erebix simulated trading engine operates with institutional precision inside `PortfolioService.java`, executing ACID-compliant `@Transactional` database operations that prevent race conditions and maintain exact **Weighted Average Cost Basis** accounting.

```mermaid
sequenceDiagram
    autonumber
    actor Trader as Client (TradeModal.tsx)
    participant FW as Security Shield
    participant PS as PortfolioService (Java)
    participant DB as Relational Database

    Note over Trader,DB: BUY TRANSACTION FLOW (e.g. BUY 10 AAPL @ $220.00)
    Trader->>FW: POST /api/v1/portfolio/buy (userId: 1, symbol: "AAPL", qty: 10, price: 220.00)
    FW->>FW: Validate Token Bucket Rate & Symbol Regex (^[A-Z0-9.\-]{1,15}$)
    FW->>PS: Forward validated BUY request
    PS->>DB: BEGIN TRANSACTION: Select Portfolio FOR UPDATE (UserId = 1)
    DB-->>PS: Return Portfolio (Cash Balance: $100,000.00)
    PS->>PS: Validate Cash >= Total Cost ($2,200.00 <= $100,000.00)
    PS->>DB: UPDATE Portfolio SET cash_balance = $97,800.00
    PS->>DB: UPSERT Holding (symbol="AAPL", qty=10, avg_cost=$220.00)
    PS->>DB: INSERT TradeHistory (type="BUY", symbol="AAPL", qty=10, price=$220.00)
    PS->>DB: COMMIT TRANSACTION
    PS-->>Trader: Return HTTP 200 (Updated PortfolioSummary & Holdings)

    Note over Trader,DB: SELL TRANSACTION FLOW (e.g. SELL 5 AAPL @ $235.00)
    Trader->>FW: POST /api/v1/portfolio/sell (userId: 1, symbol: "AAPL", qty: 5, price: 235.00)
    FW->>PS: Forward validated SELL request
    PS->>DB: BEGIN TRANSACTION: Fetch Holding (PortfolioId = 1, Symbol = "AAPL")
    DB-->>PS: Return Holding (ownedQty: 10, avgCost: $220.00)
    PS->>PS: Validate ownedQty >= sellQty (10 >= 5)
    PS->>DB: UPDATE Portfolio SET cash_balance = cash_balance + $1,175.00 ($98,975.00)
    PS->>DB: UPDATE Holding SET quantity = 5 (If quantity == 0, DELETE row)
    PS->>DB: INSERT TradeHistory (type="SELL", symbol="AAPL", qty=5, price=$235.00)
    PS->>DB: COMMIT TRANSACTION
    PS-->>Trader: Return HTTP 200 (Updated PortfolioSummary & Realized P&L)
```

### Quantitative Formulas:
- **Weighted Average Cost Basis** (when adding shares to an existing holding):
  $$\text{New Avg Cost} = \frac{(\text{Existing Qty} \times \text{Existing Avg Cost}) + (\text{New Qty} \times \text{Purchase Price})}{\text{Existing Qty} + \text{New Qty}}$$
- **Unrealized Position Profit / Loss**:
  $$\text{Unrealized P\&L (\%)} = \frac{\text{Current Market Price} - \text{Avg Cost Basis}}{\text{Avg Cost Basis}} \times 100$$
- **Realized P&L on SELL**:
  $$\text{Realized P\&L (\$)} = (\text{Execution Price} - \text{Avg Cost Basis}) \times \text{Shares Sold}$$

---

## 4. Relational Database Schema (Entity-Relationship Diagram)

Erebix uses 5 core tables mapped via Spring Data JPA and Hibernate. All foreign key relationships use cascading deletes for referential integrity.

```mermaid
erDiagram
    USER ||--o{ PORTFOLIO : "owns (1:1 default)"
    USER ||--o{ WATCHLIST_ITEM : "saves"
    USER ||--o{ TRADE_HISTORY : "executes"
    PORTFOLIO ||--o{ HOLDING : "contains"

    USER {
        BIGINT id PK
        VARCHAR(64) username
        VARCHAR(128) email
        BOOLEAN is_demo
        TIMESTAMP created_at
    }

    PORTFOLIO {
        BIGINT id PK
        BIGINT user_id FK
        DECIMAL(15_2) cash_balance
        DECIMAL(15_2) starting_cash
        TIMESTAMP updated_at
    }

    HOLDING {
        BIGINT id PK
        BIGINT portfolio_id FK
        VARCHAR(15) symbol
        INT quantity
        DECIMAL(15_4) average_cost
        TIMESTAMP updated_at
    }

    WATCHLIST_ITEM {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR(15) symbol
        TIMESTAMP added_at
    }

    TRADE_HISTORY {
        BIGINT id PK
        BIGINT user_id FK
        VARCHAR(8) trade_type
        VARCHAR(15) symbol
        INT quantity
        DECIMAL(15_4) price
        DECIMAL(15_2) total_value
        TIMESTAMP executed_at
    }
```

---

## 5. Frontend Institutional User Flow & UI Component Map

```mermaid
graph TD
    User["Institutional Trader / User"] --> Topbar["Topbar.tsx\n- Dynamic Theme Selector\n- User Auth Badge (Trader-01)"]

    Topbar -->|Click Sign In| LoginPage["/login (page.tsx)\n- 1-Click Institutional Demo Login\n- Custom Account Creation"]
    Topbar -->|Search Ticker/Company| SearchBox["Universal Search Box (64-Char Limit)\n- Queries Java Gateway -> Python Engine"]
    
    SearchBox -->|Select Stock| StockPage["/stock/[ticker] (page.tsx & AssetProfile.tsx)\n- Live Market Quote & AI Prediction\n- Interactive Financial Chart"]

    StockPage -->|Click 'TRADE / ADD TO PORTFOLIO'| TradeModal["TradeModal.tsx (Overlay)\n- Toggle BUY / SELL\n- Enter Quantity & Check Cash\n- Execute POST /api/v1/portfolio/(buy|sell)"]

    StockPage -->|Click 'ADD TO WATCHLIST'| WatchlistContext["WatchlistContext.tsx\n- Syncs to /api/v1/watchlist (DB)\n- Offline localStorage Fallback"]

    Topbar -->|Navigate /portfolio| PortfolioPage["/portfolio (page.tsx) — Quant Command Center\n- Hero Strip: Value, Cash, Equity, P&L\n- Asset Allocation Bar\n- Active Holdings Table (BUY MORE / SELL)\n- Execution History Log Table"]

    Topbar -->|Navigate /watchlist| WatchlistPage["/watchlist (page.tsx)\n- Database-Backed Watchlist Grid\n- Real-Time Price Cards"]
```

---

## 6. Zero Hardcoded API Links — Modular Configuration

All external service endpoints are decoupled via environment configuration:

- **Next.js (`frontend/next.config.ts`)**:
  ```ts
  {
    source: '/api/:path*',
    destination: `${process.env.API_URL || 'http://127.0.0.1:8080'}/api/:path*`,
  }
  ```
- **Java Spring Boot (`core-service/src/main/resources/application.yml`)**:
  ```yaml
  ml:
    service:
      url: ${ML_SERVICE_URL:http://127.0.0.1:8000}
  ```
- **Java Spring Boot Production (`application-prod.yml`)**:
  ```yaml
  spring:
    datasource:
      url: ${DATABASE_URL}
      username: ${DATABASE_USERNAME}
      password: ${DATABASE_PASSWORD}
      hikari:
        maximum-pool-size: 5
  ```

---

## 7. How to Start the Complete Institutional Stack

1. **Start Core API Gateway (`core-service`)**:
   ```powershell
   cd core-service
   .\mvnw.cmd spring-boot:run
   ```
   *(Running on `http://localhost:8080` — Swagger UI at `/swagger-ui.html`)*

2. **Start Python ML Engine (`backend`)**:
   ```powershell
   cd backend
   venv\Scripts\activate
   uvicorn app.main:app --reload
   ```
   *(Running on `http://localhost:8000`)*

3. **Start Next.js Frontend (`frontend`)**:
   ```powershell
   cd frontend
   npm run dev
   ```
   *(Running on `http://localhost:3000`)*
