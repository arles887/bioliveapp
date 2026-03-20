
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

/**
 * @fileOverview Vista de Perfil con Billetera ESP Blindada (390px) y Analítica Global.
 * Incluye: Auth (2025), Analítica Financiera, Rendimiento por Contenido e Historial.
 * Analítica Global: Visualizaciones, Localización, Edad, Seguidores/Likes Netos y Aceptación.
 */

type WalletTab = "main" | "buy" | "withdraw";
type RechargeStep = "packages" | "payment-method" | "payment-details" | "confirm";
type PaymentMethod = "card" | "yape" | "paypal" | "cash" | "gift";

const MOCK_FINANCE_FLOW = [
  { name: "Lun", income: 4000, expense: 2400 },
  { name: "Mar", income: 3000, expense: 1398 },
  { name: "Mie", income: 2000, expense: 9800 },
  { name: "Jue", income: 2780, expense: 3908 },
  { name: "Vie", income: 1890, expense: 4800 },
  { name: "Sab", income: 2390, expense: 3800 },
  { name: "Dom", income: 3490, expense: 4300 },
];

const PREDEFINED_PACKAGES = Array.from({ length: 50 }, (_, i) => {
  const amount = (i + 1) * 1000;
  const price = (amount / 100).toFixed(2);
  const isPromo = i % 10 === 0;
  const hasBonus = i % 15 === 0;
  return { id: `pkg-${i}`, amount, price, isPromo, hasBonus };
});

const chartConfig = {
  income: { label: "Ingresos", color: "hsl(var(--primary))" },
  expense: { label: "Egresos", color: "hsl(var(--destructive))" },
  views: { label: "Visualizaciones", color: "hsl(var(--primary))" },
} satisfies ChartConfig;

