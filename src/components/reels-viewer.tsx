"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Heart, MessageCircle, Share2, Music, Play, Pause, Volume2, VolumeX, Zap,
  Link, Mail, Facebook, Send, Camera, X, MessageSquare, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { ProtocolWindow } from "@/components/protocol-window";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as DialogPrimitive from "@radix-ui/react-dialog";

/**
 * @fileOverview Visualizador de Reels optimizado con protocolos de Interacción Extendida.
 * Estandarizado a 500px con control estricto de desbordamiento de texto.
 * Comentarios ahora en formato Bottom Sheet de media pantalla.
 */

const VIDEO_SOURCES = [
  "https://www.youtube.com/embed/Ap7pyB8Gp5Q?autoplay=0&mute=1&loop=1&playlist=Ap7pyB8Gp5Q&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/-rDD5v-oTjM?autoplay=0&mute=1&loop=1&playlist=-rDD5v-oTjM&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/dn3mKOYeR20?autoplay=0&mute=1&loop=1&playlist=dn3mKOYeR20&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/A0I0CnYoFO8?autoplay=0&mute=1&loop=1&playlist=A0I0CnYoFO8&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/OKkle0WgDQQ?autoplay=0&mute=1&loop=1&playlist=OKkle0WgDQQ&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/80aU_aT1VPA?autoplay=0&mute=1&loop=1&playlist=80aU_aT1VPA&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/sJTcMA3e7LI?autoplay=0&mute=1&loop=1&playlist=sJTcMA3e7LI&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/kMQLJC9aV9s?autoplay=0&mute=1&loop=1&playlist=kMQLJC9aV9s&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/fqOJVCH3RAc?autoplay=0&mute=1&loop=1&playlist=fqOJVCH3RAc&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/5U2xPq_oSHI?autoplay=0&mute=1&loop=1&playlist=5U2xPq_oSHI&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/twG-EwxFb-A?autoplay=0&mute=1&loop=1&playlist=twG-EwxFb-A&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/zc4hD4ytN0A?autoplay=0&mute=1&loop=1&playlist=zc4hD4ytN0A&controls=0&modestbranding=1&rel=0",
  "https://www.youtube.com/embed/dORlRI79D3w?autoplay=0&mute=1&loop=1&playlist=dORlRI79D3w&controls=0&modestbranding=1&rel=0"
];

const INITIAL_REELS = Array.from({ length: 50 }, (_, i) => ({
  id: `reel-${i}`,
  user: `BioEntity_${i + 100}`,
  description: `Inyectando señal neural #${i + 1}. Exploración del bioma Gaia Sector ${Math.floor(Math.random() * 10)}. #bio #cyber #life #nature #enterprise`,
  likes: Math.floor(Math.random() * 500),
  commentsCount: Math.floor(Math.random() * 100),
  video: VIDEO_SOURCES[i % VIDEO_SOURCES.length],
  liked: false,
  following: false
}));

const MOCK_COMMENTS = [
  { id: "c1", user: "BioGuard_01", text: "Increíble flujo de señal. El bioma se ve muy estable." },
  { id: "c2", user: "GaiaWatcher", text: "Me encanta la síntesis de esporas de este sector." },
  { id: "c3", user: "CyberNature", text: "BioLive está evolucionando rápido 🌿⚡" },
  { id: "c4", user: "Watcher_99", text: "Excelente resolución." },
  { id: "c5", user: "NeonExplorer", text: "Protocolo de luz activo en ese cuadrante." },
  { id: "c6", user: "Gaia_OS", text: "Señal optimizada por el nodo central." },
];

export function ReelsViewer({ 
  onProfileClick,
  requireAuth
}: { 
  onProfileClick: (u: string) => void,
  requireAuth: (cb: () => void) => void
}) {
  const [reels, setReels] = useState(INITIAL_REELS);
  const [globalMuted, setGlobalMuted] = useState(true);

  const toggleLike = (id: string) => {
    requireAuth(() => {
      setReels(prev => prev.map(reel => {
        if (reel.id === id) {
          return { 
            ...reel, 
            liked: !reel.liked, 
            likes: reel.liked ? reel.likes - 1 : reel.likes + 1 
          };
        }
        return reel;
      }));
    });
  };

  const toggleFollow = (id: string) => {
    requireAuth(() => {
      setReels(prev => prev.map(reel => {
        if (reel.id === id) {
          if (!reel.following) toast({ title: "Sincronizado", description: `@${reel.user} añadido.` });
          return { ...reel, following: !reel.following };
        }
        return reel;
      }));
    });
  };

  return (
    <div className="h-full w-full overflow-y-scroll snap-y snap-mandatory no-scrollbar bg-black">
      {reels.map((reel) => (
        <ReelItem 
          key={reel.id} 
          reel={reel} 
          globalMuted={globalMuted}
          setGlobalMuted={setGlobalMuted}
          onProfileClick={onProfileClick} 
          toggleLike={toggleLike}
          toggleFollow={toggleFollow}
          requireAuth={requireAuth}
        />
      ))}
    </div>
  );
}

