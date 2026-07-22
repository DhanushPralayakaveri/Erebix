import React from 'react';
import Link from 'next/link';
import { Activity, ShieldCheck, Database, BrainCircuit, LineChart, Code2 } from 'lucide-react';

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0a0c10] text-gray-900 dark:text-gray-200 font-sans selection:bg-green-500/30 selection:text-green-800 dark:selection:text-green-200 transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <span className="text-green-600 dark:text-green-400 font-black text-sm">E</span>
          </div>
          <h1 className="text-xl font-black tracking-widest text-gray-900 dark:text-white uppercase">
            Erebix
          </h1>
        </div>
        <Link href="/dashboard" className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-colors shadow-lg">
          Launch App &rarr;
        </Link>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-32 px-4 text-center max-w-5xl mx-auto relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-500/10 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-bold mb-8 shadow-sm relative z-10">
          <Activity className="w-4 h-4" />
          <span>Open-Source Portfolio Project</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white tracking-tight mb-8 relative z-10 leading-tight">
          Next-Gen Algorithmic <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
            Trading Simulator
          </span>
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed relative z-10">
          Erebix is a risk-free environment designed to test trading strategies against live market data, powered by machine learning quantitative insights.
        </p>

        <div className="flex items-center justify-center gap-6 relative z-10">
          <Link href="/dashboard" className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black rounded-xl hover:scale-105 transition-transform shadow-xl">
            Enter Dashboard
          </Link>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="py-24 bg-gray-50 dark:bg-[#11141a] border-y border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black mb-4 text-gray-900 dark:text-white">How It Works</h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
              Erebix leverages a modern tech stack to deliver real-time data and AI-driven insights directly to the browser.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-[#161a22] p-8 rounded-2xl border border-gray-200 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-transform">
              <Database className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">FastAPI Backend</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A high-performance Python microservice that fetches historical stock data, computes financial indicators (SMA, RSI, MACD), and serves API endpoints instantly.
              </p>
            </div>

            <div className="bg-white dark:bg-[#161a22] p-8 rounded-2xl border border-gray-200 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-transform">
              <BrainCircuit className="w-10 h-10 text-purple-500 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">XGBoost ML Engine</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A custom machine learning model that analyzes price consolidation patterns and moving averages to predict market direction with assigned confidence scores.
              </p>
            </div>

            <div className="bg-white dark:bg-[#161a22] p-8 rounded-2xl border border-gray-200 dark:border-white/5 shadow-xl hover:-translate-y-2 transition-transform">
              <Code2 className="w-10 h-10 text-green-500 mb-6" />
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">Next.js App Router</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                A highly interactive React frontend utilizing Tailwind CSS for dynamic light/dark theming and Recharts for responsive, gamified financial visualization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Disclaimer */}
      <footer className="py-12 border-t border-gray-200 dark:border-white/5 text-center">
        <div className="max-w-4xl mx-auto px-4 flex flex-col items-center gap-4">
          <ShieldCheck className="w-8 h-8 text-gray-400" />
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl">
            <strong>Open Source Disclaimer:</strong> This application is entirely open-source and built for portfolio and demonstration purposes. 
            The market data, financial models, and AI predictions provided by Erebix are simulated and should never be used for actual financial trading or investment decisions.
          </p>
        </div>
      </footer>

    </main>
  );
}
