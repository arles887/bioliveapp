"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Heart, MessageCircle, Share2, Music, Check, UserPlus, 
  Play, Pause, Volume2, VolumeX, Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

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
  "https://www.youtube.com/embed/dORlRI79D3w?autoplay=0&mute=1&loop=1&playlist=dORlRI79D3w&controls=0&modestbranding=1&rel=0",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
];

const INITIAL_REELS = Array.from({ length: 50 }, (_, i) => ({
  id: `reel-${i}`,
  user: `BioEntity_${i + 100}`,
  description: `Inyectando señal neural #${i + 1}. Exploración del bioma Gaia Sector ${Math.floor(Math.random() * 10)}. #bio #cyber #life`,
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
        <ReelItem 
          key={reel.id} 
          reel={reel} 
          globalMuted={globalMuted}
          setGlobalMuted={setGlobalMuted}
          onProfileClick={onProfileClick} 
          toggleLike={toggleLike}
          toggleFollow={toggleFollow}
          handleShare={handleShare}
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
  handleShare, 
  requireAuth 
}: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showCenterIcon, setShowCenterIcon] = useState(false);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const ffInterval = useRef<any>(null);

  const isYouTube = reel.video.includes('youtube.com') || reel.video.includes('youtu.be');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.8 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isActive) {
      setIsPlaying(false);
      if (!isYouTube && videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      setIsPlaying(true);
      if (!isYouTube && videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isActive, isYouTube]);

  useEffect(() => {
    if (!globalMuted && isPlaying && isActive) {
      window.dispatchEvent(new CustomEvent('bio-video-playing'));
    }
  }, [globalMuted, isPlaying, isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || isYouTube) return;

    const updateProgress = () => {
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
      }
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, [isYouTube]);

  const handleInteraction = (e: React.MouseEvent) => {
    if (globalMuted) {
      setGlobalMuted(false);
      return;
    }

    if (isYouTube) return;
    
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
      setShowCenterIcon(true);
      setTimeout(() => setShowCenterIcon(false), 800);
    }
  };

  const startFastForward = () => {
    if (isYouTube || !videoRef.current) return;
    setIsFastForwarding(true);
    videoRef.current.playbackRate = 2.0;
    ffInterval.current = setInterval(() => {
      if (videoRef.current) {
        videoRef.current.currentTime += 0.5;
      }
    }, 100);
  };

  const stopFastForward = () => {
    setIsFastForwarding(false);
    if (videoRef.current) videoRef.current.playbackRate = 1.0;
    if (ffInterval.current) clearInterval(ffInterval.current);
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setGlobalMuted(!globalMuted);
  };

  const getYouTubeSrc = () => {
    if (!isYouTube) return "";
    let url = reel.video;
    const finalMute = !isActive || globalMuted;
    url = url.replace(/autoplay=[01]/, `autoplay=${isActive ? 1 : 0}`);
    url = url.replace(/mute=[01]/, `mute=${finalMute ? 1 : 0}`);
    if (!url.includes('mute=')) url += `&mute=${finalMute ? 1 : 0}`;
    return url;
  };

  return (
    <div ref={containerRef} className="relative h-full w-full snap-start snap-always shrink-0 flex flex-col items-center justify-center">
      <div className="relative w-full h-full max-w-[500px] bg-black">
        {isYouTube ? (
          <div className="h-full w-full" onClick={handleInteraction}>
            <iframe 
              src={getYouTubeSrc()} 
              className="h-full w-full object-cover opacity-80 pointer-events-none" 
              allow="autoplay; encrypted-media"
            />
          </div>
        ) : (
          <video 
            ref={videoRef}
            src={reel.video} 
            className="h-full w-full object-cover opacity-80" 
            loop 
            muted={!isActive || globalMuted}
            playsInline
            onMouseDown={startFastForward}
            onMouseUp={stopFastForward}
            onMouseLeave={stopFastForward}
            onTouchStart={startFastForward}
            onTouchEnd={stopFastForward}
            onClick={handleInteraction}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none"></div>
        
        {showCenterIcon && !isYouTube && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[70]">
            <div className="h-10 w-10 rounded-full bg-black/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-primary/60 shadow-[0_0_30px_rgba(204,255,0,0.1)] animate-in zoom-in fade-in duration-300">
              {isPlaying ? <Play size={20} fill="currentColor" className="ml-0.5" /> : <Pause size={20} fill="currentColor" />}
            </div>
          </div>
        )}

        {isFastForwarding && (
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 z-50 px-6 py-2 bg-primary/20 backdrop-blur-xl border border-primary/40 rounded-full flex items-center gap-3 animate-pulse">
            <Zap size={14} className="text-primary" fill="currentColor" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">2x Bio-Speed</span>
          </div>
        )}

        {!isYouTube && (
          <div className="absolute top-8 left-0 right-0 px-6 z-50 flex gap-1 items-center justify-center">
            {Array.from({ length: 15 }).map((_, i) => {
              const segmentProgress = (i + 1) * (100 / 15);
              const isActiveSegment = progress >= segmentProgress - (100/15);
              return (
                <div 
                  key={i} 
                  className={cn(
                    "h-1 flex-1 rounded-full transition-all duration-300",
                    isActiveSegment ? "bg-primary shadow-[0_0_8px_rgba(204,255,0,0.6)]" : "bg-white/10"
                  )}
                />
              );
            })}
          </div>
        )}

        <button 
          onClick={toggleMute}
          className="absolute top-32 right-6 z-50 h-10 w-10 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 flex items-center justify-center text-primary transition-all active:scale-90"
        >
          {globalMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <div className="absolute bottom-12 left-8 right-20 space-y-5 z-[60]">
          <div className="flex items-center gap-4 min-w-0">
            <div 
              className="h-12 w-12 rounded-full border-2 border-primary overflow-hidden shadow-2xl cursor-pointer shrink-0"
              onClick={() => onProfileClick(reel.user)}
            >
              <img src={`https://picsum.photos/seed/${reel.user}/100/100`} width={48} height={48} alt="Avatar" className="object-cover h-full w-full" />
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
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md w-fit px-4 py-2 rounded-xl border border-white/5 overflow-hidden">
            <Music size={12} className="text-primary animate-pulse" />
            <div className="overflow-hidden w-40">
              <p className="text-[9px] text-primary font-black uppercase tracking-widest whitespace-nowrap animate-[marquee_12s_linear_infinite]">
                Bio-Signal Audio • Gaia Mix v.1.0
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-[210px] right-3 flex flex-col items-center gap-6 z-50">
          <div 
            onClick={() => toggleLike(reel.id)}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <div className={cn(
              "h-14 w-14 bg-white/5 backdrop-blur-xl border rounded-full flex items-center justify-center transition-all active:scale-75 shadow-2xl",
              reel.liked ? "text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] border-red-500/40" : "text-white group-hover:text-primary"
            )}>
              <Heart size={28} fill={reel.liked ? "currentColor" : "none"} />
            </div>
            <span className="text-[10px] font-black text-white/60 tracking-widest">{reel.likes}K</span>
          </div>

          <div 
            onClick={() => requireAuth(() => toast({ title: "Signal Chat", description: "Bandeja de comentarios protegida." }))}
            className="flex flex-col items-center gap-1.5 cursor-pointer group"
          >
            <div className="h-14 w-14 bg-white/5 backdrop-blur-xl border rounded-full flex items-center justify-center text-white group-hover:text-primary transition-all shadow-2xl">
              <MessageCircle size={28} />
            </div>
            <span className="text-[10px] font-black text-white/60 tracking-widest">{reel.comments}</span>
          </div>

          <div 
            onClick={() => handleShare(reel.user)}
            className="flex flex-col items-center group cursor-pointer"
          >
            <div className="h-14 w-14 bg-white/5 backdrop-blur-xl border rounded-full flex items-center justify-center text-white group-hover:text-primary transition-all shadow-2xl">
              <Share2 size={28} />
            </div>
          </div>
        </div>
      </div>
      
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
    </div>
  );
}
