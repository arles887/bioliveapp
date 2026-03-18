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
        
        {/* Cabecera del Visor - Prominente y centrada */}
        <div className="absolute top-4 left-0 right-0 z-[100] px-6 flex items-center justify-between pointer-events-none">
          <div className="space-y-0.5 bg-black/40 backdrop-blur-xl px-4 py-1.5 rounded-2xl border border-white/10">
            <h3 className="text-[11px] font-black tracking-tighter text-white uppercase italic leading-none">{title}</h3>
            <p className="text-[6px] font-black uppercase tracking-[0.4em] text-primary/60">Neural Link Active</p>
          </div>
          <button 
            onClick={onClose}
            className="h-10 w-10 bg-primary/20 hover:bg-primary backdrop-blur-xl rounded-xl flex items-center justify-center text-white hover:text-black transition-all border border-primary/20 pointer-events-auto shadow-[0_0_20px_rgba(204,255,0,0.2)]"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Contenedor de Contenido Principal */}
        <div className="w-full h-full relative">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
