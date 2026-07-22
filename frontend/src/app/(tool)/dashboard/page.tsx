"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { Topbar } from '@/components/Layout/Topbar';
import { PopularStocks } from '@/components/Dashboard/PopularStocks';

export default function DashboardPage() {
  const router = useRouter();

  const handleSelectTicker = (symbol: string) => {
    router.push(`/stock/${symbol}`);
  };

  return (
    <>
      <Topbar />
      <div className="p-8 max-w-6xl mx-auto w-full">
        <PopularStocks onSelect={handleSelectTicker} />
      </div>
    </>
  );
}
