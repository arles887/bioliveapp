
"use client";

import { useState, useEffect, useRef } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { TopBar } from "@/components/top-bar";
import { BottomNav, type NavItem } from "@/components/bottom-nav";
import { MainFeed } from "@/components/main-feed";
import { LiveViewer } from "@/components/live-viewer";
import { NotificationCenter } from "@/components/notification-center";
import { AuthModal } from "@/components/auth-modal";
import { MusicHub } from "@/components/music-hub";
import { Toaster } from "@/components/ui/toaster";
import { ProfileView } from "@/components/profile-view";

export default function Home() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<NavItem>("inicio");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const currentScrollY = scrollContainerRef.current.scrollTop;
    
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      setIsNavVisible(false);
    } else if (currentScrollY < lastScrollY.current) {
      setIsNavVisible(true);
    }
    lastScrollY.current = currentScrollY;
  };

  if (!isAppLoaded) return <LoadingScreen />;

  return (
    <main className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden font-body">
      <div className="relative w-full h-full max-w-[420px] bg-[#020503] flex flex-col overflow-hidden ring-1 ring-white/5 shadow-[0_0_80px_rgba(0,0,0,1)]">
        
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto no-scrollbar z-10"
        >
          <div className="pt-20 pb-32">
            {activeTab === "inicio" && <MainFeed />}
            {activeTab === "live" && <LiveViewer />}
            {activeTab === "notifications" && <NotificationCenter />}
            {activeTab === "profile" && <ProfileView />}

            {activeTab === "upload" && (
              <div className="flex flex-col items-center justify-center min-h-[70vh] p-10 text-center space-y-10 animate-in fade-in duration-700">
                <h2 className="text-3xl font-black tracking-tighter text-primary uppercase italic leading-none">Nueva<br/>Transmisión</h2>
                <div className="grid grid-cols-1 gap-5 w-full px-4">
                    <div className="p-12 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[3rem] flex flex-col items-center justify-center gap-5 cursor-pointer hover:border-primary/30 transition-all group shadow-2xl">
                      <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg group-hover:rotate-12 transition-transform"><span className="font-black italic text-xl">LIVE</span></div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Activar Sensor Neural</span>
                    </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <TopBar onAuthClick={() => setIsAuthModalOpen(true)} />
        <MusicHub isVisible={isNavVisible} />
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isVisible={isNavVisible} />
        
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <Toaster />
      </div>
    </main>
  );
}
