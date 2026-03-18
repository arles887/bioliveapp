
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Heart, MessageCircle, Share2, Music, Check, UserPlus, 
  Play, Pause, Volume2, VolumeX, Rewind, FastForward 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { toast } from "@/hooks/use-toast";

const VIDEO_SOURCES = [
  "https://www.youtube.com/embed/gCsemG6ip54?autoplay=1&mute=0&loop=1&playlist=gCsemG6ip54&controls=1&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/VAuMrxuGlQw?autoplay=1&mute=0&loop=1&playlist=VAuMrxuGlQw&controls=1&modestbranding=1&rel=0",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
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
          onProfileClick={onProfileClick} 
          toggleLike={toggleLike}
          toggleFollow={toggleFollow}
          handleShare={handleShare}
          requireAuth={requireAuth}
        />
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

function ReelItem({ reel, onProfileClick, toggleLike, toggleFollow, handleShare, requireAuth }: any) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const isYouTube = reel.video.includes('youtube.com') || reel.video.includes('youtu.be');

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!isYouTube) videoRef.current?.play().catch(() => {});
          setIsPlaying(true);
        } else {
          if (!isYouTube) videoRef.current?.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, [isYouTube]);

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

  const handlePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isYouTube) return;
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isYouTube) return;
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (value: number[]) => {
    if (isYouTube || !videoRef.current) return;
    const time = (value[0] / 100) * videoRef.current.duration;
    videoRef.current.currentTime = time;
    setProgress(value[0]);
  };

  const handleFastForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isYouTube || !videoRef.current) return;
    videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 5);
  };

  const handleRewind = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isYouTube || !videoRef.current) return;
    videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 5);
  };

  return (
    <div className="relative h-full w-full snap-start shrink-0 flex flex-col items-center justify-center">
      <div className="relative w-full h-full max-w-[500px] bg-black">
        {isYouTube ? (
          <iframe 
            src={reel.video} 
            className="h-full w-full object-cover opacity-80 pointer-events-auto" 
            allow="autoplay; encrypted-media"
          />
        ) : (
          <video 
            ref={videoRef}
            src={reel.video} 
            className="h-full w-full object-cover opacity-80" 
            loop 
            muted={isMuted}
            playsInline
            onClick={handlePlayPause}
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none"></div>
        
        {/* Play/Pause Overlay Icon */}
        {!isYouTube && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
            <div className="h-20 w-20 rounded-full bg-black/40 backdrop-blur-xl border border-white/20 flex items-center justify-center text-primary">
              {isPlaying ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-2" />}
            </div>
          </div>
        )}

        <div className="absolute bottom-12 left-8 right-20 space-y-5 z-[60]">
          {/* Seek Bar */}
          {!isYouTube && (
            <div className="bg-black/40 backdrop-blur-3xl border border-white/10 rounded-2xl p-4 space-y-3 mb-2">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <button onClick={handleRewind} className="text-white/60 hover:text-primary transition-colors">
                        <Rewind size={18} fill="currentColor" />
                     </button>
                     <button onClick={handlePlayPause} className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-black active:scale-90 transition-all">
                        {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                     </button>
                     <button onClick={handleFastForward} className="text-white/60 hover:text-primary transition-colors">
                        <FastForward size={18} fill="currentColor" />
                     </button>
                  </div>
                  <button onClick={handleMuteToggle} className="text-primary hover:scale-110 transition-all">
                     {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
               </div>
               <Slider 
                  value={[progress]} 
                  max={100} 
                  step={0.1} 
                  onValueChange={handleSeek}
                  className="[&>[data-slot=slider-range]]:bg-primary [&>[data-slot=slider-thumb]]:border-primary"
               />
            </div>
          )}

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
              "h-14 w-14 bg-white/5 backdrop-blur-xl border rounded-full flex items-center justify-center transition-all active:scale-75 shadow-2xl",
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
            <div className="h-14 w-14 bg-white/5 backdrop-blur-xl border rounded-full flex items-center justify-center text-white group-hover:text-primary transition-all shadow-2xl">
              <MessageCircle size={28} />
            </div>
            <span className="text-[10px] font-black text-white/60 tracking-widest">{reel.comments}</span>
          </div>

          <div 
            onClick={() => handleShare(reel.user)}
            className="flex flex-col items-center gap-2 group cursor-pointer"
          >
            <div className="h-14 w-14 bg-white/5 backdrop-blur-xl border rounded-full flex items-center justify-center text-white group-hover:text-primary transition-all shadow-2xl">
              <Share2 size={28} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
