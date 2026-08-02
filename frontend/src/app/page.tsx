"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Activity,
  ShieldCheck,
  Database,
  BrainCircuit,
  Code2,
  Lock,
  UserCheck,
  Zap,
  TrendingUp,
  ShieldAlert,
  Shield,
  CheckCircle2,
  ArrowRight,
  Terminal,
  Cpu,
  BarChart3,
  Layers,
  Wallet,
  Globe,
  X,
  Play,
  Server
} from 'lucide-react';

export default function LandingPage() {
  const { login } = useAuth();
  const router = useRouter();

  // Modal State for Terminal Entry Pop-up
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [authMode, setAuthMode] = useState<'DEMO' | 'REGISTER'>('DEMO');

  // Custom Form State
  const [handle, setHandle] = useState('');
  const [email, setEmail] = useState('');
  const [capital, setCapital] = useState('100000');
  const [secNum1] = useState(() => Math.floor(Math.random() * 8) + 3);
  const [secNum2] = useState(() => Math.floor(Math.random() * 8) + 2);
  const [secAnswer, setSecAnswer] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  // One-click Institutional Demo Entry as Trader-01
  const handleInstantDemo = () => {
    login('Trader-01', 'demo@erebix.quant', true);
    router.push('/dashboard');
  };

  // Custom Sign In / Registration with Math Security Challenge & Honeypot
  const handleCustomAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Honeypot trap for spam scripts
    if (honeypot.trim() !== '') {
      setErrorMsg('Automated submission rejected by firewall.');
      return;
    }
    // Anti-Bot Math Verification
    if (parseInt(secAnswer.trim(), 10) !== secNum1 + secNum2) {
      setErrorMsg(`Please answer the security question correctly (${secNum1} + ${secNum2}) to verify human access.`);
      return;
    }
    if (!handle.trim()) {
      setErrorMsg('Please enter your Trader Handle / Username.');
      return;
    }

    login(
      handle.trim(),
      email.trim() || `${handle.trim().toLowerCase()}@erebix.quant`,
      false
    );

    setSuccessMsg(`Session Authorized for ${handle.trim()}. Initializing Quantitative Terminal...`);
    setTimeout(() => {
      router.push('/dashboard');
    }, 900);
  };

  // Interactive React Portal Auth Pop-up Modal
  const authModalPortal = mounted && isModalOpen ? createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-card border border-border/80 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.95)] overflow-hidden relative z-[100000]">
        
        {/* Modal Topbar */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary font-black text-sm border border-primary/50 shadow-[0_0_15px_var(--glow-cyan)]">
              E
            </div>
            <div>
              <h3 className="text-sm font-black text-foreground uppercase tracking-wider">
                Institutional Terminal Access
              </h3>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                No password lockouts • Instant Demo or Custom Trader
              </p>
            </div>
          </div>
          <button
            onClick={() => { setIsModalOpen(false); setErrorMsg(''); setSuccessMsg(''); }}
            className="p-2 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-all"
            title="Close Auth Terminal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Tab Selection */}
          <div className="grid grid-cols-2 gap-2 p-1.5 rounded-2xl bg-muted/50 border border-border">
            <button
              type="button"
              onClick={() => { setAuthMode('DEMO'); setErrorMsg(''); }}
              className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                authMode === 'DEMO'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              1-Click Demo (Trader-01)
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode('REGISTER'); setErrorMsg(''); }}
              className={`py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                authMode === 'REGISTER'
                  ? 'bg-success text-success-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up / Custom Trader
            </button>
          </div>

          {authMode === 'DEMO' ? (
            <div className="space-y-6 text-center py-2">
              <div className="p-5 rounded-2xl bg-muted/30 border border-border space-y-2 text-left">
                <div className="flex items-center gap-2 text-primary font-black text-base">
                  <UserCheck className="w-5 h-5" />
                  <span>TRADER-01 (DEFAULT QUANT PROFILE)</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Instant launch with <strong>$100,000.00 USD</strong> simulated equity, ACID-shielded execution, and full access to live market tickers &amp; Tri-Model ML ensemble predictions.
                </p>
              </div>

              <button
                type="button"
                onClick={handleInstantDemo}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-success text-background font-black text-sm uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_30px_var(--glow-cyan)] flex items-center justify-center gap-2"
              >
                <span>ENTER TERMINAL IMMEDIATELY AS TRADER-01</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Trader Handle / Username *
                </label>
                <input
                  type="text"
                  required
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  placeholder="e.g. ApexQuant, Institutional-Alpha"
                  className="w-full h-11 px-4 bg-muted/40 border border-border rounded-xl text-foreground font-semibold text-sm focus:outline-none focus:border-primary transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="trader@erebix.quant"
                    className="w-full h-11 px-4 bg-muted/40 border border-border rounded-xl text-foreground font-semibold text-sm focus:outline-none focus:border-primary transition-all"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Starting Capital Allocation ($ USD)
                    </label>
                    <span className="text-xs font-black text-primary">
                      ${(parseInt(capital, 10) || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1000"
                      max="1000000000"
                      step="1000"
                      value={capital}
                      onChange={(e) => {
                        setCapital(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="Enter custom capital amount (e.g. 100000)"
                      className="w-full h-11 px-4 bg-muted/40 border border-border rounded-xl text-foreground font-black text-sm focus:outline-none focus:border-primary transition-all shadow-inner [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  {/* Institutional Preset Chips */}
                  <div className="grid grid-cols-5 gap-1.5 mt-2">
                    {[
                      { label: '$10K', value: '10000' },
                      { label: '$50K', value: '50000' },
                      { label: '$100K', value: '100000' },
                      { label: '$500K', value: '500000' },
                      { label: '$1M', value: '1000000' }
                    ].map(preset => (
                      <button
                        key={preset.value}
                        type="button"
                        onClick={() => {
                          setCapital(preset.value);
                          setErrorMsg('');
                        }}
                        className={`py-1.5 rounded-lg text-xs font-black transition-all border ${
                          capital === preset.value
                            ? 'bg-primary/20 text-primary border-primary/60 shadow-[0_0_10px_var(--glow-cyan)]'
                            : 'bg-muted/30 border-border/60 text-muted-foreground hover:text-foreground hover:border-border'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Institutional Anti-Bot Security Challenge */}
              <div className="p-4 rounded-2xl bg-muted/30 border border-border space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Security Verification (Anti-Bot Math Challenge) *
                  </label>
                  <span className="text-xs font-black text-primary">
                    What is {secNum1} + {secNum2} ?
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      required
                      value={secAnswer}
                      onChange={(e) => {
                        setSecAnswer(e.target.value);
                        setErrorMsg('');
                      }}
                      placeholder="Enter sum"
                      className="w-full h-11 px-4 bg-card border border-border rounded-xl text-foreground font-black text-sm focus:outline-none focus:border-primary transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>

                  {parseInt(secAnswer.trim(), 10) === secNum1 + secNum2 && (
                    <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-success/15 border border-success text-success text-xs font-black animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Verified</span>
                    </div>
                  )}
                </div>

                {/* Invisible Honeypot Trap for bots */}
                <input
                  type="text"
                  name="bot_trap_url"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-danger/15 border border-danger/40 text-danger text-xs font-bold flex items-center gap-2 shadow-sm">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3 rounded-xl bg-success/15 border border-success/40 text-success text-xs font-bold flex items-center gap-2 shadow-sm">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-black text-sm uppercase tracking-wider hover:opacity-95 transition-all shadow-[0_0_20px_var(--glow-cyan)]"
              >
                LAUNCH CUSTOM QUANT TERMINAL
              </button>
            </form>
          )}

          <div className="pt-3 border-t border-border/60 flex items-center justify-between text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
            <span>Free-Tier Rate Limit: 100 req/sec</span>
            <span>0 USD Database Compliant</span>
          </div>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Cyber Ambient Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/10 blur-[160px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-2/3 right-0 w-[600px] h-[600px] bg-success/10 blur-[180px] rounded-full pointer-events-none -z-10" />

      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-7xl mx-auto border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_20px_var(--glow-cyan)]">
            <span className="text-primary font-black text-xl tracking-tighter">E</span>
          </div>
          <div>
            <span className="text-2xl font-black tracking-widest text-foreground uppercase block leading-none">
              Erebix
            </span>
            <span className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
              Quant Engine • v3.0
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-success/10 border border-success/30 text-success text-xs font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>0 USD Cloud Firewall Active</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_var(--glow-cyan)] flex items-center gap-2"
          >
            <span>Launch Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </nav>

      {/* Hero Section - Super Clean & Focused */}
      <section className="pt-20 pb-28 px-4 text-center max-w-5xl mx-auto relative">
        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-card border border-border text-foreground text-xs font-black uppercase tracking-wider mb-8 shadow-md">
          <span className="w-2 h-2 rounded-full bg-success animate-ping" />
          <span>Institutional 3-Tier Quant Platform • Zero-Cost Cloud Shield</span>
        </div>
        
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-foreground tracking-tight mb-6 leading-none">
          Algorithmic Equity <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-success to-primary animate-pulse">
            Trading &amp; Intelligence
          </span>
        </h1>
        
        <p className="text-base sm:text-lg text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
          A high-frequency quantitative terminal combining <strong>Java Spring Boot Core Firewall</strong>, <strong>Python Tri-Model ML Engine</strong>, and a dynamic <strong>Next.js 16 Institutional Frontend</strong> with real-time portfolio accounting.
        </p>

        {/* Clean Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-[0_0_30px_var(--glow-cyan)] flex items-center justify-center gap-3 hover:scale-105"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>LAUNCH QUANT TERMINAL</span>
          </button>

          <a
            href="#architecture"
            className="w-full sm:w-auto px-8 py-4 bg-card hover:bg-muted border border-border text-foreground font-black text-sm uppercase tracking-wider rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Server className="w-5 h-5 text-primary" />
            <span>EXPLORE ARCHITECTURE</span>
          </a>
        </div>
      </section>

      {/* High-Level 3-Tier Enterprise Architecture Overview */}
      <section id="architecture" className="py-24 bg-muted/20 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary block mb-2">
              SYSTEM BLUEPRINT
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-foreground mb-4">
              High-Level 3-Tier Quant Architecture
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base font-medium">
              Erebix integrates modern reactive web components with a resilient Java enterprise firewall and a PyTorch quantitative intelligence engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Tier 1: Next.js Frontend */}
            <div className="bg-card p-8 rounded-3xl border border-border shadow-xl relative overflow-hidden group hover:border-primary/60 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-primary block mb-1">
                TIER 1 • PRESENTATION LAYER
              </span>
              <h3 className="text-2xl font-black text-foreground mb-3">
                Next.js 16 Quant Suite
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Built with React 19 Client Components, custom design tokens, 4-theme cyber/hades switching, real-time Recharts visualization, and React Portal-shielded ACID trade execution overlays.
              </p>
            </div>

            {/* Tier 2: Spring Boot Gateway */}
            <div className="bg-card p-8 rounded-3xl border border-border shadow-xl relative overflow-hidden group hover:border-success/60 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-success/10 border border-success/30 flex items-center justify-center text-success mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-success block mb-1">
                TIER 2 • GATEWAY &amp; FIREWALL
              </span>
              <h3 className="text-2xl font-black text-foreground mb-3">
                Java Spring Boot Shield
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Java 18 core microservice running <code>RateLimitInterceptor</code> in-memory token bucket DoS protection, 64-character international ticker search, and SQL injection sanitization—guaranteeing <strong>$0 Free-Tier Cloud Compliance</strong>.
              </p>
            </div>

            {/* Tier 3: Python PyTorch Engine */}
            <div className="bg-card p-8 rounded-3xl border border-border shadow-xl relative overflow-hidden group hover:border-primary/60 transition-all">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/30 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6" />
              </div>
              <span className="text-xs font-black uppercase tracking-wider text-primary block mb-1">
                TIER 3 • INTELLIGENCE LAYER
              </span>
              <h3 className="text-2xl font-black text-foreground mb-3">
                Tri-Model ML Ensemble
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Python ensemble combining XGBoost, Random Forest, and Scikit-Learn MLP Neural Network to compute live technical indicators (RSI, MACD, Bollinger Bands) and directional price forecasts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Feature Breakdown */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-success block mb-2">
            INSTITUTIONAL CAPABILITIES
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-foreground mb-4">
            Platform Features at a Glance
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base font-medium">
            Everything you need to simulate institutional algorithmic trading without risking real capital or exceeding free cloud database tiers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all">
            <TrendingUp className="w-8 h-8 text-primary mb-4" />
            <h4 className="text-lg font-black text-foreground mb-2">Real-Time Asset Profiler</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Instant symbol lookup across NYSE, NASDAQ, and international exchanges with 64-character full company name search matching.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-success/40 transition-all">
            <Wallet className="w-8 h-8 text-success mb-4" />
            <h4 className="text-lg font-black text-foreground mb-2">Portfolio Command Center</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Real-time Net Asset Value valuation, cash vs stock asset allocation progress bars, and Weighted Average Cost Basis accounting.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all">
            <Layers className="w-8 h-8 text-primary mb-4" />
            <h4 className="text-lg font-black text-foreground mb-2">ACID Trade Execution</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Transactional BUY/SELL modal with stepper controls, instant share presets, and cash/share validation against relational databases.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-success/40 transition-all">
            <Lock className="w-8 h-8 text-success mb-4" />
            <h4 className="text-lg font-black text-foreground mb-2">Anti-Bot DoS Firewall</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Token bucket rate-limiter drops spam bursts in memory before establishing database connections, preventing cloud billing spikes.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-primary/40 transition-all">
            <BarChart3 className="w-8 h-8 text-primary mb-4" />
            <h4 className="text-lg font-black text-foreground mb-2">Immutable Audit Log</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Every executed order is permanently logged with timestamps, share quantity, execution price, and transaction type for compliance.
            </p>
          </div>

          {/* Feature 6 - Replaced Theme engine with Tri-Model ML Directional Forecasting */}
          <div className="p-6 rounded-2xl bg-card border border-border hover:border-success/40 transition-all">
            <BrainCircuit className="w-8 h-8 text-success mb-4" />
            <h4 className="text-lg font-black text-foreground mb-2">Tri-Model ML Forecasting</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Ensemble price forecasts (XGBoost + Random Forest + Neural Net) with support/resistance detection, Bollinger Bands, and Sharpe/Sortino risk analytics.
            </p>
          </div>
        </div>
      </section>

      {/* Footer without extra bottom links */}
      <footer className="py-12 border-t border-border/60 text-center bg-muted/10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center gap-4">
          <ShieldCheck className="w-8 h-8 text-success" />
          <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
            <strong>Erebix Quantitative Trading Simulator</strong> • Open-source portfolio demonstration platform. All market quotes, algorithmic indicators, and Tri-Model ML AI forecasts are simulated and intended for educational evaluation.
          </p>
        </div>
      </footer>

      {/* Render React Portal Auth Modal Overlay */}
      {authModalPortal}
    </main>
  );
}
