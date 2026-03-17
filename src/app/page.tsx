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
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!isAppLoaded) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-[#020503] flex flex-col max-w-md mx-auto relative shadow-[0_0_100px_rgba(0,0,0,1)] border-x border-white/5 overflow-hidden">
      {/* Bio-Cyber Decorative Glows */}
      <div className="glow-bg top-[-150px] left-[-200px] animate-pulse-glow" />
      <div className="glow-bg bottom-[-150px] right-[-200px] animate-pulse-glow" style={{ animationDelay: '1.2s' }} />

      <TopBar onAuthClick={() => setIsAuthModalOpen(true)} />

      <div className="flex-1 overflow-hidden relative z-10">
        {(activeTab === "home" || activeTab === "reels" || activeTab === "lives") && <MainFeed />}
        
        {activeTab === "profile" && (
           <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
                <div className="w-28 h-28 rounded-[2.5rem] bg-primary/10 flex items-center justify-center border border-primary/40 animate-float relative z-10">
                    <div className="w-20 h-20 rounded-[2rem] bg-primary flex items-center justify-center text-black">
                      <span className="text-3xl font-black italic tracking-tighter">BIO</span>
                    </div>
                </div>
             </div>
             <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Bio <span className="text-primary">Space</span></h2>
              <p className="text-muted-foreground max-w-[200px] mx-auto text-sm leading-relaxed">Join the ecosystem to unlock your digital nature.</p>
             </div>
             <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-12 py-5 bg-primary text-black rounded-full font-black shadow-[0_0_40px_rgba(204,255,0,0.5)] hover:scale-105 active:scale-95 transition-all uppercase tracking-[0.2em] text-[10px]"
             >
              Connect Identity
             </button>
           </div>
        )}

        {activeTab === "upload" && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-10 animate-in zoom-in-95 duration-500">
             <div className="space-y-3">
              <h2 className="text-5xl font-black tracking-tighter text-primary uppercase italic">Create</h2>
              <p className="text-muted-foreground text-sm tracking-widest uppercase font-bold">Transmit your vision</p>
             </div>
             <div className="grid grid-cols-1 gap-6 w-full max-w-[280px]">
                <div className="group h-40 bg-primary/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 border border-primary/20 cursor-pointer hover:bg-primary/10 transition-all hover:neon-border hover:neon-glow">
                  <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-black shadow-xl">
                    <span className="font-black italic text-xl">GO</span>
                  </div>
                  <div className="text-center">
                    <span className="text-primary font-black text-xs uppercase tracking-[0.3em] block">Live Stream</span>
                  </div>
                </div>
                <div className="group h-40 bg-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 border border-white/10 cursor-pointer hover:bg-white/10 transition-all hover:border-white/30">
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                    <span className="font-black text-2xl">+</span>
                  </div>
                  <div className="text-center">
                    <span className="text-white font-black text-xs uppercase tracking-[0.3em] block">Upload Media</span>
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