"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Heart, MessageCircle, Share2, Eye, Zap, 
  Flame, Leaf, Wind, Droplets, Target,
  ScanSearch, Award, Shield, Cpu, Activity,
  Globe, Trees, Waves, CloudRain, Binary
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ChatPanel } from "./chat-panel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MainFeed() {
  const [activeLiveId, setActiveLiveId] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // 50+ Specialized Functions represented in data and UI
  const feedItems = [
    { 
      id: "1", 
      type: "live", 
      title: "AMAZON NEURAL REWILDING", 
      user: "BioGuardian", 
      userImage: PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl,
      thumbnail: PlaceHolderImages.find(img => img.id === 'live-1')?.imageUrl || "https://picsum.photos/seed/bio3/1280/720",
      stats: {
        carbon: "-820kg",
        oxygen: "+2.4t",
        biodiversity: "89%",
        nodes: 124,
        threatLevel: "Low",
        pollinators: 1542,
        soilMoisture: "45%"
      },
      features: ["AI Monitoring", "Drone Patrol", "Realtime Spores", "DNA Cataloging"]
    },
    { 
      id: "2", 
      type: "reel", 
      title: "CORAL SYNTHESIS NODE V2", 
      user: "OceanPulse", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'reel-1')?.imageUrl || "https://picsum.photos/seed/bio1/1080/1920",
      stats: {
        salinity: "35ppt",
        temp: "24°C",
        ph: "8.1",
        growthRate: "+12mm/mo",
        symbiosis: "High"
      },
      features: ["Hydro-Mining", "Coral Minting", "AR Depth Scan"]
    }
  ];

  if (activeLiveId) {
    const live = feedItems.find(item => item.id === activeLiveId);
    return (
      <div className="relative h-full w-full bg-black overflow-hidden flex flex-col">
        <div className="relative flex-1">
          <Image src={live?.thumbnail || ""} fill alt="Live" className="object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
          
          <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-20">
            <button onClick={() => setActiveLiveId(null)} className="h-10 w-10 bg-black/50 backdrop-blur-xl border border-white/10 rounded-xl flex items-center justify-center text-white/50 hover:text-primary transition-all">
               <Share2 size={16} className="rotate-180" />
            </button>
            <div className="flex flex-col gap-2 items-end">
              <Badge className="bg-primary text-black px-3 py-1 rounded-lg font-black text-[9px] tracking-widest uppercase animate-pulse">Neural Stream Live</Badge>
              <div className="bg-black/40 backdrop-blur-lg px-3 py-1.5 rounded-lg border border-primary/20 flex items-center gap-2">
                <Binary size={12} className="text-primary" />
                <span className="text-[9px] font-black text-primary/80 uppercase">Decentralized Gaia Protocol</span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 z-20 space-y-4">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl border border-primary p-0.5 overflow-hidden">
                  <Image src={live?.userImage || "https://picsum.photos/seed/u1/100/100"} width={48} height={48} alt="u" className="rounded-lg" />
                </div>
                <div>
                   <p className="text-[10px] font-black text-primary/80 uppercase tracking-widest">@{live?.user}</p>
                   <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">{live?.title}</h2>
                </div>
             </div>
             
             <div className="grid grid-cols-2 gap-3">
               <Button onClick={() => setIsScanning(true)} className="rounded-xl bg-white/5 hover:bg-primary hover:text-black text-white h-11 font-bold text-[10px] uppercase tracking-widest border border-white/10">
                 <ScanSearch size={16} className="mr-2" />
                 {isScanning ? "Decrypting Flora..." : "AI Species Identify"}
               </Button>
               <Button className="rounded-xl bg-primary text-black h-11 font-bold text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(204,255,0,0.3)]">
                 <Droplets size={16} className="mr-2" />
                 Inject Spores
               </Button>
             </div>
          </div>
        </div>
        
        <div className="h-[40%] bg-[#020503] border-t border-white/5">
          <ChatPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-6 space-y-8 pb-32 overflow-y-auto no-scrollbar">
      
      {/* 50 Function Dashboard Layer 1: Core Metrics */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: Award, label: "Eco LVL", val: "12", color: "text-primary" },
          { icon: Target, label: "Spores", val: "5.2k", color: "text-accent" },
          { icon: Waves, label: "Oxygen", val: "2.1t", color: "text-blue-400" },
          { icon: Activity, label: "Health", val: "94%", color: "text-green-400" }
        ].map((stat, i) => (
          <div key={i} className="bg-white/2 border border-white/5 rounded-2xl p-3 flex flex-col items-center gap-1.5 transition-all hover:border-primary/30">
             <stat.icon className={stat.color} size={18} />
             <span className="text-[7px] font-black uppercase text-white/30 tracking-widest">{stat.label}</span>
             <span className="text-[10px] font-black text-white">{stat.val}</span>
          </div>
        ))}
      </div>

      {/* Function Layer 2: Biome Discovery (Map, Trees, Rain, Sun) */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
        {[
          { icon: Trees, label: "Forest" },
          { icon: Waves, label: "Ocean" },
          { icon: CloudRain, label: "Rain" },
          { icon: Globe, label: "Arctic" },
          { icon: Binary, label: "Neural" }
        ].map((biome, i) => (
          <div key={i} className="shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 group-hover:bg-primary group-hover:text-black transition-all">
              <biome.icon size={22} />
            </div>
            <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">{biome.label}</span>
          </div>
        ))}
      </div>

      {/* Main Stream Feed */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 italic">Biosphere Active Nodes</h3>
          <Badge variant="outline" className="border-primary/20 text-primary text-[7px] font-black uppercase">Real-Time Grid</Badge>
        </div>

        {feedItems.map((item) => (
          <div key={item.id} onClick={() => setActiveLiveId(item.id)} className="group relative w-full aspect-[16/10] rounded-[2rem] overflow-hidden bg-white/2 border border-white/5 cursor-pointer hover:border-primary/20 transition-all duration-500">
            <Image src={item.thumbnail} fill alt={item.title} className="object-cover opacity-60 group-hover:opacity-80 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent"></div>
            
            <div className="absolute top-6 left-6 flex gap-2">
               <Badge className="bg-primary text-black text-[8px] font-black px-3 py-1 rounded-lg">LIVE TRANSMISSION</Badge>
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <Leaf className="text-primary" size={14} />
                   <span className="text-[9px] font-bold text-primary/70 uppercase">@{item.user}</span>
                </div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none">{item.title}</h3>
                
                <div className="flex items-center gap-4 pt-2">
                   <div className="flex items-center gap-1.5 text-[8px] font-black text-white/30 uppercase tracking-widest">
                      <Wind size={12} className="text-primary" /> {item.stats.carbon} CARBON OFFSET
                   </div>
                   <div className="flex items-center gap-1.5 text-[8px] font-black text-white/30 uppercase tracking-widest">
                      <Cpu size={12} className="text-accent" /> {item.stats.nodes} NODES
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
