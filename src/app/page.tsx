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
import { CreationHub } from "@/components/creation-hub";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<NavItem>("inicio");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isFullScreenMode, setIsFullScreenMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  
  const lastScrollY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsAppLoaded(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = () => {
    if (!scrollContainerRef.current || isFullScreenMode) return;
    const currentScrollY = scrollContainerRef.current.scrollTop;
    
    if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
      setIsNavVisible(false);
    } else if (currentScrollY < lastScrollY.current) {
      setIsNavVisible(true);
    }
    lastScrollY.current = currentScrollY;
  };

  const requireAuth = (callback: () => void) => {
    if (!isLoggedIn) {
      setIsAuthModalOpen(true);
      toast({
        title: "Acceso Restringido",
        description: "Inicia sesión para interactuar con la red BioLive.",
        variant: "destructive"
      });
      return;
    }
    callback();
  };

  const navigateToProfile = (username: string) => {
    setSelectedUser(username);
    setActiveTab("profile");
    setIsFullScreenMode(false);
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  };

  if (!isAppLoaded) return <LoadingScreen />;

  const showChrome = isNavVisible && !isFullScreenMode;

  return (
    <main className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden font-body">
      <div className="relative w-full h-full max-w-[500px] bg-[#020503] flex flex-col overflow-hidden ring-1 ring-white/5 shadow-[0_0_80px_rgba(0,0,0,1)]">
        
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="absolute inset-0 overflow-y-auto no-scrollbar z-10"
        >
          <div className="pt-24 pb-32">
            {activeTab === "inicio" && (
              <MainFeed 
                onProfileClick={navigateToProfile} 
                requireAuth={requireAuth}
              />
            )}
            {activeTab === "live" && (
              <LiveViewer 
                onToggleFullScreen={(val) => setIsFullScreenMode(val)} 
                onProfileClick={navigateToProfile}
                requireAuth={requireAuth}
              />
            )}
            {activeTab === "notifications" && (
              <NotificationCenter />
            )}
            {activeTab === "profile" && (
              <ProfileView 
                username={selectedUser || "BioEntity_01"} 
                isOwnProfile={!selectedUser || selectedUser === "BioEntity_01"}
                onBack={() => setSelectedUser(null)}
                requireAuth={requireAuth}
              />
            )}
            {activeTab === "upload" && (
              isLoggedIn ? (
                <CreationHub />
              ) : (
                <div className="flex flex-col items-center justify-center h-[60vh] p-8 text-center space-y-6">
                   <div className="h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(204,255,0,0.2)]">
                      <Lock className="w-10 h-10" />
                   </div>
                   <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter">Nodo <span className="text-primary">Bloqueado</span></h2>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/30 leading-relaxed">Debes sincronizar tu identidad digital para inyectar nuevas señales en la red.</p>
                   <Button 
                    onClick={() => setIsAuthModalOpen(true)}
                    className="h-14 px-8 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl"
                   >
                     Iniciar Sincronización
                   </Button>
                </div>
              )
            )}
          </div>
        </div>

        <TopBar 
          onAuthClick={() => {
            if (!isLoggedIn) {
              setIsAuthModalOpen(true);
            } else {
              navigateToProfile("BioEntity_01");
            }
          }} 
          isVisible={showChrome} 
          isLoggedIn={isLoggedIn}
        />
        
        <MusicHub isVisible={showChrome} requireAuth={requireAuth} />
        
        <BottomNav 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            if (tab === "upload" || tab === "notifications") {
              requireAuth(() => {
                if (tab !== "profile") setSelectedUser(null);
                setActiveTab(tab);
              });
            } else {
              if (tab !== "profile") setSelectedUser(null);
              setActiveTab(tab);
            }
          }} 
          isVisible={showChrome} 
        />
        
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onAuthSuccess={() => {
            setIsLoggedIn(true);
            toast({
              title: "Sincronización Exitosa",
              description: "Bienvenido a la red neural de BioLive."
            });
          }}
        />
        <Toaster />
      </div>
    </main>
  );
}

import { Lock } from "lucide-react";
