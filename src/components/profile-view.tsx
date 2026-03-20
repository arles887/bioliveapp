"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Menu, Camera, Play, Share2, Zap, UserPlus, Check, Send, ChevronLeft,
  Wallet, History, UserCircle, LifeBuoy, HelpCircle, Settings, Lock,
  TrendingUp, DollarSign, PlusCircle, RefreshCw, Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { toast } from "@/hooks/use-toast";
import { ProtocolWindow } from "@/components/protocol-window";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserService } from "@/services/user-service";
import { WalletService } from "@/services/wallet-service";

/**
 * @fileOverview Vista de Perfil Estandarizada. 
 * Corregidos desbordamientos en biografía y estadísticas.
 */

export function ProfileView({ 
  username = "BioEntity_01", 
  isOwnProfile = true,
  onBack,
  requireAuth
}: { 
  username?: string;
  isOwnProfile?: boolean;
  onBack?: () => void;
  requireAuth: (cb: () => void) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState(username);
  const [isFollowing, setIsFollowing] = useState(false);
  const [activeMenuSection, setActiveMenuSection] = useState<string | null>(null);
  const [walletView, setWalletView] = useState<"main" | "buy" | "withdraw">("main");
  const [selectedPackage, setSelectedPackage] = useState<number | "custom" | null>(null);
  const [customESP, setCustomESP] = useState("");
  const [espBalance, setEspBalance] = useState(WalletService.getBalance());
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  
  const avatarUrl = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl || null;

  const stats = [
    { label: "Seguidores", value: isOwnProfile ? "12.4K" : "4.2K" },
    { label: "Siguiendo", value: isOwnProfile ? "842" : "120" },
    { label: "ESP Tokens", value: isOwnProfile ? espBalance.toLocaleString() : "800" }
  ];

  const handleUpdateProfile = async () => {
    setIsEditing(false);
    await UserService.syncProfile("BioEntity_01", { username: profileName });
    toast({ title: "Protocolo Actualizado", description: "Identidad digital guardada correctamente." });
  };

  const handleFollow = () => {
    requireAuth(async () => {
      const newStatus = !isFollowing;
      setIsFollowing(newStatus);
      await UserService.toggleFollow("BioEntity_01", profileName, isFollowing);
      toast({ 
        title: newStatus ? "Sincronizado" : "Sincronización Terminada", 
        description: newStatus ? `Siguiendo a @${profileName}` : `Has dejado de seguir a @${profileName}` 
      });
    });
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    let addedAmount = 0;
    if (selectedPackage === "custom") {
      addedAmount = Number(customESP);
    } else {
      addedAmount = 1000; 
    }
    const newBalance = await WalletService.injectFunds(addedAmount);
    setEspBalance(newBalance);
    setIsProcessing(false);
    setWalletView("main");
    toast({ title: "Éxito", description: `Inyectados ${addedAmount.toLocaleString()} ESP.` });
  };

  const menuItems = [
    { id: "wallet", label: "Billetera ESP", icon: Wallet, color: "text-primary" },
    { id: "activity", label: "Actividad", icon: History, color: "text-white/60" },
    { id: "account", label: "Información", icon: UserCircle, color: "text-white/60" },
    { id: "support", label: "Soporte", icon: LifeBuoy, color: "text-white/60" },
    { id: "settings", label: "Ajustes", icon: Settings, color: "text-white/60" },
    { id: "privacy", label: "Privacidad", icon: Lock, color: "text-accent" },
  ];

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="relative h-32 w-full bg-gradient-to-b from-primary/10 to-transparent">
        <div className="absolute top-6 left-6 z-20">
           {!isOwnProfile && (
             <button 
               onClick={onBack}
               className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90"
             >
                <ChevronLeft size={20} />
             </button>
           )}
        </div>
        <div className="absolute top-6 right-6 flex gap-3 z-20">
           <button 
             onClick={() => toast({ title: "Copiado", description: "Enlace de perfil copiado." })}
             className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90"
           >
              <Share2 size={18} />
           </button>
           {isOwnProfile && (
             <Sheet>
               <SheetTrigger asChild>
                 <button className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90">
                    <Menu size={18} />
                 </button>
               </SheetTrigger>
               <SheetContent side="right" className="bg-[#020503] border-white/5 p-0 w-full max-w-[500px]">
                 <div className="flex flex-col h-full">
                    <SheetHeader className="p-8 border-b border-white/5">
                      <SheetTitle className="text-2xl font-black italic uppercase text-white tracking-tighter">
                        Configuración <span className="text-primary">Neural</span>
                      </SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="flex-1">
                      <div className="p-6">
                        {menuItems.map((item) => (
                          <button
                            key={item.id}
                            className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group"
                          >
                            <div className="flex items-center gap-4">
                              <item.icon size={20} className={item.color} />
                              <span className="text-xs font-black uppercase tracking-widest text-white/80">{item.label}</span>
                            </div>
                            <ChevronLeft size={16} className="rotate-180 text-white/20 group-hover:text-primary" />
                          </button>
                        ))}
                      </div>
                    </ScrollArea>
                 </div>
               </SheetContent>
             </Sheet>
           )}
        </div>
      </div>

      <div className="px-8 -mt-12 space-y-6">
        <div className="flex items-end justify-between">
          <div className="relative group shrink-0">
            <div className="h-24 w-24 rounded-[2rem] border-4 border-[#020503] bg-white/5 overflow-hidden shadow-2xl relative">
              <Image 
                src={isOwnProfile ? (avatarUrl || "") : `https://picsum.photos/seed/${profileName}/200/200`} 
                fill 
                alt="Avatar" 
                className="object-cover" 
              />
            </div>
          </div>
          
          <div className="flex gap-2 mb-2">
            {isOwnProfile ? (
              <Button 
                onClick={() => setIsEditing(true)}
                className="rounded-2xl border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest h-10 px-6 hover:bg-primary hover:text-black transition-all"
              >
                Editar Perfil
              </Button>
            ) : (
              <Button 
                onClick={handleFollow}
                className={cn(
                  "rounded-2xl text-[9px] font-black uppercase tracking-widest h-10 px-6 transition-all",
                  isFollowing ? "bg-white/10 text-white/40" : "bg-primary text-black shadow-lg"
                )}
              >
                {isFollowing ? "Siguiendo" : "Seguir"}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1 min-w-0">
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none truncate">{profileName}</h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate">@{profileName.toLowerCase().replace(/\s+/g, '_')}</p>
          <p className="text-[11px] text-white/60 mt-3 leading-relaxed max-w-[90%] line-clamp-3">
            Explorador de biomas digitales y coleccionista de señales orgánicas. 🌱⚡ #BioCyber #NatureTech #Enterprise #Global
          </p>
        </div>

        <div className="flex gap-4 py-4 border-y border-white/5 overflow-x-auto no-scrollbar">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col shrink-0 min-w-[80px]">
              <span className="text-lg font-black text-white italic leading-none tracking-tight truncate">{stat.value}</span>
              <span className="text-[8px] font-black uppercase text-primary/40 tracking-widest mt-1 truncate">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="videos" className="w-full mt-6">
        <TabsList className="flex w-full bg-transparent border-b border-white/5 h-14 px-4 rounded-none gap-4">
          <TabsTrigger value="videos" className="data-[state=active]:text-primary text-white/20 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 font-black uppercase text-[9px] tracking-widest transition-all">
            Videos
          </TabsTrigger>
          <TabsTrigger value="music" className="data-[state=active]:text-primary text-white/20 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 font-black uppercase text-[9px] tracking-widest transition-all">
            Música
          </TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="p-4 grid grid-cols-2 gap-3 animate-in fade-in duration-500">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5 group cursor-pointer active:scale-95 transition-all">
              <Image src={`https://picsum.photos/seed/pv${profileName}${i}/300/400`} fill alt="Video" className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <ProtocolWindow isOpen={isEditing} onClose={() => setIsEditing(false)} title="Identidad Digital">
        <div className="space-y-6 w-full max-w-[320px] px-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Bio-Alias</label>
            <Input 
              value={profileName} 
              onChange={(e) => setProfileName(e.target.value)}
              className="h-14 bg-white/5 border-white/10 rounded-2xl text-white px-6 focus-visible:ring-primary truncate" 
            />
          </div>
          <Button 
            onClick={handleUpdateProfile}
            className="w-full h-14 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.3)]"
          >
            Sincronizar Protocolo
          </Button>
        </div>
      </ProtocolWindow>
    </div>
  );
}
