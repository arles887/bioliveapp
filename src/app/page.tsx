
"use client";

import { useState, useEffect, useRef } from "react";
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
    
    // Sensibilidad del scroll para ocultar/mostrar la navegación
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
      {/* Marco de Dispositivo Android Refinado */}
      <div className="relative w-full h-full max-w-[420px] bg-black flex flex-col overflow-hidden ring-1 ring-white/5 shadow-[0_0_80px_rgba(0,0,0,1)]">
        
        {/* Luces de ambiente sutiles */}
        <div className="absolute top-[-5%] left-[-10%] w-[120%] h-[30%] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <TopBar onAuthClick={() => setIsAuthModalOpen(true)} />

        {/* Área de Contenido - Fluye por debajo de la navegación */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto relative z-10 no-scrollbar pb-10"
        >
          {activeTab === "home" && <MainFeed />}
          {activeTab === "reels" && <ReelsViewer />}
          {activeTab === "chat" && <ChatList />}
          
          {activeTab === "profile" && (
             <div className="flex flex-col items-center justify-center min-h-[70vh] p-10 text-center space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="relative w-32 h-32 rounded-[3rem] bg-white/[0.03] border border-white/5 flex items-center justify-center overflow-hidden">
                  <span className="text-3xl font-black italic text-primary relative z-10 tracking-tighter">BIO</span>
                  <div className="absolute inset-0 bg-primary/5 animate-pulse"></div>
               </div>
               <div className="space-y-3">
                <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic">Bio<span className="text-primary">Entity</span></h2>
                <p className="text-[9px] text-white/20 uppercase tracking-[0.4em] font-bold">Signal Disconnected</p>
               </div>
               <button onClick={() => setIsAuthModalOpen(true)} className="w-full max-w-[220px] py-4 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">Sincronizar Nodo</button>
             </div>
          )}

          {activeTab === "upload" && (
            <div className="flex flex-col items-center justify-center min-h-[70vh] p-10 text-center space-y-10 animate-in fade-in duration-700">
               <h2 className="text-3xl font-black tracking-tighter text-primary uppercase italic leading-none">Nueva<br/>Transmisión</h2>
               <div className="grid grid-cols-1 gap-5 w-full">
                  <div className="p-12 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-[3rem] flex flex-col items-center justify-center gap-5 cursor-pointer hover:border-primary/30 transition-all group shadow-2xl">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg group-hover:rotate-12 transition-transform"><span className="font-black italic text-xl">LIVE</span></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Activar Sensor Neural</span>
                  </div>
                  <div className="p-10 border border-dashed border-white/10 rounded-[3rem] flex flex-col items-center justify-center gap-4 opacity-30">
                     <span className="text-[8px] font-black uppercase tracking-widest text-white">Subir Secuencia DNA</span>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Capas Flotantes Transparentes */}
        <MusicHub isVisible={isNavVisible} />
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isVisible={isNavVisible} />
        
        {/* Modales de Sistema */}
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <Toaster />
      </div>
    </main>
  );
}
