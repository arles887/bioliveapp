
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
  Send, DollarSign, Sparkles, Building2, Landmark, HeartHandshake, Receipt
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
 * Flujo de Retiro Estandarizado: Conversión a Soles, Multicanal y Voucher.
 */

type WalletTab = "main" | "buy" | "withdraw";
type RechargeStep = "packages" | "payment-method" | "payment-details" | "confirm";
type WithdrawStep = "input" | "method" | "details" | "confirm" | "success";
type PaymentMethod = "card" | "yape" | "paypal" | "cash" | "gift";
type WithdrawMethod = "transfer" | "yape" | "paypal" | "gift" | "donate";

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
  const [profileName, setProfileName] = useState(username);
  
  // Ventanas
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isWalletAuthenticated, setIsWalletAuthenticated] = useState(false);
  const [walletPassword, setWalletPassword] = useState("");
  
  // Wallet States
  const [walletView, setWalletView] = useState<WalletTab>("main");
  const [rechargeStep, setRechargeStep] = useState<RechargeStep>("packages");
  const [withdrawStep, setWithdrawStep] = useState<WithdrawStep>("input");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [withdrawMethod, setWithdrawMethod] = useState<WithdrawMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
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
        setEspBalance(newBalance);
        setIsProcessing(false);
        setWalletView("main");
        setRechargeStep("packages");
        setPaymentMethod(null);
        setAmount("");
        toast({ title: "Protocolo Completado", description: "Inyección de tokens exitosa." });
      } else {
        newBalance = await WalletService.withdrawFunds(Number(amount));
        setEspBalance(newBalance);
        setIsProcessing(false);
        setWithdrawStep("success");
      }
    }, 2000);
  };

  const conversionRate = 0.01; // 100 ESP = 1 S/.
  const solAmount = Number(amount) * conversionRate;

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
        onClose={() => { setIsWalletOpen(false); setIsWalletAuthenticated(false); setWalletView("main"); setRechargeStep("packages"); setWithdrawStep("input"); }} 
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
                          {PREDEFINED_PACKAGES.map((pkg) => (
                            <button 
                              key={pkg.id} 
                              onClick={() => { setAmount(pkg.amount.toString()); setRechargeStep("payment-method"); }}
                              className="relative p-5 pt-7 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-primary/40 transition-all text-center group active:scale-95 overflow-hidden flex flex-col items-center"
                            >
                              {pkg.isPromo && <div className="absolute top-0 right-0 bg-primary text-black text-[6px] font-black px-2 py-0.5 rounded-bl-lg uppercase">Promo</div>}
                              {pkg.hasBonus && <div className="absolute top-0 left-0 bg-accent text-black text-[6px] font-black px-2 py-0.5 rounded-br-lg uppercase">+Bonus</div>}
                              <Zap size={14} className="text-primary/40 mb-2 group-hover:scale-125 transition-transform" />
                              <div className="text-lg font-black text-white italic leading-none">{pkg.amount.toLocaleString()}</div>
                              <div className="mt-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10 shadow-inner">
                                <span className="text-[9px] font-black text-primary uppercase tracking-widest">S/. {pkg.price}</span>
                              </div>
                            </button>
                          ))}
                          <div className="p-5 rounded-[2rem] bg-primary/5 border border-primary/20 flex flex-col items-center gap-4 group transition-all">
                            <div className="flex items-center gap-2">
                               <Edit size={12} className="text-primary" />
                               <span className="text-[8px] font-black uppercase text-primary/60 tracking-widest">Manual</span>
                            </div>
                            <div className="relative w-full">
                              <Input 
                                type="number" 
                                placeholder="CANTIDAD" 
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                className="h-10 bg-transparent border-b border-primary/30 rounded-none text-center text-sm text-white focus-visible:ring-0 focus-visible:border-primary"
                              />
                            </div>
                            {customAmount && (
                              <div className="px-3 py-1.5 rounded-xl bg-primary/20 border border-primary/30">
                                <p className="text-[9px] font-black text-white italic">Costo: <span className="text-primary">S/. {(Number(customAmount) * 0.01).toFixed(2)}</span></p>
                              </div>
                            )}
                            <Button onClick={() => { setAmount(customAmount); setRechargeStep("payment-method"); }} className="w-full h-10 rounded-xl bg-primary text-black text-[9px] font-black uppercase tracking-widest shadow-lg">Continuar</Button>
                          </div>
                        </div>
                        <Button onClick={() => { setWalletView("main"); setAmount(""); }} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Volver</Button>
                      </div>
                    )}
                    {/* Flujos de pago siguen estandarizados... */}
                  </div>
                )}

                {walletView === "withdraw" && (
                  <div className="w-full space-y-6 animate-in slide-in-from-right duration-500 flex flex-col items-center">
                    {withdrawStep === "input" && (
                      <div className="w-full space-y-8">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Retirar <span className="text-primary">Activos</span></h3>
                          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Saldo Disponible: {espBalance.toLocaleString()} ESP</p>
                        </div>
                        <div className="space-y-4">
                          <div className="relative">
                            <Zap size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" />
                            <Input 
                              type="number" 
                              placeholder="CANTIDAD DE TOKENS" 
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="h-14 bg-white/5 border-white/10 rounded-xl px-12 text-white font-black italic" 
                            />
                          </div>
                          {amount && (
                            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center space-y-1">
                              <p className="text-[10px] font-black uppercase text-primary/60 tracking-widest">Conversión Automática</p>
                              <p className="text-3xl font-black text-white italic tracking-tighter">S/. {solAmount.toFixed(2)}</p>
                            </div>
                          )}
                        </div>
                        <Button 
                          disabled={!amount || Number(amount) <= 0 || Number(amount) > espBalance}
                          onClick={() => setWithdrawStep("method")} 
                          className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl"
                        >
                          Siguiente Paso
                        </Button>
                        <Button onClick={() => setWalletView("main")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Cancelar</Button>
                      </div>
                    )}

                    {withdrawStep === "method" && (
                      <div className="w-full space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Nodo de <span className="text-primary">Liquidación</span></h3>
                          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Selecciona el método de retiro</p>
                        </div>
                        <div className="space-y-3">
                          {[
                            { id: "transfer", label: "Transferencia Bancaria", icon: Landmark },
                            { id: "yape", label: "Yape", icon: Smartphone },
                            { id: "paypal", label: "PayPal", icon: Send },
                            { id: "gift", label: "Código de Regalo", icon: Ticket },
                            { id: "donate", label: "Donación Gaia", icon: HeartHandshake }
                          ].map((method) => (
                            <button 
                              key={method.id}
                              onClick={() => { setWithdrawMethod(method.id as WithdrawMethod); setWithdrawStep("details"); }}
                              className="w-full flex items-center justify-between p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 hover:border-primary/40 transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                                  <method.icon size={20} />
                                </div>
                                <span className="text-xs font-black uppercase text-white/80 tracking-tight">{method.label}</span>
                              </div>
                              <ArrowUpRight className="text-white/20" size={16} />
                            </button>
                          ))}
                        </div>
                        <div className="p-4 rounded-xl bg-white/[0.02] border border-dashed border-white/10 flex items-center gap-3">
                           <ShieldCheck size={14} className="text-primary/40 shrink-0" />
                           <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">Nota: Los pagos se realizarán únicamente al titular de la cuenta.</p>
                        </div>
                        <Button onClick={() => setWithdrawStep("input")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Volver</Button>
                      </div>
                    )}

                    {withdrawStep === "details" && (
                      <div className="w-full space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Detalles del <span className="text-primary">Nodo</span></h3>
                          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Ingresa los datos para la liquidación</p>
                        </div>
                        <div className="space-y-3">
                          {withdrawMethod === 'transfer' && (
                            <>
                              <Input placeholder="BANCO RECEPTOR" className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-xs uppercase" />
                              <Input placeholder="NÚMERO DE CUENTA / CCI" className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-xs tracking-widest" />
                            </>
                          )}
                          {(withdrawMethod === 'yape' || withdrawMethod === 'paypal') && (
                            <Input placeholder={withdrawMethod === 'yape' ? "NÚMERO DE TELÉFONO" : "CORREO PAYPAL"} className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-xs" />
                          )}
                          {withdrawMethod === 'donate' && (
                            <div className="p-6 text-center bg-primary/5 border border-primary/20 rounded-2xl">
                               <HeartHandshake className="mx-auto text-primary mb-2" size={32} />
                               <p className="text-[9px] font-black uppercase text-primary tracking-widest">Donación Directa a la Red Gaia</p>
                            </div>
                          )}
                        </div>
                        <Button onClick={() => setWithdrawStep("confirm")} className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl">Continuar</Button>
                        <Button onClick={() => setWithdrawStep("method")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Volver</Button>
                      </div>
                    )}

                    {withdrawStep === "confirm" && (
                      <div className="w-full space-y-8 flex flex-col items-center">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Confirmar <span className="text-primary">Retiro</span></h3>
                          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Verifica los datos finales</p>
                        </div>
                        <div className="w-full p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
                           <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Monto ESP</span>
                             <span className="text-sm font-black text-white italic">{amount}</span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Método</span>
                             <span className="text-[10px] font-black text-primary uppercase italic">{withdrawMethod?.toUpperCase()}</span>
                           </div>
                           <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                             <span className="text-[11px] font-black text-white uppercase tracking-widest">Total a recibir</span>
                             <span className="text-xl font-black text-primary italic">S/. {solAmount.toFixed(2)}</span>
                           </div>
                        </div>
                        <Button 
                          onClick={executeTransaction}
                          disabled={isProcessing}
                          className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl"
                        >
                          {isProcessing ? <Loader2 className="animate-spin" /> : "Confirmar Retiro Neural"}
                        </Button>
                        <Button onClick={() => setWithdrawStep("details")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Corregir</Button>
                      </div>
                    )}

                    {withdrawStep === "success" && (
                      <div className="w-full space-y-8 animate-in zoom-in-95 duration-500 flex flex-col items-center">
                        <div className="h-24 w-24 rounded-[3rem] bg-primary text-black flex items-center justify-center shadow-[0_0_50px_rgba(204,255,0,0.4)]">
                          <Check size={48} strokeWidth={3} />
                        </div>
                        <div className="text-center space-y-2">
                           <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">¡Felicitaciones!</h3>
                           <p className="text-[9px] text-white/30 font-black uppercase tracking-[0.4em]">Señal Procesada con Éxito</p>
                        </div>
                        
                        {/* Voucher de Retiro */}
                        <div className="w-full p-8 rounded-[2.5rem] bg-white text-black space-y-6 relative overflow-hidden">
                           <div className="absolute top-0 right-0 p-4 opacity-10">
                             <Receipt size={100} />
                           </div>
                           <div className="flex justify-between items-start">
                             <div>
                               <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Voucher de Retiro</p>
                               <p className="text-[8px] font-bold text-black/20 uppercase">Gaia OS #7492-B</p>
                             </div>
                             <div className="h-10 w-10 bg-black rounded-xl flex items-center justify-center text-primary">
                               <Zap size={20} />
                             </div>
                           </div>
                           <div className="space-y-4 pt-4 border-t border-black/5">
                             <div className="flex justify-between">
                               <span className="text-[9px] font-black uppercase text-black/40">Monto Liquidado</span>
                               <span className="text-lg font-black italic">S/. {solAmount.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-[9px] font-black uppercase text-black/40">Tokens Debatidos</span>
                               <span className="text-xs font-black">{amount} ESP</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-[9px] font-black uppercase text-black/40">ID de Transacción</span>
                               <span className="text-[9px] font-black font-mono tracking-tighter">TXN-{Date.now().toString().slice(-6)}</span>
                             </div>
                           </div>
                           <p className="text-[7px] font-black text-center text-black/20 uppercase tracking-[0.3em] pt-4">Sincronización Neural Completada</p>
                        </div>

                        <Button onClick={() => { setWalletView("main"); setWithdrawStep("input"); setAmount(""); }} className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl">
                          Volver al Centro de Mando
                        </Button>
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

               <div className="w-full grid grid-cols-2 gap-4">
                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Seguidores Netos</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-black text-primary italic tracking-tighter">+1,240</p>
                      <Users size={14} className="text-primary/40" />
                    </div>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Me Gusta Netos</p>
                    <div className="flex items-center justify-between">
                      <p className="text-xl font-black text-accent italic tracking-tighter">+8,420</p>
                      <Heart size={14} className="text-accent/40" />
                    </div>
                  </div>
               </div>

               <div className="w-full p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                  <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em] italic">Auditoría Demográfica</h4>
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
            </div>
          </div>
        </ScrollArea>
      </ProtocolWindow>
    </div>
  );
}

