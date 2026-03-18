"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Music, UserPlus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export function ReelsViewer() {
  const [reels, setReels] = useState([
    { id: "1", user: "EcoExplorer", description: "The hidden waterfalls of Gaia Node 04 #nature #bio", likes: 124, comments: 12, video: "https://picsum.photos/seed/reel1/1080/1920", liked: false, following: false },
    { id: "2", user: "CyberBotany", description: "Bioluminescent algae synthesis complete. #cyber #science", likes: 89, comments: 8, video: "https://picsum.photos/seed/reel2/1080/1920", liked: false, following: false },
  ]);

  const toggleLike = (id: string) => {
    setReels(reels.map(reel => {
      if (reel.id === id) {
        return { 
          ...reel, 
          liked: !reel.liked, 
          likes: reel.liked ? reel.likes - 1 : reel.likes + 1 
        };
      }
      return reel;
    }));
  };

  const toggleFollow = (id: string) => {
    setReels(reels.map(reel => {
      if (reel.id === id) {
        if (!reel.following) toast({ title: "Sincronización Exitosa", description: `Siguiendo a @${reel.user}` });
        return { ...reel, following: !reel.following };
      }
      return reel;
    }));
  };

  const handleShare = (user: string) => {
    toast({ title: "Enlace Copiado", description: `Señal de @${user} lista para retransmitir.` });
  };

  return (
    <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {reels.map((reel) => (
        <div key={reel.id} className="relative h-full w-full snap-start shrink-0">
          <Image src={reel.video} fill alt="Reel" className="object-cover opacity-80" />
          
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/80 pointer-events-none"></div>
          
          <div className="absolute bottom-28 left-6 right-16 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border-2 border-primary overflow-hidden">
                <Image src={`https://picsum.photos/seed/av${reel.id}/100/100`} width={40} height={40} alt="Avatar" />
              </div>
              <span className="text-sm font-black text-white italic">@{reel.user}</span>
              <button 
                onClick={() => toggleFollow(reel.id)}
                className={cn(
                  "px-4 py-1.5 text-[9px] font-black rounded-full uppercase tracking-widest transition-all",
                  reel.following ? "bg-white/10 text-white/40" : "bg-primary text-black"
                )}
              >
                {reel.following ? "Siguiendo" : "Seguir"}
              </button>
            </div>
            <p className="text-xs text-white/90 leading-relaxed font-medium">{reel.description}</p>
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-white/5 flex items-center justify-center">
                <Music size={10} className="text-primary animate-pulse" />
              </div>
              <div className="overflow-hidden w-40">
                <p className="text-[10px] text-primary font-black uppercase tracking-widest whitespace-nowrap animate-[marquee_10s_linear_infinite]">
                  Original Bio-Signal Audio - Neural Mix 04 • Gaia Protocol
                </p>
              </div>
            </div>
          </div>

          <div className="absolute bottom-32 right-4 flex flex-col items-center gap-8">
            <div 
              onClick={() => toggleLike(reel.id)}
              className="flex flex-col items-center gap-2 group cursor-pointer"
            >
              <div className={cn(
                "h-12 w-12 glass-panel rounded-full flex items-center justify-center transition-all active:scale-75",
                reel.liked ? "text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] border-red-500/30" : "text-white group-hover:text-primary"
              )}>
                <Heart size={24} fill={reel.liked ? "currentColor" : "none"} />
              </div>
              <span className="text-[9px] font-black text-white/60">{reel.likes}K</span>
            </div>

            <div 
              onClick={() => toast({ title: "Protocolo de Chat", description: "Bandeja de comentarios encriptada temporalmente." })}
              className="flex flex-col items-center gap-2 cursor-pointer group"
            >
              <div className="h-12 w-12 glass-panel rounded-full flex items-center justify-center text-white group-hover:text-primary transition-all">
                <MessageCircle size={24} />
              </div>
              <span className="text-[9px] font-black text-white/60">{reel.comments}K</span>
            </div>

            <div 
              onClick={() => handleShare(reel.user)}
              className="h-12 w-12 glass-panel rounded-full flex items-center justify-center text-white cursor-pointer group"
            >
              <Share2 size={24} className="group-hover:text-primary transition-all" />
            </div>
          </div>
        </div>
      ))}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}