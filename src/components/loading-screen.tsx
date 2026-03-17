"use client";

import { Zap } from "lucide-react";
import { useEffect, useState } from "react";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 2 : 100));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#020503] overflow-hidden">
      {/* Background Animated Neon Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="flex flex-col items-center gap-12 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 scale-[2.5] animate-pulse rounded-full bg-primary/20 blur-[80px]"></div>
          <div className="relative flex h-40 w-40 items-center justify-center rounded-[3rem] bg-primary text-black shadow-[0_0_80px_rgba(204,255,0,0.7)] animate-float">
            <Zap size={80} fill="black" strokeWidth={3} />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-5">
          <div className="relative">
            <h1 className="text-7xl font-black italic tracking-tighter text-white uppercase">
                Bio<span className="text-primary">Live</span>
            </h1>
            <div className="absolute -bottom-2 -right-4 h-1 w-full bg-primary/20 rounded-full blur-sm"></div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.8em] text-primary/50 translate-x-1">System Booting</p>
        </div>
      </div>

      <div className="absolute bottom-32 w-full max-w-[320px] px-10">
        <div className="flex justify-between text-[11px] font-black text-primary/40 uppercase tracking-[0.3em] mb-4 italic">
          <span>Initializing Ecosystem</span>
          <span className="text-primary">{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5 border border-white/5 p-[2px]">
          <div 
            className="h-full bg-primary shadow-[0_0_20px_rgba(204,255,0,1)] transition-all duration-300 ease-out rounded-full" 
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      
      <div className="absolute bottom-10 text-[9px] font-black uppercase tracking-[0.5em] text-white/10">
        Powering Nature with Code
      </div>
    </div>
  );
}