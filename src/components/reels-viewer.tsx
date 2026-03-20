"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Heart, MessageCircle, Share2, Music, Play, Pause, Volume2, VolumeX, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

/**
 * @fileOverview Visualizador de Reels optimizado.
 * Estandarizado a 500px con control estricto de desbordamiento de texto.
 */

const VIDEO_SOURCES = [
  "https://www.youtube.com/embed/Ap7pyB8Gp5Q?autoplay=0&mute=1&loop=1&playlist=Ap7pyB8Gp5Q&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/-rDD5v-oTjM?autoplay=0&mute=1&loop=1&playlist=-rDD5v-oTjM&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/dn3mKOYeR20?autoplay=0&mute=1&loop=1&playlist=dn3mKOYeR20&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/A0I0CnYoFO8?autoplay=0&mute=1&loop=1&playlist=A0I0CnYoFO8&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/OKkle0WgDQQ?autoplay=0&mute=1&loop=1&playlist=OKkle0WgDQQ&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/80aU_aT1VPA?autoplay=0&mute=1&loop=1&playlist=80aU_aT1VPA&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/sJTcMA3e7LI?autoplay=0&mute=1&loop=1&playlist=sJTcMA3e7LI&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/kMQLJC9aV9s?autoplay=0&mute=1&loop=1&playlist=kMQLJC9aV9s&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/fqOJVCH3RAc?autoplay=0&mute=1&loop=1&playlist=fqOJVCH3RAc&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/5U2xPq_oSHI?autoplay=0&mute=1&loop=1&playlist=5U2xPq_oSHI&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/twG-EwxFb-A?autoplay=0&mute=1&loop=1&playlist=twG-EwxFb-A&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/zc4hD4ytN0A?autoplay=0&mute=1&loop=1&playlist=zc4hD4ytN0A&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/dORlRI79D3w?autoplay=0&mute=1&loop=1&playlist=dORlRI79D3w&controls=0&modestbranding=1&rel=0"
];

const INITIAL_REELS = Array.from({ length: 50 }, (_, i) => ({
  id: `reel-${i}`,
  user: `BioEntity_${i + 100}`,
  description: `Inyectando señal neural #${i + 1}. Exploración del bioma Gaia Sector ${Math.floor(Math.random() * 10)}. #bio #cyber #life #nature #enterprise`,
  likes: Math.floor(Math.random() * 500),
  comments: Math.floor(Math.random() * 100),
  video: VIDEO_SOURCES[i % VIDEO_SOURCES.length],
  liked: false,
  following: false
}));

export function ReelsViewer({ 
  onProfileClick,
  requireAuth
}: { 
  onProfileClick: (u: string) => void,
  requireAuth: (cb: () => void) => void
}) {
  const [reels, setReels] = useState(INITIAL_REELS);
  const [globalMuted, setGlobalMuted] = useState(true);

  const toggleLike = (id: string) => {
    requireAuth(() => {
      setReels(prev => prev.map(reel => {
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
      setReels(prev => prev.map(reel => {
        if (reel.id === id) {
          if (!reel.following) toast({ title: "Sincronizado", description: `@${reel.user} añadido.` });
          return { ...reel, following: !reel.following };
        }
        return reel;
      }));
    });
  };

  return (
    <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {reels.map((reel) => (
        <ReelItem 
          key={reel.id} 
          reel={reel} 
          globalMuted={globalMuted}
          setGlobalMuted={setGlobalMuted}
          onProfileClick={onProfileClick} 
          toggleLike={toggleLike}
          toggleFollow={toggleFollow}
          requireAuth={requireAuth}
        />
      ))}
    </div>
  );
}

function ReelItem({ 
  reel, 
  globalMuted, 
  setGlobalMuted, 
  onProfileClick, 
  toggleLike, 
  toggleFollow, 
  requireAuth 
}: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsActive(entry.isIntersecting), { threshold: 0.8 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const getYouTubeSrc = () => {
    let url = reel.video;
    const finalMute = !isActive || globalMuted;
    if (url.includes('shorts/')) {
        const id = url.split('shorts/')[1].split('?')[0];
        url = `https://www.youtube.com/embed/${id}?autoplay=${isActive ? 1 : 0}&mute=${finalMute ? 1 : 0}&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0`;
    }
    return url;
  };

  return (
    <div ref={containerRef} className="relative h-full w-full snap-start snap-always shrink-0 flex items-center justify-center">
      <div className="relative w-full h-full max-w-[500px] bg-black overflow-hidden">
        <iframe 
          src={getYouTubeSrc()} 
          className="h-full w-full object-cover opacity-80 pointer-events-none" 
          allow="autoplay; encrypted-media"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none"></div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); setGlobalMuted(!globalMuted); }}
          className="absolute top-28 right-6 z-50 h-10 w-10 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 flex items-center justify-center text-primary"
        >
          {globalMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <div className="absolute bottom-12 left-8 right-20 space-y-4 z-50">
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="h-10 w-10 rounded-full border-2 border-primary overflow-hidden shadow-2xl cursor-pointer shrink-0"
              onClick={() => onProfileClick(reel.user)}
            >
              <img src={`https://picsum.photos/seed/${reel.user}/100/100`} alt="Avatar" className="object-cover h-full w-full" />
            </div>
            <div className="flex flex-col cursor-pointer min-w-0 flex-1" onClick={() => onProfileClick(reel.user)}>
              <span className="text-[10px] font-black text-white italic uppercase tracking-widest truncate">@{reel.user}</span>
            </div>
            <button 
              onClick={() => toggleFollow(reel.id)}
              className={cn(
                "px-3 py-1.5 text-[8px] font-black rounded-xl uppercase tracking-widest transition-all shrink-0",
                reel.following ? "bg-white/10 text-white/40" : "bg-primary text-black shadow-lg"
              )}
            >
              {reel.following ? "Siguiendo" : "Seguir"}
            </button>
          </div>
          <p className="text-[11px] text-white/90 leading-relaxed font-medium line-clamp-3 pr-4">{reel.description}</p>
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md w-fit px-4 py-1.5 rounded-xl border border-white/5">
            <Music size={10} className="text-primary animate-pulse" />
            <span className="text-[8px] text-primary font-black uppercase tracking-widest italic">Signal v.01 • Active</span>
          </div>
        </div>

        <div className="absolute bottom-32 right-3 flex flex-col items-center gap-6 z-50">
          <div onClick={() => toggleLike(reel.id)} className="flex flex-col items-center gap-1 cursor-pointer">
            <div className={cn(
              "h-12 w-12 bg-white/5 backdrop-blur-xl border rounded-full flex items-center justify-center transition-all shadow-2xl",
              reel.liked ? "text-red-500 border-red-500/40" : "text-white"
            )}>
              <Heart size={24} fill={reel.liked ? "currentColor" : "none"} />
            </div>
            <span className="text-[9px] font-black text-white/60 tracking-widest">{reel.likes}K</span>
          </div>
          <div onClick={() => requireAuth(() => {})} className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="h-12 w-12 bg-white/5 backdrop-blur-xl border rounded-full flex items-center justify-center text-white shadow-2xl">
              <MessageCircle size={24} />
            </div>
            <span className="text-[9px] font-black text-white/60 tracking-widest">{reel.comments}</span>
          </div>
          <div onClick={() => toast({ title: "Enlace Copiado" })} className="h-12 w-12 bg-white/5 backdrop-blur-xl border rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer">
            <Share2 size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
