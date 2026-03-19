"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { 
  Menu, Camera, Play, Music, Heart, 
  Edit3, Share2, Zap, UserPlus, Check, Send, ChevronLeft,
  Wallet, History, UserCircle, LifeBuoy, HelpCircle, Settings, Lock,
  TrendingUp, Gift, DollarSign, PlusCircle, Bell, Shield, Moon, Eye, Globe,
  MessageSquare, Mail, Phone, Calendar, ArrowUpRight, ArrowDownLeft,
  CreditCard, Smartphone, Ticket, RefreshCw, Star, Sparkles, Gem, Loader2,
  Fingerprint, CreditCard as CardIcon
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { UserService } from "@/services/user-service";
import { WalletService } from "@/services/wallet-service";

/**
 * @fileOverview Vista de Perfil Enterprise. 
 * Desacoplada mediante UserService y WalletService.
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

  const tokenPackages = [
    { esp: 100, pen: "1.00" }, { esp: 200, pen: "2.00" }, { esp: 300, pen: "3.00" },
    { esp: 400, pen: "4.00" }, { esp: 500, pen: "5.00", hot: true }, { esp: 600, pen: "6.00" },
    { esp: 700, pen: "7.00" }, { esp: 800, pen: "8.00" }, { esp: 900, pen: "9.00" },
    { esp: 1000, pen: "10.00", badge: "POPULAR" }, { esp: 1500, pen: "15.00" }, { esp: 2000, pen: "20.00" },
    { esp: 2500, pen: "25.00" }, { esp: 3000, pen: "30.00" }, { esp: 4000, pen: "40.00" },
    { esp: 5000, pen: "45.00", badge: "OFERTA", hot: true }, { esp: 6000, pen: "60.00" }, { esp: 7000, pen: "70.00" },
    { esp: 8000, pen: "80.00" }, { esp: 9000, pen: "90.00" }, { esp: 10000, pen: "85.00", badge: "MEGA", hot: true },
    { esp: 15000, pen: "150.00" }, { esp: 20000, pen: "200.00" }, { esp: 25000, pen: "250.00" },
    { esp: 30000, pen: "300.00" }, { esp: 40000, pen: "400.00" }, { esp: 50000, pen: "400.00", badge: "BIO-GOD", hot: true },
    { esp: 60000, pen: "600.00" }, { esp: 75000, pen: "750.00" }, { esp: 100000, pen: "900.00", badge: "LEGEND" }
  ];

  const handleUpdateProfile = async () => {
    setIsEditing(false);
    // Delega la lógica al servicio
    await UserService.syncProfile("BioEntity_01", { username: profileName });
    toast({ title: "Protocolo Actualizado", description: "Identidad digital guardada correctamente." });
  };

  const handleFollow = () => {
    requireAuth(async () => {
      const newStatus = !isFollowing;
      setIsFollowing(newStatus);
      // Delegamos al servicio de usuario
      await UserService.toggleFollow("BioEntity_01", profileName, isFollowing);
      toast({ 
        title: newStatus ? "Sincronizado" : "Sincronización Terminada", 
        description: newStatus ? `Siguiendo a @${profileName}` : `Has dejado de seguir a @${profileName}` 
      });
    });
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);
    toast({ title: "Validación Neural", description: "Sincronizando con el nodo de pago Gaia..." });

    let addedAmount = 0;
    if (selectedPackage === "custom") {
      addedAmount = Number(customESP);
    } else {
      addedAmount = tokenPackages[selectedPackage as number].esp;
    }

    // Delegamos al servicio de wallet
    const newBalance = await WalletService.injectFunds(addedAmount);
    setEspBalance(newBalance);

    setIsProcessing(false);
    setSelectedPackage(null);
    setSelectedMethod(null);
    setCustomESP("");
    setWalletView("main");
    
    toast({ title: "Sincronización Exitosa", description: `Se han inyectado ${addedAmount.toLocaleString()} ESP.` });
  };

  const handleProcessWithdraw = async () => {
    const amount = Number(withdrawAmount);
    if (!amount || amount < 500) {
      toast({ variant: "destructive", title: "Error de Retiro", description: "Mínimo 500 ESP." });
      return;
    }

    setIsProcessing(true);
    try {
      const newBalance = await WalletService.withdrawFunds(amount);
      setEspBalance(newBalance);
      toast({ title: "Protocolo de Retiro Iniciado", description: `S/ ${(amount / 100).toFixed(2)} PEN enviados.` });
    } catch (e) {
      toast({ variant: "destructive", title: "Fallo Neural", description: "Saldo insuficiente." });
    } finally {
      setIsProcessing(false);
      setWithdrawAmount("");
      setSelectedMethod(null);
      setWalletView("main");
    }
  };

  const menuItems = [
    { id: "wallet", label: "Billetera ESP", icon: Wallet, color: "text-primary" },
    { id: "activity", label: "Registro de Actividad", icon: History, color: "text-white/60" },
    { id: "account", label: "Información de la Cuenta", icon: UserCircle, color: "text-white/60" },
    { id: "support", label: "Soporte Técnico", icon: LifeBuoy, color: "text-white/60" },
    { id: "help", label: "Ayuda", icon: HelpCircle, color: "text-white/60" },
    { id: "settings", label: "Ajustes", icon: Settings, color: "text-white/60" },
    { id: "privacy", label: "Privacidad", icon: Lock, color: "text-accent" },
  ];

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="relative h-32 w-full bg-gradient-to-b from-primary/20 to-transparent">
        <div className="absolute top-6 left-6 flex gap-3 z-20">
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
             onClick={() => toast({ title: "Enlace Copiado", description: "Nodo perfil listo para compartir." })}
             className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90"
           >
              <Share2 size={18} />
           </button>
           {isOwnProfile && (
             <Sheet onOpenChange={() => { setActiveMenuSection(null); setWalletView("main"); setSelectedMethod(null); }}>
               <SheetTrigger asChild>
                 <button className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90">
                    <Menu size={18} />
                 </button>
               </SheetTrigger>
               <SheetContent side="right" className="bg-[#020503] border-white/5 p-0 w-full sm:max-w-[400px]">
                 <div className="flex flex-col h-full">
                    <SheetHeader className="p-8 border-b border-white/5">
                      <SheetTitle className="text-2xl font-black italic uppercase text-white tracking-tighter">
                        Centro <span className="text-primary">Neural</span>
                      </SheetTitle>
                    </SheetHeader>

                    <ScrollArea className="flex-1">
                      <div className="p-6">
                        {!activeMenuSection ? (
                          <div className="space-y-2">
                            {menuItems.map((item) => (
                              <button
                                key={item.id}
                                onClick={() => setActiveMenuSection(item.id)}
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
                        ) : (
                          <div className="space-y-8 animate-in slide-in-from-right duration-300">
                            <button 
                              onClick={() => {
                                if (selectedMethod) {
                                  setSelectedMethod(null);
                                } else if (activeMenuSection === "wallet" && walletView !== "main") {
                                  setWalletView("main");
                                } else {
                                  setActiveMenuSection(null);
                                }
                              }}
                              className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors"
                            >
                              <ChevronLeft size={16} />
                              <span className="text-[9px] font-black uppercase tracking-widest">
                                {selectedMethod ? "Volver a Métodos" : (walletView === "main" ? "Volver" : "Volver a Billetera")}
                              </span>
                            </button>

                            {activeMenuSection === "wallet" && (
                              <div className="space-y-8 pb-10">
                                {walletView === "main" && (
                                  <div className="space-y-6">
                                    <div className="p-6 rounded-[2.5rem] bg-primary/10 border border-primary/20 space-y-4">
                                      <div className="flex justify-between items-start">
                                        <span className="text-[9px] font-black uppercase text-primary tracking-widest italic">Balance Bio-Neural</span>
                                        <Zap size={14} className="text-primary animate-pulse" />
                                      </div>
                                      <div className="text-4xl font-black italic text-white leading-none">{espBalance.toLocaleString()} <span className="text-sm text-primary">ESP</span></div>
                                      <div className="grid grid-cols-2 gap-3 pt-2">
                                        <Button 
                                          onClick={() => setWalletView("buy")}
                                          className="bg-primary text-black font-black uppercase italic tracking-widest h-12 rounded-xl text-[9px]"
                                        >
                                          <PlusCircle size={14} className="mr-2" />
                                          Comprar
                                        </Button>
                                        <Button 
                                          onClick={() => setWalletView("withdraw")}
                                          variant="outline"
                                          className="bg-white/5 border-white/10 text-white font-black uppercase italic tracking-widest h-12 rounded-xl text-[9px] hover:bg-primary hover:text-black"
                                        >
                                          <RefreshCw size={14} className="mr-2" />
                                          Retirar
                                        </Button>
                                      </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                        <TrendingUp size={14} className="text-accent" />
                                        <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Estadísticas</p>
                                        <p className="text-lg font-black text-white italic">+24% <span className="text-[8px] text-accent">↑</span></p>
                                      </div>
                                      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                        <DollarSign size={14} className="text-green-400" />
                                        <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">Ingresos Live</p>
                                        <p className="text-lg font-black text-white italic">1.2K <span className="text-[8px] text-primary">ESP</span></p>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {/* Formulario de Compras (Buy) */}
                                {walletView === "buy" && !selectedMethod && (
                                  <div className="space-y-8 animate-in slide-in-from-right duration-300">
                                    <div className="space-y-2">
                                      <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Inyectar <span className="text-primary">Señal ESP</span></h3>
                                      <p className="text-[9px] text-white/30 uppercase tracking-widest">Sincroniza tus fondos con la red neural</p>
                                    </div>

                                    <div className="space-y-6">
                                      <div className="space-y-4">
                                        <label className="text-[8px] font-black text-primary uppercase tracking-[0.3em] ml-1">Paquetes Disponibles</label>
                                        <div className="grid grid-cols-2 gap-3">
                                          {tokenPackages.map((pkg, idx) => (
                                            <button
                                              key={idx}
                                              disabled={isProcessing}
                                              onClick={() => setSelectedPackage(idx)}
                                              className={cn(
                                                "relative flex flex-col items-center justify-center p-4 rounded-2xl border transition-all group overflow-hidden",
                                                selectedPackage === idx 
                                                  ? "bg-primary/20 border-primary shadow-[0_0_20px_rgba(204,255,0,0.2)]" 
                                                  : "bg-white/5 border-white/10 hover:border-primary/40",
                                                isProcessing && "opacity-50 pointer-events-none"
                                              )}
                                            >
                                              {pkg.badge && (
                                                <div className="absolute top-0 right-0">
                                                  <span className="bg-primary text-black text-[6px] font-black px-2 py-0.5 rounded-bl-lg uppercase">{pkg.badge}</span>
                                                </div>
                                              )}
                                              <span className="text-lg font-black text-white italic">{pkg.esp}</span>
                                              <span className="text-[7px] font-black text-primary uppercase tracking-widest mt-0.5">ESP</span>
                                              <div className="mt-3 text-[9px] font-black text-white/40 uppercase tracking-tighter">S/ {pkg.pen}</div>
                                            </button>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="space-y-3 pt-4">
                                        <label className="text-[8px] font-black text-primary uppercase tracking-[0.3em] ml-1">Método de Pago</label>
                                        <div className="grid grid-cols-1 gap-2">
                                          {[
                                            { id: 'card', label: 'Tarjeta Crédito/Débito', icon: CreditCard, color: 'text-blue-400' },
                                            { id: 'yape', label: 'Yape / Plin', icon: Smartphone, color: 'text-purple-400' },
                                            { id: 'paypal', label: 'PayPal Global', icon: Globe, color: 'text-blue-500' },
                                            { id: 'code', label: 'Código Regalo / Promo', icon: Ticket, color: 'text-yellow-400' },
                                          ].map((m) => (
                                            <button 
                                              key={m.id} 
                                              disabled={isProcessing || selectedPackage === null}
                                              onClick={() => setSelectedMethod(m.id)}
                                              className={cn(
                                                "flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 transition-all group text-left",
                                                (isProcessing || selectedPackage === null) && "opacity-50 cursor-not-allowed"
                                              )}
                                            >
                                              <div className="flex items-center gap-4">
                                                <m.icon size={18} className={m.color} />
                                                <span className="text-[10px] font-black text-white uppercase italic tracking-tight">{m.label}</span>
                                              </div>
                                              <ArrowUpRight size={14} className="text-white/20 group-hover:text-primary" />
                                            </button>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                                {/* Formulario Final de Pago (Ejecución) */}
                                {walletView === "buy" && selectedMethod && (
                                  <div className="space-y-8 animate-in slide-in-from-right duration-300">
                                    <div className="p-6 rounded-[2.5rem] bg-primary/5 border border-primary/20 flex flex-col items-center gap-4">
                                      <Zap size={24} className="text-primary animate-pulse" />
                                      <div className="text-center">
                                        <h3 className="text-sm font-black text-white uppercase italic">Resumen de Inyección</h3>
                                        <p className="text-2xl font-black text-primary">
                                          {selectedPackage === "custom" ? Number(customESP).toLocaleString() : tokenPackages[selectedPackage as number].esp.toLocaleString()} ESP
                                        </p>
                                      </div>
                                    </div>
                                    <Button 
                                        onClick={handleProcessPayment}
                                        disabled={isProcessing}
                                        className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.3)]"
                                      >
                                        {isProcessing ? <Loader2 size={16} className="animate-spin mr-2" /> : "Confirmar Transacción"}
                                      </Button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                 </div>
               </SheetContent>
             </Sheet>
           )}
        </div>
      </div>

      {/* Perfil Header */}
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
              {isOwnProfile && (
                <div 
                  onClick={() => toast({ title: "Cámara Activa", description: "Selecciona una nueva imagen de nodo." })}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                >
                  <Camera size={20} className="text-white" />
                </div>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-primary rounded-lg border-4 border-[#020503] flex items-center justify-center">
               <Zap size={10} fill="black" strokeWidth={3} />
            </div>
          </div>
          
          <div className="flex gap-2 mb-2">
            {isOwnProfile ? (
              <Button 
                onClick={() => setIsEditing(true)}
                variant="outline" 
                className="rounded-2xl border-white/10 bg-white/5 text-[9px] font-black uppercase tracking-widest h-10 px-6 hover:bg-primary hover:text-black transition-all"
              >
                <Edit3 size={14} className="mr-2" />
                Editar Perfil
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => toast({ title: "Canal Seguro", description: "Abriendo chat encriptado..." })}
                  className="rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 h-10 w-10 p-0 shrink-0"
                >
                  <Send size={16} />
                </Button>
                <Button 
                  onClick={handleFollow}
                  className={cn(
                    "rounded-2xl text-[9px] font-black uppercase tracking-widest h-10 px-6 transition-all",
                    isFollowing ? "bg-white/10 text-white/40" : "bg-primary text-black shadow-lg"
                  )}
                >
                  {isFollowing ? <Check size={14} className="mr-2" /> : <UserPlus size={14} className="mr-2" />}
                  {isFollowing ? "Siguiendo" : "Seguir"}
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="space-y-1 min-w-0">
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none truncate">{profileName}</h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate">@{profileName.toLowerCase().replace(/\s+/g, '_')}</p>
          <p className="text-[11px] text-white/60 mt-3 leading-relaxed max-w-[90%] line-clamp-2">
            Explorador de biomas digitales y coleccionista de señales orgánicas. 🌱⚡ #BioCyber #NatureTech
          </p>
        </div>

        <div className="flex gap-8 py-4 border-y border-white/5">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <span className="text-lg font-black text-white italic leading-none tracking-tight">{stat.value}</span>
              <span className="text-[8px] font-black uppercase text-primary/40 tracking-widest mt-1 whitespace-nowrap">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <Tabs defaultValue="videos" className="w-full mt-6">
        <TabsList className="flex w-full bg-transparent border-b border-white/5 h-14 px-4 rounded-none gap-4 overflow-x-auto no-scrollbar">
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
              <div className="absolute bottom-3 left-3 flex items-center gap-1">
                <Play size={10} className="text-white/60" />
                <span className="text-[8px] font-black text-white/60">{Math.floor(Math.random() * 20)}K</span>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      <ProtocolWindow isOpen={isEditing} onClose={() => setIsEditing(false)} title="Identidad Digital">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Bio-Alias</label>
            <Input 
              value={profileName} 
              onChange={(e) => setProfileName(e.target.value)}
              className="h-14 bg-white/5 border-white/10 rounded-2xl text-white px-6 focus-visible:ring-primary" 
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

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>
  );
}
