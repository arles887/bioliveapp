"use client";

import { useState } from "react";
import { 
  Clapperboard, PlayCircle, Music, Radio, 
  Camera, ChevronLeft, Upload, Zap, 
  Globe, Lock, Users, Mic, Video, Settings2,
  Cpu, Activity, Database, CloudUpload
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
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

type CreationType = "reel" | "video" | "music" | "live" | "story" | null;

export function CreationHub() {
  const [selectedType, setSelectedType] = useState<CreationType>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const options = [
    { id: "live", label: "En Vivo", icon: Radio, color: "text-red-500", desc: "Transmisión Neural Real-time", detail: "Protocolo de baja latencia activo" },
    { id: "reel", label: "Bio-Reel", icon: Clapperboard, color: "text-primary", desc: "Video Vertical 9:16", detail: "Optimizado para visualización móvil" },
    { id: "video", label: "Video", icon: PlayCircle, color: "text-accent", desc: "Formato Largo 4K", detail: "Soporta resoluciones hasta 8K" },
    { id: "music", label: "Música", icon: Music, color: "text-purple-400", desc: "Señal de Audio Orgánica", detail: "Formatos Lossless y Neural Audio" },
    { id: "story", label: "Historia", icon: Camera, color: "text-yellow-400", desc: "Momentos Efímeros", detail: "Duración máxima: 24h" },
  ];

  const handleStartProtocol = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setSelectedType(null);
          toast({
            title: "Protocolo Exitoso",
            description: "La señal ha sido inyectada correctamente en la red Gaia.",
          });
        }, 500);
      }
    }, 100);
  };

  if (isUploading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center animate-in fade-in duration-500">
        <div className="relative mb-12">
          <div className="absolute inset-0 scale-[2] animate-pulse rounded-full bg-primary/10 blur-[60px]"></div>
          <div className="relative h-32 w-32 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_40px_rgba(204,255,0,0.2)]">
            <CloudUpload size={48} className="animate-bounce" />
          </div>
        </div>
        <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter mb-2">Inyectando <span className="text-primary">Señal</span></h2>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Sincronización Neural en Progreso</p>
        
        <div className="w-full max-w-xs space-y-4">
          <Progress value={uploadProgress} className="h-1.5 bg-white/5 border border-white/5" />
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">{uploadProgress}%</span>
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Encriptando Datos...</span>
          </div>
        </div>
      </div>
    );
  }

  if (selectedType) {
    const currentOption = options.find(o => o.id === selectedType);

    return (
      <div className="flex flex-col w-full min-h-[70vh] animate-in slide-in-from-right duration-500 pb-20">
        <button 
          onClick={() => setSelectedType(null)}
          className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors mb-8 group"
        >
          <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-widest">Volver al Hub de Creación</span>
        </button>

        <div className="space-y-8">
          <div className="flex items-center gap-5">
            <div className={cn(
              "h-16 w-16 rounded-[1.5rem] bg-white/[0.03] flex items-center justify-center border border-white/10 transition-all",
              currentOption?.color
            )}>
              {currentOption?.icon({ size: 32, strokeWidth: 2.5 })}
            </div>
            <div>
              <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">
                Nuevo <span className="text-primary">{currentOption?.label}</span>
              </h2>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/30 mt-2 flex items-center gap-2">
                <Activity size={10} className="text-primary" />
                {currentOption?.detail}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-3">Título de la Señal</label>
              <Input 
                placeholder={`Título para tu ${currentOption?.label}...`} 
                className="h-14 bg-white/5 border-white/10 rounded-2xl text-white focus-visible:ring-primary px-6 placeholder:text-white/10" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-3">Descripción Neural</label>
              <Textarea 
                placeholder="Describe el flujo de tu contenido..." 
                className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl text-white focus-visible:ring-primary px-6 py-5 placeholder:text-white/10 resize-none" 
              />
            </div>

            {selectedType === 'live' && (
              <div className="grid grid-cols-1 gap-6 p-6 rounded-3xl bg-red-500/5 border border-red-500/10">
                <div className="flex items-center gap-3">
                  <Radio size={16} className="text-red-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Configuración de Streaming</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Select>
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white/60">
                      <SelectValue placeholder="Calidad de Salida" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#050906] border-white/10 text-white">
                      <SelectItem value="4k">4K Ultra HD</SelectItem>
                      <SelectItem value="1080p">1080p Crystal</SelectItem>
                      <SelectItem value="720p">720p Stable</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white/60">
                      <SelectValue placeholder="Servidor Nodo" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#050906] border-white/10 text-white">
                      <SelectItem value="auto">Automático (Más cercano)</SelectItem>
                      <SelectItem value="latam">Latam-Node-01</SelectItem>
                      <SelectItem value="euro">Euro-Node-04</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {selectedType === 'music' && (
              <div className="grid grid-cols-1 gap-6 p-6 rounded-3xl bg-purple-500/5 border border-purple-500/10">
                <div className="flex items-center gap-3">
                  <Mic size={16} className="text-purple-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Parámetros de Audio</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="BPM" className="h-12 bg-white/5 border-white/10 rounded-xl text-[10px] text-center" />
                  <Input placeholder="Género Bio-Tech" className="h-12 bg-white/5 border-white/10 rounded-xl text-[10px] text-center" />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-3">Bio-Categoría</label>
                <Select>
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white/60">
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050906] border-white/10 text-white">
                    <SelectItem value="nature">Naturaleza Orgánica</SelectItem>
                    <SelectItem value="cyber">Cyber-Ecosistemas</SelectItem>
                    <SelectItem value="lab">Síntesis Lab</SelectItem>
                    <SelectItem value="tech">Bio-Tecnología</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-3">Visibilidad</label>
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

            <div className="p-12 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-5 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-20 w-20 rounded-[2rem] bg-white/5 flex items-center justify-center text-white/20 group-hover:text-primary group-hover:scale-110 transition-all shadow-xl">
                <Upload size={36} strokeWidth={1.5} />
              </div>
              <div className="text-center relative z-10">
                <p className="text-[11px] font-black uppercase tracking-widest text-white/60 mb-1">Arrastra tu Archivo</p>
                <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.2em]">Protocolo de Carga Multi-Nodo Activo</p>
              </div>
            </div>

            <Button 
              onClick={handleStartProtocol}
              className="w-full h-16 rounded-[1.5rem] bg-primary text-black font-black uppercase tracking-widest italic text-[11px] shadow-[0_0_40px_rgba(204,255,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all mt-4"
            >
              Iniciar Protocolo de Carga
              <Zap size={16} className="ml-2" fill="black" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full px-2 animate-in fade-in duration-700 pb-20">
      <div className="mb-12 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-32 bg-primary/5 blur-[80px] -z-10"></div>
        <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none">Nueva <span className="text-primary">Señal</span></h2>
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/40 mt-4">Interfase de Creación Neural</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option) => (
          <div 
            key={option.id}
            onClick={() => setSelectedType(option.id as CreationType)}
            className="group relative flex items-center gap-6 p-6 rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/5 hover:border-primary/40 transition-all cursor-pointer overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className={cn(
              "h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center transition-all group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.05)]",
              option.color
            )}>
              <option.icon size={30} strokeWidth={2.5} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black italic uppercase text-white leading-none tracking-tight group-hover:text-primary transition-colors">{option.label}</h3>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-2 truncate">{option.desc}</p>
            </div>

            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all">
               <ChevronLeft size={18} className="rotate-180 text-primary" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-[2.5rem] bg-primary/[0.03] border border-primary/10 flex flex-col gap-4 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-32 w-32 bg-primary/5 blur-[50px]"></div>
        <div className="flex items-center gap-3">
          <Cpu size={18} className="text-primary" />
          <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Protocolo Gaia v.2.5</p>
        </div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 leading-relaxed">
          Tu contenido será procesado por el nodo central para optimizar la eficiencia energética y el alcance en la red neural de BioLive.
        </p>
      </div>
    </div>
  );
}
