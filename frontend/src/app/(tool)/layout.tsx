import React from 'react';
import { Sidebar } from '@/components/Layout/Sidebar';

export default function ToolLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0a0c10] overflow-hidden transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
