
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
    <main className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative shadow-2xl border-x">
      {/* Header only shows on non-fullscreen views */}
      <TopBar onAuthClick={() => setIsAuthModalOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "home" && <MainFeed />}
        {activeTab === "reels" && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
             <div className="w-full h-full"><MainFeed /></div>
          </div>
        )}
        {activeTab === "lives" && (
           <div className="w-full h-full bg-black"><MainFeed /></div>
        )}
        {activeTab === "profile" && (
           <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
             <h2 className="text-2xl font-bold font-headline">Your Bio Space</h2>
             <p className="text-muted-foreground">Sign in to view your profile and activities.</p>
             <button 
              onClick={() => setIsAuthModalOpen(true)}
              className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg"
             >
              Sign In
             </button>
           </div>
        )}
        {activeTab === "upload" && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
             <h2 className="text-2xl font-bold font-headline">Share Your BioLive</h2>
             <p className="text-muted-foreground">Select a video or start a live broadcast.</p>
             <div className="grid grid-cols-2 gap-4 w-full pt-4">
                <div className="aspect-square bg-primary/10 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-primary/30 cursor-pointer">
                  <div className="p-4 bg-primary text-white rounded-2xl mb-2">Live</div>
                  <span className="text-xs font-bold">Go Live</span>
                </div>
                <div className="aspect-square bg-accent/10 rounded-3xl flex flex-col items-center justify-center border-2 border-dashed border-accent/30 cursor-pointer">
                  <div className="p-4 bg-accent text-accent-foreground rounded-2xl mb-2">Post</div>
                  <span className="text-xs font-bold">Upload Reel</span>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Modals & Overlays */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      <Toaster />
    </main>
  );
}
