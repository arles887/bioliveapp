"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Gamepad2, Leaf, Globe, 
  Search, Lock, Zap, Flame, Key,
  X, Users, Eye, EyeOff,
  Gift, Sparkles, Trophy, Gem, Dna, UserPlus, Check,
  Volume2, VolumeX, Heart, Send, Crown, Star, Coffee, 
  Music, Rocket, Moon, Sun, Ghost, Pizza, IceCream, 
  Grape, Apple, Cherry, Cloud, Wind, Anchor, Award, 
  BadgeCheck, Beer, Bell, Binary, Bird, Bomb, Bone, 
  Bot, Box, Briefcase, Bug, Cake, Camera, Car, Castle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProtocolWindow } from "@/components/protocol-window";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

const VIDEO_SOURCES = [
  "https://www.youtube.com/embed/gCsemG6ip54?autoplay=0&mute=1&loop=1&playlist=gCsemG6ip54&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/VAuMrxuGlQw?autoplay=0&mute=1&loop=1&playlist=VAuMrxuGlQw&controls=0&modestbranding=1&rel=0",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
  "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
];

const INITIAL_LIVES = Array.from({ length: 25 }, (_, i) => ({
  id: `live-${i}`,
  title: [
    "Amazon Rainforest 4K", 
    "Cyber-Organic City", 
    "Coral Reef Flow", 
    "Arctic Bio-Node", 
    "Desert Winds Live", 
    "Bioluminescent Cave"
  ][i % 6],
  category: ["Naturaleza", "Global", "Trending", "Naturaleza", "Global", "Trending"][i % 6],
  user: `Watcher_${i + 50}`,
  watchers: `${(Math.random() * 10 + 1).toFixed(1)}K`,
  img: `https://picsum.photos/seed/live${i}/600/1000`,
  video: VIDEO_SOURCES[i % VIDEO_SOURCES.length],
  locked: i === 2
}));

export function LiveViewer({ 
  onToggleFullScreen,
  onProfileClick,
  requireAuth
}: { 
  onToggleFullScreen: (isFull: boolean) => void,
  onProfileClick: (username: string) => void,
  requireAuth: (cb: () => void) => void
}) {
  const [activeCategory, setActiveCategory] = useState("Global");
  const [selectedLive, setSelectedLive] = useState<any>(null);
  const [viewingMode, setViewingMode] = useState(false);
  const [password, setPassword] = useState("");
  const [globalMuted, setGlobalMuted] = useState(true);
  
  const categories = [
    { id: "Global", icon: Globe },
    { id: "Gaming", icon: Gamepad2 },
    { id: "Naturaleza", icon: Leaf },
    { id: "Privadas", icon: Lock },
    { id: "Trending", icon: Flame }
  ];

  const filteredLives = activeCategory === "Global" 
    ? INITIAL_LIVES 
    : INITIAL_LIVES.filter(live => live.category === activeCategory || (activeCategory === "Privadas" && live.locked));

  const handleAccess = () => {
    if (password === "2025") {
      toast({ title: "Acceso Concedido", description: "Protocolo de visualización activado." });
      setViewingMode(true);
      setSelectedLive(null);
      setPassword("");
      onToggleFullScreen(true);
    } else {
      toast({ variant: "destructive", title: "Error de Encriptación", description: "Clave neural incorrecta." });
    }
  };

  const handleLiveClick = (live: any) => {
    if (live.locked) {
      requireAuth(() => {
        setSelectedLive(live);
      });
    } else {
      setViewingMode(true);
      onToggleFullScreen(true);
    }
  };

  if (viewingMode) {
    return (
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] z-[100] bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar border-x border-white/5">
        {INITIAL_LIVES.filter(l => !l.locked).map((live) => (
          <div key={live.id} className="h-full w-full snap-start shrink-0">
            <LiveStreamRoom 
              live={live} 
              globalMuted={globalMuted}
              setGlobalMuted={setGlobalMuted}
              onBack={() => { setViewingMode(false); onToggleFullScreen(false); }} 
              onProfileClick={onProfileClick}
              requireAuth={requireAuth}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#020503] animate-in fade-in duration-500 pb-24">
      <div className="p-6 pb-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">Bio<span className="text-primary">Live</span></h2>
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/40 mt-2">Exploración en Tiempo Real</p>
          </div>
          <button className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 border border-white/10">
            <Search size={18} />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all border shrink-0",
                activeCategory === cat.id 
                  ? "bg-primary/10 border-primary/40 text-primary" 
                  : "bg-white/5 border-white/5 text-white/30"
              )}
            >
              <cat.icon size={12} />
              <span className="text-[9px] font-black uppercase tracking-widest">{cat.id}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 grid grid-cols-2 gap-4 pb-8 no-scrollbar">
        {filteredLives.map((live) => (
          <div 
            key={live.id} 
            onClick={() => handleLiveClick(live)}
            className="group relative aspect-[3/4] rounded-3xl overflow-hidden bg-white/5 border border-white/10 hover:border-primary/30 transition-all cursor-pointer shadow-xl"
          >
            <Image src={live.img} fill alt="Live" className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
            
            {live.locked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <Lock size={20} className="text-primary animate-pulse" />
              </div>
            )}

            <div className="absolute top-3 left-3 flex gap-1.5 items-center bg-black/40 backdrop-blur-md px-2 py-1 rounded-full border border-white/10">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_5px_rgba(239,68,68,1)]"></div>
              <span className="text-[8px] font-black text-white uppercase">{live.watchers}</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4 space-y-1">
              <span className="text-[8px] font-black text-primary/60 uppercase tracking-widest italic truncate block">@{live.user}</span>
              <h4 className="text-[11px] font-black text-white uppercase italic leading-tight line-clamp-2">{live.title}</h4>
            </div>
          </div>
        ))}
      </div>

      <ProtocolWindow isOpen={!!selectedLive} onClose={() => setSelectedLive(null)} title="Acceso Encriptado">
        <div className="space-y-6 text-center">
          <div className="h-20 w-20 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-[0_0_30px_rgba(204,255,0,0.2)]">
            <Key size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg text-white font-black italic uppercase tracking-tighter">Sala Privada</h3>
            <p className="text-[9px] text-white/30 font-black uppercase tracking-widest leading-relaxed truncate">Ingresa la clave de acceso neural para @{selectedLive?.user}</p>
          </div>
          <Input 
            type="password" 
            placeholder="****" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 bg-white/5 border-white/10 rounded-2xl text-center text-xl tracking-[1em] text-primary focus-visible:ring-primary" 
          />
          <Button 
            onClick={handleAccess}
            className="w-full h-14 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.3)]"
          >
            Validar Protocolo
          </Button>
          <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">Tip: 2025</p>
        </div>
      </ProtocolWindow>
    </div>
  );
}