function ReelItem({ 
  reel, 
  globalMuted, 
  setGlobalMuted, 
  onProfileClick, 
  toggleLike, 
  toggleFollow, 
  requireAuth 
}: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsActive(entry.isIntersecting), { threshold: 0.8 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const getYouTubeSrc = () => {
    let url = reel.video;
    const finalMute = !isActive || globalMuted;
    
    let id = "";
    if (url.includes('shorts/')) {
        id = url.split('shorts/')[1].split('?')[0];
    } else if (url.includes('watch?v=')) {
        id = url.split('v=')[1].split('&')[0];
    } else if (url.includes('/embed/')) {
        id = url.split('/embed/')[1].split('?')[0];
    } else {
        const parts = url.split('/');
        id = parts[parts.length - 1].split('?')[0];
    }

    return `https://www.youtube.com/embed/${id}?autoplay=${isActive ? 1 : 0}&mute=${finalMute ? 1 : 0}&loop=1&playlist=${id}&controls=0&modestbranding=1&rel=0`;
  };

  const handleCopyLink = () => {
    toast({ title: "Enlace Copiado", description: "Nodo de distribución listo." });
    setIsShareOpen(false);
  };

  const handleShareToStory = () => {
    requireAuth(() => {
      toast({ title: "Compartido", description: "Señal inyectada en tu historia." });
      setIsShareOpen(false);
    });
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    requireAuth(() => {
      toast({ title: "Comentario Enviado", description: "Tu frecuencia ha sido registrada." });
      setCommentText("");
    });
  };

  return (
    <div ref={containerRef} className="relative h-full w-full snap-start snap-always shrink-0 flex items-center justify-center">
      <div className="relative w-full h-full max-w-[500px] bg-black overflow-hidden">
        <iframe 
          src={getYouTubeSrc()} 
          className="h-full w-full object-cover opacity-80 pointer-events-none" 
          allow="autoplay; encrypted-media"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/90 pointer-events-none"></div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); setGlobalMuted(!globalMuted); }}
          className="absolute top-44 right-6 z-50 h-10 w-10 bg-black/40 backdrop-blur-xl rounded-xl border border-white/10 flex items-center justify-center text-primary"
        >
          {globalMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>

        <div className="absolute bottom-12 left-8 right-20 space-y-4 z-50">
          <div className="flex items-center gap-3 min-w-0">
            <div 
              className="h-10 w-10 rounded-full border-2 border-primary overflow-hidden shadow-2xl cursor-pointer shrink-0"
              onClick={() => onProfileClick(reel.user)}
            >
              <img src={`https://picsum.photos/seed/${reel.user}/100/100`} alt="Avatar" className="object-cover h-full w-full" />
            </div>
            <div className="flex flex-col cursor-pointer min-w-0 flex-1" onClick={() => onProfileClick(reel.user)}>
              <span className="text-[10px] font-black text-white italic uppercase tracking-widest truncate">@{reel.user}</span>
            </div>
            <button 
              onClick={() => toggleFollow(reel.id)}
              className={cn(
                "px-3 py-1.5 text-[8px] font-black rounded-xl uppercase tracking-widest transition-all shrink-0",
                reel.following ? "bg-white/10 text-white/40" : "bg-primary text-black shadow-lg"
              )}
            >
              {reel.following ? "Siguiendo" : "Seguir"}
            </button>
          </div>
          <p className="text-[11px] text-white/90 leading-relaxed font-medium line-clamp-3 pr-4">{reel.description}</p>
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md w-fit px-4 py-1.5 rounded-xl border border-white/5">
            <Music size={10} className="text-primary animate-pulse" />
            <span className="text-[8px] text-primary font-black uppercase tracking-widest italic truncate max-w-[120px]">Signal v.01 • Active</span>
          </div>
        </div>

        {/* Panel Lateral de Interacción */}
        <div className="absolute bottom-52 right-3 flex flex-col items-center gap-6 z-50">
          <div onClick={() => toggleLike(reel.id)} className="flex flex-col items-center gap-1 cursor-pointer">
            <div className={cn(
              "h-12 w-12 bg-white/5 backdrop-blur-xl border rounded-full flex items-center justify-center transition-all shadow-2xl",
              reel.liked ? "text-red-500 border-red-500/40" : "text-white"
            )}>
              <Heart size={24} fill={reel.liked ? "currentColor" : "none"} />
            </div>
            <span className="text-[9px] font-black text-white/60 tracking-widest truncate">{reel.likes}K</span>
          </div>
          
          <div onClick={() => setIsCommentsOpen(true)} className="flex flex-col items-center gap-1 cursor-pointer">
            <div className="h-12 w-12 bg-white/5 backdrop-blur-xl border rounded-full flex items-center justify-center text-white shadow-2xl">
              <MessageCircle size={24} />
            </div>
            <span className="text-[9px] font-black text-white/60 tracking-widest truncate">{reel.commentsCount}</span>
          </div>
          
          <div onClick={() => setIsShareOpen(true)} className="h-12 w-12 bg-white/5 backdrop-blur-xl border rounded-full flex items-center justify-center text-white shadow-2xl cursor-pointer">
            <Share2 size={24} />
          </div>
        </div>
      </div>

      {/* Protocolo de Distribución (Compartir) */}
      <ProtocolWindow isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} title="Nodo de Distribución">
        <div className="w-full max-w-[390px] px-6 space-y-8 flex flex-col items-center pb-20 mx-auto">
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">Bio<span className="text-primary">Share</span></h3>
            <p className="text-[9px] text-white/30 font-black uppercase tracking-widest italic">Difundir Frecuencia en la Red</p>
          </div>

          <div className="grid grid-cols-2 gap-4 w-full">
            <button 
              onClick={handleCopyLink}
              className="flex flex-col items-center justify-center p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all group"
            >
              <Link size={24} className="text-primary mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">Copiar Enlace</span>
            </button>
            <button 
              onClick={handleShareToStory}
              className="flex flex-col items-center justify-center p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/10 hover:border-accent/40 transition-all group"
            >
              <Camera size={24} className="text-accent mb-3 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/60">En Historia</span>
            </button>
          </div>

          <div className="w-full space-y-3">
            {[
              { id: 'whatsapp', label: 'WhatsApp', icon: Send, color: 'text-green-500' },
              { id: 'gmail', label: 'Gmail', icon: Mail, color: 'text-red-500' },
              { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-500' }
            ].map((network) => (
              <button 
                key={network.id}
                onClick={() => { toast({ title: network.label, description: "Conectando con el nodo externo..." }); setIsShareOpen(false); }}
                className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-4">
                  <network.icon size={20} className={network.color} />
                  <span className="text-[11px] font-black uppercase tracking-widest text-white/80">{network.label}</span>
                </div>
                <Zap size={12} className="text-white/20" />
              </button>
            ))}
          </div>
        </div>
      </ProtocolWindow>

      {/* Protocolo de Comentarios (Hilos Neurales) - Bottom Half Sheet */}
      <DialogPrimitive.Root open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px]" />
          <DialogPrimitive.Content 
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] h-[60vh] bg-[#020503] rounded-t-[3rem] border-t border-white/10 z-[70] shadow-[0_-20px_50px_rgba(0,0,0,0.5)] focus:outline-none flex flex-col overflow-hidden"
          >
            {/* Header del Bottom Sheet */}
            <div className="px-8 pt-6 pb-4 flex items-center justify-between border-b border-white/5 bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <MessageSquare size={16} className="text-primary" />
                <DialogPrimitive.Title className="text-xs font-black uppercase italic tracking-widest text-white">
                  Hilos Neurales
                </DialogPrimitive.Title>
              </div>
              
              {/* Botón de Cierre Minimalista */}
              <DialogPrimitive.Close className="h-8 w-8 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                <X size={16} />
              </DialogPrimitive.Close>
            </div>

            <ScrollArea className="flex-1 px-8">
              <div className="py-6 space-y-6">
                {MOCK_COMMENTS.map((comment) => (
                  <div key={comment.id} className="flex flex-col gap-2 group">
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-lg bg-white/10 border border-white/10 overflow-hidden relative">
                        <img src={`https://picsum.photos/seed/${comment.user}/50/50`} alt="Avatar" className="object-cover h-full w-full" />
                      </div>
                      <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest italic">@{comment.user}</span>
                    </div>
                    <div className="bg-white/[0.03] border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 text-[11px] text-white/80 leading-relaxed max-w-[90%] transition-all group-hover:bg-white/5">
                      {comment.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input de Comentarios Fijo */}
            <div className="p-6 bg-[#020503] border-t border-white/5">
              <form onSubmit={handleSendComment} className="flex gap-3">
                 <Input 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Inyectar respuesta..." 
                  className="h-12 bg-white/5 border-white/10 rounded-2xl px-5 text-[10px] text-white focus-visible:ring-primary placeholder:text-white/20"
                 />
                 <Button type="submit" className="h-12 w-12 rounded-2xl bg-primary text-black shrink-0 shadow-lg shadow-primary/20 active:scale-90 transition-all">
                    <Send size={18} fill="currentColor" />
                 </Button>
              </form>
            </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </div>
  );
}
