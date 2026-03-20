
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { 
  Menu, Share2, Zap, UserPlus, Check, ChevronLeft,
  Wallet, History, UserCircle, LifeBuoy, Settings, Lock,
  Loader2, CreditCard, Smartphone, Globe, Gift, 
  Shield, ArrowUpRight, ArrowDownLeft, Landmark, 
  Edit, Coins, BadgePercent, TrendingUp, AlertCircle,
  BarChart3, MapPin, Calendar, MessageCircle, Heart,
  Users
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
import { 
  Area, 
  AreaChart, 
  PieChart, 
  Pie, 
  Cell,
  XAxis
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

/**
 * @fileOverview Vista de Perfil Enterprise con Billetera ESP e Inteligencia de Datos.
 * Simplificado: Eliminados apartados de Inicio e Historial por instrucción del usuario.
 */

type RechargeStep = "gallery" | "confirm" | "payment" | "details";
type WalletTab = "stats" | "buy" | "withdraw";

const MOCK_CHART_DATA = [
  { name: "00h", income: 4000, outcome: 2400 },
  { name: "04h", income: 3000, outcome: 1398 },
  { name: "08h", income: 2000, outcome: 9800 },
  { name: "12h", income: 2780, outcome: 3908 },
  { name: "16h", income: 1890, outcome: 4800 },
  { name: "20h", income: 2390, outcome: 3800 },
  { name: "23h", income: 3490, outcome: 4300 },
];

const ORIGIN_DATA = [
  { name: "Regalos", value: 45, color: "hsl(var(--primary))" },
  { name: "Publicidad", value: 25, color: "hsl(var(--accent))" },
  { name: "Recargas", value: 30, color: "hsl(var(--secondary-foreground))" },
];

const chartConfig = {
  income: { label: "Ingresos", color: "hsl(var(--primary))" },
  outcome: { label: "Egresos", color: "hsl(var(--accent))" },
  views: { label: "Vistas", color: "hsl(var(--primary))" }
} satisfies ChartConfig;

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
  
  // Wallet State
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletView, setWalletView] = useState<WalletTab>("stats");
  const [rechargeStep, setRechargeStep] = useState<RechargeStep>("gallery");
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState("");
  const [espBalance, setEspBalance] = useState(WalletService.getBalance());
  
  // Profile Stats State
  const [isProfileStatsOpen, setIsProfileStatsOpen] = useState(false);
  const [statsTimeframe, setStatsTimeframe] = useState("Día");
  
  const avatarUrl = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl || null;

  const tokenPackages = useMemo(() => Array.from({ length: 60 }, (_, i) => {
    const baseAmount = (i + 1) * 100;
    const multiplier = i < 10 ? 1 : i < 20 ? 10 : i < 40 ? 100 : 1000;
    const finalAmount = baseAmount * multiplier;
    const giftAmount = Math.floor(finalAmount * 0.15);
    return {
      id: `pkg-${i}`,
      amount: finalAmount,
      gift: giftAmount,
      price: (finalAmount * 0.05).toFixed(2),
      label: i % 4 === 0 ? "OFERTA" : "BONO"
    };
  }), []);

  const statsSummary = [
    { label: "Seguidores", value: isOwnProfile ? "12.4K" : "4.2K", icon: Users },
    { label: "Siguiendo", value: isOwnProfile ? "842" : "120", icon: Check },
    { label: "ESP Tokens", value: isOwnProfile ? espBalance.toLocaleString() : "800", icon: Zap }
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

  const executeTransaction = async () => {
    if (!amount || Number(amount) <= 0) {
      toast({ variant: "destructive", title: "Error", description: "Ingresa un monto válido." });
      return;
    }

    setIsProcessing(true);
    setTimeout(async () => {
      try {
        let newBalance;
        if (walletView === "buy") {
          newBalance = await WalletService.injectFunds(Number(amount));
          toast({ title: "Sincronización Exitosa", description: `Recargados ${Number(amount).toLocaleString()} ESP.` });
        } else {
          newBalance = await WalletService.withdrawFunds(Number(amount));
          toast({ title: "Retiro Exitoso", description: `Transferidos ${Number(amount).toLocaleString()} ESP.` });
        }
        setEspBalance(newBalance);
        setIsProcessing(false);
        setWalletView("stats");
        setRechargeStep("gallery");
        setPaymentMethod(null);
        setAmount("");
      } catch (e: any) {
        setIsProcessing(false);
        toast({ variant: "destructive", title: "Fallo Neural", description: "Fondos insuficientes en el nodo." });
      }
    }, 2000);
  };

  const menuItems = [
    { id: "wallet", label: "Billetera ESP", icon: Wallet, color: "text-primary", action: () => { setIsWalletOpen(true); setWalletView("stats"); } },
    { id: "activity", label: "Actividad", icon: History, color: "text-white/40", action: () => toast({ title: "Módulo Actividad", description: "Historial de señales en proceso." }) },
    { id: "account", label: "Información", icon: UserCircle, color: "text-white/40", action: () => toast({ title: "Módulo Info", description: "Detalles de cuenta encriptados." }) },
    { id: "support", label: "Soporte", icon: LifeBuoy, color: "text-white/40", action: () => toast({ title: "Soporte", description: "Contactando con el nodo central." }) },
    { id: "settings", label: "Ajustes", icon: Settings, color: "text-white/40", action: () => toast({ title: "Ajustes", description: "Configuración neural disponible pronto." }) },
    { id: "privacy", label: "Privacidad", icon: Lock, color: "text-accent", action: () => toast({ title: "Privacidad", description: "Escudo Gaia activo." }) },
  ];

  const handleWalletClose = () => {
    setIsWalletOpen(false);
    setWalletView("stats");
    setRechargeStep("gallery");
    setPaymentMethod(null);
    setAmount("");
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[500px] mx-auto overflow-x-hidden">
      {/* Banner Area */}
      <div className="relative h-32 w-full bg-gradient-to-b from-primary/10 to-transparent shrink-0">
        <div className="absolute top-6 left-6 z-20">
           {!isOwnProfile && (
             <button onClick={onBack} className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90">
                <ChevronLeft size={20} />
             </button>
           )}
        </div>
        <div className="absolute top-6 right-6 flex gap-3 z-20">
           {isOwnProfile && (
             <button 
              onClick={() => setIsProfileStatsOpen(true)}
              className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90"
             >
                <BarChart3 size={18} />
             </button>
           )}
           <button onClick={() => toast({ title: "Copiado", description: "Enlace de perfil copiado." })} className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90">
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
                      <SheetTitle className="text-2xl font-black italic uppercase text-white tracking-tighter truncate">
                        Configuración <span className="text-primary">Neural</span>
                      </SheetTitle>
                    </SheetHeader>
                    <ScrollArea className="flex-1">
                      <div className="p-6">
                        {menuItems.map((item) => (
                          <button key={item.id} onClick={item.action} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group">
                            <div className="flex items-center gap-4 min-w-0 flex-1">
                              <item.icon size={20} className={cn("shrink-0", item.color)} />
                              <span className="text-xs font-black uppercase tracking-widest text-white/80 truncate">{item.label}</span>
                            </div>
                            <ChevronLeft size={16} className="rotate-180 text-white/20 group-hover:text-primary shrink-0" />
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

      {/* Profile Header */}
      <div className="px-8 -mt-12 space-y-6">
        <div className="flex items-end justify-between">
          <div className="h-24 w-24 rounded-[2rem] border-4 border-[#020503] bg-white/5 overflow-hidden shadow-2xl relative shrink-0">
            <Image src={isOwnProfile ? (avatarUrl || "") : `https://picsum.photos/seed/${profileName}/200/200`} fill alt="Avatar" className="object-cover" />
          </div>
          <div className="flex gap-2 mb-2">
            {isOwnProfile ? (
              <Button 
                onClick={() => setIsEditing(true)} 
                variant="outline"
                className="rounded-2xl bg-transparent border border-white/20 text-white font-black uppercase tracking-widest h-10 px-6 hover:bg-white/5 transition-all flex items-center gap-2 active:scale-95 shadow-none"
              >
                <Edit size={14} />
                Editar Perfil
              </Button>
            ) : (
              <Button onClick={handleFollow} className={cn("rounded-2xl text-[9px] font-black uppercase tracking-widest h-10 px-6 transition-all", isFollowing ? "bg-white/10 text-white/40" : "bg-primary text-black shadow-lg")}>
                {isFollowing ? "Siguiendo" : "Seguir"}
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter truncate leading-none">{profileName}</h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate">@{profileName.toLowerCase().replace(/\s+/g, '_')}</p>
          <p className="text-[11px] text-white/60 mt-3 leading-relaxed max-w-full line-clamp-3">
            Explorador de biomas digitales y coleccionista de señales orgánicas. 🌱⚡ #BioCyber #NatureTech #Enterprise #Global
          </p>
        </div>

        <div className="flex gap-4 py-4 border-y border-white/5 overflow-x-auto no-scrollbar">
          {statsSummary.map((stat) => (
            <div key={stat.label} className="flex flex-col shrink-0 min-w-[80px]">
              <span className="text-lg font-black text-white italic leading-none tracking-tight truncate">{stat.value}</span>
              <span className="text-[8px] font-black uppercase text-primary/40 tracking-widest mt-1 truncate">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Tabs */}
      <Tabs defaultValue="videos" className="w-full mt-6">
        <TabsList className="flex w-full bg-transparent border-b border-white/5 h-14 px-4 rounded-none gap-4">
          <TabsTrigger value="videos" className="data-[state=active]:text-primary text-white/20 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 font-black uppercase text-[9px] tracking-widest">Videos</TabsTrigger>
          <TabsTrigger value="music" className="data-[state=active]:text-primary text-white/20 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 font-black uppercase text-[9px] tracking-widest">Música</TabsTrigger>
        </TabsList>
        <TabsContent value="videos" className="p-4 grid grid-cols-2 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5 group cursor-pointer active:scale-95 transition-all">
              <Image src={`https://picsum.photos/seed/pv${profileName}${i}/300/400`} fill alt="Video" className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
            </div>
          ))}
        </TabsContent>
      </Tabs>

      {/* Profile Edit Window */}
      <ProtocolWindow isOpen={isEditing} onClose={() => setIsEditing(false)} title="Identidad Digital">
        <div className="space-y-6 w-full max-w-[320px] px-6">
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Bio-Alias</label>
            <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="h-14 bg-white/5 border-white/10 rounded-2xl text-white px-6 focus-visible:ring-primary" />
          </div>
          <Button onClick={handleUpdateProfile} className="w-full h-14 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.3)]">
            Sincronizar Protocolo
          </Button>
        </div>
      </ProtocolWindow>

      {/* Profile Analytics Window */}
      <ProtocolWindow isOpen={isProfileStatsOpen} onClose={() => setIsProfileStatsOpen(false)} title="Bio-Inteligencia Perfil">
        <ScrollArea className="w-full max-w-[400px] h-full max-h-[85vh] px-6 py-4">
          <div className="space-y-8 pb-12">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Bio<span className="text-primary">Performance</span></h3>
               <Select value={statsTimeframe} onValueChange={setStatsTimeframe}>
                 <SelectTrigger className="h-9 w-24 bg-white/5 border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest">
                   <Calendar className="mr-2 h-3 w-3" /> {statsTimeframe}
                 </SelectTrigger>
                 <SelectContent className="bg-[#050906] border-white/10 text-white">
                   {["Hora", "Día", "Semana", "Mes", "Año"].map(t => (
                     <SelectItem key={t} value={t} className="text-[10px] font-black uppercase tracking-widest">{t}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>

            <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Visualizaciones de Perfil</span>
              <ChartContainer config={chartConfig} className="h-[200px] w-full aspect-auto">
                <AreaChart data={MOCK_CHART_DATA}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" hide />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Area type="monotone" dataKey="income" name="views" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
                </AreaChart>
              </ChartContainer>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Vistas Perfil", value: "84.2K", icon: BarChart3, color: "text-primary" },
                { label: "Me Gusta", value: "12.5K", icon: Heart, color: "text-red-500" },
                { label: "Comentarios", value: "3.2K", icon: MessageCircle, color: "text-accent" },
                { label: "Compartidos", value: "1.8K", icon: Share2, color: "text-blue-400" },
              ].map((metric) => (
                <div key={metric.label} className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-2">
                   <div className="flex items-center justify-between">
                     <metric.icon size={14} className={metric.color} />
                     <span className="text-[7px] font-black uppercase text-white/20 tracking-widest">Global</span>
                   </div>
                   <p className="text-xl font-black text-white italic tracking-tight truncate">{metric.value}</p>
                   <p className="text-[8px] font-black uppercase text-white/40 tracking-widest">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </ProtocolWindow>

      {/* Wallet Protocol Window */}
      <ProtocolWindow isOpen={isWalletOpen} onClose={handleWalletClose} title="Billetera ESP">
        <ScrollArea className="w-full max-w-[500px] h-full max-h-[85vh]">
          <div className="p-6 space-y-6 pb-12 w-full max-w-full overflow-hidden">
            
            {/* Balance Card */}
            <div className="mx-auto max-w-[94%] p-8 rounded-[2.5rem] bg-primary text-black shadow-[0_0_50px_rgba(204,255,0,0.4)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-20 rotate-12 group-hover:rotate-45 transition-transform duration-700">
                <Wallet size={80} />
              </div>
              <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Balance Gaia Activo</span>
                <div className="text-4xl font-black italic mt-1 tracking-tighter truncate">
                  {espBalance.toLocaleString()} <span className="text-sm">ESP</span>
                </div>
                <div className="mt-6 flex gap-3">
                  <Button onClick={() => { setWalletView("buy"); setRechargeStep("gallery"); setPaymentMethod(null); }} className="flex-1 bg-black text-white rounded-2xl h-12 text-[9px] font-black uppercase tracking-widest hover:bg-black/80">
                    <ArrowDownLeft className="mr-2" size={14} /> Recargar
                  </Button>
                  <Button onClick={() => { setWalletView("withdraw"); setRechargeStep("gallery"); setPaymentMethod(null); }} className="flex-1 bg-black/10 text-black border border-black/20 rounded-2xl h-12 text-[9px] font-black uppercase tracking-widest hover:bg-black/20">
                    <ArrowUpRight className="mr-2" size={14} /> Retirar
                  </Button>
                </div>
              </div>
            </div>

            {/* Wallet Quick Navigation Tabs - Solo Analítica */}
            <div className="mx-auto max-w-[92%] flex bg-white/5 p-1 rounded-2xl border border-white/5 overflow-hidden">
              {[
                { id: "stats", label: "Analítica", icon: BarChart3 },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setWalletView(tab.id as WalletTab)}
                  className={cn(
                    "flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl transition-all duration-300 min-w-0",
                    walletView === tab.id 
                      ? "bg-white/10 text-primary shadow-lg" 
                      : "text-white/30 hover:text-white/60"
                  )}
                >
                  <tab.icon size={14} className={cn(walletView === tab.id ? "text-primary" : "")} />
                  <span className="text-[7px] font-black uppercase tracking-widest truncate block w-full px-1">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* View Logic: Recarga */}
            {walletView === "buy" && (
              <div className="mx-auto max-w-[92%] space-y-6 animate-in slide-in-from-right duration-500 w-full overflow-hidden">
                <div className="flex items-center gap-4">
                   <button 
                    onClick={() => setWalletView("stats")} 
                    className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 border border-white/10 shrink-0"
                   >
                     <ChevronLeft size={20} />
                   </button>
                   <h3 className="text-xl font-black italic uppercase text-white tracking-tighter truncate">
                     Protocolo <span className="text-primary">Recarga</span>
                   </h3>
                </div>

                {rechargeStep === "gallery" && (
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {tokenPackages.map((pkg) => (
                      <button 
                        key={pkg.id}
                        onClick={() => { setAmount(pkg.amount.toString()); setRechargeStep("confirm"); }}
                        className="group relative flex flex-col items-center justify-center p-6 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-primary/40 transition-all text-center overflow-hidden min-w-0"
                      >
                        <div className="absolute top-3 left-3 flex gap-1">
                          <BadgePercent size={10} className="text-primary" />
                          <span className="text-[7px] font-black text-primary uppercase truncate">{pkg.label}</span>
                        </div>
                        <Zap size={24} className="text-primary/40 group-hover:text-primary group-hover:scale-110 transition-all mb-3" />
                        <div className="space-y-1 w-full">
                          <p className="text-2xl font-black text-white italic leading-none truncate">{pkg.amount.toLocaleString()}</p>
                          <p className="text-[8px] text-primary/60 font-black uppercase tracking-widest truncate">+ {pkg.gift.toLocaleString()} regalo</p>
                        </div>
                        <div className="mt-4 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white truncate">
                          S/ {pkg.price}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {rechargeStep === "confirm" && (
                  <div className="space-y-8 animate-in zoom-in-95 duration-300 w-full overflow-hidden">
                    <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 text-center space-y-6 relative overflow-hidden">
                       <TrendingUp size={48} className="text-primary mx-auto" />
                       <div className="space-y-2 min-w-0">
                          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic block truncate">Monto a Inyectar</span>
                          <div className="text-5xl font-black text-white italic tracking-tighter truncate">
                            {amount ? Number(amount).toLocaleString() : "0"} <span className="text-sm">ESP</span>
                          </div>
                       </div>
                    </div>
                    <Button 
                      onClick={() => setRechargeStep("payment")}
                      className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.3)]"
                    >
                      Siguiente Protocolo
                    </Button>
                  </div>
                )}

                {rechargeStep === "payment" && !paymentMethod && (
                  <div className="grid grid-cols-1 gap-3 animate-in slide-in-from-bottom-4 duration-500 w-full overflow-hidden">
                    <button onClick={() => setPaymentMethod("card")} className="flex items-center gap-5 p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-primary/40 group transition-all w-full min-w-0">
                      <CreditCard className="text-primary shrink-0" />
                      <p className="text-sm font-black text-white italic uppercase truncate">Tarjeta Crédito/Débito</p>
                    </button>
                  </div>
                )}

                {paymentMethod && (
                  <div className="space-y-6 animate-in fade-in duration-500 w-full overflow-hidden">
                    <Button onClick={executeTransaction} disabled={isProcessing} className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl">
                      {isProcessing ? <Loader2 className="animate-spin mr-2" /> : <Zap size={16} fill="black" className="mr-2" />}
                      {isProcessing ? "Procesando..." : `Confirmar Recarga`}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* View Logic: Retiro */}
            {walletView === "withdraw" && (
              <div className="mx-auto max-w-[92%] space-y-6 animate-in slide-in-from-right duration-500 w-full overflow-hidden">
                <div className="flex items-center gap-4">
                   <button 
                    onClick={() => setWalletView("stats")} 
                    className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 border border-white/10 shrink-0"
                   >
                     <ChevronLeft size={20} />
                   </button>
                   <h3 className="text-xl font-black italic uppercase text-white tracking-tighter truncate">
                     Protocolo <span className="text-primary">Retiro</span>
                   </h3>
                </div>

                <div className="space-y-8 animate-in fade-in duration-500 w-full overflow-hidden">
                    <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 space-y-6">
                      <div className="space-y-2 text-center min-w-0">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 italic block truncate">Cantidad a Retirar</label>
                         <Input 
                          type="number"
                          placeholder="0.00" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="h-20 bg-transparent border-none text-center text-4xl font-black text-white focus-visible:ring-0"
                         />
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/20 flex gap-4 items-start">
                      <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                      <p className="text-[10px] font-bold text-red-500/80 uppercase leading-relaxed italic line-clamp-4">
                        AVISO: Solo se procesarán retiros a cuentas que pertenezcan al titular registrado.
                      </p>
                    </div>

                    <Button 
                      onClick={() => {
                        if (Number(amount) > 0 && Number(amount) <= espBalance) executeTransaction();
                        else toast({ variant: "destructive", title: "Monto Inválido", description: "Verifica tu saldo disponible." });
                      }}
                      className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.3)]"
                    >
                      Confirmar Retiro
                    </Button>
                  </div>
              </div>
            )}

            {/* View Logic: Estadísticas (Analytics) */}
            {walletView === "stats" && (
              <div className="mx-auto max-w-[92%] space-y-8 animate-in fade-in duration-500 pb-8 w-full overflow-hidden">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-xl font-black italic uppercase text-white tracking-tighter truncate">Bio<span className="text-primary">Analytics</span></h3>
                   <Select value={statsTimeframe} onValueChange={setStatsTimeframe}>
                     <SelectTrigger className="h-9 w-24 bg-white/5 border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest">
                       <Calendar className="mr-2 h-3 w-3" /> {statsTimeframe}
                     </SelectTrigger>
                     <SelectContent className="bg-[#050906] border-white/10 text-white">
                       {["Hora", "Día", "Semana", "Mes", "Año"].map(t => (
                         <SelectItem key={t} value={t} className="text-[10px] font-black uppercase tracking-widest">{t}</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                </div>

                <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4 w-full overflow-hidden">
                  <ChartContainer config={chartConfig} className="h-[200px] w-full aspect-auto">
                    <AreaChart data={MOCK_CHART_DATA}>
                      <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" hide />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="income" stroke="hsl(var(--primary))" strokeWidth={3} fillOpacity={1} fill="url(#colorIncome)" />
                    </AreaChart>
                  </ChartContainer>
                </div>

                <div className="grid grid-cols-2 gap-3 w-full">
                  <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1 overflow-hidden">
                     <span className="text-[7px] font-black uppercase tracking-widest text-primary/60 block truncate">Saldo Recargado</span>
                     <p className="text-sm font-black text-white italic truncate">1,450,200 ESP</p>
                  </div>
                  <div className="p-5 rounded-3xl bg-white/[0.02] border border-white/5 space-y-1 overflow-hidden">
                     <span className="text-[7px] font-black uppercase tracking-widest text-accent/60 block truncate">Retiros Totales</span>
                     <p className="text-sm font-black text-white italic truncate">240,500 ESP</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </ProtocolWindow>
    </div>
  );
}
