"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Share2, Music } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export function ReelsViewer({ 
  onProfileClick,
  requireAuth
}: { 
  onProfileClick: (u: string) => void,
  requireAuth: (cb: () => void) => void
}) {
  const [reels, setReels] = useState([
    { id: "1", user: "EcoExplorer_Gaia", description: "Las cascadas ocultas del Nodo 04. #nature #bio", likes: 124, comments: 12, video: "https://picsum.photos/seed/reel1/1080/1920", liked: false, following: false },
    { id: "2", user: "CyberBotany_Lab", description: "Síntesis de algas bioluminiscentes completada. #cyber #science", likes: 89, comments: 8, video: "https://picsum.photos/seed/reel2/1080/1920", liked: false, following: false },
    { id: "3", user: "NeonPulse_Drive", description: "Vibras nocturnas en el bio-domo. 🌱⚡", likes: 256, comments: 42, video: "https://picsum.photos/seed/reel3/1080/1920", liked: false, following: false }
  ]);

  const toggleLike = (id: string) => {
    requireAuth(() => {
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
    });
  };

  const toggleFollow = (id: string) => {
    requireAuth(() => {
      setReels(reels.map(reel => {
        if (reel.id === id) {
          if (!reel.following) toast({ title: "Sincronización Exitosa", description: `Siguiendo a @${reel.user}` });
          return { ...reel, following: !reel.following };
        }
        return reel;
      }));
    });
  };

  const handleShare = (user: string) => {
    requireAuth(() => {
      toast({ title: "Enlace Copiado", description: `Señal de @${user} lista para compartir.` });
    });
  };

  return (
    <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {reels.map((reel) => (
        <div key={reel.id} className="relative h-full w-full snap-start shrink-0 flex flex-col items-center justify-center">
          <div className="relative w-full h-full max-w-[500px]">
            <Image src={reel.video} fill alt="Reel" className="object-cover opacity-80" priority={reel.id === "1"} />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none"></div>
            
            <div className="absolute bottom-12 left-8 right-20 space-y-5">
              <div className="flex items-center gap-4 min-w-0">
                <div 
                  className="h-12 w-12 rounded-full border-2 border-primary overflow-hidden shadow-2xl cursor-pointer shrink-0"
                  onClick={() => onProfileClick(reel.user)}
                >
                  <Image src={`https://picsum.photos/seed/av${reel.id}/100/100`} width={48} height={48} alt="Avatar" />
                </div>
                <div className="flex flex-col cursor-pointer min-w-0 flex-1" onClick={() => onProfileClick(reel.user)}>
                  <span className="text-[11px] font-black text-white italic uppercase tracking-widest truncate">@{reel.user}</span>
                  <span className="text-[8px] text-primary font-black uppercase tracking-widest">Protocolo Activo</span>
                </div>
                <button 
                  onClick={() => toggleFollow(reel.id)}
                  className={cn(
                    "ml-2 px-4 py-2 text-[9px] font-black rounded-xl uppercase tracking-widest transition-all shrink-0",
                    reel.following ? "bg-white/10 text-white/40" : "bg-primary text-black shadow-lg"
                  )}
                >
                  {reel.following ? "Siguiendo" : "Seguir"}
                </button>
              </div>
              <p className="text-sm text-white/90 leading-relaxed font-medium max-w-[90%] line-clamp-3">{reel.description}</p>
              <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md w-fit px-4 py-2 rounded-xl border border-white/5">
                <Music size={12} className="text-primary animate-pulse" />
                <div className="overflow-hidden w-40">
                  <p className="text-[9px] text-primary font-black uppercase tracking-widest whitespace-nowrap animate-[marquee_12s_linear_infinite]">
                    Bio-Signal Audio • Gaia Mix v.1.0
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute bottom-60 right-3 flex flex-col items-center gap-8 z-50">
              <div 
                onClick={() => toggleLike(reel.id)}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className={cn(
                  "h-14 w-14 glass-panel rounded-full flex items-center justify-center transition-all active:scale-75 shadow-2xl",
                  reel.liked ? "text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] border-red-500/40" : "text-white group-hover:text-primary"
                )}>
                  <Heart size={28} fill={reel.liked ? "currentColor" : "none"} />
                </div>
                <span className="text-[10px] font-black text-white/60 tracking-widest">{reel.likes}K</span>
              </div>

              <div 
                onClick={() => requireAuth(() => toast({ title: "Signal Chat", description: "Bandeja de comentarios protegida." }))}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="h-14 w-14 glass-panel rounded-full flex items-center justify-center text-white group-hover:text-primary transition-all shadow-2xl">
                  <MessageCircle size={28} />
                </div>
                <span className="text-[10px] font-black text-white/60 tracking-widest">{reel.comments}</span>
              </div>

              <div 
                onClick={() => handleShare(reel.user)}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                <div className="h-14 w-14 glass-panel rounded-full flex items-center justify-center text-white group-hover:text-primary transition-all shadow-2xl">
                  <Share2 size={28} />
                </div>
              </div>
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
