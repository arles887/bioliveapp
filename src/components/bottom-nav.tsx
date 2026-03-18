"use client";

import { Home, Compass, Plus, Map, User } from "lucide-react";
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
    { id: "home", icon: Home, label: "Core" },
    { id: "explore", icon: Compass, label: "Eco-Net" },
    { id: "upload", icon: Plus, isSpecial: true },
    { id: "lives", icon: Map, label: "Biome" },
    { id: "profile", icon: User, label: "Entity" },
  ];

  return (
    <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-[360px] z-[100]">
      <nav className="h-20 glass-panel rounded-[2.5rem] flex items-center justify-around px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavItem)}
                className="relative h-14 w-14 flex items-center justify-center rounded-2xl bg-primary text-black shadow-[0_0_30px_rgba(204,255,0,0.5)] transition-all hover:scale-110 active:scale-95 z-20"
              >
                <Icon size={28} strokeWidth={4} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavItem)}
              className={cn(
                "flex flex-col items-center justify-center gap-1.5 transition-all w-12",
                isActive ? "text-primary" : "text-white/20 hover:text-white/40"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 3 : 2} />
              <span className={cn(
                "text-[7px] font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap",
                isActive ? "opacity-100" : "opacity-0"
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