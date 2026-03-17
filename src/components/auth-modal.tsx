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
      <DialogContent className="sm:max-w-[420px] rounded-[3rem] bg-[#050906] border-white/10 p-8">
        <DialogHeader className="flex flex-col items-center pb-6">
          <div className="h-16 w-16 rounded-[1.8rem] bg-primary flex items-center justify-center text-black mb-6 shadow-[0_0_30px_rgba(204,255,0,0.5)] animate-float">
            <Zap size={32} fill="black" strokeWidth={3} />
          </div>
          <DialogTitle className="text-3xl font-black tracking-tighter text-white uppercase italic">Bio-Cyber <span className="text-primary">Sync</span></DialogTitle>
          <DialogDescription className="text-white/40 font-bold uppercase tracking-widest text-[10px] mt-2">Harmonizing Identity with Nature</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-[1.5rem] h-14 p-1.5 mb-6">
            <TabsTrigger value="login" className="rounded-[1.2rem] data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase tracking-widest text-[10px]">Signal In</TabsTrigger>
            <TabsTrigger value="register" className="rounded-[1.2rem] data-[state=active]:bg-primary data-[state=active]:text-black font-black uppercase tracking-widest text-[10px]">Create ID</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-2">Email Address</Label>
                <Input id="email" type="email" placeholder="user@biolive.cyber" className="rounded-[1.5rem] h-14 bg-white/5 border-white/10 focus-visible:ring-primary text-white" required />
              </div>
              <div className="space-y-3">
                <Label htmlFor="password" name="password" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-2">Secure Pulse</Label>
                <Input id="password" type="password" className="rounded-[1.5rem] h-14 bg-white/5 border-white/10 focus-visible:ring-primary text-white" required />
              </div>
              <Button type="submit" className="w-full rounded-[1.5rem] h-14 bg-primary text-black font-black uppercase tracking-[0.3em] italic text-xs shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all mt-4" disabled={loading}>
                {loading ? "Synchronizing..." : "Initiate Signal"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-2">Display Name</Label>
                <Input id="name" placeholder="BioEntity_01" className="rounded-[1.5rem] h-14 bg-white/5 border-white/10 focus-visible:ring-primary text-white" required />
              </div>
              <div className="space-y-3">
                <Label htmlFor="reg-email" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-2">Email</Label>
                <Input id="reg-email" type="email" placeholder="entity@biolive.cyber" className="rounded-[1.5rem] h-14 bg-white/5 border-white/10 focus-visible:ring-primary text-white" required />
              </div>
              <div className="space-y-3">
                <Label htmlFor="reg-password" name="reg-password" className="text-[10px] font-black uppercase tracking-widest text-primary/60 ml-2">New Pulse</Label>
                <Input id="reg-password" type="password" className="rounded-[1.5rem] h-14 bg-white/5 border-white/10 focus-visible:ring-primary text-white" required />
              </div>
              <Button type="submit" className="w-full rounded-[1.5rem] h-14 bg-primary text-black font-black uppercase tracking-[0.3em] italic text-xs shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all mt-4" disabled={loading}>
                {loading ? "Evolving..." : "Join Ecosystem"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col gap-6 pt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-white/10"></span></div>
            <div className="relative flex justify-center text-[9px] uppercase tracking-[0.4em] font-black text-white/20"><span className="bg-[#050906] px-4">Bio-Pass Access</span></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="rounded-[1.2rem] h-12 bg-white/5 border-white/10 text-white/60 font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all">Google</Button>
            <Button variant="outline" className="rounded-[1.2rem] h-12 bg-white/5 border-white/10 text-white/60 font-black text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black hover:border-primary transition-all">Apple</Button>
          </div>
          <div className="flex items-center justify-center gap-2 text-white/20 mt-2">
            <ShieldCheck size={14} />
            <span className="text-[8px] font-black uppercase tracking-widest">Quantum Encryption Enabled</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}