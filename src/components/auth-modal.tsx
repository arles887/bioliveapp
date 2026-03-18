"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, ShieldCheck } from "lucide-react";

export function AuthModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[380px] rounded-[2.5rem] bg-[#050906] border-white/10 p-6 z-[100] shadow-[0_0_50px_rgba(0,0,0,1)]">
        <DialogHeader className="flex flex-col items-center pb-4">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-black mb-4 shadow-[0_0_20px_rgba(204,255,0,0.3)]">
            <Zap size={24} fill="black" strokeWidth={3} />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tighter text-white uppercase italic">Bio-Cyber <span className="text-primary">Sync</span></DialogTitle>
          <DialogDescription className="text-white/40 font-bold uppercase tracking-widest text-[8px] mt-1">Identidad Digital Orgánica</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-2xl h-12 p-1 mb-4">
            <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase tracking-widest text-[9px]">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase tracking-widest text-[9px]">Crear ID</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input type="email" placeholder="user@biolive.cyber" className="rounded-xl h-12 bg-white/5 border-white/10 text-white text-xs" required />
              </div>
              <div className="space-y-2">
                <Input type="password" placeholder="Secure Pulse" className="rounded-xl h-12 bg-white/5 border-white/10 text-white text-xs" required />
              </div>
              <Button type="submit" className="w-full rounded-xl h-12 bg-primary text-black font-black uppercase tracking-widest italic text-[10px]" disabled={loading}>
                {loading ? "Sincronizando..." : "Iniciar Señal"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input placeholder="BioEntity_01" className="rounded-xl h-12 bg-white/5 border-white/10 text-white text-xs" required />
              </div>
              <div className="space-y-2">
                <Input type="email" placeholder="email@biolive.cyber" className="rounded-xl h-12 bg-white/5 border-white/10 text-white text-xs" required />
              </div>
              <Button type="submit" className="w-full rounded-xl h-12 bg-primary text-black font-black uppercase tracking-widest italic text-[10px]" disabled={loading}>
                {loading ? "Evolucionando..." : "Unirse"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="rounded-xl h-10 bg-white/5 border-white/10 text-white/50 text-[9px] uppercase font-black tracking-widest">Google</Button>
            <Button variant="outline" className="rounded-xl h-10 bg-white/5 border-white/10 text-white/50 text-[9px] uppercase font-black tracking-widest">Apple</Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/20">
            <ShieldCheck size={12} />
            <span className="text-[7px] font-black uppercase tracking-widest">Encriptación Quantum Activa</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
