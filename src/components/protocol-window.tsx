"use client"

import { X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
} from "@/components/ui/dialog";

export function ProtocolWindow({ 
  isOpen, 
  onClose, 
  title, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-[500px] h-full sm:h-[95vh] rounded-none sm:rounded-[3rem] bg-[#020503] border-none sm:border-white/10 p-0 shadow-[0_0_120px_rgba(0,0,0,1)] overflow-hidden">
        {/* Barra de estado superior decorativa */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-[100]"></div>
        
        {/* BOTÓN DE CERRAR ULTRA-PROMINENTE - Forzado en la capa más alta */}
        <div className="absolute top-10 right-8 z-[999] pointer-events-auto">
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="h-16 w-16 bg-primary text-black rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-[0_0_50px_rgba(204,255,0,0.9)] border-4 border-white/20 hover:rotate-90 hover:scale-110"
            aria-label="Close Protocol"
          >
            <X size={40} strokeWidth={4} />
          </button>
        </div>

        {/* Etiqueta de Sistema - Esquina superior izquierda */}
        <div className="absolute top-10 left-10 z-[200] pointer-events-none opacity-60">
          <div className="bg-black/60 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-[12px] font-black tracking-tighter text-white uppercase italic leading-none">{title}</h3>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/80 mt-1.5">Neural Sync Active</p>
          </div>
        </div>

        {/* Contenedor de Contenido Principal */}
        <div className="w-full h-full relative">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
