"use client"

import { X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogClose
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

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
      <DialogContent className="w-full max-w-[500px] h-full sm:h-[98vh] rounded-none sm:rounded-[3.5rem] bg-[#020503] border-none p-0 shadow-[0_0_120px_rgba(0,0,0,1)] overflow-hidden">
        {/* Botón de Cierre Minimalista */}
        <DialogClose className="absolute top-8 right-8 z-[200] h-12 w-12 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/40 transition-all active:scale-90">
          <X size={24} />
          <span className="sr-only">Close</span>
        </DialogClose>

        {/* Título de Sistema Discreto */}
        <div className="absolute top-10 left-10 z-[150] pointer-events-none opacity-40">
           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white italic">{title}</span>
        </div>

        {/* Contenedor de Contenido Principal */}
        <div className="w-full h-full relative overflow-hidden flex flex-col items-center justify-center">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
