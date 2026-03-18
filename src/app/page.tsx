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
    <main className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative shadow-2xl border-x border-white/5 overflow-hidden scanline">
      {/* Background Glows */}
      <div className="absolute top-[-100px] left-[-100px] w-64 h-64 bg-primary/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-64 h-64 bg-accent/5 blur-[120px] rounded-full"></div>

      <TopBar onAuthClick={() => setIsAuthModalOpen(true)} />

      <div className="flex-1 overflow-hidden relative z-10">
        {(activeTab === "home" || activeTab === "explore" || activeTab === "lives") && <MainFeed />}
        
        {activeTab === "profile" && (
           <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-8 animate-in fade-in duration-500">
             <div className="relative w-32 h-32 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center neon-shadow">
                <span className="text-4xl font-black italic text-primary">BIO</span>
             </div>
             <div className="space-y-2">
              <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic">Bio <span className="text-primary">Node</span></h2>
              <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] max-w-[200px] mx-auto">Syncing DNA with Digital Intelligence</p>
             </div>
             <button onClick={() => setIsAuthModalOpen(true)} className="px-10 py-4 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-xl">Connect Protocol</button>
           </div>
        )}

        {activeTab === "upload" && (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-8 animate-in zoom-in-95">
             <h2 className="text-5xl font-black tracking-tighter text-primary uppercase italic">Transmit</h2>
             <div className="grid grid-cols-1 gap-6 w-full">
                <div className="h-40 bg-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 border border-white/10 cursor-pointer hover:bg-primary/5 hover:border-primary/20 transition-all">
                  <div className="w-14 h-14 bg-primary rounded-xl flex items-center justify-center text-black shadow-lg"><span className="font-black italic text-xl">GO</span></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Live Neural Stream</span>
                </div>
                <div className="h-40 bg-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 border border-white/10 cursor-pointer">
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
