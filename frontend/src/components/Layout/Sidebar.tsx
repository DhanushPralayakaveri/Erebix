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
    { label: 'Watchlist', href: '/watchlist', icon: <LineChart className="w-5 h-5" /> },
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
    <aside className="w-64 h-screen bg-card border-r border-border flex flex-col transition-colors duration-300 flex-shrink-0 sticky top-0">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center border border-success/50 shadow-[0_0_15px_var(--glow-green)]">
            <span className="text-success font-black text-sm">E</span>
          </div>
          <h1 className="text-xl font-black tracking-widest text-foreground uppercase">
            Erebix
          </h1>
        </Link>
      </div>

      <div className="px-6 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 shadow-sm w-full">
          <Activity className="w-3 h-3 text-primary" />
          <span className="text-primary text-[10px] font-bold uppercase tracking-wider">Engine Online</span>
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
                "flex items-center gap-3 px-4 py-3 rounded-xl cyber:rounded-none cyber:cyber-clip-button font-bold transition-all text-sm cyber:cyber-glitch-hover",
                isActive 
                  ? "bg-success/10 text-success" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
            <div className="absolute bottom-full mb-2 left-0 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left font-semibold">
                <User className="w-4 h-4" /> View Profile
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors text-left font-semibold">
                <CreditCard className="w-4 h-4" /> Billing
              </button>
              <div className="h-px bg-border my-1" />
              <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors text-left font-semibold">
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
          
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={twMerge(
              "w-full p-4 rounded-xl cyber:rounded-none cyber:cyber-clip-button border flex flex-col gap-2 transition-all text-left cyber:cyber-glitch-hover",
              isProfileOpen 
                ? "bg-muted border-border" 
                : "bg-muted/50 border-border hover:bg-muted"
            )}
          >
            <span className="text-xs text-muted-foreground font-bold uppercase flex items-center justify-between">
              Account
              <ChevronUp className={twMerge("w-4 h-4 transition-transform duration-300", isProfileOpen && "rotate-180")} />
            </span>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 shrink-0 shadow-inner" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-bold text-foreground truncate">Demo User</span>
                <span className="text-xs text-muted-foreground opacity-80 truncate">Pro Tier</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
