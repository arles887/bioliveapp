
"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  ScanSearch, Droplets, Activity, Cpu, 
  Globe, Shield, Zap, MapPin, Play
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ChatPanel } from "./chat-panel";
import { Button } from "@/components/ui/button";
import { ProtocolWindow } from "./protocol-window";

export function MainFeed() {
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  const [activeLiveId, setActiveLiveId] = useState<string | null>(null);

  const feedItems = [
    { 
      id: "1", 
      title: "Amazon Canopy Node", 
      user: "BioGuardian", 
      viewers: "12.4K",
      thumbnail: PlaceHolderImages.find(img => img.id === 'live-1')?.imageUrl || "https://picsum.photos/seed/bio3/1280/720",
      stats: { carbon: "-820kg", oxygen: "+2.4t" }
    },
    { 
      id: "2", 
      title: "Arctic Algae Synthesis", 
      user: "FrostWatcher", 
      viewers: "8.1K",
      thumbnail: PlaceHolderImages.find(img => img.id === 'live-2')?.imageUrl || "https://picsum.photos/seed/bio4/1280/720",
      stats: { carbon: "-120kg", oxygen: "+0.8t" }
    }
  ];

  return (
    <div className="flex flex-col w-full h-full relative">
      
      {/* Stream Viewer Mode */}
      {activeLiveId && (
        <div className="absolute inset-0 z-40 bg-black flex flex-col animate-in fade-in duration-300">
          <div className="relative flex-1">
            <Image 
              src={feedItems.find(i => i.id === activeLiveId)?.thumbnail || ""} 
              fill alt="Live" 
              className="object-cover opacity-60" 
            />
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-50">
               <Button variant="ghost" size="sm" onClick={() => setActiveLiveId(null)} className="glass-panel border-white/10 text-[9px] uppercase font-black tracking-widest text-white/50 px-4">
                 Exit Node
               </Button>
               <div className="flex flex-col items-end gap-1">
                 <Badge className="bg-primary text-black text-[8px] font-black tracking-widest px-3">LIVE</Badge>
                 <span className="text-[9px] font-black text-white/40 uppercase tracking-tighter">12,430 SYNCHRONIZED</span>
               </div>
            </div>
          </div>
          <div className="h-[45%]">
            <ChatPanel />
          </div>
        </div>
      )}

      {/* Main Hub */}
      <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
        
        {/* Active Nodes Horizontal */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Neural Nodes</h3>
             <Zap size={12} className="text-primary animate-pulse" />
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                <div className="w-16 h-16 rounded-[1.8rem] bg-primary/5 border border-primary/20 flex items-center justify-center p-1 group cursor-pointer hover:border-primary/50 transition-all">
                  <div className="w-full h-full rounded-[1.5rem] bg-black overflow-hidden relative">
                    <Image src={`https://picsum.photos/seed/${i}/100/100`} fill alt="Live" className="object-cover opacity-50 grayscale group-hover:grayscale-0 transition-all" />
                    <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                </div>
                <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Node_{i}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Global Grid Feed */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 italic">Biosphere Feed</h3>
             <Globe size={12} className="text-primary/40" />
          </div>
          
          <div className="space-y-6">
            {feedItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setActiveLiveId(item.id)}
                className="group relative aspect-video rounded-[2rem] overflow-hidden bg-white/2 border border-white/5 cursor-pointer hover:border-primary/20 transition-all"
              >
                <Image src={item.thumbnail} fill alt={item.title} className="object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020503] via-transparent to-transparent"></div>
                
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                  <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center text-black shadow-2xl scale-75 group-hover:scale-100 transition-all duration-500">
                    <Play size={32} fill="black" />
                  </div>
                </div>

                <div className="absolute bottom-6 left-6 right-6 space-y-2">
                   <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest italic">@{item.user}</span>
                   </div>
                   <h2 className="text-xl font-black italic uppercase text-white tracking-tighter leading-none">{item.title}</h2>
                   <div className="flex gap-4 pt-1">
                      <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{item.viewers} Watchers</span>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Protocol Window Manager */}
      {activeProtocol && (
        <ProtocolWindow 
          isOpen={!!activeProtocol} 
          onClose={() => setActiveProtocol(null)}
          title={activeProtocol}
        >
          <div className="py-10 text-center space-y-6">
             <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
               <Activity size={24} className="text-primary" />
             </div>
             <p className="text-xs text-white/60 font-medium leading-relaxed max-w-[200px] mx-auto italic">
               Initializing protocol sequence... Data link synchronization required.
             </p>
          </div>
        </ProtocolWindow>
      )}
    </div>
  );
}
