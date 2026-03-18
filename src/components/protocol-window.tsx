"use client";

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
      <DialogContent className="w-[95vw] max-w-[420px] rounded-[2.5rem] bg-[#020503] border-white/10 p-6 shadow-[0_0_100px_rgba(0,0,0,0.8)] overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <DialogHeader className="flex flex-row items-center justify-between pb-4">
          <div className="space-y-0.5">
            <DialogTitle className="text-xl font-black tracking-tighter text-white uppercase italic">{title}</DialogTitle>
            <p className="text-[7px] font-black uppercase tracking-[0.4em] text-primary/60">System Protocol Active</p>
          </div>
        </DialogHeader>
        <div className="animate-in fade-in zoom-in-95 duration-500 h-full max-h-[85vh]">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
