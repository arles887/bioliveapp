"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Gamepad2, Leaf, Globe, 
  Search, Lock, Zap, Flame, Key,
  X, Users, Heart, Send, Eye, EyeOff,
  Gift, Sparkles, Trophy, Gem, Dna, UserPlus, Check
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

export function LiveViewer({ 
  onToggleFullScreen,
  onProfileClick
}: { 
  onToggleFullScreen: (isFull: boolean) => void,
  onProfileClick: (username: string) => void
}) {
  const [activeCategory, setActiveCategory] = useState("Global");
  const [selectedLive, setSelectedLive] = useState<any>(null);
  const [viewingMode, setViewingMode] = useState(false);
  const [password, setPassword] = useState("");
  
  const categories = [
    { id: "Global", icon: Globe },
    { id: "Gaming", icon: Gamepad2 },
    { id: "Naturaleza", icon: Leaf },
    { id: "Privadas", icon: Lock },
    { id: "Trending", icon: Flame }
  ];

  const lives = [
    { id: "1", title: "Amazon Rainforest 4K", category: "Naturaleza", user: "EcoWatcher", watchers: "4.2K", img: "https://picsum.photos/seed/l1/600/1000" },
    { id: "2", title: "Cyber-Organic Chess", category: "Gaming", user: "GrandMaster", watchers: "1.1K", img: "https://picsum.photos/seed/l2/600/1000" },
    { id: "3", title: "Secret Lab Stream", category: "Privadas", user: "Unknown", watchers: "0", img: "https://picsum.photos/seed/l3/600/1000", locked: true },
    { id: "4", title: "Coral Reef Flow", category: "Naturaleza", user: "OceanPulse", watchers: "12K", img: "https://picsum.photos/seed/l4/600/1000" },
    { id: "5", title: "Cyberpunk City Live", category: "Gaming", user: "NeonRunner", watchers: "3.5K", img: "https://picsum.photos/seed/l5/600/1000" },
    { id: "6", title: "Organic Lab Synthesis", category: "Naturaleza", user: "BioSynth", watchers: "900", img: "https://picsum.photos/seed/l6/600/1000" },
  ];

  const filteredLives = activeCategory === "Global" 
    ? lives 
    : lives.filter(live => live.category === activeCategory);

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
      setSelectedLive(live);
    } else {
      setViewingMode(true);
      onToggleFullScreen(true);
    }
  };

  if (viewingMode) {
    return (
      <div className="fixed inset-y-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] z-[100] bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar border-x border-white/5">
        {lives.filter(l => !l.locked).map((live) => (
          <div key={live.id} className="h-full w-full snap-start shrink-0">
            <LiveStreamRoom 
              live={live} 
              onBack={() => { setViewingMode(false); onToggleFullScreen(false); }} 
              onProfileClick={onProfileClick}
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
            <p className="text-[9px] text-white/30 font-black uppercase tracking-widest leading-relaxed">Ingresa la clave de acceso neural para @{selectedLive?.user}</p>
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

function LiveStreamRoom({ live, onBack, onProfileClick }: { live: any; onBack: () => void; onProfileClick: (u: string) => void }) {
  const [likes, setLikes] = useState(1420);
  const [hearts, setHearts] = useState<any[]>([]);
  const [activeGifts, setActiveGifts] = useState<any[]>([]);
  const [espBalance, setEspBalance] = useState(2500);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, user: "BioEntity_02", text: "Increíble la calidad 🌿" },
    { id: 2, user: "CyberFan", text: "¡Bio-luz!" },
  ]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const gifts = [
    { name: "Bio-Seed", icon: Leaf, cost: 50, color: "text-green-400" },
    { name: "Cyber-Spark", icon: Sparkles, cost: 150, color: "text-primary" },
    { name: "Eco-Trophy", icon: Trophy, cost: 500, color: "text-yellow-400" },
    { name: "Gaia-Gem", icon: Gem, cost: 1200, color: "text-cyan-400" },
    { name: "DNA-Helix", icon: Dna, cost: 2500, color: "text-primary" },
  ];

  const handleTikiTiki = (e: any) => {
    setLikes(prev => prev + 1);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = e.clientX || e.touches[0].clientX;
    const constrainedX = Math.max(40, Math.min(clientX - rect.left, 460));
    const newHeart = { id: Date.now(), x: constrainedX };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== newHeart.id)), 1000);
  };

  const handleSendGift = (gift: any) => {
    if (espBalance < gift.cost) {
      toast({ variant: "destructive", title: "Balance Insuficiente", description: "Inyecta más tokens ESP." });
      return;
    }
    setEspBalance(prev => prev - gift.cost);
    const newGiftAnim = { id: Date.now(), icon: gift.icon, color: gift.color };
    setActiveGifts(prev => [...prev, newGiftAnim]);
    setTimeout(() => setActiveGifts(prev => prev.filter(g => g.id !== newGiftAnim.id)), 2000);
    setMessages(prev => [...prev, { id: Date.now(), user: "SISTEMA", text: `🎁 Enviado: ${gift.name}`, isSpecial: true }]);
  };

  const handleFollow = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFollowing(!isFollowing);
    if (!isFollowing) {
      toast({ title: "Sincronizado", description: `Siguiendo a @${live.user}` });
    }
  };

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { id: Date.now(), user: "Tú", text: inputText }]);
    setInputText("");
  };

  return (
    <div ref={containerRef} className="relative h-full w-full bg-black overflow-hidden flex flex-col">
      <div className="absolute inset-0 z-0 cursor-pointer" onClick={handleTikiTiki}>
        <Image src={live.img} fill alt="Live" className="object-cover opacity-90" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {hearts.map(h => (
          <div key={h.id} className="absolute bottom-24 animate-heart-float text-primary" style={{ left: `${h.x}px` }}>
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

      <div className="relative z-40 px-6 py-10 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-2xl p-2 pr-4 rounded-2xl border border-white/10">
          <div 
            className="h-10 w-10 rounded-xl overflow-hidden border border-primary/40 relative cursor-pointer"
            onClick={() => { onBack(); onProfileClick(live.user); }}
          >
            <Image src={`https://picsum.photos/seed/${live.user}/100/100`} fill alt="Avatar" className="object-cover" />
          </div>
          <div className="cursor-pointer" onClick={() => { onBack(); onProfileClick(live.user); }}>
            <h4 className="text-[10px] font-black italic text-white uppercase leading-none mb-1">@{live.user}</h4>
            <div className="flex items-center gap-1.5">
              <Users size={10} className="text-primary" />
              <span className="text-[8px] font-black text-white/70 uppercase">{live.watchers}</span>
            </div>
          </div>
          <button 
            onClick={handleFollow}
            className={cn(
              "ml-2 h-7 px-3 rounded-lg text-[7px] font-black uppercase tracking-widest transition-all",
              isFollowing ? "bg-white/10 text-white/40" : "bg-primary text-black shadow-lg"
            )}
          >
            {isFollowing ? <Check size={10} /> : <UserPlus size={10} />}
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); setIsChatVisible(!isChatVisible); }} 
            className="h-11 w-11 bg-black/40 backdrop-blur-2xl rounded-xl flex items-center justify-center text-white border border-white/10 hover:border-primary/40 transition-all"
          >
            {isChatVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onBack(); }} 
            className="h-11 w-11 bg-black/40 backdrop-blur-2xl rounded-xl flex items-center justify-center text-white border border-white/10 hover:border-red-500/40 transition-all"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1"></div>

      <div className={cn("relative z-40 px-6 pb-6 transition-all duration-500", isChatVisible ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <div ref={scrollRef} className="max-h-44 overflow-y-auto no-scrollbar space-y-2 mb-3">
          {messages.map((msg) => (
            <div key={msg.id} className="text-left animate-in fade-in slide-in-from-left-2">
              <span className={cn("text-[8px] font-black uppercase italic", msg.isSpecial ? "text-primary" : "text-primary/70")}>{msg.user}</span>
              <p className={cn("text-[10px] backdrop-blur-md px-3 py-1.5 rounded-xl rounded-tl-none border border-white/5 inline-block max-w-[85%]", msg.isSpecial ? "bg-primary/20 text-primary" : "bg-black/60 text-white/90")}>{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <button className="h-14 w-14 bg-white/10 backdrop-blur-3xl rounded-2xl flex items-center justify-center text-white border border-white/10 shadow-2xl active:scale-90 transition-transform">
                <Gift size={24} />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-[340px] bg-[#020503]/95 backdrop-blur-3xl border-white/10 rounded-[2.5rem] p-6 z-[9999] shadow-[0_0_50px_rgba(0,0,0,1)]">
              <div className="space-y-5">
                <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-primary uppercase italic tracking-widest">Bio-Wallet</span>
                    <div className="text-xl font-black text-white italic leading-none">{espBalance} <span className="text-[10px] text-primary">ESP</span></div>
                  </div>
                  <Zap size={16} className="text-primary animate-pulse" />
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {gifts.map(g => (
                    <button 
                      key={g.name} 
                      onClick={() => handleSendGift(g)} 
                      className="flex items-center justify-between p-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-primary/40 group transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <g.icon size={20} className={g.color} />
                        <span className="text-[11px] font-black text-white italic uppercase">{g.name}</span>
                      </div>
                      <span className="text-[10px] text-primary font-black uppercase">{g.cost} ESP</span>
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <form onSubmit={handleSendMessage} className="flex-1 flex gap-2">
            <input 
              value={inputText} 
              onChange={(e) => setInputText(e.target.value)} 
              placeholder="Inyectar señal..." 
              className="flex-1 h-14 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-2xl px-5 text-[11px] text-white focus:outline-none focus:border-primary/50" 
            />
            <button 
              type="submit" 
              className="h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-black shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              <Send size={22} fill="currentColor" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
