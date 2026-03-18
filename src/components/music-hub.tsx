"use client";

import { useState } from "react";
import { Music, Play, SkipForward, Pause } from "lucide-react";

export function MusicHub() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="absolute bottom-24 left-0 right-0 px-8 z-40">
      <div className="h-12 glass-panel rounded-full px-4 flex items-center gap-3 border-white/10 bg-black/40 backdrop-blur-md">
        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary animate-pulse">
          <Music size={14} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-[9px] font-black text-primary uppercase tracking-widest truncate">Neural Waves v.01</h4>
          <div className="flex gap-1 h-1 items-end mt-0.5">
            {[1, 2, 3, 4, 3, 2].map((h, i) => (
              <div key={i} className="w-0.5 bg-primary/40 rounded-full" style={{ height: isPlaying ? `${h * 4}px` : '2px' }}></div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 w-8 rounded-full flex items-center justify-center text-white/80 hover:text-primary transition-all"
          >
            {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          </button>
          <button className="h-8 w-8 rounded-full flex items-center justify-center text-white/30">
            <SkipForward size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
