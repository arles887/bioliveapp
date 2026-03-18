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
        
        {/* Cabecera del Visor - Prominente y funcional */}
        <div className="absolute top-6 left-0 right-0 z-[110] px-6 flex items-center justify-between pointer-events-none">
          <div className="bg-black/60 backdrop-blur-2xl px-5 py-2 rounded-2xl border border-white/10 shadow-2xl">
            <h3 className="text-[12px] font-black tracking-tighter text-white uppercase italic leading-none">{title}</h3>
            <p className="text-[7px] font-black uppercase tracking-[0.4em] text-primary/80 mt-1">Neural Link Active</p>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="h-12 w-12 bg-primary text-black rounded-2xl flex items-center justify-center transition-all active:scale-90 pointer-events-auto shadow-[0_0_30px_rgba(204,255,0,0.4)] border-2 border-primary/20 hover:rotate-90"
          >
            <X size={24} strokeWidth={4} />
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
