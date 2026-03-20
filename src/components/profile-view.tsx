
"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Menu, Share2, Zap, Check, ChevronLeft,
  Wallet, BarChart3, Edit, ArrowUpRight, ArrowDownLeft, 
  Users, Loader2, Activity, PieChart as PieChartIcon,
  TrendingUp, TrendingDown, MapPin, Award, Heart, Eye,
  Target, BarChart, Key
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
 * Blindaje: Ancho estricto de 390px para centrado absoluto.
 * Se ha integrado bloqueo por clave (2025) para el acceso a la billetera.
 */

type RechargeStep = "gallery" | "confirm" | "payment";
type WalletTab = "main" | "buy" | "withdraw";

const MOCK_VIEWS_DATA = [
  { name: "Lun", views: 4000 },
  { name: "Mar", views: 3000 },
  { name: "Mie", views: 5000 },
  { name: "Jue", views: 2780 },
  { name: "Vie", views: 1890 },
  { name: "Sab", views: 2390 },
  { name: "Dom", views: 3490 },
];

const MOCK_AGE_DATA = [
  { age: "13-17", value: 15 },
  { age: "18-24", value: 45 },
  { age: "25-34", value: 25 },
  { age: "35+", value: 15 },
];

const chartConfig = {
  views: { label: "Visualizaciones", color: "hsl(var(--primary))" },
  value: { label: "Usuarios", color: "hsl(var(--primary))" },
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
  const [isWalletAuthenticated, setIsWalletAuthenticated] = useState(false);
  const [walletPassword, setWalletPassword] = useState("");
  const [walletView, setWalletView] = useState<WalletTab>("main");
  const [rechargeStep, setRechargeStep] = useState<RechargeStep>("gallery");
  const [isProcessing, setIsProcessing] = useState(false);
  const [amount, setAmount] = useState("");
  const [espBalance, setEspBalance] = useState(WalletService.getBalance());
  
  // Profile Stats State
  const [isProfileStatsOpen, setIsProfileStatsOpen] = useState(false);
  const [statsTimeframe, setStatsTimeframe] = useState("Semana");
  
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
        } else {
          newBalance = await WalletService.withdrawFunds(Number(amount));
        }
        setEspBalance(newBalance);
        setIsProcessing(false);
        setWalletView("main");
        setRechargeStep("gallery");
        setAmount("");
      } catch (e) {
        setIsProcessing(false);
        toast({ variant: "destructive", title: "Fallo Neural" });
      }
    }, 2000);
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

      {/* Bio-Analítica Avanzada */}
      <ProtocolWindow isOpen={isProfileStatsOpen} onClose={() => setIsProfileStatsOpen(false)} title="Bio-Inteligencia Analítica">
        <ScrollArea className="w-full max-w-[500px] h-full max-h-[85vh] px-0">
          <div className="flex flex-col items-center w-full space-y-8 pb-24 pt-6 overflow-x-hidden">
            
            {/* Cabecera Analítica */}
            <div className="w-full max-w-[390px] flex items-center justify-between px-4">
               <div className="space-y-1">
                 <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Bio<span className="text-primary">Signals</span></h3>
                 <p className="text-[8px] font-black uppercase text-white/20 tracking-widest">Auditoría de Alcance Neural</p>
               </div>
               <Select value={statsTimeframe} onValueChange={setStatsTimeframe}>
                 <SelectTrigger className="h-9 w-24 bg-white/5 border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest">
                   {statsTimeframe}
                 </SelectTrigger>
                 <SelectContent className="bg-[#050906] border-white/10 text-white">
                   {["Día", "Semana", "Mes", "Año"].map(t => (
                     <SelectItem key={t} value={t} className="text-[10px] font-black uppercase tracking-widest">{t}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
            
            {/* Visualizaciones Alcanzadas */}
            <div className="w-full max-w-[390px] px-4">
              <div className="p-6 rounded-[2.5rem] bg-white/[0.02] border border-white/5 w-full relative overflow-hidden group">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Eye size={18} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Alcance Total</span>
                      <p className="text-xl font-black text-white italic tracking-tighter">248,592 <span className="text-[10px] text-primary">VIEWS</span></p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[8px] font-black text-primary uppercase tracking-widest">+12.4%</span>
                    <TrendingUp size={14} className="text-primary" />
                  </div>
                </div>
                <ChartContainer config={chartConfig} className="h-[180px] w-full">
                  <AreaChart data={MOCK_VIEWS_DATA}>
                    <XAxis dataKey="name" hide />
                    <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary))" 
                      fillOpacity={0.15} 
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ChartContainer>
              </div>
            </div>

            {/* Crecimiento Neto */}
            <div className="w-full max-w-[390px] px-4 grid grid-cols-2 gap-4">
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                   <Users size={16} className="text-primary/60" />
                   <div className="flex items-center gap-1 text-[8px] font-black text-primary uppercase tracking-widest">
                     <TrendingUp size={10} /> +1.2K
                   </div>
                 </div>
                 <div className="space-y-1">
                   <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Seguidores Netos</span>
                   <p className="text-lg font-black text-white italic tracking-tighter">12,402</p>
                 </div>
              </div>
              <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                 <div className="flex items-center justify-between">
                   <Heart size={16} className="text-accent/60" />
                   <div className="flex items-center gap-1 text-[8px] font-black text-accent uppercase tracking-widest">
                     <TrendingUp size={10} /> +4.8K
                   </div>
                 </div>
                 <div className="space-y-1">
                   <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Me Gusta Netos</span>
                   <p className="text-lg font-black text-white italic tracking-tighter">48,910</p>
                 </div>
              </div>
            </div>

            {/* Localización y Edad */}
            <div className="w-full max-w-[390px] px-4 space-y-4">
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                {/* Localización */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <MapPin size={16} className="text-primary" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Localización de Nodos</h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      { city: "Buenos Aires, AR", val: 42, color: "bg-primary" },
                      { city: "Madrid, ES", val: 28, color: "bg-primary/60" },
                      { city: "Mexico City, MX", val: 18, color: "bg-primary/30" },
                      { city: "Otros", val: 12, color: "bg-white/10" }
                    ].map(loc => (
                      <div key={loc.city} className="space-y-2">
                        <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest">
                          <span className="text-white/60">{loc.city}</span>
                          <span className="text-white">{loc.val}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-1000", loc.color)} style={{ width: `${loc.val}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full bg-white/5" />

                {/* Rango de Edad */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Target size={16} className="text-accent" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Distribución de Edad</h4>
                  </div>
                  <div className="h-[120px] w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <RechartsBarChart data={MOCK_AGE_DATA}>
                        <XAxis dataKey="age" hide />
                        <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                          {MOCK_AGE_DATA.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`rgba(204, 255, 0, ${0.2 + (index * 0.2)})`} />
                          ))}
                        </Bar>
                        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                      </RechartsBarChart>
                    </ChartContainer>
                    <div className="flex justify-between mt-4 px-2">
                      {MOCK_AGE_DATA.map(d => (
                        <span key={d.age} className="text-[8px] font-black uppercase text-white/30 tracking-widest">{d.age}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Videos Virales + Aceptación */}
            <div className="w-full max-w-[390px] px-4 space-y-4">
              <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award size={18} className="text-primary" />
                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Videos Virales</h4>
                  </div>
                  <span className="text-[8px] font-black text-primary uppercase tracking-widest">Top 3</span>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                       <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 overflow-hidden relative shrink-0">
                          <Image src={`https://picsum.photos/seed/viral${i}/200/200`} fill alt="Viral" className="object-cover grayscale group-hover:grayscale-0 transition-all" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h5 className="text-[10px] font-black text-white uppercase italic truncate">Protocolo de Síntesis Bio-#{i}</h5>
                          <div className="flex items-center gap-3 mt-1 text-[8px] font-black uppercase tracking-widest text-primary/40">
                             <span className="flex items-center gap-1"><Eye size={10} /> {(Math.random() * 100 + 50).toFixed(1)}K</span>
                             <span className="flex items-center gap-1"><Heart size={10} /> {(Math.random() * 10 + 2).toFixed(1)}K</span>
                          </div>
                       </div>
                       <ArrowUpRight size={14} className="text-white/10 group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-[2.5rem] bg-primary text-black space-y-4 shadow-[0_0_50px_rgba(204,255,0,0.3)]">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.3em] italic">Bio-Aceptación</h4>
                  <Activity size={16} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-4xl font-black italic tracking-tighter">98.4%</p>
                    <span className="text-[8px] font-black uppercase tracking-widest">Nivel Óptimo</span>
                  </div>
                  <Progress value={98.4} className="h-2 bg-black/10 border-none" />
                </div>
                <p className="text-[8px] font-bold uppercase leading-relaxed opacity-60">
                  Tu señal resuena positivamente en el 98% de los nodos receptores. Protocolo de influencia activo.
                </p>
              </div>
            </div>

          </div>
        </ScrollArea>
      </ProtocolWindow>

      {/* Wallet Protocol Window */}
      <ProtocolWindow 
        isOpen={isWalletOpen} 
        onClose={() => { setIsWalletOpen(false); setIsWalletAuthenticated(false); }} 
        title="Billetera ESP"
      >
        <ScrollArea className="w-full max-w-[500px] h-full max-h-[85vh] overflow-x-hidden">
          <div className="flex flex-col items-center justify-start w-full gap-8 pb-24 pt-6 overflow-x-hidden">
            
            {/* Bloqueo por Clave Neural */}
            {!isWalletAuthenticated ? (
              <div className="w-full max-w-[390px] px-6 py-12 flex flex-col items-center gap-8 animate-in fade-in duration-500">
                <div className="h-20 w-20 bg-primary/10 rounded-[2.5rem] border border-primary/20 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(204,255,0,0.2)]">
                  <Key size={32} />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl text-white font-black italic uppercase tracking-tighter">Acceso Blindado</h3>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest leading-relaxed">Inyecta la clave neural para auditar tus activos.</p>
                </div>
                <Input 
                  type="password" 
                  placeholder="****" 
                  value={walletPassword}
                  onChange={(e) => setWalletPassword(e.target.value)}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl text-center text-2xl tracking-[1em] text-primary focus-visible:ring-primary w-full" 
                />
                <Button 
                  onClick={handleWalletAuth}
                  className="w-full h-14 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-[0_0_20px_rgba(204,255,0,0.3)]"
                >
                  Validar Protocolo
                </Button>
                <p className="text-[8px] text-white/20 font-bold uppercase tracking-widest">Tip: 2025</p>
              </div>
            ) : (
              <>
                {/* Balance Card */}
                {walletView === "main" && (
                  <div className="w-full flex flex-col items-center px-4 animate-in fade-in duration-500">
                    <div className="w-full max-w-[390px] p-8 rounded-[2.5rem] bg-primary text-black shadow-[0_0_50px_rgba(204,255,0,0.4)] relative overflow-hidden">
                      <div className="relative z-10">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">Balance Gaia Activo</span>
                        <div className="text-4xl font-black italic mt-1 tracking-tighter truncate">
                          {espBalance.toLocaleString()} <span className="text-sm">ESP</span>
                        </div>
                        <div className="mt-8 flex gap-3">
                          <button 
                            onClick={() => { setWalletView("buy"); setRechargeStep("gallery"); }} 
                            className="flex-1 bg-black text-white rounded-2xl h-14 text-[9px] font-black uppercase tracking-widest flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-xl"
                          >
                            <ArrowDownLeft className="mr-2" size={14} /> Recargar
                          </button>
                          <button 
                            onClick={() => { setWalletView("withdraw"); setAmount(""); }} 
                            className="flex-1 bg-black/10 text-black border border-black/20 rounded-2xl h-14 text-[9px] font-black uppercase tracking-widest flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                          >
                            <ArrowUpRight className="mr-2" size={14} /> Retirar
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Buy View */}
                {walletView === "buy" && (
                  <div className="w-full flex flex-col items-center px-4 animate-in slide-in-from-right duration-500">
                    <div className="w-full max-w-[390px] space-y-6">
                      <button onClick={() => setWalletView("main")} className="flex items-center gap-2 text-white/30 hover:text-primary transition-all mb-4">
                        <ChevronLeft size={16} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Volver</span>
                      </button>
                      
                      {rechargeStep === "gallery" && (
                        <div className="grid grid-cols-2 gap-4 w-full">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <button 
                              key={i}
                              onClick={() => { setAmount(((i + 1) * 1000).toString()); setRechargeStep("confirm"); }}
                              className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/5 hover:border-primary/40 transition-all text-center group active:scale-95 shadow-xl"
                            >
                              <Zap size={24} className="text-primary/40 group-hover:text-primary mx-auto mb-4 transition-colors" />
                              <p className="text-2xl font-black text-white italic truncate leading-none">{((i + 1) * 1000).toLocaleString()}</p>
                              <p className="text-[8px] text-primary/60 font-black uppercase tracking-widest mt-3">+15% regalo</p>
                            </button>
                          ))}
                        </div>
                      )}
                      {rechargeStep === "confirm" && (
                        <div className="w-full space-y-8 animate-in zoom-in-95 duration-300">
                          <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 text-center w-full">
                             <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] italic block mb-3">Monto Seleccionado</span>
                             <div className="text-5xl font-black text-white italic tracking-tighter truncate">{Number(amount).toLocaleString()} ESP</div>
                          </div>
                          <button 
                            onClick={executeTransaction} 
                            disabled={isProcessing}
                            className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                          >
                            {isProcessing ? <Loader2 className="animate-spin" size={20} /> : "Confirmar Recarga"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Withdraw View */}
                {walletView === "withdraw" && (
                  <div className="w-full flex flex-col items-center px-4 animate-in slide-in-from-right duration-500">
                    <div className="w-full max-w-[390px] space-y-6">
                      <button onClick={() => setWalletView("main")} className="flex items-center gap-2 text-white/30 hover:text-primary transition-all mb-4">
                        <ChevronLeft size={16} />
                        <span className="text-[9px] font-black uppercase tracking-widest">Volver</span>
                      </button>

                      <div className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 text-center w-full">
                         <label className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 italic block mb-4">Cantidad a Retirar</label>
                         <Input 
                          type="number" 
                          value={amount} 
                          onChange={(e) => setAmount(e.target.value)} 
                          className="h-20 bg-transparent border-none text-center text-5xl font-black text-white focus-visible:ring-0 placeholder:text-white/5"
                          placeholder="0"
                         />
                      </div>
                      <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/20 w-full text-center">
                         <p className="text-[9px] font-bold text-red-500/80 uppercase leading-relaxed italic">
                           AVISO: Solo se procesarán retiros al titular de la cuenta sincronizada con el Nodo Central.
                         </p>
                      </div>
                      <button 
                        onClick={executeTransaction} 
                        disabled={isProcessing}
                        className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                      >
                        {isProcessing ? <Loader2 className="animate-spin" size={20} /> : "Confirmar Retiro"}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </ScrollArea>
      </ProtocolWindow>
    </div>
  );
}
