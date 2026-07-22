"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, LineChart, PieChart, Settings, Activity, ChevronUp, User, CreditCard, LogOut } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { label: 'Watchlist', href: '/dashboard', icon: <LineChart className="w-5 h-5" /> },
    { label: 'Portfolio', href: '/portfolio', icon: <PieChart className="w-5 h-5" /> },
    { label: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <aside className="w-64 h-screen bg-white dark:bg-[#0a0c10] border-r border-gray-200 dark:border-white/5 flex flex-col transition-colors duration-300 flex-shrink-0 sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center border border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            <span className="text-green-600 dark:text-green-400 font-black text-sm">E</span>
          </div>
          <h1 className="text-xl font-black tracking-widest text-gray-900 dark:text-white uppercase">
            Erebix
          </h1>
        </Link>
      </div>

      <div className="px-6 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 shadow-sm w-full">
          <Activity className="w-3 h-3 text-blue-600 dark:text-blue-400" />
          <span className="text-blue-600 dark:text-blue-400 text-[10px] font-bold uppercase tracking-wider">Engine Online</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith('/stock') && item.href === '/dashboard');
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={twMerge(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all text-sm",
                isActive 
                  ? "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400" 
                  : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 mt-auto">
        <div className="relative" ref={profileRef}>
          {isProfileOpen && (
            <div className="absolute bottom-full mb-2 left-0 w-full bg-white dark:bg-[#161a22] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left font-semibold">
                <User className="w-4 h-4" /> View Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left font-semibold">
                <CreditCard className="w-4 h-4" /> Billing
              </button>
              <div className="h-px bg-gray-200 dark:bg-white/10 my-1" />
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-left font-semibold">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
          
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={twMerge(
              "w-full p-4 rounded-xl border flex flex-col gap-2 transition-all text-left",
              isProfileOpen 
                ? "bg-gray-100 dark:bg-white/10 border-gray-300 dark:border-white/20" 
                : "bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-white/5 hover:bg-gray-100 dark:hover:bg-white/10 hover:border-gray-300 dark:hover:border-white/10"
            )}
          >
            <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase flex items-center justify-between">
              Account
              <ChevronUp className={twMerge("w-4 h-4 transition-transform duration-300", isProfileOpen && "rotate-180")} />
            </span>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 shrink-0 shadow-inner" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-gray-900 dark:text-white truncate">Demo User</span>
                <span className="text-xs text-gray-500 truncate">Pro Tier</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