function LiveStreamRoom({ 
  live, 
  globalMuted, 
  setGlobalMuted, 
  onBack, 
  onProfileClick, 
  requireAuth 
}: { 
  live: any; 
  globalMuted: boolean;
  setGlobalMuted: (m: boolean) => void;
  onBack: () => void; 
  onProfileClick: (u: string) => void; 
  requireAuth: (cb: () => void) => void 
}) {
  const [hearts, setHearts] = useState<any[]>([]);
  const [activeGifts, setActiveGifts] = useState<any[]>([]);
  const [espBalance, setEspBalance] = useState(2500);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isGiftPopoverOpen, setIsGiftPopoverOpen] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const giftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isYouTube = live.video.includes('youtube.com') || live.video.includes('youtu.be');

  const giftGallery = {
    Casuales: [
      { name: "Bio-Seed", icon: Leaf, cost: 5, color: "text-green-400" },
      { name: "Coffee", icon: Coffee, cost: 10, color: "text-amber-600" },
      { name: "Pizza", icon: Pizza, cost: 15, color: "text-orange-400" },
      { name: "Ice Cream", icon: IceCream, cost: 20, color: "text-pink-300" },
      { name: "Grape", icon: Grape, cost: 25, color: "text-purple-400" },
      { name: "Apple", icon: Apple, cost: 30, color: "text-red-500" },
      { name: "Cherry", icon: Cherry, cost: 35, color: "text-red-400" },
      { name: "Cloud", icon: Cloud, cost: 40, color: "text-blue-200" },
      { name: "Wind", icon: Wind, cost: 45, color: "text-cyan-200" },
      { name: "Anchor", icon: Anchor, cost: 50, color: "text-slate-400" },
      { name: "Bell", icon: Bell, cost: 55, color: "text-yellow-500" },
      { name: "Bird", icon: Bird, cost: 60, color: "text-sky-400" },
      { name: "Bone", icon: Bone, cost: 65, color: "text-stone-300" }
    ],
    Fan: [
      { name: "Cyber-Spark", icon: Sparkles, cost: 100, color: "text-primary" },
      { name: "Star", icon: Star, cost: 150, color: "text-yellow-400" },
      { name: "Music", icon: Music, cost: 200, color: "text-purple-400" },
      { name: "Controller", icon: Gamepad2, cost: 250, color: "text-indigo-400" },
      { name: "Sun", icon: Sun, cost: 300, color: "text-amber-500" },
      { name: "Moon", icon: Moon, cost: 350, color: "text-slate-200" },
      { name: "Ghost", icon: Ghost, cost: 400, color: "text-white" },
      { name: "Award", icon: Award, cost: 450, color: "text-orange-500" },
      { name: "Badge", icon: BadgeCheck, cost: 500, color: "text-blue-500" },
      { name: "Binary", icon: Binary, cost: 550, color: "text-emerald-500" },
      { name: "Bot", icon: Bot, cost: 600, color: "text-zinc-400" },
      { name: "Box", icon: Box, cost: 650, color: "text-amber-800" },
      { name: "Briefcase", icon: Briefcase, cost: 700, color: "text-brown-500" }
    ],
    Premium: [
      { name: "Eco-Trophy", icon: Trophy, cost: 1000, color: "text-yellow-400" },
      { name: "Gaia-Gem", icon: Gem, cost: 1500, color: "text-cyan-400" },
      { name: "Rocket", icon: Rocket, cost: 2000, color: "text-red-500" },
      { name: "Bomb", icon: Bomb, cost: 2500, color: "text-zinc-600" },
      { name: "Castle", icon: Castle, cost: 3000, color: "text-indigo-600" },
      { name: "Car", icon: Car, cost: 3500, color: "text-blue-500" },
      { name: "Camera", icon: Camera, cost: 4000, color: "text-zinc-200" },
      { name: "Bug", icon: Bug, cost: 4500, color: "text-red-600" },
      { name: "Cake", icon: Cake, cost: 5000, color: "text-pink-500" },
      { name: "Flaming", icon: Flame, cost: 5500, color: "text-orange-600" },
      { name: "Beer", icon: Beer, cost: 6000, color: "text-yellow-600" }
    ],
    Exclusivos: [
      { name: "DNA-Helix", icon: Dna, cost: 10000, color: "text-primary" },
      { name: "Bio-Crown", icon: Crown, cost: 25000, color: "text-yellow-500" },
      { name: "Earth-Node", icon: Globe, cost: 50000, color: "text-blue-400" },
      { name: "Hyper-Zap", icon: Zap, cost: 75000, color: "text-primary" },
      { name: "Grand-Trophy", icon: Trophy, cost: 100000, color: "text-yellow-300" },
      { name: "Neural-Link", icon: Binary, cost: 150000, color: "text-emerald-400" },
      { name: "Cyber-City", icon: Castle, cost: 200000, color: "text-indigo-500" },
      { name: "Solar-Core", icon: Sun, cost: 300000, color: "text-orange-500" },
      { name: "Diamond-Bio", icon: Gem, cost: 500000, color: "text-cyan-200" },
      { name: "Gaia-Heart", icon: Heart, cost: 1000000, color: "text-red-500" }
    ]
  };

  const [messages, setMessages] = useState<any[]>([
    { id: 1, user: "BioEntity_Alpha_Centauri", text: "Increíble la calidad 🌿" },
    { id: 2, user: "CyberFan_Zero_One", text: "¡Bio-luz!" },
    { id: 3, user: "GaiaGuard", text: "Sincronización al 100%." },
    { id: 4, user: "NeonExplorer", text: "Ese bioma es único." },
    { id: 5, user: "Watcher_42", text: "BioLive es el futuro." },
  ]);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsActive(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => {
      observer.disconnect();
      if (giftTimerRef.current) clearTimeout(giftTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isActive) {
      if (!isYouTube && videoRef.current) {
        videoRef.current.pause();
      }
    } else {
      if (!isYouTube && videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isActive, isYouTube]);

  useEffect(() => {
    if (!globalMuted && isActive) {
      window.dispatchEvent(new CustomEvent('bio-video-playing'));
    }
  }, [globalMuted, isActive]);

  const handleTikiTiki = (e: any) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : rect.width / 2);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : rect.height / 2);
    
    const x = Math.max(40, Math.min(clientX - rect.left, 460));
    const y = clientY - rect.top;
    
    const newHeart = { id: Date.now(), x, y };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== newHeart.id)), 1000);
    
    if (globalMuted) {
      setGlobalMuted(false);
    }
  };

  const handleSendGift = (gift: any) => {
    requireAuth(() => {
      if (espBalance < gift.cost) {
        toast({ variant: "destructive", title: "Balance Insuficiente", description: "Inyecta más tokens ESP." });
        return;
      }
      setEspBalance(prev => prev - gift.cost);
      const newGiftAnim = { id: Date.now(), icon: gift.icon, color: gift.color };
      setActiveGifts(prev => [...prev, newGiftAnim]);
      setTimeout(() => setActiveGifts(prev => prev.filter(g => g.id !== newGiftAnim.id)), 3000);
      setMessages(prev => [...prev, { id: Date.now(), user: "SISTEMA", text: `🎁 Enviado: ${gift.name}`, isSpecial: true }]);

      if (giftTimerRef.current) clearTimeout(giftTimerRef.current);
      giftTimerRef.current = setTimeout(() => {
        setIsGiftPopoverOpen(false);
      }, 1000);
    });
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    requireAuth(() => {
      setIsFollowing(!isFollowing);
      if (!isFollowing) {
        toast({ title: "Sincronizado", description: `Siguiendo a @${live.user}` });
      }
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    requireAuth(() => {
      setMessages(prev => [...prev, { id: Date.now(), user: "Tú", text: inputText }]);
      setInputText("");
    });
  };

  const getYouTubeSrc = () => {
    if (!isYouTube) return "";
    let url = live.video;
    const finalMute = !isActive || globalMuted;
    url = url.replace(/autoplay=[01]/, `autoplay=${isActive ? 1 : 0}`);
    url = url.replace(/mute=[01]/, `mute=${finalMute ? 1 : 0}`);
    return url;
  };

  return (
    <div ref={containerRef} className="relative h-full w-full bg-black overflow-hidden flex flex-col" onClick={handleTikiTiki}>
      <div className="absolute inset-0 z-0">
        {isYouTube ? (
          <iframe 
            src={getYouTubeSrc()} 
            className="h-full w-full object-cover opacity-90 pointer-events-none" 
            allow="autoplay; encrypted-media"
          />
        ) : (
          <video 
            ref={videoRef}
            src={live.video} 
            className="h-full w-full object-cover opacity-90" 
            autoPlay 
            muted={!isActive || globalMuted}
            loop 
            playsInline 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60 pointer-events-none"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {hearts.map(h => (
          <div key={h.id} className="absolute animate-heart-float text-primary" style={{ left: `${h.x}px`, top: `${h.y}px` }}>
            <Heart fill="currentColor" size={28} />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
        {activeGifts.map(g => (
          <div key={g.id} className={cn("animate-gift-bounce flex flex-col items-center", g.color)}>
            <g.icon size={100} strokeWidth={1} className="drop-shadow-[0_0_40px_rgba(204,255,0,0.6)]" />
          </div>
        ))}
      </div>

      <div className="relative z-40 px-6 py-10 flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-0 bg-transparent backdrop-blur-2xl p-1.5 pr-3 rounded-2xl border border-white/10">
          <div 
            className="h-9 w-9 rounded-xl overflow-hidden border border-primary/40 relative cursor-pointer shrink-0"
            onClick={(e) => { e.stopPropagation(); onBack(); onProfileClick(live.user); }}
          >
            <img src={`https://picsum.photos/seed/${live.user}/100/100`} className="object-cover h-full w-full" alt="Avatar" />
          </div>
          <div className="cursor-pointer min-w-0 flex-1" onClick={(e) => { e.stopPropagation(); onBack(); onProfileClick(live.user); }}>
            <h4 className="text-[9px] font-black italic text-white uppercase leading-none truncate">@{live.user}</h4>
          </div>
          <button 
            onClick={handleFollow}
            className={cn(
              "ml-1 h-6 px-2.5 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all shrink-0",
              isFollowing ? "bg-white/10 text-white/40" : "bg-primary text-black shadow-lg"
            )}
          >
            {isFollowing ? <Check size={8} /> : <UserPlus size={8} />}
          </button>
        </div>

        <div className="h-10 px-3 bg-transparent backdrop-blur-2xl rounded-xl flex items-center gap-2 text-white border border-white/10 shrink-0">
          <Users size={14} className="text-primary" />
          <span className="text-[9px] font-black uppercase tracking-widest leading-none">{live.watchers}</span>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); setIsChatVisible(!isChatVisible); }} 
          className="h-10 w-10 shrink-0 bg-transparent backdrop-blur-2xl rounded-xl flex items-center justify-center text-white border border-white/10 hover:border-primary/40 transition-all"
        >
          {isChatVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onBack(); }} 
          className="h-10 w-10 shrink-0 bg-transparent backdrop-blur-2xl rounded-xl flex items-center justify-center text-white border border-white/10 hover:border-red-500/40 transition-all"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1"></div>

      <div className={cn("relative z-40 px-6 pb-12 transition-all duration-500", isChatVisible ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <div className="max-h-56 overflow-y-auto no-scrollbar space-y-2 mb-4 [mask-image:linear-gradient(to_bottom,transparent,black_20%)]">
          {messages.map((msg) => (
            <div key={msg.id} className="text-left animate-in fade-in slide-in-from-left-2">
              <span className={cn("text-[8px] font-black uppercase italic tracking-widest block truncate ml-2 mb-0.5", msg.isSpecial ? "text-primary" : "text-primary/70")}>{msg.user}</span>
              <p className={cn(
                "text-[9px] backdrop-blur-md px-3 py-1.5 rounded-2xl rounded-tl-none border border-white/10 inline-block max-w-[85%] leading-relaxed transition-all",
                msg.isSpecial 
                  ? "bg-primary/10 text-primary border-primary/20" 
                  : "bg-white/5 text-white/90"
              )}>
                {msg.text}
              </p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 h-11 w-full" onClick={(e) => e.stopPropagation()}>
          <Popover open={isGiftPopoverOpen} onOpenChange={setIsGiftPopoverOpen}>
            <PopoverTrigger asChild>
              <button className="h-11 w-11 shrink-0 bg-white/10 backdrop-blur-3xl rounded-xl flex items-center justify-center text-white border border-white/10 shadow-2xl active:scale-90 transition-all overflow-hidden">
                <Gift size={18} />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-[320px] bg-[#020503]/95 backdrop-blur-3xl border-white/10 rounded-[2.5rem] p-0 z-[9999] shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden">
              <div className="p-5 pb-0">
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between mb-4">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-black text-primary uppercase italic tracking-widest">Bio-Wallet</span>
                    <div className="text-lg font-black text-white italic leading-none">{espBalance} <span className="text-[9px] text-primary">ESP</span></div>
                  </div>
                  <Zap size={14} className="text-primary animate-pulse" />
                </div>
              </div>

              <Tabs defaultValue="Casuales" className="w-full">
                <TabsList className="flex w-full bg-white/5 h-10 px-4 rounded-none gap-0 border-b border-white/5">
                  {Object.keys(giftGallery).map((cat) => (
                    <TabsTrigger 
                      key={cat} 
                      value={cat} 
                      className="flex-1 data-[state=active]:text-primary text-white/20 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-0 font-black uppercase text-[8px] tracking-widest transition-all"
                    >
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                <ScrollArea className="h-[280px] w-full">
                  {Object.entries(giftGallery).map(([cat, items]) => (
                    <TabsContent key={cat} value={cat} className="p-4 grid grid-cols-3 gap-2 m-0">
                      {items.map((g) => (
                        <button 
                          key={g.name} 
                          onClick={() => handleSendGift(g)} 
                          className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/40 group transition-all"
                        >
                          <g.icon size={24} className={cn("mb-2 transition-transform group-hover:scale-125", g.color)} />
                          <span className="text-[8px] font-black text-white/80 italic uppercase truncate w-full text-center">{g.name}</span>
                          <span className="text-[7px] text-primary font-black uppercase mt-1">{g.cost}</span>
                        </button>
                      ))}
                    </TabsContent>
                  ))}
                </ScrollArea>
              </Tabs>
              
              <div className="p-4 bg-white/5 border-t border-white/5 flex justify-center">
                 <p className="text-[7px] font-black text-white/20 uppercase tracking-[0.3em] italic">Gaia Neural Gift Protocol</p>
              </div>
            </PopoverContent>
          </Popover>

          <form onSubmit={handleSendMessage} className="flex-1 flex gap-2 h-full">
            <input 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder="Inyectar respuesta..." 
              className="flex-1 h-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-xl px-4 text-[10px] text-white focus:outline-none focus:border-primary/40" 
            />
            <button 
              type="submit" 
              className="h-11 w-11 shrink-0 bg-primary rounded-xl flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Send size={18} fill="currentColor" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}