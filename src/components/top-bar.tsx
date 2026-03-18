"use client";

import { Search, Bell, Zap, Droplet, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function TopBar({ onAuthClick }: { onAuthClick: () => void }) {
  const [isLoggedIn] = useState(false);
  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl;

  return (
    <header className="sticky top-0 z-50 flex h-28 w-full items-center justify-between px-8 bg-background/80 backdrop-blur-3xl border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black bio-glow animate-pulse">
           <Globe size={24} strokeWidth={3} />
        </div>
        <div>
            <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic leading-none">Bio<span className="text-primary">Live</span></h1>
            <div className="flex items-center gap-2 mt-1">
               <div className="h-1 w-6 bg-primary/40 rounded-full"></div>
               <span className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/40">Ecosystem v3.0</span>
            </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex glass-emerald rounded-2xl px-4 h-11 items-center gap-3 mr-4 border border-primary/20">
           <Droplet size={14} className="text-primary" />
           <span className="text-[10px] font-black text-primary">820ml Contributed</span>
        </div>
        
        <Button variant="ghost" size="icon" className="h-11 w-11 text-white/20 hover:text-primary transition-all rounded-xl hover:bg-white/5">
          <Search size={22} />
        </Button>
        <Button variant="ghost" size="icon" className="h-11 w-11 text-white/20 hover:text-primary transition-all rounded-xl hover:bg-white/5 relative">
          <Bell size={22} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
        </Button>
        
        {isLoggedIn ? (
          <Avatar className="h-11 w-11 ring-2 ring-primary/30 ml-2 hover:ring-primary cursor-pointer transition-all">
            <AvatarImage src={avatarImage} />
            <AvatarFallback className="bg-primary/10 text-primary font-black">BIO</AvatarFallback>
          </Avatar>
        ) : (
          <Button 
            onClick={onAuthClick} 
            className="rounded-xl bg-primary text-black font-black px-6 h-11 ml-2 bio-glow hover:scale-105 active:scale-95 transition-all text-[11px] uppercase tracking-widest italic"
          >
            Connect
          </Button>
        )}
      </div>
    </header>
  );
}
