
"use client";

import { useState, useEffect } from "react";
import { Music, Pause, SkipForward, Music2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

export function MusicHub({ 
  isVisible,
  requireAuth
}: { 
  isVisible: boolean;
  requireAuth: (cb: () => void) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(4);

  // Listen for video playback events to pause music
  useEffect(() => {
    const handleVideoPlaying = () => {
      setIsPlaying(false);
    };

    window.addEventListener('bio-video-playing', handleVideoPlaying);
    return () => window.removeEventListener('bio-video-playing', handleVideoPlaying);
  }, []);

  const togglePlayback = () => {
    requireAuth(() => {
      setIsPlaying(!isPlaying);
      if (!isPlaying) {
        toast({ title: "Inyectando Señal", description: `Reproduciendo Neural Mix #0${currentTrack}` });
      }
    });
  };

  const nextTrack = () => {
    requireAuth(() => {
      const next = (currentTrack % 9) + 1;
      setCurrentTrack(next);
      toast({ title: "Nueva Frecuencia", description: `Cambiando a Mix #0${next}` });
    });
  };

  return (
    <div className={cn(
      "absolute bottom-28 right-8 z-[70] transition-all duration-700",
      isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"
    )}>
      <div className="relative group">
        <button 
          onClick={togglePlayback}
          className={cn(
            "relative h-14 w-14 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 flex items-center justify-center transition-all duration-500 shadow-2xl overflow-hidden active:scale-90",
            isPlaying ? "ring-2 ring-primary/40" : ""
          )}
        >
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center gap-[2px] opacity-20">
               {[1, 2, 3, 2, 1, 2, 3, 2].map((h, i) => (
                 <div 
                   key={i} 
                   className="w-[2px] bg-primary animate-pulse-gentle" 
                   style={{ height: `${h * 12}px`, animationDelay: `${i * 0.1}s` }}
                 />
               ))}
            </div>
          )}

          <div className={cn(
            "relative z-10 transition-colors",
            isPlaying ? "text-primary" : "text-white/20 group-hover:text-primary"
          )}>
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Music size={20} />}
          </div>
        </button>

        {isPlaying && (
          <button 
            onClick={nextTrack}
            className="absolute -top-4 -right-4 h-8 w-8 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all"
          >
            <SkipForward size={14} fill="currentColor" />
          </button>
        )}
      </div>

      <div className={cn(
        "absolute bottom-0 right-16 whitespace-nowrap px-5 py-2.5 rounded-2xl bg-white/[0.05] backdrop-blur-md border border-white/10 text-[7px] font-black uppercase tracking-[0.3em] text-primary/80 transition-all duration-500 pointer-events-none shadow-xl",
        isPlaying ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      )}>
        Signal v.0{currentTrack} • Active
      </div>
    </div>
  );
}
