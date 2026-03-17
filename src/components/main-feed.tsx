"use client";

import { Play, Heart, MessageCircle, Share2, Eye, User, Zap, Plus } from "lucide-react";
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
      thumbnail: PlaceHolderImages.find(img => img.id === 'live-1')?.imageUrl || "",
      views: "12.4k",
      isLive: true
    },
    { 
      id: "2", 
      type: "reel", 
      title: "Vertical Hydroponics Hack", 
      user: "NeonFarmer", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'reel-1')?.imageUrl || "",
      likes: "88k",
      views: "1.2M"
    },
    { 
      id: "3", 
      type: "reel", 
      title: "Bioluminescent Fungi Expo", 
      user: "DarkBotanist", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'reel-2')?.imageUrl || "",
      likes: "45k",
      views: "600k"
    },
    { 
      id: "4", 
      type: "live", 
      title: "AMAZON REWILDING LIVE", 
      user: "GlobalGreen", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'live-2')?.imageUrl || "",
      views: "50k",
      isLive: true
    },
  ];

  if (activeLiveId) {
    const live = feedItems.find(item => item.id === activeLiveId);
    return (
      <div className="relative h-[calc(100vh-6rem)] w-full bg-black overflow-hidden flex flex-col">
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
            <div className="glass-dark p-3 rounded-full hover:bg-primary hover:text-black transition-all">
               <Share2 size={20} className="rotate-180" />
            </div>
          </button>

          <div className="absolute top-8 right-8 z-20 flex flex-col gap-2 items-end">
            <Badge className="bg-primary text-black border-none px-4 py-2 rounded-full text-[10px] font-black tracking-[0.2em] uppercase shadow-[0_0_20px_rgba(204,255,0,0.5)]">
              LIVE NOW
            </Badge>
            <div className="glass-dark px-3 py-1 rounded-full text-[10px] font-bold text-white flex items-center gap-2">
              <Eye size={12} /> {live?.views}
            </div>
          </div>

          <div className="absolute bottom-12 left-8 z-20 text-white max-w-[85%] space-y-4">
            <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-2xl bg-primary/20 p-1 border border-primary/30">
                  <div className="w-full h-full rounded-xl overflow-hidden relative">
                    <Image src={live?.userImage || feedItems[0].userImage!} fill alt="user" className="object-cover" />
                  </div>
               </div>
               <div>
                  <p className="text-xs font-black text-primary uppercase tracking-widest">@{live?.user}</p>
                  <h2 className="text-3xl font-black tracking-tighter leading-none mt-1">{live?.title}</h2>
               </div>
            </div>
          </div>
        </div>
        
        <div className="h-[40%] bg-black/40 backdrop-blur-3xl border-t border-white/5">
          <ChatPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-6 space-y-10 pb-40 overflow-y-auto no-scrollbar">
      {/* Stories / Active Lives Bar */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 pt-2">
        <div className="flex flex-col items-center gap-2 shrink-0">
          <div className="w-18 h-18 rounded-[1.8rem] bg-primary flex items-center justify-center text-black shadow-lg animate-float">
            <Plus size={28} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-tighter text-primary">Your Bio</span>
        </div>
        {feedItems.filter(i => i.isLive).map(live => (
          <div key={live.id} onClick={() => setActiveLiveId(live.id)} className="flex flex-col items-center gap-2 shrink-0 cursor-pointer">
            <div className="w-18 h-18 rounded-[1.8rem] p-1 bg-gradient-to-tr from-primary to-green-400 border border-primary/50">
              <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative grayscale hover:grayscale-0 transition-all">
                <Image src={live.thumbnail} fill alt="live" className="object-cover" />
                <div className="absolute inset-0 bg-primary/10"></div>
              </div>
            </div>
            <span className="text-[9px] font-black uppercase tracking-tighter text-white/50">@{live.user}</span>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {feedItems.map((item) => (
          <div 
            key={item.id} 
            onClick={() => item.type === "live" && setActiveLiveId(item.id)}
            className="group relative w-full overflow-hidden rounded-[2.5rem] bg-card border border-white/5 transition-all hover:neon-border hover:shadow-[0_0_30px_rgba(204,255,0,0.1)] cursor-pointer"
          >
            <div className={cn(
              "relative",
              item.type === "reel" ? "aspect-[4/5]" : "aspect-[16/10]"
            )}>
              <Image 
                src={item.thumbnail} 
                fill 
                alt={item.title} 
                className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-90"
                data-ai-hint="futuristic forest neon"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>

              <div className="absolute top-6 left-6 flex gap-2">
                {item.type === "live" ? (
                  <Badge className="bg-primary text-black border-none px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase">
                    LIVE
                  </Badge>
                ) : (
                  <Badge className="bg-white/10 backdrop-blur-xl text-white border-white/10 px-4 py-1.5 rounded-xl text-[9px] font-black tracking-widest uppercase">
                    REEL
                  </Badge>
                )}
              </div>

              <div className="absolute bottom-8 left-8 right-8">
                <div className="flex flex-col gap-2 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20">
                      <Zap size={14} fill="currentColor" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">@{item.user}</span>
                  </div>
                  <h3 className="text-2xl font-black leading-none tracking-tighter group-hover:text-primary transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-6 mt-4 text-[10px] font-black uppercase tracking-widest text-white/40">
                    {item.type === "live" ? (
                      <span className="flex items-center gap-2 text-primary/80"><Eye size={14} /> {item.views} WATCHING</span>
                    ) : (
                      <>
                        <span className="flex items-center gap-2 hover:text-primary transition-colors"><Heart size={14} /> {item.likes}</span>
                        <span className="flex items-center gap-2"><Play size={14} /> {item.views}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {item.type === "reel" && (
                <div className="absolute right-8 bottom-8 flex flex-col gap-6">
                  <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 text-white hover:bg-primary hover:text-black transition-all shadow-xl">
                    <Heart size={24} />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 text-white hover:bg-primary hover:text-black transition-all shadow-xl">
                    <MessageCircle size={24} />
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
