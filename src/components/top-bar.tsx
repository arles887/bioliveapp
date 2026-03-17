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
    <header className="sticky top-0 z-50 flex h-24 w-full items-center justify-between px-8 bg-black/50 backdrop-blur-2xl border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(204,255,0,0.5)] animate-pulse">
           <Zap size={20} fill="black" />
        </div>
        <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">Bio<span className="text-primary">Live</span></h1>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="text-white/40 hover:text-primary transition-colors">
          <Search size={22} />
        </Button>
        <Button variant="ghost" size="icon" className="text-white/40 hover:text-primary transition-colors relative">
          <Bell size={22} />
          <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full animate-ping"></span>
        </Button>
        
        {isLoggedIn ? (
          <Avatar className="h-10 w-10 ring-2 ring-primary/20 ml-2">
            <AvatarImage src={avatarImage} />
            <AvatarFallback>BIO</AvatarFallback>
          </Avatar>
        ) : (
          <Button 
            onClick={onAuthClick} 
            className="rounded-full bg-primary text-black font-black px-6 h-10 ml-2 shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:scale-105 transition-all text-xs uppercase tracking-tighter"
          >
            Join
          </Button>
        )}
      </div>
    </header>
  );
}