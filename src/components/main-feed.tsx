"use client";

import { Play, Radio, Heart, MessageCircle, Share2, Eye, User } from "lucide-react";
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
      title: "Sustainable Living Q&A", 
      user: "EcoExplorer", 
      userImage: PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl,
      thumbnail: PlaceHolderImages.find(img => img.id === 'live-1')?.imageUrl || "",
      views: "1.2k watching",
      isLive: true
    },
    { 
      id: "2", 
      type: "reel", 
      title: "5 Tips for Vertical Gardening", 
      user: "GardenGuru", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'reel-1')?.imageUrl || "",
      likes: "12k",
      views: "45k"
    },
    { 
      id: "3", 
      type: "reel", 
      title: "Mushroom Foraging in the PNW", 
      user: "WildRoots", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'reel-2')?.imageUrl || "",
      likes: "8k",
      views: "22k"
    },
    { 
      id: "4", 
      type: "live", 
      title: "Reforestation Project Live!", 
      user: "GreenPlanet", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'live-2')?.imageUrl || "",
      views: "3.4k watching",
      isLive: true
    },
  ];

  if (activeLiveId) {
    const live = feedItems.find(item => item.id === activeLiveId);
    return (
      <div className="relative h-[calc(100vh-4rem)] w-full bg-black overflow-hidden flex flex-col">
        <div className="relative flex-1">
          <Image 
            src={live?.thumbnail || ""} 
            fill 
            alt="Live Stream" 
            className="object-cover opacity-90"
            data-ai-hint="live nature stream"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
          
          <button 
            onClick={() => setActiveLiveId(null)}
            className="absolute top-6 left-6 z-20 text-white/90 hover:text-white transition-colors"
          >
            <div className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20">
               <Share2 size={20} className="rotate-180" />
            </div>
          </button>

          <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 items-end">
            <Badge className="bg-red-500 hover:bg-red-600 border-none px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase">
              Live
            </Badge>
          </div>

          <div className="absolute bottom-10 left-6 z-20 text-white max-w-[85%] space-y-3">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-primary overflow-hidden border-2 border-white/30">
                  <Image src={live?.userImage || feedItems[0].userImage!} width={40} height={40} alt="user" />
               </div>
               <div>
                  <p className="text-xs font-semibold text-white/70">@{live?.user}</p>
                  <h2 className="text-2xl font-bold tracking-tight">{live?.title}</h2>
               </div>
            </div>
          </div>
        </div>
        
        <div className="h-[45%]">
          <ChatPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-5 space-y-8 pb-32 overflow-y-auto no-scrollbar bg-neutral-50/50">
      <div className="flex items-center justify-between pt-2">
        <h2 className="text-2xl font-black tracking-tight text-primary">Explore Bio</h2>
        <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-primary">
          <Radio size={20} />
        </div>
      </div>

      {feedItems.map((item) => (
        <div 
          key={item.id} 
          onClick={() => item.type === "live" && setActiveLiveId(item.id)}
          className="group relative w-full overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] border border-neutral-100 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <div className={cn(
            "relative",
            item.type === "reel" ? "aspect-[4/5]" : "aspect-[16/10]"
          )}>
            <Image 
              src={item.thumbnail} 
              fill 
              alt={item.title} 
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              data-ai-hint={item.type === 'live' ? 'nature forest' : 'nature plants'}
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

            <div className="absolute top-4 left-4 flex gap-2">
              {item.type === "live" ? (
                <Badge className="bg-red-500/90 backdrop-blur-md border-none px-3 py-1 rounded-full text-[10px] font-bold">
                  LIVE
                </Badge>
              ) : (
                <Badge className="bg-black/30 backdrop-blur-md text-white border-white/10 px-3 py-1 rounded-full text-[10px] font-bold">
                  REEL
                </Badge>
              )}
            </div>

            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-col gap-1 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-[10px] font-bold overflow-hidden">
                    <User size={12} />
                  </div>
                  <span className="text-xs font-medium opacity-80">@{item.user}</span>
                </div>
                <h3 className="text-xl font-bold leading-tight tracking-tight mb-2">{item.title}</h3>
                <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-wider opacity-70">
                  {item.type === "live" ? (
                    <span className="flex items-center gap-1.5"><Eye size={12} /> {item.views}</span>
                  ) : (
                    <>
                      <span className="flex items-center gap-1.5"><Heart size={12} /> {item.likes}</span>
                      <span className="flex items-center gap-1.5"><Play size={12} /> {item.views}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {item.type === "reel" && (
              <div className="absolute right-6 bottom-6 flex flex-col gap-4">
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all">
                  <Heart size={22} />
                </div>
                <div className="p-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/20 transition-all">
                  <MessageCircle size={22} />
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}