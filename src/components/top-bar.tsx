
"use client";

import { Search, User, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useState } from "react";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export function TopBar({ onAuthClick }: { onAuthClick: () => void }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const avatarImage = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl;

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between gap-4 border-b bg-background/80 px-4 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <h1 className="font-headline text-xl font-bold text-primary">BioLive</h1>
      </div>
      
      <div className="relative flex flex-1 items-center max-w-md">
        <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
        <Input 
          className="pl-9 bg-secondary/50 border-none rounded-full h-9 focus-visible:ring-primary" 
          placeholder="Search creators, lives..." 
        />
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 flex h-2 w-2 rounded-full bg-primary"></span>
        </Button>
        
        {isLoggedIn ? (
          <Avatar className="h-9 w-9 border-2 border-primary">
            <AvatarImage src={avatarImage} />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
        ) : (
          <Button 
            onClick={onAuthClick} 
            size="sm" 
            variant="default"
            className="rounded-full bg-primary hover:bg-primary/90"
          >
            Join
          </Button>
        )}
      </div>
    </header>
  );
}
