
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { 
  Gamepad2, Leaf, Globe, 
  Search, Lock, Zap, Flame, Key,
  X, Users, Heart, Send, MessageCircle, Eye, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProtocolWindow } from "@/components/protocol-window";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

interface HeartAnimation {
  id: number;
  x: number;
}

export function LiveViewer({ 
  onToggleFullScreen 
}: { 
  onToggleFullScreen: (isFull: boolean) => void 
}) {
  const [activeCategory, setActiveCategory] = useState("Global");
  const [selectedLive, setSelectedLive] = useState<any>(null);
  const [activeLiveStream, setActiveLiveStream] = useState<any>(null);
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
      const liveToOpen = selectedLive;
      setSelectedLive(null);
      setPassword("");
      setActiveLiveStream(liveToOpen);
      onToggleFullScreen(true);
    } else {
      toast({ variant: "destructive", title: "Error de Encriptación", description: "Clave neural incorrecta." });
    }
  };

  const handleLiveClick = (live: any) => {
    if (live.locked) {
      setSelectedLive(live);
    } else {
      setActiveLiveStream(live);
      onToggleFullScreen(true);
    }
  };

  const handleBackFromLive = () => {
    setActiveLiveStream(null);
    onToggleFullScreen(false);
  };

  if (activeLiveStream) {
    return <LiveStreamRoom live={activeLiveStream} onBack={handleBackFromLive} />;
  }

  return (
    <div className="flex flex-col w-full h-full bg-[#020503] animate-in fade-in duration-500 pb-24">
      <div className="p-6 pb-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Bio<span className="text-primary">Live</span></h2>
          <Search size={20} className="text-white/40" />
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all border",
                activeCategory === cat.id 
                  ? "bg-primary/10 border-primary/40 text-primary" 
                  : "bg-white/5 border-white/5 text-white/30"
              )}
            >
              <cat.icon size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">{cat.id}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 grid grid-cols-2 gap-4 no-scrollbar">
        {filteredLives.map((live) => (
          <div 
            key={live.id} 
            onClick={() => handleLiveClick(live)}
            className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 hover:border-primary/30 transition-all cursor-pointer"
          >
            <Image src={live.img} fill alt="Live" className="object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            {live.locked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <Lock size={24} className="text-primary animate-pulse" />
              </div>
            )}

            <div className="absolute top-4 left-4 flex gap-1 items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[8px] font-black text-white uppercase tracking-tighter">{live.watchers}</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[7px] font-black text-primary/60 uppercase tracking-widest">@{live.user}</span>
              <h4 className="text-[10px] font-black text-white uppercase italic leading-tight mt-0.5 line-clamp-2">{live.title}</h4>
            </div>
          </div>
        ))}
      </div>

      <ProtocolWindow isOpen={!!selectedLive} onClose={() => setSelectedLive(null)} title="Acceso Encriptado">
        <div className="space-y-6 text-center">
          <div className="h-20 w-20 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex items-center justify-center mx-auto text-primary">
            <Key size={32} />
          </div>
          <div className="space-y-2">
            <h3 className="text-white font-black italic uppercase tracking-tighter">Sala Privada</h3>
            <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Ingresa la clave de acceso neural para desbloquear la señal</p>
          </div>
          <Input 
            type="password" 
            placeholder="****" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-14 bg-white/5 border-white/10 rounded-2xl text-center text-xl tracking-[1em] text-primary" 
          />
          <Button 
            onClick={handleAccess}
            className="w-full h-14 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl"
          >
            Validar Protocolo
          </Button>
          <p className="text-[8px] text-white/20 font-bold uppercase">Tip: La clave es 2025</p>
        </div>
      </ProtocolWindow>
    </div>
  );
}

