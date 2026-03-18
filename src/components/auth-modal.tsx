"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Zap, ShieldCheck, User, Mail, Phone, Lock, Calendar } from "lucide-react";

export function AuthModal({ 
  isOpen, 
  onClose,
  onAuthSuccess
}: { 
  isOpen: boolean; 
  onClose: () => void;
  onAuthSuccess?: () => void;
}) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (onAuthSuccess) onAuthSuccess();
      onClose();
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[400px] rounded-[2.5rem] bg-[#050906] border-white/10 p-6 z-[200] shadow-[0_0_50px_rgba(0,0,0,1)] outline-none">
        <DialogHeader className="flex flex-col items-center pb-4">
          <div className="h-12 w-12 rounded-2xl bg-primary flex items-center justify-center text-black mb-4 shadow-[0_0_20px_rgba(204,255,0,0.3)]">
            <Zap size={24} fill="black" strokeWidth={3} />
          </div>
          <DialogTitle className="text-2xl font-black tracking-tighter text-white uppercase italic">Bio-Cyber <span className="text-primary">Sync</span></DialogTitle>
          <DialogDescription className="text-white/40 font-bold uppercase tracking-widest text-[8px] mt-1 text-center">Protocolo de Identidad Orgánica Obligatorio</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-2xl h-12 p-1 mb-4">
            <TabsTrigger value="login" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase tracking-widest text-[9px]">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase tracking-widest text-[9px]">Crear ID</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={14} />
                <Input type="email" placeholder="CORREO@BIOLIVE.CYBER" className="rounded-xl h-12 bg-white/5 border-white/10 text-white text-[10px] pl-10 font-black tracking-widest" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={14} />
                <Input type="password" placeholder="CONTRASEÑA NEURAL" className="rounded-xl h-12 bg-white/5 border-white/10 text-white text-[10px] pl-10 font-black tracking-widest" required />
              </div>
              <Button type="submit" className="w-full rounded-xl h-12 bg-primary text-black font-black uppercase tracking-widest italic text-[11px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-2" disabled={loading}>
                {loading ? "Sincronizando..." : "Iniciar Señal"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-3 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={14} />
                <Input placeholder="USUARIO_BIO" className="rounded-xl h-12 bg-white/5 border-white/10 text-white text-[10px] pl-10 font-black tracking-widest" required />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={14} />
                <Input type="email" placeholder="CORREO@RED.GAIA" className="rounded-xl h-12 bg-white/5 border-white/10 text-white text-[10px] pl-10 font-black tracking-widest" required />
              </div>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={14} />
                <Input type="tel" placeholder="+54 TELEFONO" className="rounded-xl h-12 bg-white/5 border-white/10 text-white text-[10px] pl-10 font-black tracking-widest" required />
              </div>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={14} />
                <Input type="number" placeholder="EDAD" min="13" className="rounded-xl h-12 bg-white/5 border-white/10 text-white text-[10px] pl-10 font-black tracking-widest" required />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={14} />
                <Input type="password" placeholder="NUEVA CONTRASEÑA" className="rounded-xl h-12 bg-white/5 border-white/10 text-white text-[10px] pl-10 font-black tracking-widest" required />
              </div>
              <Button type="submit" className="w-full rounded-xl h-12 bg-primary text-black font-black uppercase tracking-widest italic text-[11px] shadow-lg hover:scale-[1.02] active:scale-95 transition-all mt-2" disabled={loading}>
                {loading ? "Evolucionando..." : "Crear Identidad"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="flex items-center justify-center gap-2 text-white/20">
            <ShieldCheck size={12} />
            <span className="text-[7px] font-black uppercase tracking-widest">Protocolo de Encriptación Quantum Activa</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
