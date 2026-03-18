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
      <DialogContent className="w-full max-w-[500px] h-full sm:h-[98vh] rounded-none sm:rounded-[3rem] bg-[#020503] border-none sm:border-white/10 p-0 shadow-[0_0_120px_rgba(0,0,0,1)] overflow-hidden">
        {/* Barra de estado superior decorativa */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-primary to-transparent z-[100]"></div>
        
        {/* Etiqueta de Sistema - Esquina superior izquierda */}
        <div className="absolute top-10 left-10 z-[200] pointer-events-none opacity-80">
          <div className="bg-black/60 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-[12px] font-black tracking-tighter text-white uppercase italic leading-none">{title}</h3>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/80 mt-1.5">Neural Sync Active</p>
          </div>
        </div>

        {/* Contenedor de Contenido Principal */}
        <div className="w-full h-full relative overflow-hidden">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
