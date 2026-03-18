"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Play, Heart, MessageCircle, Share2, Eye, Zap, 
  Plus, Flame, Leaf, Wind, Droplets, Target,
  ScanSearch, Award
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ChatPanel } from "./chat-panel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ContentItem {
  id: string;
  type: "live" | "reel";
  title: string;
  user: string;
  userImage?: string;
  thumbnail: string;
  views?: string;
  likes?: string;
  isLive?: boolean;
  ecoImpact: {
    co2: string;
    oxygen: string;
  };
}

export function MainFeed() {
  const [activeLiveId, setActiveLiveId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const feedItems: ContentItem[] = [
    { 
      id: "1", 
      type: "live", 
      title: "AMAZON REWILDING PROTOTYPE", 
      user: "BioGuardian", 
      userImage: PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl,
      thumbnail: PlaceHolderImages.find(img => img.id === 'live-1')?.imageUrl || "https://picsum.photos/seed/bio3/1280/720",
      views: "24.8k",
      isLive: true,
      ecoImpact: { co2: "-450kg", oxygen: "+1.2t" }
    },
    { 
      id: "2", 
      type: "reel", 
      title: "Vertical Forest Design V4", 
      user: "UrbanJungle", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'reel-1')?.imageUrl || "https://picsum.photos/seed/bio1/1080/1920",
      likes: "120k",
      views: "2.5M",
      ecoImpact: { co2: "-12kg", oxygen: "+40kg" }
    },
    { 
      id: "3", 
      type: "reel", 
      title: "Bioluminescent Moss Wall", 
      user: "SynthNature", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'reel-2')?.imageUrl || "https://picsum.photos/seed/bio2/1080/1920",
      likes: "95k",
      views: "800k",
      ecoImpact: { co2: "-5kg", oxygen: "+15kg" }
    }
  ];

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 2000);
  };

  if (activeLiveId) {
    const live = feedItems.find(item => item.id === activeLiveId);
    return (
      <div className="relative h-[calc(100vh-6rem)] w-full bg-black overflow-hidden flex flex-col animate-in fade-in duration-700">
        <div className="relative flex-1">
          <Image 
            src={live?.thumbnail || ""} 
            fill 
            alt="Live Stream" 
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
          
          <div className="absolute top-8 left-8 right-8 flex justify-between items-start z-20">
            <button 
              onClick={() => setActiveLiveId(null)}
              className="glass-emerald p-3 rounded-2xl hover:bg-primary hover:text-black transition-all"
            >
               <Share2 size={20} className="rotate-180" />
            </button>
            <div className="flex flex-col gap-2 items-end">
              <Badge className="bg-primary text-black px-4 py-1.5 rounded-xl font-black text-[10px] tracking-widest animate-pulse">LIVE TRANSMISSION</Badge>
              <div className="glass-emerald px-4 py-1.5 rounded-xl flex items-center gap-2 text-[10px] font-bold">
                <Wind size={12} className="text-primary" /> {live?.ecoImpact.co2} CARBON OFFSET
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-8 z-20 space-y-4">
             <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl border-2 border-primary overflow-hidden relative">
                  <Image src={live?.userImage || "https://picsum.photos/seed/u1/100/100"} fill alt="u" />
                </div>
                <div>
                   <p className="text-xs font-black text-primary uppercase tracking-[0.2em]">@{live?.user}</p>
                   <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">{live?.title}</h2>
                </div>
             </div>
             <div className="flex gap-4">
               <Button onClick={handleScan} disabled={isScanning} className="rounded-2xl bg-white/10 hover:bg-primary hover:text-black text-white h-12 px-6 font-bold text-xs uppercase tracking-widest border border-white/5 transition-all">
                 <ScanSearch size={18} className="mr-2" />
                 {isScanning ? "Identifying..." : "AI ID Species"}
               </Button>
               <Button className="rounded-2xl bg-primary text-black h-12 px-6 font-bold text-xs uppercase tracking-widest bio-glow">
                 <Droplets size={18} className="mr-2" />
                 Water Spore
               </Button>
             </div>
          </div>
        </div>
        
        <div className="h-[45%] border-t border-white/5 bg-[#020805]">
          <ChatPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-6 space-y-10 pb-44 overflow-y-auto no-scrollbar animate-in fade-in duration-1000">
      {/* Top Gamification Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-emerald rounded-3xl p-4 flex flex-col items-center gap-2 border border-primary/20">
           <Award className="text-primary" size={24} />
           <span className="text-[10px] font-black uppercase text-primary">Eco Level 12</span>
        </div>
        <div className="glass-emerald rounded-3xl p-4 flex flex-col items-center gap-2 border border-accent/20">
           <Target className="text-accent" size={24} />
           <span className="text-[10px] font-black uppercase text-accent">5.2k Spores</span>
        </div>
        <div className="glass-emerald rounded-3xl p-4 flex flex-col items-center gap-2 border border-white/5">
           <Flame className="text-orange-500" size={24} />
           <span className="text-[10px] font-black uppercase text-white/40">7 Day Streak</span>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
        <div className="shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
          <div className="w-16 h-16 rounded-[1.8rem] bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all">
            <Plus size={28} />
          </div>
          <span className="text-[8px] font-black uppercase text-primary/60">Upload</span>
        </div>
        {feedItems.map(item => (
          <div key={item.id} className="shrink-0 flex flex-col items-center gap-2 cursor-pointer group">
            <div className="w-16 h-16 rounded-[1.8rem] border-2 border-primary p-0.5 overflow-hidden relative group-hover:scale-110 transition-transform">
              <Image src={item.thumbnail} fill alt="t" className="object-cover" />
            </div>
            <span className="text-[8px] font-black uppercase text-white/30">@{item.user}</span>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">Planetary Pulse</h3>
          <Badge variant="outline" className="border-primary/40 text-primary text-[8px] tracking-[0.2em] font-black uppercase">Realtime Data</Badge>
        </div>

        {feedItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setActiveLiveId(item.id)}
            className="group relative w-full aspect-[16/11] rounded-[2.5rem] overflow-hidden bg-card border border-white/5 transition-all duration-500 hover:border-primary/30"
          >
            <Image 
              src={item.thumbnail} 
              fill 
              alt={item.title} 
              className="object-cover transition-transform duration-[4000ms] group-hover:scale-110 opacity-70 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/20"></div>

            <div className="absolute top-8 left-8 flex gap-2">
              <Badge className={cn(
                "px-4 py-1 rounded-xl text-[9px] font-black tracking-widest uppercase",
                item.isLive ? "bg-primary text-black" : "bg-white/10 text-white"
              )}>
                {item.isLive ? "TRANSMITTING" : "ECO-REEL"}
              </Badge>
            </div>

            <div className="absolute bottom-8 left-8 right-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Leaf className="text-primary" size={16} />
                  <span className="text-[10px] font-black text-primary/70 uppercase tracking-widest italic">@{item.user}</span>
                </div>
                <h3 className="text-3xl font-black italic uppercase leading-none tracking-tighter text-white group-hover:text-primary transition-colors">{item.title}</h3>
                <div className="flex items-center gap-8 pt-4">
                   <div className="flex items-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-widest">
                     <Heart size={14} className="group-hover:text-red-500 transition-colors" /> {item.likes || "LIVE"}
                   </div>
                   <div className="flex items-center gap-2 text-white/40 text-[9px] font-black uppercase tracking-widest">
                     <Wind size={14} className="text-primary" /> {item.ecoImpact.co2}
                   </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
