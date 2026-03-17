"use client";

import { Home, Radio, Plus, Play, User } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = "home" | "reels" | "upload" | "lives" | "profile";

export function BottomNav({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: NavItem; 
  setActiveTab: (tab: NavItem) => void;
}) {
  const navItems = [
    { id: "home", icon: Home, label: "Eco" },
    { id: "reels", icon: Play, label: "Reels" },
    { id: "upload", icon: Plus, label: "Create", isSpecial: true },
    { id: "lives", icon: Radio, label: "Live" },
    { id: "profile", icon: User, label: "Bio" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full px-6 pb-8 z-50 pointer-events-none">
      <nav className="max-w-md mx-auto h-22 glass-dark rounded-[3rem] border border-white/10 flex items-center justify-around px-4 pointer-events-auto shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavItem)}
                className="relative -top-4 flex h-16 w-16 items-center justify-center rounded-[2rem] bg-primary text-black shadow-[0_10px_30px_rgba(204,255,0,0.4)] transition-all hover:scale-110 active:scale-90"
              >
                <Icon size={32} strokeWidth={3} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavItem)}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-white/30 hover:text-white/60"
              )}
            >
              <div className={cn(
                "p-2 rounded-2xl transition-all",
                isActive && "bg-primary/10 shadow-[0_0_20px_rgba(204,255,0,0.1)]"
              )}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[9px] font-black tracking-[0.2em] uppercase transition-all",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
              )}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}