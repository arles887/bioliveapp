
"use client";

import { Home, Radio, PlusSquare, Play, Bell, User } from "lucide-react";
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
    { id: "home", icon: Home, label: "Home" },
    { id: "reels", icon: Play, label: "Reels" },
    { id: "upload", icon: PlusSquare, label: "Post", isSpecial: true },
    { id: "lives", icon: Radio, label: "Live" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t bg-background px-2 pb-safe">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id as NavItem)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-colors",
              item.isSpecial ? "mb-6" : "",
              activeTab === item.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={cn(
              "flex h-10 w-10 items-center justify-center rounded-2xl transition-all duration-300",
              item.isSpecial ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110" : "",
              activeTab === item.id && !item.isSpecial ? "bg-primary/10" : ""
            )}>
              <Icon size={item.isSpecial ? 24 : 22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            </div>
            {!item.isSpecial && <span className="text-[10px] font-medium">{item.label}</span>}
          </button>
        );
      })}
    </nav>
  );
}
