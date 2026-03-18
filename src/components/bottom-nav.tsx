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
    <div className="fixed bottom-0 left-0 w-full px-10 pb-12 z-50 pointer-events-none">
      <nav className="max-w-md mx-auto h-26 glass-dark rounded-[3.5rem] border border-white/10 flex items-center justify-around px-8 pointer-events-auto shadow-[0_40px_100px_rgba(0,0,0,0.9)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavItem)}
                className="relative -top-8 flex h-22 w-22 items-center justify-center rounded-[2.8rem] bg-primary text-black shadow-[0_0_50px_rgba(204,255,0,0.6)] transition-all hover:scale-110 active:scale-90 animate-float neon-glow"
              >
                <Icon size={42} strokeWidth={3} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavItem)}
              className={cn(
                "flex flex-col items-center justify-center gap-3 transition-all duration-700",
                isActive ? "text-primary scale-115" : "text-white/20 hover:text-white/50"
              )}
            >
              <div className={cn(
                "p-4 rounded-[1.8rem] transition-all duration-500",
                isActive && "bg-primary/10 shadow-[0_0_40px_rgba(204,255,0,0.2)]"
              )}>
                <Icon size={28} strokeWidth={isActive ? 3 : 2} />
              </div>
              <span className={cn(
                "text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-700 italic",
                isActive ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-3"
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