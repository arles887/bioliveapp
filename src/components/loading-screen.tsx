"use client";

import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 3 : 100));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020503] overflow-hidden">
      {/* Background Animated Glow */}
      <div className="absolute inset-0 bg-radial-gradient from-primary/10 to-transparent animate-pulse-gentle"></div>
      
      <div className="flex flex-col items-center gap-10 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 scale-[2] animate-pulse rounded-full bg-primary/20 blur-3xl"></div>
          <div className="relative flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-primary text-black shadow-[0_0_60px_rgba(204,255,0,0.6)] animate-float">
            <Zap size={60} fill="black" />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase">
            Bio<span className="text-primary">Live</span>
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.5em] text-primary/60">System Initializing</p>
        </div>
      </div>

      <div className="absolute bottom-24 w-full max-w-[280px] px-8">
        <div className="flex justify-between text-[10px] font-black text-primary/40 uppercase tracking-widest mb-3">
          <span>Loading...</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
          <div 
            className="h-full bg-primary shadow-[0_0_15px_rgba(204,255,0,0.8)] transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}