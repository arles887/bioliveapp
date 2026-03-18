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

export default function Home() {
  const [isAppLoaded, setIsAppLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<NavItem>("inicio");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
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
              <MainFeed onProfileClick={navigateToProfile} />
            )}
            {activeTab === "live" && (
              <LiveViewer 
                onToggleFullScreen={(val) => setIsFullScreenMode(val)} 
                onProfileClick={navigateToProfile}
              />
            )}
            {activeTab === "notifications" && <NotificationCenter />}
            {activeTab === "profile" && (
              <ProfileView 
                username={selectedUser || "BioEntity_01"} 
                isOwnProfile={!selectedUser || selectedUser === "BioEntity_01"}
                onBack={() => setSelectedUser(null)}
              />
            )}
            {activeTab === "upload" && <CreationHub />}
          </div>
        </div>

        <TopBar 
          onAuthClick={() => {
            setSelectedUser(null);
            setIsAuthModalOpen(true);
          }} 
          isVisible={showChrome} 
        />
        
        <MusicHub isVisible={showChrome} />
        
        <BottomNav 
          activeTab={activeTab} 
          setActiveTab={(tab) => {
            if (tab !== "profile") setSelectedUser(null);
            setActiveTab(tab);
          }} 
          isVisible={showChrome} 
        />
        
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
        <Toaster />
      </div>
    </main>
  );
}
