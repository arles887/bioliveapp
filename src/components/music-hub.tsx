
"use client";

import { useState } from "react";
import { Music, Play, SkipForward, Maximize2 } from "lucide-react";

export function MusicHub() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-[85%] z-[90]">
      <div className="glass-panel rounded-2xl p-3 flex items-center gap-4 border-primary/20 bg-black/60 shadow-2xl animate-in slide-in-from-bottom-10 duration-700">
        <div className="h-10 w-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/20 animate-pulse"></div>
          <Music size={18} className="relative z-10" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] truncate">Biosynthesis v2.1</h4>
          <p className="text-[8px] text-white/40 uppercase tracking-widest font-bold">Ambient Neural Waves</p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-black transition-all"
          >
            <Play size={14} fill={isPlaying ? "currentColor" : "none"} />
          </button>
          <button className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
            <SkipForward size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
