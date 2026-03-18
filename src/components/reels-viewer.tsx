"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Music } from "lucide-react";

export function ReelsViewer() {
  const reels = [
    { id: "1", user: "EcoExplorer", description: "The hidden waterfalls of Gaia Node 04 #nature #bio", likes: "124K", comments: "1.2K", video: "https://picsum.photos/seed/reel1/1080/1920" },
    { id: "2", user: "CyberBotany", description: "Bioluminescent algae synthesis complete. #cyber #science", likes: "89K", comments: "842", video: "https://picsum.photos/seed/reel2/1080/1920" },
  ];

  return (
    <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {reels.map((reel) => (
        <div key={reel.id} className="relative h-full w-full snap-start shrink-0">
          <Image src={reel.video} fill alt="Reel" className="object-cover opacity-80" />
          
          {/* Overlay Content */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none"></div>
          
          <div className="absolute bottom-28 left-6 right-16 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border-2 border-primary overflow-hidden">
                <Image src="https://picsum.photos/seed/avatar1/100/100" width={40} height={40} alt="Avatar" />
              </div>
              <span className="text-sm font-black text-white italic">@{reel.user}</span>
              <button className="px-4 py-1.5 bg-primary text-black text-[9px] font-black rounded-full uppercase tracking-widest">Follow</button>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-medium">{reel.description}</p>
            <div className="flex items-center gap-2">
              <Music size={12} className="text-primary" />
              <marquee className="text-[10px] text-primary font-black uppercase tracking-widest w-40">Original Bio-Signal Audio - Neural Mix 04</marquee>
            </div>
          </div>

          {/* Side Actions */}
          <div className="absolute bottom-32 right-4 flex flex-col items-center gap-8">
            <div className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="h-12 w-12 glass-panel rounded-full flex items-center justify-center text-white group-active:scale-90 group-hover:text-primary transition-all">
                <Heart size={24} />
              </div>
              <span className="text-[9px] font-black text-white/60">{reel.likes}</span>
            </div>
            <div className="flex flex-col items-center gap-2 cursor-pointer">
              <div className="h-12 w-12 glass-panel rounded-full flex items-center justify-center text-white">
                <MessageCircle size={24} />
              </div>
              <span className="text-[9px] font-black text-white/60">{reel.comments}</span>
            </div>
            <div className="h-12 w-12 glass-panel rounded-full flex items-center justify-center text-white">
              <Share2 size={24} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}