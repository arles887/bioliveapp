
"use client";

import { Play, Radio, Heart, MessageCircle, Share2, MoreVertical, Eye } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ChatPanel } from "./chat-panel";
import { useState } from "react";

interface ContentItem {
  id: string;
  type: "live" | "reel";
  title: string;
  user: string;
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
      <div className="relative h-[calc(100vh-8rem)] w-full bg-black overflow-hidden flex flex-col">
        <div className="relative flex-1 group">
          <Image 
            src={live?.thumbnail || ""} 
            fill 
            alt="Live Stream" 
            className="object-cover"
            data-ai-hint="live video stream"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
          
          <button 
            onClick={() => setActiveLiveId(null)}
            className="absolute top-4 left-4 z-20 text-white font-bold text-sm bg-black/40 px-3 py-1 rounded-full border border-white/20"
          >
            ← Close
          </button>

          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 items-end">
            <Badge className="bg-red-500 hover:bg-red-600 animate-pulse border-none px-3 py-1 uppercase text-[10px] tracking-widest font-black">
              Live
            </Badge>
            <div className="flex items-center gap-1 text-white bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded-full text-[10px] font-bold">
              <Eye size={12} /> {live?.views}
            </div>
          </div>

          <div className="absolute bottom-4 left-4 z-20 text-white max-w-[70%]">
            <h2 className="text-xl font-headline font-bold drop-shadow-lg">{live?.title}</h2>
            <p className="text-sm font-medium opacity-90 drop-shadow-md">@{live?.user}</p>
          </div>
        </div>
        
        <div className="h-[40%]">
          <ChatPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full p-4 space-y-6 pb-24 overflow-y-auto no-scrollbar">
      {feedItems.map((item) => (
        <div 
          key={item.id} 
          onClick={() => item.type === "live" && setActiveLiveId(item.id)}
          className="relative w-full overflow-hidden rounded-3xl bg-card shadow-sm border transition-all active:scale-[0.98] cursor-pointer"
        >
          {/* Content Preview */}
          <div className={item.type === "reel" ? "aspect-[9/16]" : "aspect-video"}>
            <Image 
              src={item.thumbnail} 
              fill 
              alt={item.title} 
              className="object-cover"
              data-ai-hint={item.type === 'live' ? 'nature stream' : 'nature vertical'}
            />
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex gap-2">
              {item.type === "live" ? (
                <Badge className="bg-red-500 animate-pulse border-none">
                  <Radio size={12} className="mr-1" /> LIVE
                </Badge>
              ) : (
                <Badge variant="secondary" className="bg-white/20 backdrop-blur-md text-white border-none">
                  <Play size={12} className="mr-1" fill="white" /> REEL
                </Badge>
              )}
            </div>

            {/* Content Details */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="text-white space-y-1">
                <p className="text-sm font-bold opacity-90">@{item.user}</p>
                <h3 className="text-lg font-headline font-semibold leading-tight">{item.title}</h3>
                <div className="flex items-center gap-3 text-[11px] font-medium opacity-80 pt-1">
                  {item.type === "live" ? (
                    <span className="flex items-center gap-1"><Eye size={12} /> {item.views}</span>
                  ) : (
                    <>
                      <span className="flex items-center gap-1"><Heart size={12} /> {item.likes}</span>
                      <span className="flex items-center gap-1"><Play size={12} /> {item.views}</span>
                    </>
                  )}
                </div>
              </div>

              {/* Interaction Buttons for Reels */}
              {item.type === "reel" && (
                <div className="flex flex-col gap-4 text-white pb-2">
                  <div className="flex flex-col items-center gap-1">
                    <div className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                      <Heart size={20} />
                    </div>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <div className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                      <MessageCircle size={20} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
