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
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isAppLoaded) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen bg-[#020503] flex flex-col max-w-md mx-auto relative shadow-[0_0_100px_rgba(0,0,0,1)] border-x border-white/5 overflow-hidden">
      {/* Decorative Glows */}
      <div className="glow-bg top-[-100px] left-[-150px] animate-pulse-glow" />
      <div className="glow-bg bottom-[-100px] right-[-150px] animate-pulse-glow" style={{ animationDelay: '1s' }} />

      <TopBar onAuthClick={() => setIsAuthModalOpen(true)} />

      <div className="flex-1 overflow-hidden relative z-10">
        {activeTab === "home" && <MainFeed />}
        {activeTab === "reels" && <MainFeed />}
        {activeTab === "lives" && <div className="w-full h-full bg-black"><MainFeed /></div>}
        
        {activeTab === "profile" && (
           <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
             <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 animate-float">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-black">
                  <span className="text-2xl font-black">BIO</span>
                </div>
             </div>
             <div>
              <h2 className="text-3xl font-black tracking-tighter text-white">BIO SPACE</h2>
              <p className="text-muted-foreground mt-2">Accede para ver tu ecosistema digital.</p>
             </div>
             <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-10 py-4 bg-primary text-black rounded-full font-black shadow-[0_0_30px_rgba(204,255,0,0.4)] hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs"
             >
              Conectar Ahora
             </button>
           </div>
        )}

        {activeTab === "upload" && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-8">
             <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter text-primary">CREAR</h2>
              <p className="text-muted-foreground">Comparte tu visión natural con el mundo.</p>
             </div>
             <div className="grid grid-cols-1 gap-4 w-full pt-4">
                <div className="group h-32 bg-primary/5 rounded-[2rem] flex items-center justify-between px-8 border border-primary/20 cursor-pointer hover:bg-primary/10 transition-all hover:border-primary/50">
                  <div className="text-left">
                    <span className="text-primary font-black text-xl block">LIVE</span>
                    <span className="text-xs text-muted-foreground">Streaming en tiempo real</span>
                  </div>
                  <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg">
                    <span className="font-bold">GO</span>
                  </div>
                </div>
                <div className="group h-32 bg-white/5 rounded-[2rem] flex items-center justify-between px-8 border border-white/10 cursor-pointer hover:bg-white/10 transition-all hover:border-white/30">
                  <div className="text-left">
                    <span className="text-white font-black text-xl block">POST</span>
                    <span className="text-xs text-muted-foreground">Sube un Reel o Foto</span>
                  </div>
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                    <span className="font-bold">+</span>
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