
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Gamepad2, Leaf, Globe, 
  Search, Lock, Zap, Flame, Key,
  X, Users, Heart, Send, MessageCircle, Eye, EyeOff,
  Gift, Sparkles, Trophy, Gem, Dna
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

interface HeartAnimation {
  id: number;
  x: number;
}

interface GiftAnimation {
  id: number;
  icon: any;
  color: string;
}

export function LiveViewer({ 
  onToggleFullScreen 
}: { 
  onToggleFullScreen: (isFull: boolean) => void 
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
      <div className="fixed inset-0 z-[100] bg-black overflow-y-scroll snap-y snap-mandatory no-scrollbar max-w-[500px] left-1/2 -translate-x-1/2">
        {lives.filter(l => !l.locked).map((live) => (
          <div key={live.id} className="h-full w-full snap-start shrink-0">
            <LiveStreamRoom live={live} onBack={() => { setViewingMode(false); onToggleFullScreen(false); }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#020503] animate-in fade-in duration-500 pb-24">
      <div className="p-8 pb-4 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none">Bio<span className="text-primary">Live</span></h2>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40 mt-2">Canales en tiempo real</p>
          </div>
          <button className="h-12 w-12 bg-white/5 rounded-2xl flex items-center justify-center text-white/40 border border-white/10">
            <Search size={20} />
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-5 py-3 rounded-2xl transition-all border shrink-0",
                activeCategory === cat.id 
                  ? "bg-primary/10 border-primary/40 text-primary" 
                  : "bg-white/5 border-white/5 text-white/30"
              )}
            >
              <cat.icon size={14} />
              <span className="text-[10px] font-black uppercase tracking-widest">{cat.id}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 space-y-6 no-scrollbar">
        {filteredLives.map((live) => (
          <div 
            key={live.id} 
            onClick={() => handleLiveClick(live)}
            className="group relative aspect-video rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 hover:border-primary/30 transition-all cursor-pointer shadow-2xl"
          >
            <Image src={live.img} fill alt="Live" className="object-cover opacity-60 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            {live.locked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Lock size={24} className="animate-pulse" />
                </div>
              </div>
            )}

            <div className="absolute top-6 left-6 flex gap-2 items-center bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,1)]"></div>
              <span className="text-[10px] font-black text-white uppercase tracking-tighter">{live.watchers}</span>
            </div>

            <div className="absolute bottom-6 left-8 right-8">
              <span className="text-[10px] font-black text-primary/60 uppercase tracking-widest italic">@{live.user}</span>
              <h4 className="text-xl font-black text-white uppercase italic leading-tight mt-1 line-clamp-1">{live.title}</h4>
            </div>
          </div>
        ))}
      </div>

      <ProtocolWindow isOpen={!!selectedLive} onClose={() => setSelectedLive(null)} title="Acceso Encriptado">
        <div className="space-y-6 text-center">
          <div className="h-24 w-24 bg-primary/10 rounded-[3rem] border border-primary/20 flex items-center justify-center mx-auto text-primary shadow-[0_0_30px_rgba(204,255,0,0.2)]">
            <Key size={36} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl text-white font-black italic uppercase tracking-tighter">Sala Privada</h3>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-relaxed">Ingresa la clave de acceso neural para @{selectedLive?.user}</p>
          </div>
          <Input 
            type="password" 
            placeholder="****" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-16 bg-white/5 border-white/10 rounded-2xl text-center text-2xl tracking-[1em] text-primary focus-visible:ring-primary" 
          />
          <Button 
            onClick={handleAccess}
            className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.3)]"
          >
            Validar Protocolo
          </Button>
          <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">Tip: 2025</p>
        </div>
      </ProtocolWindow>
    </div>
  );
}

