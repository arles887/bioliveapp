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
    { id: "home", icon: Home, label: "Feed" },
    { id: "reels", icon: Play, label: "Reels" },
    { id: "upload", icon: Plus, label: "Create", isSpecial: true },
    { id: "lives", icon: Radio, label: "Live" },
    { id: "profile", icon: User, label: "Bio" },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full px-4 pb-6 z-50 pointer-events-none">
      <nav className="max-w-md mx-auto h-20 glass-effect rounded-[2.5rem] border flex items-center justify-around px-6 pointer-events-auto organic-shadow shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavItem)}
                className="relative -top-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-xl shadow-primary/40 transition-all hover:scale-110 active:scale-95"
              >
                <Icon size={28} strokeWidth={3} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavItem)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all duration-300",
                isActive ? "text-primary scale-110" : "text-neutral-400 hover:text-neutral-600"
              )}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className={cn(
                "text-[10px] font-bold tracking-tight uppercase",
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