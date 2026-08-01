"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, LineChart, PieChart, Activity, ChevronUp, LogOut, RefreshCw } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { label: 'Watchlist', href: '/watchlist', icon: <LineChart className="w-5 h-5" /> },
    { label: 'Portfolio', href: '/portfolio', icon: <PieChart className="w-5 h-5" /> },
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

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    router.push('/');
  };

  const handleSwitchProfile = () => {
    setIsProfileOpen(false);
    router.push('/');
  };

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
          <Activity className="w-3 h-3 text-primary animate-pulse" />
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
                  ? "bg-success/10 text-success border border-success/30" 
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
            <div className="absolute bottom-full mb-2 left-0 w-full bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1.5 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="px-4 py-2 border-b border-border/60">
                <span className="text-xs font-black text-foreground block truncate">
                  {user?.username || 'Trader-01'}
                </span>
                <span className="text-[10px] text-muted-foreground block truncate font-medium">
                  {user?.email || 'demo@erebix.quant'}
                </span>
              </div>

              <button 
                onClick={handleSwitchProfile}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-foreground hover:bg-muted transition-colors text-left font-bold"
              >
                <RefreshCw className="w-4 h-4 text-primary" />
                <span>Switch Profile / Auth</span>
              </button>

              <div className="h-px bg-border my-1" />

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-danger hover:bg-danger/10 transition-colors text-left font-bold"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout Session</span>
              </button>
            </div>
          )}
          
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={twMerge(
              "w-full p-4 rounded-xl cyber:rounded-none cyber:cyber-clip-button border flex flex-col gap-2 transition-all text-left cyber:cyber-glitch-hover",
              isProfileOpen 
                ? "bg-muted border-border shadow-md" 
                : "bg-muted/50 border-border hover:bg-muted"
            )}
          >
            <span className="text-xs text-muted-foreground font-bold uppercase flex items-center justify-between">
              Active Session
              <ChevronUp className={twMerge("w-4 h-4 transition-transform duration-300", isProfileOpen && "rotate-180")} />
            </span>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-success shrink-0 shadow-inner flex items-center justify-center text-background font-black text-xs">
                {(user?.username || 'T').charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-black text-foreground truncate">
                  {user?.username || 'Trader-01'}
                </span>
                <span className="text-[11px] text-primary font-bold truncate">
                  {user ? 'Institutional Mode' : 'Demo Mode'}
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
