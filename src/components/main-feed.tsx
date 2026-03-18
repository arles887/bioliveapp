
"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Zap, Globe, Play, Users, 
  Flame, Hash, Star, LayoutGrid, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProtocolWindow } from "@/components/protocol-window";
import { ReelsViewer } from "@/components/reels-viewer";

export function MainFeed() {
  const [activeFilter, setActiveFilter] = useState("Para ti");
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [activeReelMode, setActiveReelMode] = useState(false);

  const filters = ["Amigos", "Siguiendo", "Temáticas", "Salas", "Para ti"];
  const storyIds = [1, 2, 3, 4, 5, 6, 7, 8];

  const contentItems = [
    { 
      id: "1", 
      type: "live",
      title: "Amazon Canopy Node", 
      user: "BioGuardian", 
      viewers: "12.4K",
      thumbnail: "https://picsum.photos/seed/bio3/1280/720",
      filter: "Para ti"
    },
    { 
      id: "2", 
      type: "reel",
      title: "Neon Spore Synthesis", 
      user: "NeonBot", 
      viewers: "45K",
      thumbnail: "https://picsum.photos/seed/bio1/1080/1920",
      filter: "Para ti"
    },
    { 
      id: "3", 
      type: "live",
      title: "Arctic Algae Flow", 
      user: "FrostWatcher", 
      viewers: "8.1K",
      thumbnail: "https://picsum.photos/seed/bio4/1280/720",
      filter: "Siguiendo"
    }
  ];

  const filteredItems = activeFilter === "Para ti" 
    ? contentItems 
    : contentItems.filter(item => item.filter === activeFilter);

  if (activeReelMode) {
    return (
      <div className="fixed inset-0 z-[80] bg-black">
        <button 
          onClick={() => setActiveReelMode(false)}
          className="absolute top-8 left-6 z-[100] h-10 w-10 bg-black/40 backdrop-blur-xl rounded-xl flex items-center justify-center text-white border border-white/10"
        >
          <X size={20} />
        </button>
        <ReelsViewer />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full relative">
      <div className="sticky top-0 z-20 bg-[#020503]/80 backdrop-blur-md py-4 border-b border-white/5">
        <div className="flex gap-4 overflow-x-auto no-scrollbar px-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                activeFilter === filter 
                  ? "bg-primary text-black shadow-[0_0_15px_rgba(204,255,0,0.3)]" 
                  : "bg-white/5 text-white/40 hover:text-white/70"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 space-y-8 no-scrollbar">
        {/* Historias - Desplazamiento Horizontal con Snap */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[9px] font-black uppercase tracking-[0.4em] text-white/30 italic">Nodos Cercanos</h3>
             <Users size={12} className="text-primary/40" />
          </div>
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-2">
            {storyIds.map((id, index) => (
              <div 
                key={id} 
                onClick={() => setSelectedStoryIndex(index)}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group active:scale-95 transition-transform snap-center"
              >
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-primary to-accent group-hover:rotate-12 transition-transform">
                  <div className="w-full h-full rounded-full bg-black border-2 border-[#020503] overflow-hidden">
                    <Image src={`https://picsum.photos/seed/u${id}/100/100`} width={64} height={64} alt="User" className="object-cover" />
                  </div>
                </div>
                <span className="text-[7px] font-black uppercase text-white/30 tracking-widest">Bio_{id}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Feed Vertical */}
        <section className="grid grid-cols-1 gap-6">
          {filteredItems.length > 0 ? filteredItems.map((item) => (
            <div 
              key={item.id} 
              onClick={() => item.type === 'reel' ? setActiveReelMode(true) : null}
              className={cn(
                "group relative rounded-[2.5rem] overflow-hidden bg-white/2 border border-white/5 cursor-pointer hover:border-primary/20 transition-all shadow-xl",
                item.type === "reel" ? "aspect-[4/5]" : "aspect-video"
              )}
            >
              <Image src={item.thumbnail} fill alt={item.title} className="object-cover opacity-60 group-hover:scale-105 transition-all duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020503] via-transparent to-transparent"></div>
              
              <div className="absolute top-6 right-6">
                <Badge className={cn(
                  "text-[8px] font-black tracking-widest px-4 h-6 border-none flex items-center",
                  item.type === "live" ? "bg-red-500 text-white" : "bg-primary text-black"
                )}>
                  {item.type === "live" ? "LIVE" : "REEL"}
                </Badge>
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                 <div className="flex items-center gap-2 mb-2">
                    <div className="h-5 w-5 rounded-full bg-white/10 border border-white/20"></div>
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest italic">@{item.user}</span>
                 </div>
                 <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none">{item.title}</h2>
                 <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-2">{item.viewers} Sincronizados</p>
              </div>
            </div>
          )) : (
            <div className="flex flex-col items-center justify-center py-20 text-white/20 space-y-4">
              <Zap size={40} className="animate-pulse" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em]">No hay señales en este nodo</p>
            </div>
          )}
        </section>
      </div>

      <ProtocolWindow isOpen={selectedStoryIndex !== null} onClose={() => setSelectedStoryIndex(null)} title="Bio-Stories">
        <div className="w-full overflow-x-auto snap-x snap-mandatory no-scrollbar flex">
          {storyIds.map((id) => (
            <div key={id} className="relative aspect-[9/16] w-full shrink-0 snap-center bg-black rounded-[2.5rem] overflow-hidden border border-white/10">
              <Image src={`https://picsum.photos/seed/story${id}/1080/1920`} fill alt="Story" className="object-cover" />
              <div className="absolute top-6 left-6 right-6 h-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary animate-[progress_5s_linear_infinite]" style={{ width: '100%' }}></div>
              </div>
              <div className="absolute bottom-10 left-8">
                 <p className="text-white font-black italic text-base">@Bio_{id}</p>
                 <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Protocolo de supervivencia #0{id}</p>
              </div>
            </div>
          ))}
        </div>
      </ProtocolWindow>
    </div>
  );
}
