"use client";

import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 2 : 100));
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020503] overflow-hidden scanline">
      {/* Background Animated Neon Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] animate-pulse"></div>
      
      <div className="flex flex-col items-center gap-16 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 scale-[2.8] animate-pulse rounded-full bg-primary/20 blur-[100px]"></div>
          <div className="relative flex h-48 w-48 items-center justify-center rounded-[3.5rem] bg-primary text-black shadow-[0_0_100px_rgba(204,255,0,0.8)] animate-float neon-glow">
            <Zap size={90} fill="black" strokeWidth={3} />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <h1 className="text-8xl font-black italic tracking-tighter text-white uppercase leading-none">
                Bio<span className="text-primary">Live</span>
            </h1>
            <div className="absolute -bottom-3 -right-6 h-1.5 w-[120%] bg-primary/30 rounded-full blur-md"></div>
          </div>
          <div className="flex items-center gap-4">
            <span className="h-[1px] w-12 bg-primary/20"></span>
            <p className="text-[11px] font-black uppercase tracking-[1em] text-primary/60 translate-x-2">System Booting</p>
            <span className="h-[1px] w-12 bg-primary/20"></span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-40 w-full max-w-[360px] px-12">
        <div className="flex justify-between text-[12px] font-black text-primary/50 uppercase tracking-[0.4em] mb-5 italic">
          <span className="animate-pulse">Initializing Ecosystem</span>
          <span className="text-primary">{progress}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/5 border border-white/5 p-[3px]">
          <div 
            className="h-full bg-primary shadow-[0_0_30px_rgba(204,255,0,1)] transition-all duration-300 ease-out rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="absolute bottom-12 text-[10px] font-black uppercase tracking-[0.6em] text-white/10 italic">
        Syncing Nature with Digital Intelligence
      </div>
    </div>
  );
}