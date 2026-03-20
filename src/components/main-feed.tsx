"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Users, Heart, X, UserPlus, Check, Play, MessageCircle, Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProtocolWindow } from "@/components/protocol-window";
import { ReelsViewer } from "@/components/reels-viewer";
import { toast } from "@/hooks/use-toast";

/**
 * @fileOverview Feed principal estandarizado.
 * Corregidos anchos de historias y truncado de textos largos.
 */

const INITIAL_CONTENT = Array.from({ length: 25 }, (_, i) => ({
  id: `content-${i}`,
  type: i % 2 === 0 ? "live" : "reel",
  title: [
    "Amazon Canopy Node Ultra HD", 
    "Neon Spore Synthesis Protocol", 
    "Arctic Algae Flow Station", 
    "Cyber Jungle Walk Simulation", 
    "Bioluminescent Reef Exploration",
    "Deep Tech Farming Gaia"
  ][i % 6],
  user: `BioEntity_${i + 10}`,
  viewers: `${(Math.random() * 50).toFixed(1)}K`,
  thumbnail: `https://picsum.photos/seed/bio${i}/1280/720`,
  filter: ["Para ti", "Siguiendo", "Temáticas"][i % 3]
}));

export function MainFeed({ 
  onProfileClick,
  requireAuth
}: { 
  onProfileClick: (username: string) => void;
  requireAuth: (cb: () => void) => void;
}) {
  const [activeFilter, setActiveFilter] = useState("Para ti");
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [activeReelMode, setActiveReelMode] = useState(false);
  const [following, setFollowing] = useState<Record<string, boolean>>({});
  
  const filters = ["Para ti", "Siguiendo", "Temáticas", "Salas", "Cerca"];
  const storyIds = Array.from({ length: 15 }, (_, i) => i + 1);

  const toggleFollow = (user: string, e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuth(() => {
      setFollowing(prev => ({ ...prev, [user]: !prev[user] }));
      if (!following[user]) {
        toast({ title: "Sincronizado", description: `@${user} activo.` });
      }
    });
  };

  const filteredItems = activeFilter === "Para ti" 
    ? INITIAL_CONTENT 
    : INITIAL_CONTENT.filter(item => item.filter === activeFilter);

  if (activeReelMode) {
    return (
      <div className="fixed inset-0 z-[80] bg-black flex items-center justify-center">
        <div className="relative w-full h-full max-w-[500px]">
          <button 
            onClick={() => setActiveReelMode(false)}
            className="absolute top-8 left-6 z-[100] h-10 w-10 bg-black/40 backdrop-blur-xl rounded-xl flex items-center justify-center text-white border border-white/10"
          >
            <X size={20} />
          </button>
          <ReelsViewer onProfileClick={onProfileClick} requireAuth={requireAuth} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full relative max-w-[500px] mx-auto overflow-x-hidden">
      <div className="sticky top-0 z-20 bg-[#020503]/80 backdrop-blur-md py-4 border-b border-white/5">
        <div className="flex gap-3 overflow-x-auto no-scrollbar px-6">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "whitespace-nowrap px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-all shrink-0",
                activeFilter === filter 
                  ? "bg-primary text-black shadow-lg" 
                  : "bg-white/5 text-white/40"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-6 space-y-8">
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
             <h3 className="text-[8px] font-black uppercase tracking-[0.4em] text-white/30 italic">Nodos Cercanos</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto snap-x no-scrollbar pb-2">
            {storyIds.map((id, index) => (
              <div 
                key={id} 
                onClick={() => setSelectedStoryIndex(index)}
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer w-14 snap-center"
              >
                <div className="w-14 h-14 rounded-full p-[2px] bg-gradient-to-tr from-primary to-accent">
                  <div className="w-full h-full rounded-full bg-black border-2 border-[#020503] overflow-hidden relative">
                    <Image src={`https://picsum.photos/seed/u${id}/150/150`} fill alt="User" className="object-cover" />
                  </div>
                </div>
                <span className="text-[7px] font-black uppercase text-white/40 truncate w-full text-center">Bio_{id}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="group relative rounded-[2rem] overflow-hidden bg-white/2 border border-white/5 aspect-[4/5] shadow-2xl"
            >
              <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveReelMode(true)}>
                <Image src={item.thumbnail} fill alt={item.title} className="object-cover opacity-60 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020503] via-transparent to-transparent"></div>
              </div>
              <div className="absolute top-5 right-5 z-10">
                <Badge className={cn("text-[7px] font-black tracking-widest px-3 h-5 border-none", item.type === "live" ? "bg-red-500" : "bg-primary text-black")}>
                  {item.type.toUpperCase()}
                </Badge>
              </div>
              <div className="absolute bottom-6 left-6 right-6 z-10 space-y-4">
                 <div className="flex items-center justify-between min-w-0">
                    <div className="flex items-center gap-3 cursor-pointer min-w-0 flex-1" onClick={(e) => { e.stopPropagation(); onProfileClick(item.user); }}>
                      <div className="h-8 w-8 rounded-xl bg-white/10 border border-white/20 overflow-hidden relative shrink-0">
                         <Image src={`https://picsum.photos/seed/${item.user}/50/50`} fill alt="Avatar" className="object-cover" />
                      </div>
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest italic truncate leading-none">@{item.user}</span>
                    </div>
                    <button 
                      onClick={(e) => toggleFollow(item.user, e)}
                      className={cn(
                        "h-8 px-4 rounded-xl text-[7px] font-black uppercase tracking-widest transition-all shrink-0",
                        following[item.user] ? "bg-white/10 text-white/40" : "bg-primary text-black"
                      )}
                    >
                      {following[item.user] ? "SINC." : "SEGUIR"}
                    </button>
                 </div>
                 <div className="space-y-1">
                   <h2 className="text-xl font-black italic uppercase text-white tracking-tighter truncate leading-tight drop-shadow-md">{item.title}</h2>
                   <p className="text-[8px] text-white/50 font-black uppercase tracking-widest">{item.viewers} Sincronizados</p>
                 </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      <ProtocolWindow isOpen={selectedStoryIndex !== null} onClose={() => setSelectedStoryIndex(null)} title="Bio-Stories">
        <div className="w-full h-full flex items-center justify-center bg-transparent">
          <div className="relative aspect-[9/16] h-[80vh] w-full max-w-[320px] bg-black rounded-[3rem] overflow-hidden border border-white/10">
            <Image src={`https://picsum.photos/seed/story${selectedStoryIndex}/1080/1920`} fill alt="Story" className="object-cover" />
            <div className="absolute bottom-10 left-8 right-8 flex items-center gap-3 z-20">
               <button onClick={() => setSelectedStoryIndex(null)} className="h-12 w-full bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 text-[9px] font-black text-white/40 uppercase tracking-widest">Cerrar Nodo</button>
            </div>
          </div>
        </div>
      </ProtocolWindow>
    </div>
  );
}
