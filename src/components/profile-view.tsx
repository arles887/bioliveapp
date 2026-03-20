
"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Menu, Share2, Zap, Check, ChevronLeft,
  Wallet, BarChart3, Edit, ArrowUpRight, ArrowDownLeft, 
  Users, Loader2, Activity, PieChart as PieChartIcon,
  TrendingUp, TrendingDown, MapPin, Award, Heart, Eye,
  Target, BarChart, Key, Clapperboard, Radio, Gift,
  Clock, CreditCard, History, Smartphone, QrCode, Ticket, ShieldCheck,
  Send, DollarSign, Sparkles, Building2
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
  XAxis,
  Bar,
  BarChart as RechartsBarChart,
  ResponsiveContainer,
  Cell
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
import { Progress } from "@/components/ui/progress";

/**
 * @fileOverview Vista de Perfil con Bio-Inteligencia Analítica Avanzada y Billetera Blindada.
 * Secciones de Billetera: Balance, Pasarela de Pago avanzada (50 paquetes + Custom).
 */

type WalletTab = "main" | "buy" | "withdraw";
type RechargeStep = "packages" | "payment-method" | "payment-details" | "confirm";
type PaymentMethod = "card" | "yape" | "paypal" | "cash" | "gift";

const MOCK_VIEWS_DATA = [
  { name: "Lun", views: 4000 },
  { name: "Mar", views: 3000 },
  { name: "Mie", views: 5000 },
  { name: "Jue", views: 2780 },
  { name: "Vie", views: 1890 },
  { name: "Sab", views: 2390 },
  { name: "Dom", views: 3490 },
];

const MOCK_FINANCE_FLOW = [
  { time: "00:00", income: 2400, expense: 1200 },
  { time: "04:00", income: 1398, expense: 900 },
  { time: "08:00", income: 9800, expense: 4500 },
  { time: "12:00", income: 3908, expense: 2800 },
  { time: "16:00", income: 4800, expense: 1100 },
  { time: "20:00", income: 3800, expense: 2300 },
  { time: "23:59", income: 4300, expense: 1400 },
];

const PREDEFINED_PACKAGES = Array.from({ length: 50 }, (_, i) => {
  const amount = (i + 1) * 1000;
  const price = (amount / 100).toFixed(2);
  const isPromo = i % 10 === 0;
  const hasBonus = i % 15 === 0;
  return { id: `pkg-${i}`, amount, price, isPromo, hasBonus };
});

const chartConfig = {
  views: { label: "Visualizaciones", color: "hsl(var(--primary))" },
  value: { label: "Usuarios", color: "hsl(var(--primary))" },
  income: { label: "Ingresos", color: "hsl(var(--primary))" },
  expense: { label: "Egresos", color: "hsl(var(--destructive))" },
} satisfies ChartConfig;

