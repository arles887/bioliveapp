"use client";

import { Search, Bell, Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function TopBar({ onAuthClick }: { onAuthClick: () => void }) {
  const [isLoggedIn] = useState(false);
  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl;

  return (
    <header className="sticky top-0 z-50 flex h-20 w-full items-center justify-between gap-4 bg-white/80 px-6 backdrop-blur-xl border-b border-neutral-100">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-xl flex items-center justify-center text-white">
           <Menu size={18} />
        </div>
        <h1 className="text-xl font-black tracking-tighter text-primary uppercase">Bio<span className="text-accent">Live</span></h1>
      </div>
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-primary transition-colors">
          <Search size={22} />
        </Button>
        <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-primary transition-colors relative">
          <Bell size={22} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-accent rounded-full border-2 border-white"></span>
        </Button>
        
        {isLoggedIn ? (
          <Avatar className="h-9 w-9 ring-2 ring-primary/10">
            <AvatarImage src={avatarImage} />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        ) : (
          <Button 
            onClick={onAuthClick} 
            size="sm" 
            className="rounded-full bg-primary text-white font-bold px-6 h-9 shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
          >
            Join
          </Button>
        )}
      </div>
    </header>
  );
}