function LiveStreamRoom({ live, onBack }: { live: any; onBack: () => void }) {
  const [likes, setLikes] = useState(1420);
  const [hearts, setHearts] = useState<HeartAnimation[]>([]);
  const [activeGifts, setActiveGifts] = useState<GiftAnimation[]>([]);
  const [espBalance, setEspBalance] = useState(2500);
  const [isChatVisible, setIsChatVisible] = useState(true);
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
  ];

  const handleTikiTiki = (e: React.MouseEvent | React.TouchEvent) => {
    setLikes(prev => prev + 1);
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = 'clientX' in e ? (e as React.MouseEvent).clientX : (e as any).touches[0].clientX;
    const constrainedX = Math.max(40, Math.min(clientX - rect.left, 460));
    const newHeart = { id: Date.now(), x: constrainedX };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== newHeart.id)), 1000);
  };

  const handleSendGift = (gift: any) => {
    if (espBalance < gift.cost) return;
    setEspBalance(prev => prev - gift.cost);
    const newGiftAnim = { id: Date.now(), icon: gift.icon, color: gift.color };
    setActiveGifts(prev => [...prev, newGiftAnim]);
    setTimeout(() => setActiveGifts(prev => prev.filter(g => g.id !== newGiftAnim.id)), 2000);
    setMessages(prev => [...prev, { id: Date.now(), user: "SISTEMA", text: `🎁 Enviado: ${gift.name}`, isSpecial: true }]);
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

      <div className="relative z-40 px-8 py-10 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-2xl p-2.5 rounded-[1.75rem] border border-white/10 pointer-events-auto">
          <div className="h-11 w-11 rounded-2xl overflow-hidden border border-primary/50">
            <Image src={`https://picsum.photos/seed/${live.user}/100/100`} width={44} height={44} alt="Avatar" />
          </div>
          <div className="pr-4 text-left">
            <h4 className="text-[12px] font-black italic text-white uppercase leading-none mb-1.5">@{live.user}</h4>
            <div className="flex items-center gap-2">
              <Users size={12} className="text-primary" />
              <span className="text-[10px] font-black text-white/70 uppercase">{live.watchers}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3 pointer-events-auto">
          <button onClick={() => setIsChatVisible(!isChatVisible)} className="h-12 w-12 bg-black/40 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/10">
            {isChatVisible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
          <button onClick={onBack} className="h-12 w-12 bg-black/40 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/10">
            <X size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1"></div>

      <div className={cn("relative z-40 px-8 pb-6 transition-all duration-500", isChatVisible ? "opacity-100" : "opacity-0 pointer-events-none")}>
        <div ref={scrollRef} className="max-h-44 overflow-y-auto no-scrollbar space-y-3 mb-4">
          {messages.map((msg) => (
            <div key={msg.id} className="text-left animate-in fade-in slide-in-from-left-2">
              <span className={cn("text-[9px] font-black uppercase italic", msg.isSpecial ? "text-primary" : "text-primary/70")}>{msg.user}</span>
              <p className={cn("text-[11px] backdrop-blur-md px-4 py-2 rounded-2xl rounded-tl-none border border-white/5 inline-block max-w-[85%]", msg.isSpecial ? "bg-primary/20 text-primary" : "bg-black/60 text-white/90")}>{msg.text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <button className="h-16 w-16 bg-white/10 backdrop-blur-3xl rounded-[1.5rem] flex items-center justify-center text-white border border-white/10">
                <Gift size={28} />
              </button>
            </PopoverTrigger>
            <PopoverContent side="top" align="start" className="w-[340px] bg-black/95 backdrop-blur-3xl border-white/10 rounded-[3rem] p-6 z-[9999]">
              <div className="space-y-6">
                <div className="p-5 rounded-[2rem] bg-primary/10 border border-primary/20">
                  <span className="text-[11px] font-black text-primary uppercase italic">Bio-Wallet</span>
                  <div className="text-2xl font-black text-white italic">{espBalance} ESP</div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {gifts.map(g => (
                    <button key={g.name} onClick={() => handleSendGift(g)} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:border-primary/40 group transition-all">
                      <div className="flex items-center gap-4">
                        <g.icon size={22} className={g.color} />
                        <span className="text-sm font-black text-white italic uppercase">{g.name}</span>
                      </div>
                      <span className="text-primary font-black">{g.cost} ESP</span>
                    </button>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <form onSubmit={handleSendMessage} className="flex-1 flex gap-4">
            <input value={inputText} onChange={(e) => setInputText(e.target.value)} placeholder="Inyectar señal..." className="flex-1 h-16 bg-black/60 backdrop-blur-3xl border border-white/10 rounded-[1.5rem] px-6 text-[12px] text-white focus:outline-none focus:border-primary/50" />
            <button type="submit" className="h-16 w-16 bg-primary rounded-[1.5rem] flex items-center justify-center text-black shadow-lg"><Send size={26} fill="currentColor" /></button>
          </form>
        </div>
      </div>
    </div>
  );
}