export function ProfileView({ 
  username = "BioEntity_01", 
  isOwnProfile = true,
  onBack,
  requireAuth
}: { 
  username?: string;
  isOwnProfile?: boolean;
  onBack?: void;
  requireAuth: (cb: () => void) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState(username);
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Wallet State
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isWalletAuthenticated, setIsWalletAuthenticated] = useState(false);
  const [walletPassword, setWalletPassword] = useState("");
  const [walletView, setWalletView] = useState<WalletTab>("main");
  const [rechargeStep, setRechargeStep] = useState<RechargeStep>("packages");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState("");
  const [espBalance, setEspBalance] = useState(WalletService.getBalance());
  
  // Payment Form States
  const [cardData, setCardData] = useState({ number: "", expiry: "", cvv: "", name: "" });
  const [yapeData, setYapeData] = useState({ phone: "", code: "" });
  const [giftCode, setGiftCode] = useState("");
  
  // Profile Stats State
  const [isProfileStatsOpen, setIsProfileStatsOpen] = useState(false);
  
  const avatarUrl = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl || null;

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

  const handleWalletAuth = () => {
    if (walletPassword === "2025") {
      setIsWalletAuthenticated(true);
      setWalletPassword("");
      toast({ title: "Acceso Concedido", description: "Billetera ESP desbloqueada." });
    } else {
      toast({ variant: "destructive", title: "Error de Encriptación", description: "Clave neural incorrecta." });
    }
  };

  const executeTransaction = async () => {
    setIsProcessing(true);
    setTimeout(async () => {
      try {
        let newBalance;
        if (walletView === "buy") {
          newBalance = await WalletService.injectFunds(Number(amount));
        } else {
          newBalance = await WalletService.withdrawFunds(Number(amount));
        }
        setEspBalance(newBalance);
        setIsProcessing(false);
        setWalletView("main");
        setRechargeStep("packages");
        setPaymentMethod(null);
        setAmount("");
        toast({ title: "Protocolo Completado", description: "Transacción inyectada con éxito." });
      } catch (e) {
        setIsProcessing(false);
        toast({ variant: "destructive", title: "Fallo Neural", description: "No se pudo procesar el pago." });
      }
    }, 2500);
  };

  const handleSelectPackage = (amt: number) => {
    setAmount(amt.toString());
    setRechargeStep("payment-method");
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
           <button onClick={() => toast({ title: "Copiado" })} className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary transition-all active:scale-90">
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
                        <button onClick={() => { setIsWalletOpen(true); setIsWalletAuthenticated(false); setWalletView("main"); }} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-white/5 transition-all group">
                          <div className="flex items-center gap-4">
                            <Wallet size={20} className="text-primary" />
                            <span className="text-xs font-black uppercase tracking-widest text-white/80">Billetera ESP</span>
                          </div>
                          <ChevronLeft size={16} className="rotate-180 text-white/20 group-hover:text-primary" />
                        </button>
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
              <button onClick={() => setIsEditing(true)} className="h-10 px-6 rounded-2xl bg-transparent border border-white/20 text-white font-black uppercase tracking-widest text-[9px] flex items-center justify-center hover:bg-white/5 transition-all">
                <Edit size={14} className="mr-2" /> Editar Perfil
              </button>
            ) : (
              <button onClick={handleFollow} className={cn("rounded-2xl text-[9px] font-black uppercase tracking-widest h-10 px-6", isFollowing ? "bg-white/10 text-white/40" : "bg-primary text-black shadow-lg")}>
                {isFollowing ? "Siguiendo" : "Seguir"}
              </button>
            )}
          </div>
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter truncate leading-none">{profileName}</h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest truncate">@{profileName.toLowerCase().replace(/\s+/g, '_')}</p>
        </div>
        <div className="flex gap-4 py-4 border-y border-white/5 overflow-x-auto no-scrollbar">
          {statsSummary.map((stat) => (
            <div key={stat.label} className="flex flex-col shrink-0 min-w-[80px]">
              <span className="text-lg font-black text-white italic leading-none tracking-tight">{stat.value}</span>
              <span className="text-[8px] font-black uppercase text-primary/40 tracking-widest mt-1">{stat.label}</span>
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
        <div className="space-y-6 w-full max-w-[390px] px-6 mx-auto flex flex-col items-center">
          <Input value={profileName} onChange={(e) => setProfileName(e.target.value)} className="h-14 bg-white/5 border-white/10 rounded-2xl text-white px-6 w-full" />
          <Button onClick={handleUpdateProfile} className="w-full h-14 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl">
            Sincronizar Protocolo
          </Button>
        </div>
      </ProtocolWindow>

      {/* Bio-Analítica Perfil */}
      <ProtocolWindow isOpen={isProfileStatsOpen} onClose={() => setIsProfileStatsOpen(false)} title="Bio-Inteligencia Perfil">
        <ScrollArea className="w-full max-w-[500px] h-full max-h-[85vh] px-0">
          <div className="flex flex-col items-center w-full space-y-8 pb-24 pt-6 overflow-x-hidden">
            <div className="w-full max-w-[390px] p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 relative overflow-hidden mx-auto">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                    <Eye size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Alcance Total</span>
                    <p className="text-xl font-black text-white italic tracking-tighter">248,592 views</p>
                  </div>
                </div>
              </div>
              <ChartContainer config={chartConfig} className="h-[150px] w-full">
                <AreaChart data={MOCK_VIEWS_DATA}>
                  <XAxis dataKey="name" hide />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <Area type="monotone" dataKey="views" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={3} />
                </AreaChart>
              </ChartContainer>
            </div>
          </div>
        </ScrollArea>
      </ProtocolWindow>

      {/* Billetera ESP */}
      <ProtocolWindow 
        isOpen={isWalletOpen} 
        onClose={() => { setIsWalletOpen(false); setIsWalletAuthenticated(false); setWalletView("main"); setRechargeStep("packages"); }} 
        title="Billetera ESP"
      >
        <ScrollArea className="w-full max-w-[500px] h-full max-h-[85vh]">
          <div className="flex flex-col items-center justify-start w-full gap-8 pb-32 pt-6">
            {!isWalletAuthenticated ? (
              <div className="w-full max-w-[390px] px-6 py-12 flex flex-col items-center gap-8 animate-in fade-in duration-500 mx-auto">
                <div className="h-20 w-20 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex items-center justify-center text-primary">
                  <Key size={32} />
                </div>
                <Input 
                  type="password" 
                  placeholder="****" 
                  value={walletPassword}
                  onChange={(e) => setWalletPassword(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl text-center text-2xl tracking-[1em] text-primary w-full" 
                />
                <Button onClick={handleWalletAuth} className="w-full h-14 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl">
                  Validar Protocolo
                </Button>
              </div>
            ) : (
              <div className="w-full max-w-[390px] px-4 flex flex-col gap-8 animate-in fade-in duration-700 mx-auto">
                {walletView === "main" && (
                  <div className="space-y-8 w-full">
                    <div className="p-8 rounded-[2.5rem] bg-primary text-black shadow-2xl relative overflow-hidden w-full">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">Balance Gaia Activo</span>
                      <div className="text-4xl font-black italic mt-1 tracking-tighter truncate">{espBalance.toLocaleString()} ESP</div>
                      <div className="mt-8 flex gap-3">
                        <button onClick={() => setWalletView("buy")} className="flex-1 bg-black text-white rounded-2xl h-12 text-[8px] font-black uppercase tracking-widest flex items-center justify-center active:scale-95 shadow-xl">
                          <ArrowDownLeft className="mr-2" size={14} /> Recargar
                        </button>
                        <button onClick={() => setWalletView("withdraw")} className="flex-1 bg-black/10 text-black border border-black/20 rounded-2xl h-12 text-[8px] font-black uppercase tracking-widest flex items-center justify-center active:scale-95">
                          <ArrowUpRight className="mr-2" size={14} /> Retirar
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {walletView === "buy" && (
                  <div className="w-full space-y-6 animate-in slide-in-from-right duration-500">
                    {rechargeStep === "packages" && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Inyectar <span className="text-primary">Tokens ESP</span></h3>
                          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Selecciona un Nodo de Energía</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {PREDEFINED_PACKAGES.map((pkg) => (
                            <button 
                              key={pkg.id} 
                              onClick={() => handleSelectPackage(pkg.amount)}
                              className="relative p-5 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all text-center group active:scale-95 overflow-hidden"
                            >
                              {pkg.isPromo && (
                                <div className="absolute top-0 right-0 bg-primary text-black text-[6px] font-black px-2 py-0.5 rounded-bl-lg uppercase">Promo</div>
                              )}
                              {pkg.hasBonus && (
                                <div className="absolute bottom-0 left-0 bg-accent text-black text-[6px] font-black px-2 py-0.5 rounded-tr-lg uppercase">+Bonus</div>
                              )}
                              <Zap size={14} className="text-primary/40 mx-auto mb-2 group-hover:scale-125 transition-transform" />
                              <div className="text-lg font-black text-white italic leading-none">{pkg.amount.toLocaleString()}</div>
                              <div className="text-[8px] font-bold text-primary uppercase mt-1 tracking-widest">${pkg.price} USD</div>
                            </button>
                          ))}
                          <div className="p-5 rounded-[2rem] bg-primary/5 border border-primary/20 flex flex-col items-center gap-2">
                            <Edit size={14} className="text-primary" />
                            <Input 
                              type="number" 
                              placeholder="Monto" 
                              className="h-8 bg-transparent border-b border-primary/30 rounded-none text-center text-xs text-white"
                              onChange={(e) => setAmount(e.target.value)}
                            />
                            <Button onClick={() => setRechargeStep("payment-method")} className="h-7 px-4 rounded-lg bg-primary text-black text-[8px] font-black uppercase">Custom</Button>
                          </div>
                        </div>
                        <Button onClick={() => setWalletView("main")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase rounded-2xl">Cancelar</Button>
                      </div>
                    )}

                    {rechargeStep === "payment-method" && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Pasarela <span className="text-primary">Gaia</span></h3>
                          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Total a inyectar: {Number(amount).toLocaleString()} ESP</p>
                        </div>
                        <div className="space-y-3">
                          {[
                            { id: "card", label: "Tarjeta de Crédito", icon: CreditCard },
                            { id: "yape", label: "Yape / Digital Wallet", icon: Smartphone },
                            { id: "paypal", label: "PayPal Express", icon: Send },
                            { id: "cash", label: "Efectivo / Agente", icon: Building2 },
                            { id: "gift", label: "Código de Regalo", icon: Ticket }
                          ].map((method) => (
                            <button 
                              key={method.id}
                              onClick={() => { setPaymentMethod(method.id as PaymentMethod); setRechargeStep("payment-details"); }}
                              className="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:border-primary/40 transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                  <method.icon size={20} />
                                </div>
                                <span className="text-xs font-black uppercase text-white/80">{method.label}</span>
                              </div>
                              <ChevronLeft className="rotate-180 text-white/20" size={16} />
                            </button>
                          ))}
                        </div>
                        <Button onClick={() => setRechargeStep("packages")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase rounded-2xl">Volver</Button>
                      </div>
                    )}

                    {rechargeStep === "payment-details" && (
                      <div className="space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Detalles de <span className="text-primary">Pago</span></h3>
                          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Verifica tu Señal de Pago</p>
                        </div>

                        {paymentMethod === "card" && (
                          <div className="space-y-3">
                            <Input placeholder="NOMBRE EN TARJETA" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs uppercase" onChange={(e) => setCardData({...cardData, name: e.target.value})} />
                            <Input placeholder="NÚMERO DE TARJETA" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs" onChange={(e) => setCardData({...cardData, number: e.target.value})} />
                            <div className="grid grid-cols-2 gap-3">
                              <Input placeholder="MM/AA" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs" onChange={(e) => setCardData({...cardData, expiry: e.target.value})} />
                              <Input placeholder="CVV" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs" onChange={(e) => setCardData({...cardData, cvv: e.target.value})} />
                            </div>
                          </div>
                        )}

                        {paymentMethod === "yape" && (
                          <div className="space-y-3">
                            <Input placeholder="TELÉFONO YAPE" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs" onChange={(e) => setYapeData({...yapeData, phone: e.target.value})} />
                            <Input placeholder="CÓDIGO DE APROBACIÓN" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs text-center tracking-[1em]" maxLength={6} onChange={(e) => setYapeData({...yapeData, code: e.target.value})} />
                          </div>
                        )}

                        {paymentMethod === "paypal" && (
                          <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center space-y-4">
                            <Send size={40} className="text-blue-400 mx-auto" />
                            <p className="text-[10px] text-white/60 font-black uppercase">Serás redirigido al portal de PayPal para autorizar la transacción.</p>
                          </div>
                        )}

                        {paymentMethod === "cash" && (
                          <div className="space-y-6">
                             <div className="p-8 rounded-2xl bg-white flex flex-col items-center gap-4">
                                <QrCode size={120} className="text-black" />
                                <div className="text-center">
                                  <p className="text-[8px] font-black uppercase text-black/40">Código de Pago</p>
                                  <p className="text-2xl font-black text-black tracking-[0.2em]">GAIA-8492</p>
                                </div>
                             </div>
                             <p className="text-[9px] text-white/30 text-center uppercase font-black leading-relaxed">Paga en cualquier agente autorizado con este código QR.</p>
                          </div>
                        )}

                        {paymentMethod === "gift" && (
                          <Input placeholder="INGRESA TU CÓDIGO DE REGALO" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs text-center uppercase tracking-widest" onChange={(e) => setGiftCode(e.target.value)} />
                        )}

                        <Button onClick={() => setRechargeStep("confirm")} className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl">
                          Siguiente Paso
                        </Button>
                        <Button onClick={() => setRechargeStep("payment-method")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase rounded-2xl">Volver</Button>
                      </div>
                    )}

                    {rechargeStep === "confirm" && (
                      <div className="space-y-8 animate-in zoom-in-95 duration-500">
                        <div className="text-center space-y-2">
                           <div className="h-20 w-20 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto shadow-2xl">
                             <ShieldCheck size={40} />
                           </div>
                           <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">Confirmar <span className="text-primary">Inyección</span></h3>
                           <p className="text-[9px] text-white/30 font-black uppercase tracking-widest">Protocolo de Seguridad Activo</p>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
                           <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Activo</span>
                             <span className="text-sm font-black text-white italic">{Number(amount).toLocaleString()} ESP</span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Método</span>
                             <span className="text-[10px] font-black text-primary uppercase italic">{paymentMethod}</span>
                           </div>
                           <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                             <span className="text-[11px] font-black text-white uppercase tracking-widest">Total USD</span>
                             <span className="text-xl font-black text-primary italic">${(Number(amount)/100).toFixed(2)}</span>
                           </div>
                        </div>

                        <Button 
                          onClick={executeTransaction} 
                          disabled={isProcessing}
                          className="w-full h-20 bg-primary text-black font-black uppercase italic tracking-[0.2em] rounded-[2rem] shadow-[0_0_50px_rgba(204,255,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all text-sm"
                        >
                          {isProcessing ? (
                            <div className="flex items-center gap-3">
                              <Loader2 className="animate-spin" size={20} /> Sincronizando...
                            </div>
                          ) : "Confirmar Pago Neural"}
                        </Button>
                        <Button onClick={() => setRechargeStep("payment-details")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase rounded-2xl">Corregir Datos</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </ProtocolWindow>
    </div>
  );
}

