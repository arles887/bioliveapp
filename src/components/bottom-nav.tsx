"use client";

import { Home, Compass, Plus, Radio, User, Map } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = "home" | "explore" | "upload" | "lives" | "profile";

export function BottomNav({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: NavItem; 
  setActiveTab: (tab: NavItem) => void;
}) {
  const navItems = [
    { id: "home", icon: Home, label: "Eco-Core" },
    { id: "explore", icon: Compass, label: "Explore" },
    { id: "upload", icon: Plus, isSpecial: true },
    { id: "lives", icon: Map, label: "Bio-Map" },
    { id: "profile", icon: User, label: "Identity" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full px-8 pb-10 z-50 pointer-events-none">
      <nav className="max-w-md mx-auto h-24 glass-emerald rounded-[3rem] border border-white/5 flex items-center justify-around px-6 pointer-events-auto shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavItem)}
                className="relative -top-10 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary text-black bio-glow transition-all hover:scale-110 active:scale-90 shadow-2xl"
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
                isActive ? "text-primary scale-110" : "text-white/20 hover:text-white/40"
              )}
            >
              <div className={cn(
                "p-3 rounded-2xl transition-all duration-300",
                isActive && "bg-primary/10"
              )}>
                <Icon size={24} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className={cn(
                "text-[8px] font-black tracking-widest uppercase transition-all duration-500 italic",
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
