"use client";

import { Search, Bell, Zap, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function TopBar({ onAuthClick }: { onAuthClick: () => void }) {
  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl;

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex h-20 w-full items-center justify-between px-6 bg-[#020503]/40 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black shadow-[0_0_15px_rgba(204,255,0,0.4)]">
           <Zap size={20} strokeWidth={3} />
        </div>
        <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">Bio<span className="text-primary">Live</span></h1>
            <span className="text-[7px] font-black uppercase tracking-[0.3em] text-primary/60">Neural Node 0.4.2</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
          <Cpu size={12} className="text-primary" />
          <span className="text-[9px] font-bold text-white/70 tracking-widest uppercase">98.2 TPS</span>
        </div>
        
        <Button variant="ghost" size="icon" className="h-9 w-9 text-white/30 hover:text-primary transition-all">
          <Search size={18} />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9 text-white/30 hover:text-primary transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-primary rounded-full"></span>
        </Button>
        
        <Avatar className="h-9 w-9 ring-1 ring-white/10 ml-2 cursor-pointer hover:ring-primary transition-all" onClick={onAuthClick}>
          <AvatarImage src={avatarImage} />
          <AvatarFallback className="bg-primary/10 text-primary font-black text-[10px]">BIO</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
