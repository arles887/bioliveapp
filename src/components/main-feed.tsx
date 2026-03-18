"use client";

import { Play, Heart, MessageCircle, Share2, Eye, Zap, Plus, Flame } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ChatPanel } from "./chat-panel";
import { useState } from "react";
import { cn } from "@/lib/utils";

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
}

export function MainFeed() {
  const [activeLiveId, setActiveLiveId] = useState<string | null>(null);

  const feedItems: ContentItem[] = [
    { 
      id: "1", 
      type: "live", 
      title: "SUSTAINABLE ENERGY 2.0", 
      user: "EcoCyborg", 
      userImage: PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl,
      thumbnail: PlaceHolderImages.find(img => img.id === 'live-1')?.imageUrl || "https://picsum.photos/seed/live1/1280/720",
      views: "12.4k",
      isLive: true
    },
    { 
      id: "2", 
      type: "reel", 
      title: "Vertical Hydroponics Hack", 
      user: "NeonFarmer", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'reel-1')?.imageUrl || "https://picsum.photos/seed/reel1/1080/1920",
      likes: "88k",
      views: "1.2M"
    },
    { 
      id: "3", 
      type: "reel", 
      title: "Bioluminescent Fungi Expo", 
      user: "DarkBotanist", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'reel-2')?.imageUrl || "https://picsum.photos/seed/reel2/1080/1920",
      likes: "45k",
      views: "600k"
    },
    { 
      id: "4", 
      type: "live", 
      title: "AMAZON REWILDING LIVE", 
      user: "GlobalGreen", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'live-2')?.imageUrl || "https://picsum.photos/seed/live2/1280/720",
      views: "50k",
      isLive: true
    },
  ];

  if (activeLiveId) {
    const live = feedItems.find(item => item.id === activeLiveId);
    return (
      <div className="relative h-[calc(100vh-6rem)] w-full bg-black overflow-hidden flex flex-col animate-in fade-in duration-700">
        <div className="relative flex-1">
          <Image 
            src={live?.thumbnail || ""} 
            fill 
            alt="Live Stream" 
            className="object-cover opacity-80"
            data-ai-hint="futuristic nature neon"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90"></div>
          
          <button 
            onClick={() => setActiveLiveId(null)}
            className="absolute top-8 left-8 z-20"
          >
            <div className="glass-dark p-3 rounded-2xl hover:bg-primary hover:text-black transition-all group">
               <Share2 size={20} className="rotate-180 group-hover:scale-110" />
            </div>
          </button>

          <div className="absolute top-8 right-8 z-20 flex flex-col gap-3 items-end">
            <Badge className="bg-primary text-black border-none px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.25em] uppercase shadow-[0_0_30px_rgba(204,255,0,0.6)] animate-pulse">
              TRANSMITTING
            </Badge>
            <div className="glass-dark px-4 py-2 rounded-xl text-[10px] font-black text-white flex items-center gap-2 uppercase tracking-widest">
              <Eye size={12} className="text-primary" /> {live?.views}
            </div>
          </div>

          <div className="absolute bottom-12 left-8 z-20 text-white max-w-[85%] space-y-4">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-[1.8rem] bg-primary/20 p-1 border border-primary/40">
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                    <Image src={live?.userImage || feedItems[0].userImage || "https://picsum.photos/seed/user1/200/200"} fill alt="user" className="object-cover" />
                  </div>
               </div>
               <div>
                  <p className="text-xs font-black text-primary uppercase tracking-[0.3em]">@{live?.user}</p>
                  <h2 className="text-4xl font-black tracking-tighter leading-none mt-2 italic uppercase">{live?.title}</h2>
               </div>
            </div>
          </div>
        </div>
        
        <div className="h-[45%] border-t border-white/10">
          <ChatPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-8 space-y-12 pb-44 overflow-y-auto no-scrollbar animate-in fade-in slide-in-from-bottom-8 duration-1000">
      {/* Stories / Active Lives Bar */}
      <div className="flex gap-6 overflow-x-auto no-scrollbar py-4">
        <div className="flex flex-col items-center gap-4 shrink-0 group cursor-pointer">
          <div className="w-20 h-20 rounded-[2.2rem] bg-primary flex items-center justify-center text-black shadow-[0_0_35px_rgba(204,255,0,0.4)] animate-float transition-all group-hover:scale-110">
            <Plus size={34} strokeWidth={3} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 italic">My Bio</span>
        </div>
        {feedItems.filter(i => i.isLive).map(live => (
          <div key={live.id} onClick={() => setActiveLiveId(live.id)} className="flex flex-col items-center gap-4 shrink-0 cursor-pointer group">
            <div className="w-20 h-20 rounded-[2.2rem] p-[3px] bg-gradient-to-tr from-primary to-green-500 relative transition-all group-hover:scale-110">
              <div className="absolute inset-0 rounded-[2.2rem] animate-pulse-glow bg-primary/30 -z-10 blur-xl"></div>
              <div className="w-full h-full rounded-[2rem] overflow-hidden relative grayscale group-hover:grayscale-0 transition-all duration-700">
                <Image src={live.thumbnail} fill alt="live" className="object-cover" />
                <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent"></div>
              </div>
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-white/40 group-hover:text-primary transition-colors">@{live.user}</span>
          </div>
        ))}
      </div>

      <div className="space-y-12">
        <div className="flex items-center justify-between px-3">
            <h2 className="text-[11px] font-black uppercase tracking-[0.6em] text-white/25 italic">Global Transmission</h2>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>
              <Flame size={20} className="text-primary animate-pulse" />
            </div>
        </div>
        
        {feedItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => item.type === "live" && setActiveLiveId(item.id)}
            className="group relative w-full overflow-hidden rounded-[3rem] bg-card border border-white/5 transition-all duration-700 hover:neon-border hover:shadow-[0_0_60px_rgba(204,255,0,0.2)] cursor-pointer"
          >
            <div className={cn(
              "relative",
              item.type === "reel" ? "aspect-[4/5.5]" : "aspect-[16/10.5]"
            )}>
              <Image 
                src={item.thumbnail} 
                fill 
                alt={item.title} 
                className="object-cover transition-transform duration-[2500ms] group-hover:scale-115 opacity-50 group-hover:opacity-100"
                data-ai-hint="futuristic nature neon"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

              <div className="absolute top-10 left-10 flex gap-4">
                {item.type === "live" ? (
                  <Badge className="bg-primary text-black border-none px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase italic shadow-xl">
                    LIVE NOW
                  </Badge>
                ) : (
                  <Badge className="bg-white/5 backdrop-blur-2xl text-white border-white/10 px-6 py-2.5 rounded-2xl text-[10px] font-black tracking-widest uppercase">
                    TRANSMISSION
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-12 left-10 right-10">
                <div className="flex flex-col gap-4 text-white">
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-12 h-12 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary border border-primary/20 group-hover:bg-primary group-hover:text-black transition-all shadow-xl">
                      <Zap size={20} fill="currentColor" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.4em] text-primary italic">@{item.user}</span>
                  </div>
                  <h3 className="text-4xl font-black leading-[0.9] tracking-tighter group-hover:text-primary transition-colors italic uppercase">{item.title}</h3>
                  <div className="flex items-center gap-10 mt-8 text-[11px] font-black uppercase tracking-[0.3em] text-white/30">
                    {item.type === "live" ? (
                      <span className="flex items-center gap-3 text-primary/70"><Eye size={18} /> {item.views} SIGNAL</span>
                    ) : (
                      <>
                        <span className="flex items-center gap-3 hover:text-primary transition-colors"><Heart size={18} /> {item.likes}</span>
                        <span className="flex items-center gap-3"><Play size={18} /> {item.views}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {item.type === "reel" && (
                <div className="absolute right-10 bottom-12 flex flex-col gap-8">
                  <div className="p-6 rounded-[2.2rem] glass-dark text-white hover:bg-primary hover:text-black transition-all shadow-2xl hover:scale-110 active:scale-90">
                    <Heart size={30} strokeWidth={2.5} />
                  </div>
                  <div className="p-6 rounded-[2.2rem] glass-dark text-white hover:bg-primary hover:text-black transition-all shadow-2xl hover:scale-110 active:scale-90">
                    <MessageCircle size={30} strokeWidth={2.5} />
                  </div>
                  <div className="p-6 rounded-[2.2rem] glass-dark text-white hover:bg-primary hover:text-black transition-all shadow-2xl hover:scale-110 active:scale-90">
                    <Share2 size={30} strokeWidth={2.5} />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}