function LiveStreamRoom({ live, onBack }: { live: any; onBack: () => void }) {
  const [likes, setLikes] = useState(1420);
  const [hearts, setHearts] = useState<HeartAnimation[]>([]);
  const [isChatVisible, setIsChatVisible] = useState(true);
  const [messages, setMessages] = useState<any[]>([
    { id: 1, user: "BioEntity_02", text: "Increíble la calidad de la señal 🌿" },
    { id: 2, user: "CyberFan", text: "¡Esa planta es bioluminiscente!" },
    { id: 3, user: "NatureGamer", text: "EcoContribution activada." },
  ]);
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTikiTiki = (e: React.MouseEvent | React.TouchEvent) => {
    // Si el chat está visible y el clic fue en la zona del chat, ignorar si se quiere evitar confusión,
    // pero usualmente en lives el tiki tiki es en toda la pantalla.
    setLikes(prev => prev + 1);
    const clientX = 'clientX' in e ? (e as React.MouseEvent).clientX : (e as any).touches[0].clientX;
    const newHeart = {
      id: Date.now(),
      x: clientX
    };
    setHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1000);
  };

  useEffect(() => {
    const chatInterval = setInterval(() => {
      const fakeUsers = ["BotanyNode", "GaiaWatcher", "NeonExplorer", "PulseX"];
      const fakeTexts = ["¡Wow!", "Increíble vista", "Sincronizando...", "🌿⚡🌿", "Protocolo activo"];
      const newMessage = {
        id: Date.now(),
        user: fakeUsers[Math.floor(Math.random() * fakeUsers.length)],
        text: fakeTexts[Math.floor(Math.random() * fakeTexts.length)],
      };
      setMessages(prev => [...prev.slice(-10), newMessage]);
    }, 4000);

    return () => clearInterval(chatInterval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const newMessage = {
      id: Date.now(),
      user: "Tú",
      text: inputText,
    };
    setMessages(prev => [...prev, newMessage]);
    setInputText("");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black animate-in slide-in-from-bottom duration-500 flex flex-col max-w-[420px] mx-auto overflow-hidden">
      <div 
        className="absolute inset-0 z-0 cursor-pointer"
        onClick={handleTikiTiki}
      >
        <Image 
          src={live.img} 
          fill 
          alt="Live Stream" 
          className="object-cover opacity-90 grayscale-[0.2]" 
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60"></div>
      </div>

      {/* Capa de Corazones */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {hearts.map(heart => (
          <div 
            key={heart.id}
            className="absolute bottom-20 animate-heart-float text-primary"
            style={{ left: `${Math.min(heart.x - 20, 380)}px` }}
          >
            <Heart fill="currentColor" size={24} />
          </div>
        ))}
      </div>

      {/* Header del Live */}
      <div className="relative z-20 p-6 flex items-center justify-between">
        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
          <div className="h-10 w-10 rounded-xl overflow-hidden border border-primary">
            <Image src={`https://picsum.photos/seed/${live.user}/100/100`} width={40} height={40} alt="Avatar" />
          </div>
          <div>
            <h4 className="text-xs font-black italic text-white uppercase tracking-tight">@{live.user}</h4>
            <div className="flex items-center gap-1.5">
              <Users size={10} className="text-primary" />
              <span className="text-[8px] font-bold text-white/70 uppercase">{live.watchers}</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsChatVisible(!isChatVisible)}
            className="h-10 w-10 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 transition-all hover:bg-primary hover:text-black"
            title={isChatVisible ? "Ocultar Chat" : "Mostrar Chat"}
          >
            {isChatVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button 
            onClick={onBack}
            className="h-10 w-10 bg-black/40 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 transition-all hover:bg-destructive"
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Likes Counter */}
      <div className="relative z-20 mt-4 px-6">
        <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-md px-3 py-1 rounded-full border border-primary/30">
          <Heart size={12} fill="currentColor" className="text-primary" />
          <span className="text-[9px] font-black text-primary uppercase tracking-widest">{likes}K</span>
        </div>
      </div>

      <div className="flex-1"></div>

      {/* Contenedor del Chat (Ocultable y posicionado abajo) */}
      <div className={cn(
        "relative z-20 px-6 pb-12 transition-all duration-500 transform",
        isChatVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0 pointer-events-none"
      )}>
        <div 
          ref={scrollRef}
          className="max-h-56 overflow-y-auto no-scrollbar space-y-3 mask-fade-top mb-4"
        >
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-0.5 animate-in fade-in slide-in-from-left-2 duration-300">
              <span className="text-[9px] font-black text-primary/80 uppercase tracking-widest italic">{msg.user}</span>
              <p className="text-[11px] text-white/90 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl rounded-tl-none border border-white/5 inline-block max-w-[85%] shadow-xl">
                {msg.text}
              </p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="relative flex-1">
            <MessageCircle size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60" />
            <input 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Inyectar mensaje..." 
              className="w-full h-12 bg-black/50 backdrop-blur-2xl border border-white/10 rounded-2xl pl-10 pr-4 text-xs text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20 shadow-2xl"
            />
          </div>
          <button 
            type="submit"
            className="h-12 w-12 bg-primary rounded-2xl flex items-center justify-center text-black shadow-[0_0_20px_rgba(204,255,0,0.3)] hover:scale-105 active:scale-95 transition-all"
          >
            <Send size={18} fill="currentColor" />
          </button>
        </form>
      </div>

      <style jsx>{`
        .mask-fade-top {
          mask-image: linear-gradient(to bottom, transparent, black 25%);
        }
      `}</style>
    </div>
  );
}
