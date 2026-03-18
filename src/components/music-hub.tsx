
"use client";

import { useState } from "react";
import { Music, Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export function MusicHub({ isVisible }: { isVisible: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={cn(
      "absolute bottom-28 right-6 z-[70] transition-all duration-500",
      isVisible ? "scale-100 opacity-100" : "scale-75 opacity-0 pointer-events-none"
    )}>
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className={cn(
          "group relative h-12 w-12 rounded-full glass-panel border border-white/10 flex items-center justify-center transition-all duration-300 shadow-2xl overflow-hidden",
          isPlaying ? "ring-2 ring-primary/40 bg-black/60" : "bg-black/40"
        )}
      >
        {/* Onda de sonido animada cuando está encendido */}
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center gap-[2px] opacity-20">
             {[1, 2, 3, 2, 1].map((h, i) => (
               <div 
                 key={i} 
                 className="w-[2px] bg-primary animate-pulse-gentle" 
                 style={{ height: `${h * 10}px`, animationDelay: `${i * 0.1}s` }}
               />
             ))}
          </div>
        )}

        <div className={cn(
          "relative z-10 transition-colors",
          isPlaying ? "text-primary" : "text-white/40 group-hover:text-primary"
        )}>
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Music size={18} />}
        </div>
      </button>

      {/* Mini Etiqueta de Canción (Aparece solo en hover o al sonar) */}
      <div className={cn(
        "absolute bottom-0 right-14 whitespace-nowrap px-4 py-2 rounded-full glass-panel border border-white/5 text-[8px] font-black uppercase tracking-[0.2em] text-primary/80 transition-all duration-300 pointer-events-none",
        isPlaying ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      )}>
        Neural Waves v.04
      </div>
    </div>
  );
}
