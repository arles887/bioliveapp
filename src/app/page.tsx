"use client";

import { useState, useEffect } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { TopBar } from "@/components/top-bar";
import { BottomNav } from "@/components/bottom-nav";
import { MainFeed } from "@/components/main-feed";
import { ReelsViewer } from "@/components/reels-viewer";
import { ChatList } from "@/components/chat-list";
import { AuthModal } from "@/components/auth-modal";
import { MusicHub } from "@/components/music-hub";
import { Toaster } from "@/components/ui/toaster";

export default function Home() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"home" | "reels" | "upload" | "chat" | "profile">("home");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!isAppLoaded) return <LoadingScreen />;

  return (
    <main className="min-h-screen bg-[#020503] flex flex-col max-w-md mx-auto relative shadow-2xl border-x border-white/5 overflow-hidden font-body">
      {/* Dynamic Background */}
      <div className="absolute top-[-100px] left-[-100px] w-80 h-80 bg-primary/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-80 h-80 bg-accent/5 blur-[120px] rounded-full pointer-events-none"></div>

      <TopBar onAuthClick={() => setIsAuthModalOpen(true)} />

      <div className="flex-1 overflow-hidden relative z-10">
        {activeTab === "home" && <MainFeed />}
        {activeTab === "reels" && <ReelsViewer />}
        {activeTab === "chat" && <ChatList />}
        
        {activeTab === "profile" && (
           <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-8 animate-in fade-in duration-500">
             <div className="relative w-32 h-32 rounded-[2.5rem] bg-primary/5 border border-primary/20 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-xl"></div>
                <span className="text-4xl font-black italic text-primary relative z-10">ID</span>
             </div>
             <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter text-white uppercase italic">Bio<span className="text-primary">Entity</span></h2>
              <p className="text-[9px] text-white/40 uppercase tracking-[0.3em] max-w-[200px] mx-auto">Neural Link Sequence: STANDBY</p>
             </div>
             <button onClick={() => setIsAuthModalOpen(true)} className="px-10 py-4 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-xl shadow-primary/20 active:scale-95 transition-all">Connect Protocol</button>
           </div>
        )}

        {activeTab === "upload" && (
          <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-8 animate-in zoom-in-95 duration-500">
             <h2 className="text-4xl font-black tracking-tighter text-primary uppercase italic">Transmit</h2>
             <div className="grid grid-cols-1 gap-6 w-full">
                <div className="h-40 glass-panel rounded-[2.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/40 transition-all">
                  <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-black shadow-lg"><span className="font-black italic">LIVE</span></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Start Neural Stream</span>
                </div>
                <div className="h-32 glass-panel border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-all">
                   <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Upload Sequence</span>
                </div>
             </div>
          </div>
        )}
      </div>

      <MusicHub />
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      <Toaster />
    </main>
  );
}