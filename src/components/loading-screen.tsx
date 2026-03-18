
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
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="flex flex-col items-center gap-12 relative z-10 scale-90 sm:scale-100">
        <div className="relative">
          <div className="absolute inset-0 scale-[2] animate-pulse rounded-full bg-primary/10 blur-[80px]"></div>
          <div className="relative flex h-36 w-36 items-center justify-center rounded-[3rem] bg-primary text-black shadow-[0_0_60px_rgba(204,255,0,0.5)] animate-float">
            <Zap size={60} fill="black" strokeWidth={3} />
          </div>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-6xl font-black italic tracking-tighter text-white uppercase leading-none">
              Bio<span className="text-primary">Live</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/40">Initializing Protocol</p>
        </div>
      </div>

      <div className="absolute bottom-32 w-full max-w-[280px] px-4">
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
          <div 
            className="h-full bg-primary shadow-[0_0_20px_rgba(204,255,0,0.8)] transition-all duration-300 ease-out" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-center mt-4">
          <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest">{progress}%</span>
        </div>
      </div>
    </div>
  );
}
