"use client";

import { useState } from "react";
import { 
  Clapperboard, PlayCircle, Music, Radio, 
  Camera, ChevronLeft, Upload, Zap, 
  Globe, Lock, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type CreationType = "reel" | "video" | "music" | "live" | "story" | null;

export function CreationHub() {
  const [selectedType, setSelectedType] = useState<CreationType>(null);

  const options = [
    { id: "live", label: "En Vivo", icon: Radio, color: "text-red-500", desc: "Transmisión Neural Real-time" },
    { id: "reel", label: "Bio-Reel", icon: Clapperboard, color: "text-primary", desc: "Video Vertical 9:16" },
    { id: "video", label: "Video", icon: PlayCircle, color: "text-accent", desc: "Formato Largo 4K" },
    { id: "music", label: "Música", icon: Music, color: "text-purple-400", desc: "Señal de Audio Orgánica" },
    { id: "story", label: "Historia", icon: Camera, color: "text-yellow-400", desc: "Momentos Efímeros" },
  ];

  if (selectedType) {
    return (
      <div className="flex flex-col w-full min-h-[70vh] animate-in slide-in-from-right duration-500">
        <button 
          onClick={() => setSelectedType(null)}
          className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Volver al Hub</span>
        </button>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              {options.find(o => o.id === selectedType)?.icon({ size: 28 })}
            </div>
            <div>
              <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none">Nueva <span className="text-primary">{options.find(o => o.id === selectedType)?.label}</span></h2>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-1">Configuración de Protocolo</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Título de la Señal</label>
              <Input placeholder="Ej: Exploración Sector 7" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white focus-visible:ring-primary px-6" />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Descripción Neural</label>
              <Textarea placeholder="Describe tu contenido..." className="min-h-[100px] bg-white/5 border-white/10 rounded-2xl text-white focus-visible:ring-primary px-6 py-4" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Bio-Categoría</label>
                <Select>
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white/60">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050906] border-white/10 text-white">
                    <SelectItem value="nature">Naturaleza</SelectItem>
                    <SelectItem value="cyber">Cyber-Tech</SelectItem>
                    <SelectItem value="urban">Urbano</SelectItem>
                    <SelectItem value="lab">Laboratorio</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Visibilidad</label>
                <Select>
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white/60">
                    <SelectValue placeholder="Público" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050906] border-white/10 text-white">
                    <SelectItem value="public">Global (Público)</SelectItem>
                    <SelectItem value="friends">Círculo Neural (Amigos)</SelectItem>
                    <SelectItem value="private">Encriptado (Privado)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="p-10 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 bg-white/[0.02] hover:bg-white/[0.04] hover:border-primary/20 transition-all cursor-pointer group">
              <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary transition-colors">
                <Upload size={32} />
              </div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/60">Arrastra tu Archivo</p>
                <p className="text-[8px] font-bold text-white/20 uppercase mt-1">Soporta MP4, WAV, JPG (Max 500MB)</p>
              </div>
            </div>

            <Button className="w-full h-16 rounded-2xl bg-primary text-black font-black uppercase tracking-widest italic text-[11px] shadow-[0_0_30px_rgba(204,255,0,0.3)] hover:scale-[1.02] transition-transform">
              Iniciar Protocolo de Carga
              <Zap size={16} className="ml-2" fill="black" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-2 animate-in fade-in duration-700">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">Elegir <span className="text-primary">Señal</span></h2>
        <p className="text-[9px] font-black uppercase tracking-[0.5em] text-primary/40 mt-3">Interfase de Creación Neural</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option) => (
          <div 
            key={option.id}
            onClick={() => setSelectedType(option.id as CreationType)}
            className="group relative flex items-center gap-6 p-6 rounded-[2.5rem] bg-white/[0.03] backdrop-blur-xl border border-white/5 hover:border-primary/30 transition-all cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className={cn(
              "h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:bg-primary/10",
              option.color
            )}>
              <option.icon size={28} strokeWidth={2.5} />
            </div>

            <div className="flex-1">
              <h3 className="text-lg font-black italic uppercase text-white leading-none tracking-tight">{option.label}</h3>
              <p className="text-[8px] font-black uppercase tracking-widest text-white/20 mt-1.5">{option.desc}</p>
            </div>

            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
               <ChevronLeft size={16} className="rotate-180 text-primary" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-6 rounded-[2rem] bg-primary/5 border border-primary/10 flex items-center gap-4">
        <Zap size={16} className="text-primary animate-pulse" />
        <p className="text-[8px] font-black uppercase tracking-widest text-primary/60 leading-relaxed">
          Tu contenido será procesado por el Protocolo Gaia para optimizar la eficiencia energética y el alcance neural.
        </p>
      </div>
    </div>
  );
}
