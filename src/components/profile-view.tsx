"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Settings, Camera, Play, Music, Heart, 
  Grid, List, Edit3, Share2, Zap, Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { toast } from "@/hooks/use-toast";
import { ProtocolWindow } from "@/components/protocol-window";
import { Input } from "@/components/ui/input";

export function ProfileView() {
  const [isEditing, setIsEditing] = useState(false);
  const [userName, setUserName] = useState("BioEntity_01");
  const avatarUrl = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl || null;

  const stats = [
    { label: "Seguidores", value: "12.4K" },
    { label: "Siguiendo", value: "842" },
    { label: "Amigos", value: "156" }
  ];

  const handleUpdateProfile = () => {
    setIsEditing(false);
    toast({ title: "Protocolo Actualizado", description: "Identidad digital guardada correctamente." });
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="relative h-32 w-full bg-gradient-to-b from-primary/20 to-transparent">
        <div className="absolute top-6 right-6 flex gap-3">
           <button 
             onClick={() => toast({ title: "Enlace Copiado", description: "Tu nodo perfil está listo para compartir." })}
             className="h-10 w-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90"
           >
              <Share2 size={18} />
           </button>
           <button 
             className="h-10 w-10 rounded-xl bg-white/5 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90"
           >
              <Settings size={18} />
           </button>
        </div>
      </div>

      <div className="px-8 -mt-12 space-y-6">
        <div className="flex items-end justify-between">
          <div className="relative group">
            <div className="h-24 w-24 rounded-[2rem] border-4 border-[#020503] bg-white/5 overflow-hidden shadow-2xl relative">
              {avatarUrl ? (
                <Image src={avatarUrl} fill alt="Avatar" className="object-cover" />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black uppercase italic tracking-tighter text-xl">
                  BIO
                </div>
              )}
              <div 
                onClick={() => toast({ title: "Cámara Activa", description: "Selecciona una nueva imagen de nodo." })}
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <Camera size={20} className="text-white" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-lg border-4 border-[#020503] flex items-center justify-center">
               <Zap size={10} fill="black" strokeWidth={3} />
            </div>
          </div>
          
          <Button 
            onClick={() => setIsEditing(true)}
            variant="outline" 
            className="rounded-2xl border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest h-10 px-6 hover:bg-primary hover:text-black transition-all"
          >
            <Edit3 size={14} className="mr-2" />
            Editar Perfil
          </Button>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none">{userName}</h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">@bio_signal_alpha</p>
          <p className="text-[11px] text-white/60 mt-3 leading-relaxed max-w-[80%]">
            Explorador de biomas digitales y coleccionista de señales orgánicas. 🌱⚡ #BioCyber #NatureTech
          </p>
        </div>

        <div className="flex gap-8 py-4 border-y border-white/5">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-lg font-black text-white italic leading-none tracking-tight">{stat.value}</span>
              <span className="text-[8px] font-black uppercase text-primary/40 tracking-widest mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="videos" className="w-full mt-6">
        <TabsList className="flex w-full bg-transparent border-b border-white/5 h-14 px-4 rounded-none gap-4 overflow-x-auto no-scrollbar">
          <TabsTrigger value="videos" className="data-[state=active]:text-primary text-white/20 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 font-black uppercase text-[9px] tracking-widest transition-all">
            Mis Videos
          </TabsTrigger>
          <TabsTrigger value="music" className="data-[state=active]:text-primary text-white/20 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 font-black uppercase text-[9px] tracking-widest transition-all">
            Mi Música
          </TabsTrigger>
          <TabsTrigger value="likes" className="data-[state=active]:text-primary text-white/20 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 font-black uppercase text-[9px] tracking-widest transition-all">
            Favoritos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="videos" className="p-4 grid grid-cols-2 gap-3 animate-in fade-in duration-500">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5 group cursor-pointer active:scale-95 transition-all">
              <Image src={`https://picsum.photos/seed/pv${i}/300/400`} fill alt="Video" className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
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
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                <Music size={20} />
              </div>
              <div className="flex-1">
                <h4 className="text-[11px] font-black text-white uppercase italic tracking-tight">Signal Mix #0{i}</h4>
                <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest">Deep Forest Techno</p>
              </div>
              <Button size="icon" variant="ghost" className="text-white/20 group-hover:text-primary">
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
              value={userName} 
              onChange={(e) => setUserName(e.target.value)}
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