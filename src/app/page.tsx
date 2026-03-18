"use client";

import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { MainFeed } from "@/components/main-feed";
import { AuthModal } from "@/components/auth-modal";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "reels" | "upload" | "lives" | "profile">("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAppLoaded(true);
    }, 2800);
    return () => clearTimeout(timer);
  }, []);

  if (!isAppLoaded) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-[#020503] flex flex-col max-w-md mx-auto relative shadow-[0_0_150px_rgba(0,0,0,1)] border-x border-white/5 overflow-hidden scanline">
      {/* Bio-Cyber Decorative Glows */}
      <div className="glow-bg top-[-150px] left-[-250px] animate-pulse-glow" />
      <div className="glow-bg bottom-[-150px] right-[-250px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <TopBar onAuthClick={() => setIsAuthModalOpen(true)} />

      <div className="flex-1 overflow-hidden relative z-10">
        {(activeTab === "home" || activeTab === "reels" || activeTab === "lives") && <MainFeed />}
        
        {activeTab === "profile" && (
           <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
             <div className="relative">
                <div className="absolute inset-0 bg-primary/25 blur-[100px] rounded-full scale-150 animate-pulse"></div>
                <div className="w-32 h-32 rounded-[2.8rem] bg-primary/10 flex items-center justify-center border border-primary/40 animate-float relative z-10 neon-glow">
                    <div className="w-24 h-24 rounded-[2.2rem] bg-primary flex items-center justify-center text-black shadow-2xl">
                      <span className="text-4xl font-black italic tracking-tighter">BIO</span>
                    </div>
                </div>
             </div>
             <div className="space-y-3">
              <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic">Bio <span className="text-primary">Space</span></h2>
              <p className="text-muted-foreground max-w-[240px] mx-auto text-sm leading-relaxed font-medium uppercase tracking-widest opacity-60">Harmonize your digital essence with nature.</p>
             </div>
             <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-14 py-6 bg-primary text-black rounded-full font-black shadow-[0_0_50px_rgba(204,255,0,0.6)] hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.3em] text-[11px] italic"
             >
              Connect Identity
             </button>
           </div>
        )}

        {activeTab === "upload" && (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-12 animate-in zoom-in-95 duration-700">
             <div className="space-y-4">
              <h2 className="text-6xl font-black tracking-tighter text-primary uppercase italic leading-none">Create</h2>
              <p className="text-muted-foreground text-[10px] tracking-[0.5em] uppercase font-bold opacity-40">Transmit your vision to the ecosystem</p>
             </div>
             <div className="grid grid-cols-1 gap-8 w-full max-w-[300px]">
                <div className="group h-44 bg-primary/5 rounded-[3rem] flex flex-col items-center justify-center gap-4 border border-primary/20 cursor-pointer hover:bg-primary/10 transition-all hover:neon-border hover:neon-glow relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-black shadow-2xl relative z-10">
                    <span className="font-black italic text-2xl">GO</span>
                  </div>
                  <div className="text-center relative z-10">
                    <span className="text-primary font-black text-xs uppercase tracking-[0.4em] block italic">Live Stream</span>
                  </div>
                </div>
                <div className="group h-44 bg-white/5 rounded-[3rem] flex flex-col items-center justify-center gap-4 border border-white/10 cursor-pointer hover:bg-white/10 transition-all hover:border-white/30">
                  <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white relative z-10">
                    <span className="font-black text-3xl">+</span>
                  </div>
                  <div className="text-center relative z-10">
                    <span className="text-white font-black text-xs uppercase tracking-[0.4em] block opacity-40 italic">Upload Media</span>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <Toaster />
    </main>
  );
}