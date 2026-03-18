"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Menu, Camera, Play, Music, Heart, 
  Edit3, Share2, Zap, UserPlus, Check, Send, ChevronLeft,
  Wallet, History, UserCircle, LifeBuoy, HelpCircle, Settings, Lock,
  TrendingUp, Gift, DollarSign, PlusCircle, X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { toast } from "@/hooks/use-toast";
import { ProtocolWindow } from "@/components/protocol-window";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function ProfileView({ 
  username = "BioEntity_01_Official_Handle", 
  isOwnProfile = true,
  onBack
}: { 
  username?: string;
  isOwnProfile?: boolean;
  onBack?: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState(username);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeMenuSection, setActiveMenuSection] = useState<string | null>(null);
  
  const avatarUrl = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl || null;

  const stats = [
    { label: "Seguidores", value: isOwnProfile ? "12.4K" : "4.2K" },
    { label: "Siguiendo", value: isOwnProfile ? "842" : "120" },
    { label: "ESP Tokens", value: isOwnProfile ? "2.5K" : "800" }
  ];

  const handleUpdateProfile = () => {
    setIsEditing(false);
    toast({ title: "Protocolo Actualizado", description: "Identidad digital guardada correctamente." });
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast({ 
      title: isFollowing ? "Sincronización Terminada" : "Sincronizado", 
      description: isFollowing ? `Has dejado de seguir a @${profileName}` : `Siguiendo a @${profileName}` 
    });
  };

  const menuItems = [
    { id: "wallet", label: "Billetera ESP", icon: Wallet, color: "text-primary" },
    { id: "activity", label: "Registro de Actividad", icon: History, color: "text-white/60" },
    { id: "account", label: "Información de la Cuenta", icon: UserCircle, color: "text-white/60" },
    { id: "support", label: "Soporte Técnico", icon: LifeBuoy, color: "text-white/60" },
    { id: "help", label: "Ayuda", icon: HelpCircle, color: "text-white/60" },
    { id: "settings", label: "Ajustes", icon: Settings, color: "text-white/60" },
    { id: "privacy", label: "Privacidad", icon: Lock, color: "text-accent" },
  ];

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="relative h-32 w-full bg-gradient-to-b from-primary/20 to-transparent">
        <div className="absolute top-6 left-6 flex gap-3 z-20">
           {!isOwnProfile && (
             <button 
               onClick={onBack}
               className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90"
             >
                <ChevronLeft size={20} />
             </button>
           )}
        </div>
        <div className="absolute top-6 right-6 flex gap-3 z-20">
           <button 
             onClick={() => toast({ title: "Enlace Copiado", description: "Nodo perfil listo para compartir." })}
             className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90"
           >
              <Share2 size={18} />
           </button>
           {isOwnProfile && (
             <Sheet>
               <SheetTrigger asChild>
                 <button className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90">
                    <Menu size={18} />
                 </button>
               </SheetTrigger>
               <SheetContent side="right" className="bg-[#020503] border-white/5 p-0 w-full sm:max-w-[400px]">
                 <div className="flex flex-col h-full">
                    <SheetHeader className="p-8 border-b border-white/5">
                      <SheetTitle className="text-2xl font-black italic uppercase text-white tracking-tighter">
                        Centro <span className="text-primary">Neural</span>
                      </SheetTitle>
                    </SheetHeader>

                    <ScrollArea className="flex-1 p-6">
                      {!activeMenuSection ? (
                        <div className="space-y-2">
                          {menuItems.map((item) => (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (item.id === "wallet") setActiveMenuSection("wallet");
                                else toast({ title: item.label, description: "Protocolo en desarrollo." });
                              }}
                              className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                <item.icon size={20} className={item.color} />
                                <span className="text-xs font-black uppercase tracking-widest text-white/80">{item.label}</span>
                              </div>
                              <ChevronLeft size={16} className="rotate-180 text-white/20 group-hover:text-primary" />
                            </button>
                          ))}
                        </div>
                      ) : activeMenuSection === "wallet" ? (
                        <div className="space-y-8 animate-in slide-in-from-right duration-300">
                          <button 
                            onClick={() => setActiveMenuSection(null)}
                            className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors"
                          >
                            <ChevronLeft size={16} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Volver</span>
                          </button>

                          <div className="p-6 rounded-[2.5rem] bg-primary/10 border border-primary/20 space-y-4 shadow-[0_0_30px_rgba(204,255,0,0.1)]">
                             <div className="flex justify-between items-start">
                                <span className="text-[9px] font-black uppercase text-primary tracking-widest italic">Bio-Wallet balance</span>
                                <Zap size={14} className="text-primary animate-pulse" />
                             </div>
                             <div className="text-4xl font-black italic text-white leading-none">2,500 <span className="text-sm text-primary">ESP</span></div>
                             <Button className="w-full bg-primary text-black font-black uppercase italic tracking-widest h-12 rounded-xl">
                                <PlusCircle size={16} className="mr-2" />
                                Inyectar Tokens
                             </Button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                             <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                <TrendingUp size={14} className="text-accent" />
                                <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Estadísticas</p>
                                <p className="text-lg font-black text-white italic">+24% <span className="text-[8px] text-accent">↑</span></p>
                             </div>
                             <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                <DollarSign size={14} className="text-green-400" />
                                <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Ingresos Live</p>
                                <p className="text-lg font-black text-white italic">1.2K <span className="text-[8px] text-primary">ESP</span></p>
                             </div>
                          </div>

                          <div className="space-y-4">
                             <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic">Historial Reciente</h4>
                             <div className="space-y-2">
                                {[
                                  { type: "gift", label: "Regalo enviado", amount: "-50", user: "@Watcher_12" },
                                  { type: "buy", label: "Compra de Tokens", amount: "+500", user: "Protocol Gaia" },
                                  { type: "income", label: "Ingreso por Live", amount: "+120", user: "@Fan_99" },
                                ].map((t, i) => (
                                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                                        {t.type === 'gift' ? <Gift size={14} className="text-red-400" /> : <DollarSign size={14} className="text-primary" />}
                                      </div>
                                      <div>
                                        <p className="text-[9px] font-black text-white uppercase italic tracking-tight">{t.label}</p>
                                        <p className="text-[7px] font-bold text-white/20 uppercase tracking-widest">{t.user}</p>
                                      </div>
                                    </div>
                                    <span className={cn(
                                      "text-[10px] font-black italic",
                                      t.amount.startsWith('+') ? "text-primary" : "text-red-400"
                                    )}>{t.amount}</span>
                                  </div>
                                ))}
                             </div>
                          </div>
                        </div>
                      ) : null}
                    </ScrollArea>
                 </div>
               </SheetContent>
             </Sheet>
           )}
        </div>
      </div>

      <div className="px-8 -mt-12 space-y-6">
        <div className="flex items-end justify-between">
          <div className="relative group shrink-0">
            <div className="h-24 w-24 rounded-[2rem] border-4 border-[#020503] bg-white/5 overflow-hidden shadow-2xl relative">
              <Image 
                src={isOwnProfile ? (avatarUrl || "") : `https://picsum.photos/seed/${profileName}/200/200`} 
                fill 
                alt="Avatar" 
                className="object-cover" 
              />
              {isOwnProfile && (
                <div 
                  onClick={() => toast({ title: "Cámara Activa", description: "Selecciona una nueva imagen de nodo." })}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <Camera size={20} className="text-white" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-lg border-4 border-[#020503] flex items-center justify-center">
               <Zap size={10} fill="black" strokeWidth={3} />
            </div>
          </div>
          
          <div className="flex gap-2 mb-2">
            {isOwnProfile ? (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline" 
                className="rounded-2xl border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest h-10 px-6 hover:bg-primary hover:text-black transition-all"
              >
                <Edit3 size={14} className="mr-2" />
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => toast({ title: "Canal Seguro", description: "Abriendo chat encriptado..." })}
                  className="rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 h-10 w-10 p-0 shrink-0"
                >
                  <Send size={16} />
                </Button>
                <Button 
                  onClick={handleFollow}
                  className={cn(
                    "rounded-2xl text-[9px] font-black uppercase tracking-widest h-10 px-6 transition-all",
                    isFollowing ? "bg-white/10 text-white/40" : "bg-primary text-black shadow-lg"
                  )}
                >
                  {isFollowing ? <Check size={14} className="mr-2" /> : <UserPlus size={14} className="mr-2" />}
                  {isFollowing ? "Siguiendo" : "Seguir"}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1 min-w-0">
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none truncate">{profileName}</h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate">@{profileName.toLowerCase().replace(/\s+/g, '_')}</p>
          <p className="text-[11px] text-white/60 mt-3 leading-relaxed max-w-[90%] line-clamp-2">
            {isOwnProfile 
              ? "Explorador de biomas digitales y coleccionista de señales orgánicas. 🌱⚡ #BioCyber #NatureTech"
              : "Creador de contenido neural. Generando esporas de información 24/7. #BioLive #PublicSignal"}
          </p>
        </div>

        <div className="flex gap-8 py-4 border-y border-white/5">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-lg font-black text-white italic leading-none tracking-tight">{stat.value}</span>
              <span className="text-[8px] font-black uppercase text-primary/40 tracking-widest mt-1 whitespace-nowrap">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="videos" className="w-full mt-6">
        <TabsList className="flex w-full bg-transparent border-b border-white/5 h-14 px-4 rounded-none gap-4 overflow-x-auto no-scrollbar">
          <TabsTrigger value="videos" className="data-[state=active]:text-primary text-white/20 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 font-black uppercase text-[9px] tracking-widest transition-all">
            Videos
          </TabsTrigger>
          <TabsTrigger value="music" className="data-[state=active]:text-primary text-white/20 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 font-black uppercase text-[9px] tracking-widest transition-all">
            Música
          </TabsTrigger>
          {isOwnProfile && (
            <TabsTrigger value="likes" className="data-[state=active]:text-primary text-white/20 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 font-black uppercase text-[9px] tracking-widest transition-all">
              Favoritos
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="videos" className="p-4 grid grid-cols-2 gap-3 animate-in fade-in duration-500">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5 group cursor-pointer active:scale-95 transition-all">
              <Image src={`https://picsum.photos/seed/pv${profileName}${i}/300/400`} fill alt="Video" className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-3 left-3 flex items-center gap-1">
                <Play size={10} className="text-white/60" />
                <span className="text-[8px] font-black text-white/60">{Math.floor(Math.random() * 20)}K</span>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="music" className="p-6 space-y-4 animate-in fade-in duration-500">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer active:bg-white/10">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <Music size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-black text-white uppercase italic tracking-tight truncate">Signal Mix #0{i} Deep Forest</h4>
                <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest truncate">Deep Forest Techno Protocol</p>
              </div>
              <Button size="icon" variant="ghost" className="text-white/20 group-hover:text-primary shrink-0">
                <Play size={18} />
              </Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="likes" className="p-4 grid grid-cols-2 gap-3 animate-in fade-in duration-500">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5 cursor-pointer active:scale-95 transition-all">
              <Image src={`https://picsum.photos/seed/like${i}/300/400`} fill alt="Liked" className="object-cover opacity-50" />
              <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary/10 backdrop-blur-md flex items-center justify-center text-primary">
                <Heart size={12} fill="currentColor" />
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <ProtocolWindow isOpen={isEditing} onClose={() => setIsEditing(false)} title="Identidad Digital">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Bio-Alias</label>
            <Input 
              value={profileName} 
              onChange={(e) => setProfileName(e.target.value)}
              className="h-14 bg-white/5 border-white/10 rounded-2xl text-white px-6 focus-visible:ring-primary" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Bio-Descripción</label>
            <Input 
              placeholder="Explorador de biomas..."
              className="h-14 bg-white/5 border-white/10 rounded-2xl text-white px-6 focus-visible:ring-primary" 
            />
          </div>
          <Button 
            onClick={handleUpdateProfile}
            className="w-full h-14 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.3)]"
          >
            Sincronizar Protocolo
          </Button>
        </div>
      </ProtocolWindow>
    </div>
  );
}