export function ProfileView({ 
  username = "BioEntity_01", 
  isOwnProfile = true,
  onBack,
  requireAuth
}: { 
  username?: string;
  isOwnProfile?: boolean;
  onBack?: any;
  requireAuth: (cb: () => void) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileName, setProfileName] = useState(username);
  
  // States para Ventanas de Protocolo
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isWalletAuthenticated, setIsWalletAuthenticated] = useState(false);
  const [walletPassword, setWalletPassword] = useState("");
  
  // Wallet Navigation States
  const [walletView, setWalletView] = useState<WalletTab>("main");
  const [rechargeStep, setRechargeStep] = useState<RechargeStep>("packages");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState("");
  const [espBalance, setEspBalance] = useState(WalletService.getBalance());
  
  const avatarUrl = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl || null;

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
    }, 2000);
  };

  return (
    <div className="flex flex-col w-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 max-w-[500px] mx-auto overflow-x-hidden">
      {/* Banner Area */}
      <div className="relative h-32 w-full bg-gradient-to-b from-primary/10 to-transparent">
        <div className="absolute top-6 left-6 z-20">
           {!isOwnProfile && (
             <button onClick={onBack} className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary active:scale-90">
                <ChevronLeft size={20} />
             </button>
           )}
        </div>
        <div className="absolute top-6 right-6 flex gap-3 z-20">
           <button 
            onClick={() => toast({ title: "Enlace Copiado", description: "Sincronización de perfil lista." })} 
            className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary active:scale-90"
           >
              <Share2 size={18} />
           </button>
           {isOwnProfile && (
             <>
               <button 
                onClick={() => setIsAnalyticsOpen(true)}
                className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary active:scale-90"
               >
                  <BarChart3 size={18} />
               </button>
               <button 
                onClick={() => { setIsWalletOpen(true); setIsWalletAuthenticated(false); }}
                className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-primary shadow-[0_0_15px_rgba(204,255,0,0.3)] active:scale-90"
               >
                  <Wallet size={18} />
               </button>
             </>
           )}
        </div>
      </div>

      {/* Profile Header */}
      <div className="px-8 -mt-12 space-y-6">
        <div className="h-24 w-24 rounded-[2rem] border-4 border-[#020503] bg-white/5 overflow-hidden shadow-2xl relative">
          <Image src={isOwnProfile ? (avatarUrl || "") : `https://picsum.photos/seed/${profileName}/200/200`} fill alt="Avatar" className="object-cover" />
        </div>
        <div className="space-y-1">
          <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter truncate leading-none">{profileName}</h2>
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">@{profileName.toLowerCase().replace(/\s+/g, '_')}</p>
        </div>
        <div className="flex gap-4 py-4 border-y border-white/5 overflow-x-auto no-scrollbar">
          {[
            { label: "Seguidores", value: isOwnProfile ? "12.4K" : "4.2K" },
            { label: "Siguiendo", value: isOwnProfile ? "842" : "120" },
            { label: "Tokens ESP", value: isOwnProfile ? espBalance.toLocaleString() : "800" }
          ].map((stat) => (
            <div key={stat.label} className="flex flex-col min-w-[80px]">
              <span className="text-lg font-black text-white italic tracking-tight">{stat.value}</span>
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

      {/* Billetera ESP Blindada (390px) */}
      <ProtocolWindow 
        isOpen={isWalletOpen} 
        onClose={() => { setIsWalletOpen(false); setIsWalletAuthenticated(false); setWalletView("main"); setRechargeStep("packages"); }} 
        title="Billetera ESP"
      >
        <ScrollArea className="w-full h-full">
          <div className="flex flex-col items-center w-full gap-8 pb-32 pt-6">
            {!isWalletAuthenticated ? (
              <div className="w-full max-w-[390px] px-6 py-12 flex flex-col items-center gap-8 animate-in fade-in duration-500 mx-auto">
                <div className="h-20 w-20 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(204,255,0,0.2)]">
                  <Key size={32} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Acceso <span className="text-primary">Blindado</span></h3>
                  <p className="text-[9px] text-white/30 font-black uppercase tracking-widest italic">Ingresa tu Clave Neural</p>
                </div>
                <Input 
                  type="password" 
                  placeholder="****" 
                  value={walletPassword}
                  onChange={(e) => setWalletPassword(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl text-center text-2xl tracking-[1em] text-primary w-full" 
                />
                <Button onClick={handleWalletAuth} className="w-full h-14 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl">
                  Validar Protocolo
                </Button>
                <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">Tip: 2025</p>
              </div>
            ) : (
              <div className="w-full max-w-[390px] px-4 flex flex-col gap-8 animate-in fade-in duration-700 mx-auto items-center">
                {walletView === "main" && (
                  <div className="w-full space-y-8 flex flex-col items-center">
                    {/* Balance Card */}
                    <div className="w-full p-8 rounded-[2.5rem] bg-primary text-black shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap size={120} fill="currentColor" />
                      </div>
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

                    {/* Analítica de Ingresos/Egresos */}
                    <div className="w-full p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                          <Activity size={16} />
                        </div>
                        <h3 className="text-[10px] font-black uppercase text-white tracking-widest italic">Flujo Bio-Económico</h3>
                      </div>
                      <ChartContainer config={chartConfig} className="h-[120px] w-full">
                        <AreaChart data={MOCK_FINANCE_FLOW}>
                          <XAxis dataKey="name" hide />
                          <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                          <Area type="monotone" dataKey="income" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
                          <Area type="monotone" dataKey="expense" stroke="hsl(var(--destructive))" fill="hsl(var(--destructive))" fillOpacity={0.1} strokeWidth={2} />
                        </AreaChart>
                      </ChartContainer>
                    </div>

                    {/* Rendimiento por Contenido */}
                    <div className="w-full grid grid-cols-2 gap-4">
                      <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                         <div className="flex items-center justify-between">
                           <Clapperboard size={14} className="text-primary/60" />
                           <span className="text-[8px] font-black text-primary uppercase tracking-widest">+12%</span>
                         </div>
                         <p className="text-[18px] font-black text-white italic tracking-tighter">45.2K</p>
                         <p className="text-[8px] font-black text-white/30 uppercase tracking-widest italic">Por Bio-Reels</p>
                      </div>
                      <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                         <div className="flex items-center justify-between">
                           <Radio size={14} className="text-accent/60" />
                           <span className="text-[8px] font-black text-accent uppercase tracking-widest">+8%</span>
                         </div>
                         <p className="text-[18px] font-black text-white italic tracking-tighter">120.8K</p>
                         <p className="text-[8px] font-black text-white/30 uppercase tracking-widest italic">Por Lives</p>
                      </div>
                    </div>

                    {/* Última Actividad */}
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between px-4">
                        <h3 className="text-[10px] font-black uppercase text-white/40 tracking-widest italic">Historial Multicapa</h3>
                        <History size={12} className="text-white/20" />
                      </div>
                      {[
                        { type: "Recarga", icon: ArrowDownLeft, color: "text-primary", amount: "+5,000 ESP", time: "Hace 2h" },
                        { type: "Retiro", icon: ArrowUpRight, color: "text-white/40", amount: "-10,000 ESP", time: "Hace 1d" },
                        { type: "Regalo Donado", icon: Gift, color: "text-accent", amount: "-50 ESP", time: "Hace 5m" }
                      ].map((log, i) => (
                        <div key={i} className="w-full p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group hover:bg-white/[0.05] transition-all">
                          <div className="flex items-center gap-4">
                            <div className={cn("h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center", log.color)}>
                              <log.icon size={18} />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[10px] font-black text-white uppercase italic">{log.type}</span>
                              <span className="text-[8px] font-bold text-white/20 uppercase">{log.time}</span>
                            </div>
                          </div>
                          <span className={cn("text-xs font-black italic", log.color)}>{log.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {walletView === "buy" && (
                  <div className="w-full space-y-6 animate-in slide-in-from-right duration-500 flex flex-col items-center">
                    {rechargeStep === "packages" && (
                      <div className="w-full space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Inyectar <span className="text-primary">Tokens ESP</span></h3>
                          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Selecciona un Nodo de Energía</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 w-full">
                          {PREDEFINED_PACKAGES.slice(0, 50).map((pkg) => (
                            <button 
                              key={pkg.id} 
                              onClick={() => { setAmount(pkg.amount.toString()); setRechargeStep("payment-method"); }}
                              className="relative p-5 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all text-center group active:scale-95 overflow-hidden"
                            >
                              {pkg.isPromo && <div className="absolute top-0 right-0 bg-primary text-black text-[6px] font-black px-2 py-0.5 rounded-bl-lg uppercase">Promo</div>}
                              {pkg.hasBonus && <div className="absolute bottom-0 left-0 bg-accent text-black text-[6px] font-black px-2 py-0.5 rounded-tr-lg uppercase">+Bonus</div>}
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
                              className="h-8 bg-transparent border-b border-primary/30 rounded-none text-center text-xs text-white placeholder:text-white/20"
                              onChange={(e) => setAmount(e.target.value)}
                            />
                            <Button onClick={() => setRechargeStep("payment-method")} className="h-7 px-4 rounded-lg bg-primary text-black text-[8px] font-black uppercase tracking-widest">Custom</Button>
                          </div>
                        </div>
                        <Button onClick={() => setWalletView("main")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Cancelar</Button>
                      </div>
                    )}

                    {rechargeStep === "payment-method" && (
                      <div className="w-full space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Pasarela <span className="text-primary">Gaia</span></h3>
                          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Total: {Number(amount).toLocaleString()} ESP</p>
                        </div>
                        <div className="space-y-3 w-full">
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
                                <span className="text-xs font-black uppercase text-white/80 tracking-tight">{method.label}</span>
                              </div>
                              <ChevronLeft className="rotate-180 text-white/20" size={16} />
                            </button>
                          ))}
                        </div>
                        <Button onClick={() => setRechargeStep("packages")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Volver</Button>
                      </div>
                    )}

                    {rechargeStep === "payment-details" && (
                      <div className="w-full space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Datos de <span className="text-primary">Inyección</span></h3>
                          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Verifica tu Señal de Pago</p>
                        </div>

                        {paymentMethod === "card" && (
                          <div className="space-y-3 w-full">
                            <Input placeholder="NOMBRE COMPLETO" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs uppercase tracking-widest px-6" />
                            <Input placeholder="NÚMERO DE TARJETA" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs tracking-[0.2em] px-6" />
                            <div className="grid grid-cols-2 gap-3">
                              <Input placeholder="MM/AA" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs px-6" />
                              <Input placeholder="CVV" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs px-6" />
                            </div>
                          </div>
                        )}

                        {paymentMethod === "yape" && (
                          <div className="space-y-3 w-full">
                            <Input placeholder="NÚMERO DE CELULAR" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs px-6" />
                            <Input placeholder="CÓDIGO DE CONFIRMACIÓN" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs text-center tracking-[0.5em]" maxLength={6} />
                          </div>
                        )}

                        {paymentMethod === "cash" && (
                          <div className="space-y-6 w-full flex flex-col items-center">
                             <div className="p-8 rounded-2xl bg-white flex flex-col items-center gap-4 w-full">
                                <QrCode size={120} className="text-black" />
                                <div className="text-center">
                                  <p className="text-[8px] font-black uppercase text-black/40 tracking-widest">Código de Pago</p>
                                  <p className="text-2xl font-black text-black tracking-[0.2em]">GAIA-8492</p>
                                </div>
                             </div>
                             <p className="text-[9px] text-white/30 text-center uppercase font-black tracking-widest leading-relaxed">Paga en agentes autorizados con este código.</p>
                          </div>
                        )}

                        {paymentMethod === "gift" && (
                          <Input placeholder="INGRESA CÓDIGO" className="h-14 bg-white/5 border-white/10 rounded-xl text-xs text-center uppercase tracking-[0.5em] w-full" />
                        )}

                        <Button onClick={() => setRechargeStep("confirm")} className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl hover:scale-[1.02] transition-all">
                          Siguiente Paso
                        </Button>
                        <Button onClick={() => setRechargeStep("payment-method")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Volver</Button>
                      </div>
                    )}

                    {rechargeStep === "confirm" && (
                      <div className="w-full space-y-8 animate-in zoom-in-95 duration-500 flex flex-col items-center">
                        <div className="text-center space-y-2">
                           <div className="h-20 w-20 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto shadow-2xl">
                             <ShieldCheck size={40} />
                           </div>
                           <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">Confirmar <span className="text-primary">Pago</span></h3>
                           <p className="text-[9px] text-white/30 font-black uppercase tracking-widest italic">Protocolo de Encriptación Activo</p>
                        </div>

                        <div className="w-full p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
                           <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Señal</span>
                             <span className="text-sm font-black text-white italic tracking-tighter">{Number(amount).toLocaleString()} ESP</span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Método</span>
                             <span className="text-[10px] font-black text-primary uppercase italic tracking-widest">{paymentMethod?.toUpperCase()}</span>
                           </div>
                           <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                             <span className="text-[11px] font-black text-white uppercase tracking-widest">Total</span>
                             <span className="text-xl font-black text-primary italic tracking-tighter">${(Number(amount)/100).toFixed(2)} USD</span>
                           </div>
                        </div>

                        <Button 
                          onClick={executeTransaction} 
                          disabled={isProcessing}
                          className="w-full h-20 bg-primary text-black font-black uppercase italic tracking-[0.2em] rounded-[2rem] shadow-[0_0_50px_rgba(204,255,0,0.3)] active:scale-95 transition-all text-sm"
                        >
                          {isProcessing ? <Loader2 className="animate-spin" size={24} /> : "Confirmar Pago Neural"}
                        </Button>
                        <Button onClick={() => setRechargeStep("payment-details")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Corregir Datos</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </ScrollArea>
      </ProtocolWindow>

      {/* Bio-Inteligencia Perfil (Analíticas Globales) (390px) */}
      <ProtocolWindow 
        isOpen={isAnalyticsOpen} 
        onClose={() => setIsAnalyticsOpen(false)} 
        title="Bio-Inteligencia Perfil"
      >
        <ScrollArea className="w-full h-full">
          <div className="flex flex-col items-center w-full gap-8 pb-32 pt-6">
            <div className="w-full max-w-[390px] px-4 space-y-8 flex flex-col items-center animate-in fade-in duration-700 mx-auto">
               
               {/* Visualizaciones Alcanzadas */}
               <div className="w-full p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Visualizaciones Netas</span>
                    <TrendingUp size={14} className="text-primary" />
                  </div>
                  <h3 className="text-3xl font-black text-white italic tracking-tighter">248,592</h3>
                  <ChartContainer config={chartConfig} className="h-[120px] w-full">
                    <AreaChart data={MOCK_FINANCE_FLOW}>
                      <XAxis dataKey="name" hide />
                      <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      <Area type="monotone" dataKey="income" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} strokeWidth={2} />
                    </AreaChart>
                  </ChartContainer>
               </div>

               {/* Métricas Netas de Crecimiento */}
               <div className="w-full grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Seguidores Netos</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-black text-primary italic tracking-tighter">+1,240</p>
                      <Users size={14} className="text-primary/40" />
                    </div>
                    <div className="flex items-center gap-1 text-[7px] text-primary/60 font-bold uppercase tracking-widest">
                       <TrendingUp size={8} /> 12.5% de señal
                    </div>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Me Gusta Netos</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-black text-accent italic tracking-tighter">+8,420</p>
                      <Heart size={14} className="text-accent/40" />
                    </div>
                    <div className="flex items-center gap-1 text-[7px] text-accent/60 font-bold uppercase tracking-widest">
                       <TrendingUp size={8} /> 5.2% de resonancia
                    </div>
                  </div>
               </div>

               {/* Demografía: Localización y Edad */}
               <div className="w-full p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                  <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em] italic">Auditoría Demográfica</h4>
                  
                  {/* Localización */}
                  <div className="space-y-4">
                    <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Nodos de Origen</span>
                    {[
                      { label: "Latam North", val: 65, color: "bg-primary" },
                      { label: "Euro Node", val: 20, color: "bg-accent" },
                      { label: "Asia Signal", val: 15, color: "bg-white/20" }
                    ].map((loc) => (
                      <div key={loc.label} className="space-y-1.5">
                        <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                          <span className="text-white/40">{loc.label}</span>
                          <span className="text-white">{loc.val}%</span>
                        </div>
                        <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full", loc.color)} style={{ width: `${loc.val}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Rango de Edad */}
                  <div className="space-y-4">
                    <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Distribución de Ciclos</span>
                    <ChartContainer config={chartConfig} className="h-[100px] w-full">
                       <RechartsBarChart data={[
                         { age: '18-24', val: 40 },
                         { age: '25-34', val: 35 },
                         { age: '35-44', val: 15 },
                         { age: '45+', val: 10 }
                       ]}>
                         <XAxis dataKey="age" hide />
                         <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                         <Bar dataKey="val" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                       </RechartsBarChart>
                    </ChartContainer>
                  </div>
               </div>

               {/* Viralidad y Resonancia */}
               <div className="w-full grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <Clapperboard size={14} className="text-primary/60" />
                      <TrendingUp size={10} className="text-primary" />
                    </div>
                    <p className="text-lg font-black text-white italic tracking-tighter">Bio-Reel #42</p>
                    <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest italic">Video más viral de la red</p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <Activity size={14} className="text-accent/60" />
                      <TrendingUp size={10} className="text-accent" />
                    </div>
                    <p className="text-lg font-black text-white italic tracking-tighter">98.4%</p>
                    <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest italic">Nivel de Aceptación</p>
                  </div>
               </div>

               {/* Footer de Inteligencia */}
               <div className="w-full p-8 rounded-[2.5rem] bg-primary/[0.03] border border-primary/10 flex flex-col items-center text-center gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Sparkles size={24} />
                  </div>
                  <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                    Tu señal tiene una resonancia óptima con el ecosistema BioLive. El 98.4% de los nodos receptores han emitido una respuesta positiva.
                  </p>
               </div>

            </div>
          </div>
        </ScrollArea>
      </ProtocolWindow>
    </div>
  );
}
