"use client"

import { X } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
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
      <DialogContent className="w-[95vw] max-w-[440px] rounded-[3rem] bg-[#020503] border-white/10 p-0 shadow-[0_0_120px_rgba(0,0,0,1)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent z-[60]"></div>
        
        <div className="px-6 pt-6 pb-2 border-b border-white/5 flex items-center justify-between">
          <div className="space-y-0.5">
            <h3 className="text-xl font-black tracking-tighter text-white uppercase italic leading-none">{title}</h3>
            <p className="text-[7px] font-black uppercase tracking-[0.4em] text-primary/60">System Protocol Active</p>
          </div>
          <button 
            onClick={onClose}
            className="h-9 w-9 bg-white/5 rounded-xl flex items-center justify-center text-white/20 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-[85vh] animate-in fade-in zoom-in-95 duration-500">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
