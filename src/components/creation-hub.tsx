"use client";

import { useState } from "react";
import { 
  Clapperboard, PlayCircle, Music, Radio, 
  Camera, ChevronLeft, Upload, Zap, 
  Mic, Activity, CloudUpload, Cpu
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
    { id: "live", label: "En Vivo", icon: Radio, color: "text-red-500", desc: "Transmisión Real-time", detail: "Baja latencia activa" },
    { id: "reel", label: "Bio-Reel", icon: Clapperboard, color: "text-primary", desc: "Video Vertical 9:16", detail: "Optimizado para móvil" },
    { id: "video", label: "Video", icon: PlayCircle, color: "text-accent", desc: "Formato Largo 4K", detail: "Soporta alta resolución" },
    { id: "music", label: "Música", icon: Music, color: "text-purple-400", desc: "Audio Orgánico", detail: "Formato Lossless" },
    { id: "story", label: "Historia", icon: Camera, color: "text-yellow-400", desc: "Momentos Efímeros", detail: "Duración: 24h" },
  ];

  const handleStartProtocol = () => {
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 4;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setSelectedType(null);
          toast({
            title: "Señal Inyectada",
            description: "Tu contenido ha sido sincronizado con éxito en la red Gaia.",
          });
        }, 500);
      }
    }, 80);
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
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 mb-8">Sincronización Neural...</p>
        
        <div className="w-full max-w-xs space-y-4">
          <Progress value={uploadProgress} className="h-1.5 bg-white/5 border border-white/5" />
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-black text-primary uppercase tracking-widest">{uploadProgress}%</span>
            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">Encriptando...</span>
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
          <span className="text-[10px] font-black uppercase tracking-widest">Volver al Hub</span>
        </button>

        <div className="space-y-8">
          <div className="flex items-center gap-5">
            <div className={cn(
              "h-16 w-16 rounded-[1.5rem] bg-white/[0.03] flex items-center justify-center border border-white/10",
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
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-3">Título</label>
              <Input 
                placeholder={`Título para tu ${currentOption?.label}...`} 
                className="h-14 bg-white/5 border-white/10 rounded-2xl text-white focus-visible:ring-primary px-6" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-3">Descripción</label>
              <Textarea 
                placeholder="Describe el flujo de tu señal..." 
                className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl text-white focus-visible:ring-primary px-6 py-5 resize-none" 
              />
            </div>

            {selectedType === 'live' && (
              <div className="grid grid-cols-2 gap-4">
                <Select>
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white/60">
                    <SelectValue placeholder="Calidad" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050906] border-white/10 text-white">
                    <SelectItem value="4k">4K Ultra HD</SelectItem>
                    <SelectItem value="1080p">1080p</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl text-white/60">
                    <SelectValue placeholder="Servidor" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#050906] border-white/10 text-white">
                    <SelectItem value="auto">Auto-Node</SelectItem>
                    <SelectItem value="latam">Latam-01</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedType === 'music' && (
              <div className="grid grid-cols-2 gap-4">
                 <div className="relative">
                   <Mic size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                   <Input placeholder="BPM" className="h-12 bg-white/5 border-white/10 rounded-xl text-center pl-8 text-xs text-white" />
                 </div>
                 <div className="relative">
                   <Activity size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" />
                   <Input placeholder="Género" className="h-12 bg-white/5 border-white/10 rounded-xl text-center pl-8 text-xs text-white" />
                 </div>
              </div>
            )}

            <div className="p-12 border-2 border-dashed border-white/5 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 bg-white/[0.01] hover:bg-white/[0.03] hover:border-primary/30 transition-all cursor-pointer group">
              <Upload size={36} className="text-white/20 group-hover:text-primary transition-all group-hover:scale-110" />
              <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Arrastra tu Archivo</p>
            </div>

            <Button 
              onClick={handleStartProtocol}
              className="w-full h-16 rounded-[1.5rem] bg-primary text-black font-black uppercase tracking-widest italic text-[11px] shadow-[0_0_40px_rgba(204,255,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              Iniciar Protocolo
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
        <h2 className="text-5xl font-black tracking-tighter text-white uppercase italic leading-none">Nueva <span className="text-primary">Señal</span></h2>
        <p className="text-[10px] font-black uppercase tracking-[0.6em] text-primary/40 mt-4">Hub de Creación Neural</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option) => (
          <div 
            key={option.id}
            onClick={() => setSelectedType(option.id as CreationType)}
            className="group relative flex items-center gap-6 p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-primary/40 transition-all cursor-pointer overflow-hidden shadow-2xl active:scale-95"
          >
            <div className={cn(
              "h-16 w-16 rounded-[1.5rem] bg-white/5 flex items-center justify-center transition-all group-hover:scale-110",
              option.color
            )}>
              <option.icon size={30} strokeWidth={2.5} />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-black italic uppercase text-white leading-none tracking-tight group-hover:text-primary transition-colors">{option.label}</h3>
              <p className="text-[9px] font-black uppercase tracking-widest text-white/20 mt-2 truncate">{option.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 p-8 rounded-[2.5rem] bg-primary/[0.03] border border-primary/10 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Cpu size={16} className="text-primary" />
          <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Gaia v.2.5 Protocol</p>
        </div>
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 leading-relaxed">
          Tu contenido será optimizado por el nodo central para maximizar el alcance en la red neural de BioLive.
        </p>
      </div>
    </div>
  );
}
