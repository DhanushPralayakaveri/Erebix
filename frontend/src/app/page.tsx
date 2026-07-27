import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Database, BrainCircuit, LineChart, Code2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 selection:text-primary transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center border border-success/50 shadow-[0_0_15px_var(--glow-green)]">
            <span className="text-success font-black text-sm">E</span>
          </div>
          <h1 className="text-xl font-black tracking-widest text-foreground uppercase">
            Erebix
          </h1>
        </div>
        <Link href="/dashboard" className="px-6 py-2 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full transition-colors shadow-lg">
          Launch App &rarr;
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 text-center max-w-5xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-success/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold mb-8 shadow-sm relative z-10">
          <Activity className="w-4 h-4" />
          <span>Open-Source Portfolio Project</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-foreground tracking-tight mb-8 relative z-10 leading-tight">
          Next-Gen Algorithmic <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-success to-primary">
            Trading Simulator
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed relative z-10">
          Erebix is a risk-free environment designed to test trading strategies against live market data, powered by machine learning quantitative insights.
        </p>

        <div className="flex items-center justify-center gap-6 relative z-10">
          <Link href="/dashboard" className="px-8 py-4 bg-foreground text-background font-black rounded-xl hover:scale-105 transition-transform shadow-xl">
            Enter Dashboard
          </Link>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 bg-muted/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-foreground">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Erebix leverages a modern tech stack to deliver real-time data and AI-driven insights directly to the browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-xl hover:-translate-y-2 transition-transform">
              <Database className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-3 text-foreground">FastAPI Backend</h3>
              <p className="text-muted-foreground leading-relaxed">
                A high-performance Python microservice that fetches historical stock data, computes financial indicators (SMA, RSI, MACD), and serves API endpoints instantly.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-xl hover:-translate-y-2 transition-transform">
              <BrainCircuit className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-3 text-foreground">XGBoost ML Engine</h3>
              <p className="text-muted-foreground leading-relaxed">
                A custom machine learning model that analyzes price consolidation patterns and moving averages to predict market direction with assigned confidence scores.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-xl hover:-translate-y-2 transition-transform">
              <Code2 className="w-10 h-10 text-primary mb-6" />
              <h3 className="text-xl font-bold mb-3 text-foreground">Next.js App Router</h3>
              <p className="text-muted-foreground leading-relaxed">
                A highly interactive React frontend utilizing Tailwind CSS for dynamic light/dark theming and Recharts for responsive, gamified financial visualization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Disclaimer */}
      <footer className="py-12 border-t border-border text-center">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4">
          <ShieldCheck className="w-8 h-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
            <strong>Open Source Disclaimer:</strong> This application is entirely open-source and built for portfolio and demonstration purposes. 
            The market data, financial models, and AI predictions provided by Erebix are simulated and should never be used for actual financial trading or investment decisions.
          </p>
        </div>
      </footer>

    </main>
  );
}
