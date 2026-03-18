
"use client";

import { Home, Play, Plus, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = "home" | "reels" | "upload" | "chat" | "profile";

export function BottomNav({ 
  activeTab, 
  setActiveTab,
  isVisible
}: { 
  activeTab: NavItem; 
  setActiveTab: (tab: NavItem) => void;
  isVisible: boolean;
}) {
  const navItems = [
    { id: "home", icon: Home, label: "Live" },
    { id: "reels", icon: Play, label: "Reels" },
    { id: "upload", icon: Plus, isSpecial: true },
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "profile", icon: User, label: "Perfil" },
  ];

  return (
    <div className={cn(
      "absolute bottom-6 left-0 right-0 px-6 z-[60] transition-all duration-500 ease-in-out",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0"
    )}>
      <nav className="h-16 glass-panel rounded-full flex items-center justify-between px-4 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavItem)}
                className="relative h-12 w-12 flex items-center justify-center rounded-full bg-primary text-black shadow-[0_0_25px_rgba(204,255,0,0.5)] transition-all hover:scale-110 active:scale-90"
              >
                <Icon size={24} strokeWidth={3} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as NavItem)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-all px-2 outline-none",
                isActive ? "text-primary scale-105" : "text-white/20 hover:text-white/40"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 3 : 2} />
              <span className={cn(
                "text-[7px] font-black tracking-widest uppercase",
                isActive ? "opacity-100" : "hidden"
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
