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
    <header className="sticky top-0 z-50 flex h-32 w-full items-center justify-between px-10 bg-black/50 backdrop-blur-3xl border-b border-white/5">
      <div className="flex items-center gap-5">
        <div className="w-14 h-14 bg-primary rounded-[1.8rem] flex items-center justify-center text-black shadow-[0_0_40px_rgba(204,255,0,0.5)] animate-pulse-gentle">
           <Zap size={28} fill="black" strokeWidth={3} />
        </div>
        <div className="flex flex-col -gap-1">
            <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">Bio<span className="text-primary">Live</span></h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="h-1 w-8 bg-primary/40 rounded-full"></span>
               <span className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/40 italic">v2.0 CYBER</span>
            </div>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="h-14 w-14 text-white/20 hover:text-primary transition-all rounded-[1.5rem] hover:bg-white/5 group">
          <Search size={28} className="group-hover:scale-110 transition-transform" />
        </Button>
        <Button variant="ghost" size="icon" className="h-14 w-14 text-white/20 hover:text-primary transition-all rounded-[1.5rem] hover:bg-white/5 relative group">
          <Bell size={28} className="group-hover:scale-110 transition-transform" />
          <span className="absolute top-4 right-4 w-3 h-3 bg-primary rounded-full shadow-[0_0_15px_rgba(204,255,0,1)] border-2 border-black"></span>
        </Button>
        
        {isLoggedIn ? (
          <Avatar className="h-14 w-14 ring-2 ring-primary/30 ml-4 transition-all hover:ring-primary cursor-pointer">
            <AvatarImage src={avatarImage} />
            <AvatarFallback className="bg-primary/10 text-primary font-black italic">BIO</AvatarFallback>
          </Avatar>
        ) : (
          <Button 
            onClick={onAuthClick} 
            className="rounded-[1.5rem] bg-primary text-black font-black px-10 h-14 ml-4 shadow-[0_0_30px_rgba(204,255,0,0.4)] hover:scale-105 active:scale-95 transition-all text-[12px] uppercase tracking-widest italic"
          >
            Access
          </Button>
        )}
      </div>
    </header>
  );
}