"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { 
  Zap, Users, Heart, X, UserPlus, Check, Play, MessageCircle, Share2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProtocolWindow } from "@/components/protocol-window";
import { ReelsViewer } from "@/components/reels-viewer";
import { toast } from "@/hooks/use-toast";

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
  const [likedStories, setLikedStories] = useState<Record<number, boolean>>({});
  
  const storiesScrollRef = useRef<HTMLDivElement>(null);

  const filters = ["Amigos", "Siguiendo", "Temáticas", "Salas", "Para ti"];
  const storyIds = Array.from({ length: 12 }, (_, i) => i + 1);

  const contentItems = [
    { 
      id: "1", 
      type: "live",
      title: "Amazon Canopy Node", 
      user: "BioGuardian_Alpha", 
      viewers: "12.4K",
      thumbnail: "https://picsum.photos/seed/bio3/1280/720",
      filter: "Para ti"
    },
    { 
      id: "2", 
      type: "reel",
      title: "Neon Spore Synthesis", 
      user: "NeonBot_Synthetix", 
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
    },
    { 
      id: "4", 
      type: "reel",
      title: "Cyber Jungle Walk", 
      user: "GreenRunner_88", 
      viewers: "12K",
      thumbnail: "https://picsum.photos/seed/bio9/1080/1920",
      filter: "Para ti"
    },
    { 
      id: "5", 
      type: "live",
      title: "Bioluminescent Reef", 
      user: "DeepDive_Eco", 
      viewers: "22K",
      thumbnail: "https://picsum.photos/seed/bio6/1280/720",
      filter: "Para ti"
    }
  ];

  useEffect(() => {
    if (selectedStoryIndex !== null) {
      const timer = setTimeout(() => {
        if (storiesScrollRef.current) {
          const container = storiesScrollRef.current;
          const storyElements = container.querySelectorAll('.story-item-container');
          if (storyElements[selectedStoryIndex]) {
            storyElements[selectedStoryIndex].scrollIntoView({
              behavior: 'auto',
              block: 'nearest',
              inline: 'center'
            });
          }
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [selectedStoryIndex]);

  const toggleFollow = (user: string, e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuth(() => {
      setFollowing(prev => ({ ...prev, [user]: !prev[user] }));
      if (!following[user]) {
        toast({ 
          title: "Protocolo Sincronizado", 
          description: `Conexión establecida con @${user}` 
        });
      }
    });
  };

  const toggleStoryLike = (id: number) => {
    requireAuth(() => {
      setLikedStories(prev => ({ ...prev, [id]: !prev[id] }));
    });
  };

  const filteredItems = activeFilter === "Para ti" 
    ? contentItems 
    : contentItems.filter(item => item.filter === activeFilter);

  if (activeReelMode) {
    return (
      <div className="fixed inset-0 z-[80] bg-black">
        <button 
          onClick={() => setActiveReelMode(false)}
          className="absolute top-8 left-6 z-[100] h-12 w-12 bg-black/40 backdrop-blur-xl rounded-xl flex items-center justify-center text-white border border-white/10 active:scale-90 transition-all"
        >
          <X size={24} />
        </button>
        <ReelsViewer onProfileClick={onProfileClick} requireAuth={requireAuth} />
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
                className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group active:scale-95 transition-transform snap-center w-16"
              >
                <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-primary via-accent to-primary group-hover:rotate-12 transition-transform shadow-[0_0_15px_rgba(204,255,0,0.2)]">
                  <div className="w-full h-full rounded-full bg-black border-2 border-[#020503] overflow-hidden relative">
                    <Image src={`https://picsum.photos/seed/u${id}/150/150`} fill alt="User" className="object-cover" />
                  </div>
                </div>
                <span className="text-[7px] font-black uppercase text-white/40 tracking-widest truncate w-full text-center">Bio_{id}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="group relative rounded-[2.5rem] overflow-hidden bg-white/2 border border-white/5 hover:border-primary/20 transition-all shadow-xl aspect-[4/5]"
            >
              <div 
                className="absolute inset-0 cursor-pointer"
                onClick={() => item.type === 'reel' ? setActiveReelMode(true) : null}
              >
                <Image src={item.thumbnail} fill alt={item.title} className="object-cover opacity-60 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020503] via-transparent to-transparent"></div>
              </div>
              
              <div className="absolute top-6 right-6 pointer-events-none">
                <Badge className={cn(
                  "text-[8px] font-black tracking-widest px-4 h-6 border-none flex items-center",
                  item.type === "live" ? "bg-red-500 text-white" : "bg-primary text-black"
                )}>
                  {item.type.toUpperCase()}
                </Badge>
              </div>

              <div className="absolute bottom-8 left-8 right-8 z-10">
                 <div className="flex items-center justify-between mb-4">
                    <div 
                      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity min-w-0 flex-1 mr-4"
                      onClick={(e) => { e.stopPropagation(); onProfileClick(item.user); }}
                    >
                      <div className="h-8 w-8 rounded-xl bg-white/10 border border-white/20 overflow-hidden relative shrink-0">
                         <Image src={`https://picsum.photos/seed/${item.user}/50/50`} fill alt="Avatar" className="object-cover" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest italic leading-none truncate">@{item.user}</span>
                        <span className="text-[6px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1 truncate">Bio-Entity OS</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => toggleFollow(item.user, e)}
                      className={cn(
                        "h-8 px-4 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center gap-2 shrink-0",
                        following[item.user] 
                          ? "bg-white/10 text-white/40 border border-white/5" 
                          : "bg-primary text-black shadow-[0_0_15px_rgba(204,255,0,0.3)] hover:scale-105"
                      )}
                    >
                      {following[item.user] ? (
                        <Check size={10} strokeWidth={4} />
                      ) : (
                        <UserPlus size={10} strokeWidth={4} />
                      )}
                      <span className="ml-1.5">{following[item.user] ? "Sinc." : "Seguir"}</span>
                    </button>
                 </div>
                 <div className="pointer-events-none space-y-2">
                   <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-tight drop-shadow-lg truncate">{item.title}</h2>
                   <div className="flex items-center gap-2">
                      <div className="h-1 w-1 rounded-full bg-primary animate-pulse"></div>
                      <p className="text-[9px] text-white/50 font-black uppercase tracking-widest">{item.viewers} Sincronizados</p>
                   </div>
                 </div>
              </div>
            </div>
          ))}
        </section>
      </div>

      <ProtocolWindow isOpen={selectedStoryIndex !== null} onClose={() => setSelectedStoryIndex(null)} title="Bio-Stories">
        <div 
          ref={storiesScrollRef}
          className="w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar flex items-center bg-transparent"
        >
          {storyIds.map((id) => (
            <div 
              key={id} 
              className="story-item-container w-full h-full shrink-0 flex items-center justify-center snap-center px-6"
            >
              <div className="relative aspect-[9/16] h-[85vh] w-full max-w-[340px] bg-black rounded-[3.5rem] overflow-hidden border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)]">
                <Image src={`https://picsum.photos/seed/story${id}/1080/1920`} fill alt="Story" className="object-cover" priority />
                
                <div className="absolute top-6 left-8 right-8 h-1 bg-white/10 rounded-full overflow-hidden z-20">
                  <div className="h-full bg-primary animate-[story-progress_5s_linear_forwards]"></div>
                </div>

                <div className="absolute top-10 left-8 flex items-center gap-3 z-20">
                   <div 
                    className="h-10 w-10 rounded-full border border-primary/40 overflow-hidden relative cursor-pointer"
                    onClick={() => { setSelectedStoryIndex(null); onProfileClick(`Bio_${id}`); }}
                   >
                      <Image src={`https://picsum.photos/seed/u${id}/100/100`} fill alt="User" />
                   </div>
                   <div 
                    className="cursor-pointer min-w-0"
                    onClick={() => { setSelectedStoryIndex(null); onProfileClick(`Bio_${id}`); }}
                   >
                     <p className="text-white font-black italic text-[11px] uppercase tracking-tighter truncate leading-none">@Bio_{id}</p>
                     <p className="text-white/40 text-[7px] uppercase font-bold tracking-[0.2em] mt-1">Sincronizado</p>
                   </div>
                </div>

                <div className="absolute bottom-10 left-8 right-8 flex items-center gap-4 z-20">
                   <button 
                    onClick={() => toggleStoryLike(id)}
                    className={cn(
                      "h-14 w-14 rounded-2xl backdrop-blur-3xl border flex items-center justify-center transition-all active:scale-75 shrink-0 shadow-2xl",
                      likedStories[id] 
                        ? "bg-red-500/20 border-red-500/40 text-red-500" 
                        : "bg-white/5 border-white/10 text-white/60"
                    )}
                   >
                      <Heart size={24} fill={likedStories[id] ? "currentColor" : "none"} />
                   </button>
                   <div className="flex-1">
                      <div 
                        onClick={() => requireAuth(() => {})}
                        className="h-14 w-full bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 flex items-center px-4 cursor-pointer"
                      >
                         <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Inyectar respuesta...</span>
                      </div>
                   </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/40 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>
      </ProtocolWindow>

      <style jsx global>{`
        @keyframes story-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
