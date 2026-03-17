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
    { id: "home", icon: Home, label: "Core" },
    { id: "reels", icon: Play, label: "Feed" },
    { id: "upload", icon: Plus, label: "Trans", isSpecial: true },
    { id: "lives", icon: Radio, label: "Live" },
    { id: "profile", icon: User, label: "Bio" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full px-8 pb-10 z-50 pointer-events-none">
      <nav className="max-w-md mx-auto h-24 glass-dark rounded-[3rem] border border-white/10 flex items-center justify-around px-6 pointer-events-auto shadow-[0_30px_70px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavItem)}
                className="relative -top-6 flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-primary text-black shadow-[0_0_40px_rgba(204,255,0,0.6)] transition-all hover:scale-110 active:scale-90 animate-float"
              >
                <Icon size={38} strokeWidth={3} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavItem)}
              className={cn(
                "flex flex-col items-center justify-center gap-2 transition-all duration-500",
                isActive ? "text-primary scale-110" : "text-white/20 hover:text-white/50"
              )}
            >
              <div className={cn(
                "p-3 rounded-2xl transition-all",
                isActive && "bg-primary/10 shadow-[0_0_30px_rgba(204,255,0,0.15)]"
              )}>
                <Icon size={26} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                "text-[9px] font-black tracking-[0.3em] uppercase transition-all duration-500 italic",
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