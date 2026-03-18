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
  const [activeTab, setActiveTab] = useState<"home" | "explore" | "upload" | "lives" | "profile">("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoaded(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!isAppLoaded) return <LoadingScreen />;

  return (
    <main className="min-h-screen bg-black flex flex-col max-w-md mx-auto relative shadow-2xl border-x border-white/5 overflow-hidden scanline">
      {/* Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-primary/10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-accent/10 blur-[150px] rounded-full"></div>

      <TopBar onAuthClick={() => setIsAuthModalOpen(true)} />

      <div className="flex-1 overflow-hidden relative z-10 bg-gradient-to-b from-transparent to-black/40">
        {(activeTab === "home" || activeTab === "explore" || activeTab === "lives") && <MainFeed />}
        
        {activeTab === "profile" && (
           <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-10 animate-in fade-in duration-700">
             <div className="relative w-40 h-40 rounded-[3rem] bg-primary/5 border border-primary/20 flex items-center justify-center neon-shadow group">
                <div className="absolute inset-0 bg-primary/5 blur-2xl group-hover:bg-primary/10 transition-all"></div>
                <span className="text-5xl font-black italic text-primary relative z-10">BIO</span>
             </div>
             <div className="space-y-3">
              <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Neural <span className="text-primary">Identity</span></h2>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.4em] max-w-[240px] mx-auto leading-relaxed">Sincroniza tu ADN con la red de inteligencia biológica global.</p>
             </div>
             <button onClick={() => setIsAuthModalOpen(true)} className="px-12 py-5 bg-primary text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] italic shadow-2xl shadow-primary/30 active:scale-95 transition-all">Connect Protocol</button>
           </div>
        )}

        {activeTab === "upload" && (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-10 animate-in zoom-in-95 duration-500">
             <div className="space-y-2">
                <h2 className="text-5xl font-black tracking-tighter text-primary uppercase italic">Transmit</h2>
                <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white/20">Uplink sequence ready</p>
             </div>
             <div className="grid grid-cols-1 gap-6 w-full">
                <div className="group h-44 glass-panel rounded-[3rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/40 transition-all overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-black shadow-xl group-hover:scale-110 transition-transform"><span className="font-black italic text-2xl">GO</span></div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-primary italic">Live Neural Stream</span>
                </div>
                <div className="h-40 glass-panel border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
                   <span className="text-4xl font-thin text-white/20">+</span>
                   <span className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">Upload Media</span>
                </div>
             </div>
          </div>
        )}
      </div>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <Toaster />
    </main>
  );
}