"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Users, Heart, X, UserPlus, Check, Play, MessageCircle, Share2, Send, ChevronLeft, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProtocolWindow } from "@/components/protocol-window";
import { ReelsViewer } from "@/components/reels-viewer";
import { toast } from "@/hooks/use-toast";
import useEmblaCarousel from "embla-carousel-react";

/**
 * @fileOverview Feed principal estandarizado.
 * Historias mejoradas: Deslizables con interacciones sociales.
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
                 <div className="flex items-center justify-between min-w-0 gap-2">
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
                   <p className="text-[8px] text-white/50 font-black uppercase tracking-widest truncate">{item.viewers} Sincronizados</p>
                 </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      <ProtocolWindow isOpen={selectedStoryIndex !== null} onClose={() => setSelectedStoryIndex(null)} title="Bio-Stories">
        <StoryCarousel 
          stories={storyIds} 
          initialIndex={selectedStoryIndex ?? 0} 
          onClose={() => setSelectedStoryIndex(null)} 
          requireAuth={requireAuth}
        />
      </ProtocolWindow>
    </div>
  );
}

function StoryCarousel({ stories, initialIndex, onClose, requireAuth }: { stories: number[], initialIndex: number, onClose: () => void, requireAuth: any }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    startIndex: initialIndex,
    loop: false,
    align: 'center',
    skipSnaps: false
  });
  
  const [liked, setLiked] = useState<Record<number, boolean>>({});

  const toggleLike = (id: number) => {
    requireAuth(() => {
      setLiked(prev => ({ ...prev, [id]: !prev[id] }));
      if (!liked[id]) {
        toast({ title: "Resonancia Activa", description: "Inyectaste un pulso de energía." });
      }
    });
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-transparent pb-10">
      <div className="relative w-full max-w-[390px] aspect-[9/16] overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {stories.map((id) => (
            <div key={id} className="relative flex-[0_0_100%] min-w-0 h-full px-2">
              <div className="relative w-full h-full bg-black rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
                <Image 
                  src={`https://picsum.photos/seed/story${id}/1080/1920`} 
                  fill 
                  alt={`Story ${id}`} 
                  className="object-cover"
                  priority={id === stories[initialIndex]}
                />
                
                {/* Overlay Interactivo */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 pointer-events-none" />
                
                {/* Header Historia */}
                <div className="absolute top-8 left-8 right-8 flex items-center gap-3 z-20">
                  <div className="h-10 w-10 rounded-xl border border-primary/40 overflow-hidden relative">
                    <Image src={`https://picsum.photos/seed/u${id}/100/100`} fill alt="User" />
                  </div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Bio_{id}</span>
                </div>

                {/* Controles de Interacción */}
                <div className="absolute bottom-10 left-8 right-8 flex items-center gap-4 z-20 pointer-events-auto">
                  <div className="flex-1 relative">
                    <input 
                      type="text" 
                      placeholder="Comentar..." 
                      className="w-full h-12 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-6 text-[10px] text-white focus:outline-none focus:border-primary/40"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-primary">
                      <Send size={16} />
                    </button>
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLike(id); }}
                    className={cn(
                      "h-12 w-12 rounded-2xl flex items-center justify-center transition-all border",
                      liked[id] ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(204,255,0,0.5)]" : "bg-white/10 text-white border-white/10"
                    )}
                  >
                    <Heart size={20} fill={liked[id] ? "currentColor" : "none"} />
                  </button>

                  <button 
                    onClick={(e) => { e.stopPropagation(); toast({ title: "Nodo de Comentarios", description: "Cargando hilos neurales..." }); }}
                    className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white"
                  >
                    <MessageCircle size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
