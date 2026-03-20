"use client"

import * as React from "react"
import { ChevronLeft } from "lucide-react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

/**
 * @fileOverview Ventana de protocolo estandarizada.
 * Corregido: Respetando el Status Bar (40px / h-10) en la parte superior.
 * Corregido: Navegación de retorno limpia y etiquetas de sistema desplazadas.
 */

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
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-[500px] h-full sm:h-[95vh] -translate-x-1/2 -translate-y-1/2 bg-[#020503] border-none shadow-[0_0_120px_rgba(0,0,0,1)] overflow-hidden focus:outline-none sm:rounded-[3.5rem] flex flex-col">
          
          <DialogPrimitive.Title className="sr-only">
            {title}
          </DialogPrimitive.Title>

          {/* Botón de Retorno (Back): Desplazado para respetar el Status Bar (h-10) */}
          <DialogPrimitive.Close className="absolute top-14 left-8 z-[200] h-12 w-12 rounded-2xl bg-white/5 backdrop-blur-3xl border border-white/10 flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/40 transition-all active:scale-90 outline-none">
            <ChevronLeft size={24} />
            <span className="sr-only">Volver</span>
          </DialogPrimitive.Close>

          {/* Etiqueta de Sistema: Desplazada para respetar el Status Bar */}
          <div className="absolute top-16 right-10 z-[150] pointer-events-none opacity-20 max-w-[200px] text-right">
             <span className="text-[8px] font-black uppercase tracking-[0.5em] text-white italic truncate block">{title}</span>
          </div>

          {/* Contenedor de Contenido Principal: Padding superior aumentado para despejar navegación */}
          <div className="flex-1 w-full relative overflow-hidden flex flex-col items-center justify-center pt-28">
            {children}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
