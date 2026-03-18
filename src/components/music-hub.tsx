
"use client";

import { useState } from "react";
import { Music, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

export function MusicHub({ isVisible }: { isVisible: boolean }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className={cn(
      "absolute bottom-28 right-8 z-[70] transition-all duration-700",
      isVisible ? "scale-100 opacity-100" : "scale-50 opacity-0 pointer-events-none"
    )}>
      <button 
        onClick={() => setIsPlaying(!isPlaying)}
        className={cn(
          "group relative h-12 w-12 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/5 flex items-center justify-center transition-all duration-500 shadow-2xl overflow-hidden",
          isPlaying ? "ring-1 ring-primary/30" : ""
        )}
      >
        {isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center gap-[2px] opacity-10">
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
          isPlaying ? "text-primary" : "text-white/20 group-hover:text-primary"
        )}>
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Music size={18} />}
        </div>
      </button>

      <div className={cn(
        "absolute bottom-0 right-14 whitespace-nowrap px-4 py-2 rounded-full bg-white/[0.03] backdrop-blur-md border border-white/5 text-[7px] font-black uppercase tracking-[0.3em] text-primary/60 transition-all duration-500 pointer-events-none",
        isPlaying ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
      )}>
        Signal v.04
      </div>
    </div>
  );
}
