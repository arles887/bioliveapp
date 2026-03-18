
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
      "absolute bottom-8 left-0 right-0 px-8 z-[60] transition-all duration-700 ease-in-out",
      isVisible ? "translate-y-0 opacity-100" : "translate-y-32 opacity-0"
    )}>
      {/* Barra ultra-transparente con desenfoque extremo */}
      <nav className="h-16 bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] flex items-center justify-between px-6 border border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavItem)}
                className="relative h-12 w-12 flex items-center justify-center rounded-2xl bg-primary text-black shadow-[0_0_30px_rgba(204,255,0,0.4)] transition-all hover:scale-110 active:scale-95"
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
                "flex flex-col items-center justify-center gap-1 transition-all outline-none",
                isActive ? "text-primary scale-110" : "text-white/30 hover:text-white/60"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 3 : 2} />
              <span className={cn(
                "text-[7px] font-black tracking-[0.2em] uppercase",
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
