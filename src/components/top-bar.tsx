"use client";

import { Search, Zap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

/**
 * @fileOverview Barra superior estandarizada a 500px con soporte Safe-Area.
 * Corregidos truncados de texto.
 */

export function TopBar({ 
  onAuthClick,
  isVisible,
  isLoggedIn 
}: { 
  onAuthClick: () => void;
  isVisible: boolean;
  isLoggedIn: boolean;
}) {
  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl;

  return (
    <header className={cn(
      "fixed top-0 left-1/2 -translate-x-1/2 z-50 flex flex-col w-full max-w-[500px] bg-[#020503]/40 backdrop-blur-xl border-b border-white/5 transition-all duration-700 ease-in-out",
      isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
    )}>
      {/* Zona de Seguridad Status Bar */}
      <div className="h-10 w-full" />
      
      <div className="flex h-16 w-full items-center justify-between px-6 pb-2">
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-black shadow-[0_0_15px_rgba(204,255,0,0.4)]">
             <Zap size={18} strokeWidth={3} />
          </div>
          <div className="hidden xs:flex flex-col min-w-0">
              <h1 className="text-base font-black tracking-tighter text-white uppercase italic leading-none truncate">Bio<span className="text-primary">Live</span></h1>
              <span className="text-[5px] font-black uppercase tracking-[0.3em] text-primary/60 truncate">Neural OS</span>
          </div>
        </div>
        
        <div className="flex-1 mx-4 relative group min-w-0">
          <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="BUSCAR..."
            className="w-full h-9 bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 text-[8px] text-white focus:outline-none focus:border-primary/40 focus:bg-white/[0.08] transition-all placeholder:text-white/10 font-black uppercase tracking-[0.2em] italic truncate"
          />
        </div>
        
        <div className="flex items-center shrink-0">
          <Avatar className="h-8 w-8 ring-1 ring-white/10 cursor-pointer hover:ring-primary transition-all shadow-lg" onClick={onAuthClick}>
            <AvatarImage src={avatarImage || null} />
            <AvatarFallback className="bg-primary/10 text-primary font-black text-[9px]">
              {isLoggedIn ? "BIO" : "LOG"}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
