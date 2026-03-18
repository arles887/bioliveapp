
"use client";

import { Search, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function TopBar({ onAuthClick }: { onAuthClick: () => void }) {
  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl;

  return (
    <header className="absolute top-0 left-0 right-0 z-50 flex h-20 w-full items-center justify-between px-6 bg-[#020503]/40 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-black shadow-[0_0_15px_rgba(204,255,0,0.4)]">
           <Zap size={20} strokeWidth={3} />
        </div>
        <div className="hidden xs:flex flex-col">
            <h1 className="text-lg font-black tracking-tighter text-white uppercase italic leading-none">Bio<span className="text-primary">Live</span></h1>
            <span className="text-[6px] font-black uppercase tracking-[0.3em] text-primary/60 uppercase">Neural Protocol</span>
        </div>
      </div>
      
      {/* Buscador Global Extendido */}
      <div className="flex-1 mx-4 relative group">
        <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
        <input 
          type="text"
          placeholder="BIO-SIGNAL SEARCH..."
          className="w-full h-10 bg-white/5 border border-white/10 rounded-2xl pl-11 pr-4 text-[9px] text-white focus:outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all placeholder:text-white/10 font-black uppercase tracking-[0.2em] italic"
        />
      </div>
      
      <div className="flex items-center shrink-0">
        <Avatar className="h-9 w-9 ring-1 ring-white/10 cursor-pointer hover:ring-primary transition-all shadow-lg" onClick={onAuthClick}>
          <AvatarImage src={avatarImage} />
          <AvatarFallback className="bg-primary/10 text-primary font-black text-[10px]">BIO</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
