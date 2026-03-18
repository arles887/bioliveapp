
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
    
    if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
      setIsNavVisible(false);
    } else {
      setIsNavVisible(true);
    }
    lastScrollY.current = currentScrollY;
  };

  if (!isAppLoaded) return <LoadingScreen />;

  return (
    <main className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden font-body">
      {/* Contenedor Estricto Android */}
      <div className="relative w-full h-full max-w-[420px] bg-[#020503] flex flex-col shadow-2xl border-x border-white/5 overflow-hidden ring-1 ring-white/10">
        
        {/* Capas de Brillo de Fondo */}
        <div className="absolute top-[-10%] left-[-20%] w-[140%] h-[40%] bg-primary/5 blur-[120px] rounded-full pointer-events-none z-0"></div>
        
        <TopBar onAuthClick={() => setIsAuthModalOpen(true)} />

        {/* Área de Contenido Principal - Scrollable */}
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto relative z-10 no-scrollbar pb-32"
        >
          {activeTab === "home" && <MainFeed />}
          {activeTab === "reels" && <ReelsViewer />}
          {activeTab === "chat" && <ChatList />}
          
          {activeTab === "profile" && (
             <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-8 animate-in fade-in duration-500">
               <div className="relative w-28 h-28 rounded-[2.5rem] bg-primary/10 border border-primary/30 flex items-center justify-center overflow-hidden">
                  <span className="text-3xl font-black italic text-primary relative z-10">BIO</span>
               </div>
               <div className="space-y-2">
                <h2 className="text-2xl font-black tracking-tighter text-white uppercase italic text-shadow-glow">Bio<span className="text-primary">Entity</span></h2>
                <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Protocolo Desconectado</p>
               </div>
               <button onClick={() => setIsAuthModalOpen(true)} className="w-full max-w-[200px] py-4 bg-primary text-black rounded-2xl font-black text-[10px] uppercase tracking-widest italic shadow-xl shadow-primary/20 active:scale-95 transition-all">Sincronizar Protocolo</button>
             </div>
          )}

          {activeTab === "upload" && (
            <div className="flex flex-col items-center justify-center min-h-[80vh] p-8 text-center space-y-8">
               <h2 className="text-3xl font-black tracking-tighter text-primary uppercase italic">Transmisión</h2>
               <div className="grid grid-cols-1 gap-4 w-full">
                  <div className="p-10 glass-panel rounded-[2.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/40 transition-all group">
                    <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg group-hover:scale-110 transition-transform"><span className="font-black italic">LIVE</span></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">Iniciar Nodo Neuronal</span>
                  </div>
                  <div className="p-8 glass-panel border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer opacity-50">
                     <span className="text-[9px] font-black uppercase tracking-widest text-white/20">Cargar Secuencia DNA</span>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Music Orb Flotante (Botón Compacto) */}
        <MusicHub isVisible={isNavVisible} />

        {/* Navegación Inferior Flotante Dinámica */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} isVisible={isNavVisible} />
        
        {/* Modales */}
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <Toaster />
      </div>
    </main>
  );
}
