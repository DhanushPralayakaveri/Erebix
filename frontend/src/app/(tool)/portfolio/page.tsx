"use client";

import React from 'react';
import { Topbar } from '@/components/Layout/Topbar';

export default function PortfolioPage() {
  return (
    <>
      <Topbar />
      <div className="p-8 max-w-6xl mx-auto w-full">
        <div className="bg-card rounded-2xl border border-border p-12 text-center shadow-xl">
          <h2 className="text-3xl font-black text-foreground mb-4">Portfolio</h2>
          <p className="text-muted-foreground">Your simulated portfolio holdings will appear here.</p>
        </div>
      </div>
    </>
  );
}
