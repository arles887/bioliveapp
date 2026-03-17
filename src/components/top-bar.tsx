"use client";

import { Search, Bell, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function TopBar({ onAuthClick }: { onAuthClick: () => void }) {
  const [isLoggedIn] = useState(false);
  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl;

  return (
    <header className="sticky top-0 z-50 flex h-28 w-full items-center justify-between px-10 bg-black/40 backdrop-blur-3xl border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary rounded-[1.5rem] flex items-center justify-center text-black shadow-[0_0_30px_rgba(204,255,0,0.6)] animate-pulse-gentle">
           <Zap size={24} fill="black" strokeWidth={3} />
        </div>
        <div className="flex flex-col -gap-1">
            <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic leading-none">Bio<span className="text-primary">Live</span></h1>
            <span className="text-[9px] font-black uppercase tracking-[0.5em] text-primary/40 ml-1">v.2.0 Cyber</span>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="h-12 w-12 text-white/30 hover:text-primary transition-all rounded-[1.2rem] hover:bg-white/5">
          <Search size={24} />
        </Button>
        <Button variant="ghost" size="icon" className="h-12 w-12 text-white/30 hover:text-primary transition-all rounded-[1.2rem] hover:bg-white/5 relative">
          <Bell size={24} />
          <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(204,255,0,1)]"></span>
        </Button>
        
        {isLoggedIn ? (
          <Avatar className="h-12 w-12 ring-2 ring-primary/30 ml-3 transition-all hover:ring-primary">
            <AvatarImage src={avatarImage} />
            <AvatarFallback className="bg-primary/10 text-primary font-black">BIO</AvatarFallback>
          </Avatar>
        ) : (
          <Button 
            onClick={onAuthClick} 
            className="rounded-[1.2rem] bg-primary text-black font-black px-8 h-12 ml-3 shadow-[0_0_25px_rgba(204,255,0,0.4)] hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-widest italic"
          >
            Access
          </Button>
        )}
      </div>
    </header>
  );
}