"use client";

import React from 'react';
import { Topbar } from '@/components/Layout/Topbar';

export default function SettingsPage() {
  return (
    <>
      <Topbar />
      <div className="p-8 max-w-6xl mx-auto w-full">
        <div className="bg-white dark:bg-[#161a22] rounded-2xl border border-gray-200 dark:border-white/5 p-12 text-center shadow-xl">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">User preferences and account settings will be available here.</p>
        </div>
      </div>
    </>
  );
}
