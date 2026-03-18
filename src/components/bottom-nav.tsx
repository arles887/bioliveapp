
"use client";

import { Home, Play, Plus, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = "home" | "reels" | "upload" | "chat" | "profile";

export function BottomNav({ 
  activeTab, 
  setActiveTab 
}: { 
  activeTab: NavItem; 
  setActiveTab: (tab: NavItem) => void;
}) {
  const navItems = [
    { id: "home", icon: Home, label: "Live" },
    { id: "reels", icon: Play, label: "Reels" },
    { id: "upload", icon: Plus, isSpecial: true },
    { id: "chat", icon: MessageSquare, label: "Chat" },
    { id: "profile", icon: User, label: "Me" },
  ];

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[340px] z-[100]">
      <nav className="h-16 glass-panel rounded-[2rem] flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as NavItem)}
                className="relative h-12 w-12 flex items-center justify-center rounded-2xl bg-primary text-black shadow-[0_0_20px_rgba(204,255,0,0.3)] transition-all hover:scale-110 active:scale-95 z-20"
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
                "flex flex-col items-center justify-center gap-1 transition-all w-12",
                isActive ? "text-primary scale-110" : "text-white/20 hover:text-white/40"
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 3 : 2} />
              <span className={cn(
                "text-[7px] font-black tracking-widest uppercase transition-all",
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
