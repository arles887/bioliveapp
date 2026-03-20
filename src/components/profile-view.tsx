
"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Menu, Share2, Zap, Check, ChevronLeft,
  Wallet, BarChart3, Edit, ArrowUpRight, ArrowDownLeft, 
  Users, Loader2, Activity,
  TrendingUp, MapPin, Award, Heart, Eye,
  BarChart, Key, Clapperboard, Radio, Gift,
  CreditCard, Smartphone, QrCode, Ticket, ShieldCheck,
  Send, Building2, Landmark, HeartHandshake, Receipt, Camera,
  CheckCircle2, Sparkles, Flag, Ban, MessageSquare, UserPlus,
  Settings, Shield, Clock, Info, HelpCircle, Bell, ChevronRight,
  Globe, Lock, Mail, Trash2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { toast } from "@/hooks/use-toast";
import { ProtocolWindow } from "@/components/protocol-window";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { WalletService } from "@/services/wallet-service";
import { 
  Area, 
  AreaChart, 
  XAxis,
  Bar,
  BarChart as RechartsBarChart,
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";

/**
 * @fileOverview Vista de Perfil Bio-Neural Avanzada.
 * Implementa Billetera, Analítica, Edición y ahora el Centro de Control Gaia (Menú de 3 líneas).
 */

type WalletTab = "main" | "buy" | "withdraw";
type RechargeStep = "packages" | "payment-method" | "payment-details" | "confirm" | "success";
type WithdrawStep = "input" | "method" | "details" | "confirm" | "success";
type PaymentMethod = "card" | "yape" | "paypal" | "cash" | "gift";
type WithdrawMethod = "transfer" | "yape" | "paypal" | "gift" | "donate";
type SettingsSection = "main" | "ajustes" | "privacidad" | "actividad" | "info" | "ayuda";

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
  const [bio, setBio] = useState("Sincronizado con la red Gaia. Explorador de biomas digitales.");
  const [isFollowing, setIsFollowing] = useState(false);
  
  // Ventanas
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
  
  // Settings State
  const [activeSettingsSection, setActiveSettingsSection] = useState<SettingsSection>("main");

  const [avatarUrl, setAvatarUrl] = useState(PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl || "");

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
        setRechargeStep("success");
        toast({ title: "Protocolo Completado", description: "Inyección de tokens exitosa." });
      } else {
        newBalance = await WalletService.withdrawFunds(Number(amount));
        setEspBalance(newBalance);
        setIsProcessing(false);
        setWithdrawStep("success");
      }
    }, 2000);
  };

  const handleSaveProfile = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsEditProfileOpen(false);
      toast({ title: "Perfil Actualizado", description: "Los cambios han sido inyectados en la red." });
    }, 1500);
  };

  const solAmount = Number(amount) * 0.01;

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
           {!isOwnProfile ? (
             <>
               <button 
                onClick={() => toast({ title: "Reporte Enviado", description: "El equipo de Gaia revisará esta señal." })}
                className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-red-500 active:scale-90"
               >
                  <Flag size={18} />
               </button>
               <button 
                onClick={() => toast({ title: "Bloqueo Activo", description: "Señal de este nodo neutralizada." })}
                className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-red-500 active:scale-90"
               >
                  <Ban size={18} />
               </button>
             </>
           ) : (
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
               <button 
                onClick={() => { setIsSettingsOpen(true); setActiveSettingsSection("main"); }}
                className="h-10 w-10 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/60 hover:text-primary active:scale-90"
               >
                 <Menu size={18} />
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
          <p className="text-[10px] text-white/60 font-medium leading-relaxed mt-2 line-clamp-2 max-w-[300px]">{bio}</p>
        </div>

        {isOwnProfile ? (
          <Button 
            onClick={() => setIsEditProfileOpen(true)}
            variant="outline"
            className="w-full h-12 rounded-2xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:text-primary transition-all"
          >
            Editar Perfil
          </Button>
        ) : (
          <div className="flex gap-3 w-full max-w-[390px] mx-auto">
            <Button 
              onClick={() => setIsFollowing(!isFollowing)}
              className={cn(
                "flex-1 h-12 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all",
                isFollowing ? "bg-white/10 text-white/40 border border-white/10" : "bg-primary text-black shadow-lg shadow-primary/20"
              )}
            >
              {isFollowing ? <><Check size={14} className="mr-2" /> Siguiendo</> : <><UserPlus size={14} className="mr-2" /> Seguir</>}
            </Button>
            <Button 
              onClick={() => toast({ title: "Bio-Chat", description: "Iniciando canal neural seguro..." })}
              variant="outline"
              className="flex-1 h-12 rounded-2xl border-white/10 bg-white/5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 hover:text-primary transition-all"
            >
              <MessageSquare size={14} className="mr-2" /> Mensaje
            </Button>
          </div>
        )}

        <div className="flex gap-4 py-4 border-y border-white/5 overflow-x-auto no-scrollbar">
          {[
            { label: "Seguidores", value: isOwnProfile ? "12.4K" : "4.2K" },
            { label: "Siguiendo", value: isOwnProfile ? "842" : "120" },
            { label: "Me Gusta", value: isOwnProfile ? "84.2K" : "1.2K" }
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

      {/* Modal Editar Perfil */}
      <ProtocolWindow 
        isOpen={isEditProfileOpen} 
        onClose={() => setIsEditProfileOpen(false)} 
        title="Modificar Nodo Perfil"
      >
        <div className="w-full max-w-[390px] px-6 space-y-8 flex flex-col items-center animate-in fade-in duration-500 mx-auto pb-32">
          <div className="relative group cursor-pointer" onClick={() => toast({ title: "Protocolo de Cámara", description: "Selecciona una nueva imagen de bioma." })}>
             <div className="h-32 w-32 rounded-[2.5rem] overflow-hidden border-4 border-primary/20 bg-white/5 relative">
               <Image src={avatarUrl} fill alt="Edit Avatar" className="object-cover group-hover:opacity-40 transition-opacity" />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={32} className="text-primary" />
               </div>
             </div>
             <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-primary text-black flex items-center justify-center shadow-lg">
                <Edit size={16} />
             </div>
          </div>

          <div className="w-full space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-3">Identidad Bio-Neural</label>
              <Input 
                value={profileName} 
                onChange={(e) => setProfileName(e.target.value)} 
                placeholder="NOMBRE_BIO" 
                className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-black italic px-6 focus-visible:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black uppercase tracking-widest text-primary/60 ml-3">Descripción de Señal</label>
              <Textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Escribe tu misión en la red Gaia..." 
                className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl text-white px-6 py-4 resize-none focus-visible:ring-primary"
              />
            </div>
          </div>

          <Button 
            onClick={handleSaveProfile}
            disabled={isProcessing}
            className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl active:scale-95 transition-all"
          >
            {isProcessing ? <Loader2 className="animate-spin" /> : "Sincronizar Cambios"}
          </Button>
        </div>
      </ProtocolWindow>

      {/* Centro de Control Gaia (Menú 3 líneas) */}
      <ProtocolWindow 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        title="Centro de Control Gaia"
      >
        <ScrollArea className="w-full h-full">
          <div className="flex flex-col items-center w-full gap-8 pb-32 pt-6">
            <div className="w-full max-w-[390px] px-4 space-y-6 animate-in fade-in duration-500 mx-auto">
              
              {activeSettingsSection === "main" && (
                <div className="space-y-3">
                  <div className="text-center mb-8">
                    <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Nodo de <span className="text-primary">Configuración</span></h3>
                    <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Gestión de la Identidad Neural</p>
                  </div>
                  
                  {[
                    { id: "ajustes", label: "Ajustes", icon: Settings, desc: "Notificaciones y Preferencias" },
                    { id: "privacidad", label: "Privacidad", icon: Shield, desc: "Seguridad y Bloqueos" },
                    { id: "actividad", label: "Centro de Actividad", icon: Clock, desc: "Historial de Señales" },
                    { id: "info", label: "Información", icon: Info, desc: "Protocolos y Versión" },
                    { id: "ayuda", label: "Ayuda", icon: HelpCircle, desc: "Soporte Técnico Gaia" }
                  ].map((item) => (
                    <button 
                      key={item.id}
                      onClick={() => setActiveSettingsSection(item.id as SettingsSection)}
                      className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-primary/40 transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-black transition-all">
                          <item.icon size={20} />
                        </div>
                        <div className="text-left">
                          <span className="text-xs font-black uppercase text-white/80 tracking-tight block">{item.label}</span>
                          <span className="text-[8px] text-white/20 font-bold uppercase tracking-widest">{item.desc}</span>
                        </div>
                      </div>
                      <ChevronRight className="text-white/20" size={16} />
                    </button>
                  ))}
                  
                  <div className="pt-8">
                    <Button 
                      onClick={() => {
                        toast({ title: "Cerrando Sesión", description: "Protocolo de desconexión iniciado." });
                        setIsSettingsOpen(false);
                      }}
                      variant="destructive"
                      className="w-full h-14 rounded-2xl text-[10px] font-black uppercase tracking-widest italic"
                    >
                      Finalizar Sincronización
                    </Button>
                  </div>
                </div>
              )}

              {activeSettingsSection === "ajustes" && (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <button onClick={() => setActiveSettingsSection("main")} className="flex items-center gap-2 text-primary hover:text-white transition-colors">
                    <ChevronLeft size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Volver</span>
                  </button>
                  <div className="space-y-6">
                    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Bell size={18} className="text-primary" />
                          <span className="text-[11px] font-black text-white uppercase italic">Notificaciones Neurales</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Globe size={18} className="text-accent" />
                          <span className="text-[11px] font-black text-white uppercase italic">Traducción Automática</span>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4">
                       <span className="text-[9px] font-black uppercase tracking-widest text-white/30">Idioma de la Red</span>
                       <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 text-xs font-black uppercase tracking-widest">Español (Bio-Latam)</Button>
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsSection === "privacidad" && (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <button onClick={() => setActiveSettingsSection("main")} className="flex items-center gap-2 text-primary hover:text-white transition-colors">
                    <ChevronLeft size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Volver</span>
                  </button>
                  <div className="space-y-4">
                    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Lock size={18} className="text-primary" />
                          <span className="text-[11px] font-black text-white uppercase italic">Perfil Privado</span>
                        </div>
                        <Switch />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-accent" />
                          <span className="text-[11px] font-black text-white uppercase italic">Mensajes Directos</span>
                        </div>
                        <Switch defaultChecked />
                      </div>
                    </div>
                    <button className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 text-destructive">
                      <div className="flex items-center gap-3">
                        <Ban size={18} />
                        <span className="text-[11px] font-black uppercase italic">Usuarios Bloqueados</span>
                      </div>
                      <span className="text-xs font-black italic">12</span>
                    </button>
                    <button className="w-full p-6 rounded-[2rem] bg-red-500/10 border border-red-500/20 text-red-500 flex items-center gap-3">
                      <Trash2 size={18} />
                      <span className="text-[11px] font-black uppercase italic">Eliminar Nodo de Identidad</span>
                    </button>
                  </div>
                </div>
              )}

              {activeSettingsSection === "actividad" && (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <button onClick={() => setActiveSettingsSection("main")} className="flex items-center gap-2 text-primary hover:text-white transition-colors">
                    <ChevronLeft size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Volver</span>
                  </button>
                  <div className="space-y-3">
                    {[
                      { icon: Heart, label: "Interacciones de Likes", val: "1.2K", color: "text-red-500" },
                      { icon: MessageSquare, label: "Comentarios Enviados", val: "248", color: "text-blue-500" },
                      { icon: Radio, label: "Streams Realizados", val: "14", color: "text-primary" },
                      { icon: Clapperboard, label: "Bio-Reels Inyectados", val: "42", color: "text-accent" }
                    ].map((act, i) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5">
                        <div className="flex items-center gap-4">
                           <act.icon size={16} className={act.color} />
                           <span className="text-[11px] font-black text-white uppercase italic">{act.label}</span>
                        </div>
                        <span className="text-xs font-black text-white/40 italic">{act.val}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSettingsSection === "info" && (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <button onClick={() => setActiveSettingsSection("main")} className="flex items-center gap-2 text-primary hover:text-white transition-colors">
                    <ChevronLeft size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Volver</span>
                  </button>
                  <div className="space-y-4">
                    <div className="p-8 rounded-[2.5rem] bg-primary/5 border border-primary/20 flex flex-col items-center gap-4 text-center">
                       <Zap size={32} className="text-primary animate-pulse" />
                       <div>
                         <h4 className="text-lg font-black italic text-white uppercase tracking-tighter">Gaia <span className="text-primary">OS</span></h4>
                         <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">Firmware v.2.5.9</p>
                       </div>
                    </div>
                    <div className="space-y-2">
                       {["Términos de la Red", "Política de Privacidad Neural", "Guías de Comunidad Gaia", "Copyright Bio-Cyber"].map((t) => (
                         <button key={t} className="w-full flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-primary transition-all">
                           {t}
                           <ArrowUpRight size={14} />
                         </button>
                       ))}
                    </div>
                  </div>
                </div>
              )}

              {activeSettingsSection === "ayuda" && (
                <div className="space-y-8 animate-in slide-in-from-right duration-500">
                  <button onClick={() => setActiveSettingsSection("main")} className="flex items-center gap-2 text-primary hover:text-white transition-colors">
                    <ChevronLeft size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Volver</span>
                  </button>
                  <div className="space-y-6">
                    <div className="relative">
                       <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" />
                       <Input placeholder="¿CÓMO PODEMOS AYUDARTE?" className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 text-[10px] font-black uppercase tracking-widest" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <button className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3 text-center">
                          <MessageSquare className="text-primary" size={24} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Soporte Chat</span>
                       </button>
                       <button className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 flex flex-col items-center gap-3 text-center">
                          <Mail className="text-accent" size={24} />
                          <span className="text-[9px] font-black uppercase tracking-widest">Email Gaia</span>
                       </button>
                    </div>
                    <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5">
                       <h5 className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 italic">FAQs Populares</h5>
                       <div className="space-y-4">
                          {["¿Cómo monetizar mi bioma?", "¿Qué son los tokens ESP?", "¿Cómo reportar una señal falsa?"].map((q) => (
                            <div key={q} className="pb-3 border-b border-white/5 flex items-center justify-between">
                               <span className="text-[10px] font-bold text-white/60">{q}</span>
                               <ChevronRight size={14} className="text-white/20" />
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </ScrollArea>
      </ProtocolWindow>

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
                    {/* Balance Card Principal */}
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

                    {/* Estadísticas de Flujo */}
                    <section className="w-full space-y-4">
                      <div className="flex items-center gap-2 px-2">
                        <BarChart className="text-primary" size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Estadísticas de Flujo</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                          <span className="text-[8px] font-black uppercase text-primary/40 tracking-widest">Total Ingresos</span>
                          <p className="text-xl font-black text-white italic tracking-tighter">+450K ESP</p>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                          <span className="text-[8px] font-black uppercase text-destructive/40 tracking-widest">Total Egresos</span>
                          <p className="text-xl font-black text-white italic tracking-tighter">-120K ESP</p>
                        </div>
                      </div>
                    </section>

                    {/* Rendimiento por Contenido */}
                    <section className="w-full space-y-4">
                      <div className="flex items-center gap-2 px-2">
                        <TrendingUp className="text-primary" size={16} />
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 italic">Monetización de Contenido</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4 flex flex-col items-center text-center">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                            <Clapperboard size={20} />
                          </div>
                          <div>
                            <span className="text-[8px] font-black uppercase text-white/20 tracking-widest block mb-1">Por Bio-Reels</span>
                            <p className="text-lg font-black text-white italic">280K ESP</p>
                          </div>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-4 flex flex-col items-center text-center">
                          <div className="h-10 w-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                            <Radio size={20} />
                          </div>
                          <div>
                            <span className="text-[8px] font-black uppercase text-white/20 tracking-widest block mb-1">Por Live Stream</span>
                            <p className="text-lg font-black text-white italic">170K ESP</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Registros de Actividad */}
                    <section className="w-full space-y-6 pb-12">
                      <Tabs defaultValue="recargas" className="w-full">
                        <TabsList className="flex w-full bg-white/5 p-1 rounded-2xl h-12 gap-1 mb-4">
                          <TabsTrigger value="recargas" className="flex-1 rounded-xl font-black uppercase text-[8px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black">Recargas</TabsTrigger>
                          <TabsTrigger value="retiros" className="flex-1 rounded-xl font-black uppercase text-[8px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black">Retiros</TabsTrigger>
                          <TabsTrigger value="regalos" className="flex-1 rounded-xl font-black uppercase text-[8px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black">Regalos</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="recargas" className="space-y-3 m-0">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><ArrowDownLeft size={16} /></div>
                                <div>
                                  <p className="text-[10px] font-black text-white uppercase italic">Inyección Neural</p>
                                  <span className="text-[8px] text-white/20 font-bold uppercase">Hace {i} día(s)</span>
                                </div>
                              </div>
                              <span className="text-xs font-black text-primary italic">+5,000 ESP</span>
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="retiros" className="space-y-3 m-0">
                          {[1, 2].map((i) => (
                            <div key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-destructive/10 flex items-center justify-center text-destructive"><ArrowUpRight size={16} /></div>
                                <div>
                                  <p className="text-[10px] font-black text-white uppercase italic">Liquidación a Banco</p>
                                  <span className="text-[8px] text-white/20 font-bold uppercase">Hace {i + 2} día(s)</span>
                                </div>
                              </div>
                              <span className="text-xs font-black text-destructive italic">-10,000 ESP</span>
                            </div>
                          ))}
                        </TabsContent>

                        <TabsContent value="regalos" className="space-y-3 m-0">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                              <div className="flex items-center gap-3">
                                <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center text-accent"><Gift size={16} /></div>
                                <div>
                                  <p className="text-[10px] font-black text-white uppercase italic">Donación a Bio_{i+5}</p>
                                  <span className="text-[8px] text-white/20 font-bold uppercase">Hace {i * 5} min</span>
                                </div>
                              </div>
                              <span className="text-xs font-black text-white/40 italic">-500 ESP</span>
                            </div>
                          ))}
                        </TabsContent>
                      </Tabs>
                    </section>
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

                    {rechargeStep === "payment-method" && (
                      <div className="w-full space-y-6">
                         <div className="text-center">
                            <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Nodo de <span className="text-primary">Pago</span></h3>
                            <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Selecciona tu protocolo</p>
                         </div>
                         <div className="space-y-3">
                            {[
                              { id: "card", label: "Tarjeta Bancaria", icon: CreditCard },
                              { id: "yape", label: "Yape / Plin", icon: Smartphone },
                              { id: "paypal", label: "PayPal Express", icon: Send },
                              { id: "cash", label: "Efectivo / Agentes", icon: Building2 },
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
                                <ArrowUpRight className="text-white/20" size={16} />
                              </button>
                            ))}
                         </div>
                         <Button onClick={() => setRechargeStep("packages")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Volver</Button>
                      </div>
                    )}

                    {rechargeStep === "payment-details" && (
                      <div className="w-full space-y-6">
                        <div className="text-center">
                            <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Detalles</h3>
                            <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Ingresa los datos para {paymentMethod?.toUpperCase()}</p>
                        </div>

                        <div className="space-y-4">
                           {paymentMethod === 'card' && (
                             <>
                               <Input placeholder="NÚMERO DE TARJETA" className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-xs tracking-widest" />
                               <div className="grid grid-cols-2 gap-4">
                                  <Input placeholder="MM/AA" className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-xs" />
                                  <Input placeholder="CVV" className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-xs" />
                               </div>
                               <Input placeholder="NOMBRE EN LA TARJETA" className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-xs uppercase" />
                             </>
                           )}
                           {paymentMethod === 'yape' && (
                             <>
                               <Input placeholder="NÚMERO DE CELULAR" className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-xs" />
                               <Input placeholder="CÓDIGO DE APROBACIÓN" className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-xs tracking-[0.5em]" />
                             </>
                           )}
                           {paymentMethod === 'cash' && (
                             <div className="p-8 text-center bg-white/[0.02] border border-dashed border-white/10 rounded-[2rem] space-y-6">
                               <QrCode className="mx-auto text-primary" size={64} strokeWidth={1} />
                               <div className="space-y-1">
                                 <p className="text-[10px] font-black uppercase text-white/40">Código CIP</p>
                                 <p className="text-2xl font-black text-white tracking-widest">749-284-015</p>
                               </div>
                             </div>
                           )}
                           {paymentMethod === 'gift' && (
                             <Input placeholder="CÓDIGO DE REGALO" className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-center text-xs tracking-[0.2em] text-primary" />
                           )}
                           {paymentMethod === 'paypal' && (
                             <div className="p-12 text-center bg-primary/5 rounded-[2rem] border border-primary/20">
                               <Send className="mx-auto text-primary animate-pulse" size={32} />
                               <p className="text-[10px] font-black uppercase text-white mt-4 tracking-widest">Pasarela de PayPal Activa.</p>
                             </div>
                           )}
                        </div>

                        <Button onClick={() => setRechargeStep("confirm")} className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl">Continuar</Button>
                        <Button onClick={() => setRechargeStep("payment-method")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Volver</Button>
                      </div>
                    )}

                    {rechargeStep === "confirm" && (
                      <div className="w-full space-y-8 flex flex-col items-center">
                        <div className="text-center">
                           <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Confirmar</h3>
                        </div>
                        <div className="w-full p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4">
                           <div className="flex justify-between items-center">
                             <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Tokens</span>
                             <span className="text-sm font-black text-white italic">{amount}</span>
                           </div>
                           <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                             <span className="text-[11px] font-black text-white uppercase tracking-widest">Total S/.</span>
                             <span className="text-xl font-black text-primary italic">S/. {(Number(amount) * 0.01).toFixed(2)}</span>
                           </div>
                        </div>
                        <Button 
                          onClick={executeTransaction}
                          disabled={isProcessing}
                          className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl"
                        >
                          {isProcessing ? <Loader2 className="animate-spin" /> : "Ejecutar Pago"}
                        </Button>
                        <Button onClick={() => setRechargeStep("payment-details")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Corregir</Button>
                      </div>
                    )}

                    {rechargeStep === "success" && (
                      <div className="w-full flex flex-col items-center animate-in zoom-in-95 duration-700">
                        <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-black mb-6 shadow-[0_0_40px_rgba(204,255,0,0.5)]">
                          <CheckCircle2 size={48} strokeWidth={2.5} />
                        </div>
                        <div className="w-full max-w-[340px] bg-white rounded-[2rem] p-8 text-black shadow-2xl relative overflow-hidden flex flex-col gap-6">
                           <div className="absolute -top-10 -right-10 opacity-10 rotate-12"><Sparkles size={120} /></div>
                           <div className="flex justify-between items-center border-b border-black/5 pb-4">
                             <span className="text-[8px] font-black uppercase text-black/40">Protocolo Inyectado</span>
                             <span className="text-[8px] font-black uppercase text-black/40">ID: TXN-{(Math.random()*1000).toFixed(0)}</span>
                           </div>
                           <div className="text-center py-4">
                             <p className="text-[10px] font-black uppercase text-black/40 mb-1">Inyección de Activos</p>
                             <h4 className="text-4xl font-black italic tracking-tighter">+{amount} ESP</h4>
                           </div>
                           <div className="space-y-3">
                             <div className="flex justify-between">
                               <span className="text-[9px] font-bold text-black/40 uppercase">Método</span>
                               <span className="text-[9px] font-black uppercase">{paymentMethod}</span>
                             </div>
                             <div className="flex justify-between">
                               <span className="text-[9px] font-bold text-black/40 uppercase">Total PEN</span>
                               <span className="text-[9px] font-black uppercase">S/. {solAmount.toFixed(2)}</span>
                             </div>
                           </div>
                           <div className="bg-black/5 p-4 rounded-xl text-center">
                              <p className="text-[7px] font-black uppercase tracking-widest">Sincronización Gaia Exitosa</p>
                           </div>
                        </div>
                        <Button 
                          onClick={() => { setWalletView("main"); setRechargeStep("packages"); setAmount(""); }} 
                          className="w-full h-14 bg-primary text-black font-black uppercase tracking-widest rounded-2xl mt-8 shadow-xl"
                        >
                          Entendido
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {walletView === "withdraw" && (
                  <div className="w-full space-y-6 animate-in slide-in-from-right duration-500 flex flex-col items-center">
                    {withdrawStep === "input" && (
                      <div className="w-full space-y-8">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Retirar</h3>
                          <p className="text-[9px] text-white/30 font-black uppercase tracking-widest mt-1">Saldo: {espBalance.toLocaleString()} ESP</p>
                        </div>
                        <div className="space-y-4">
                          <Input 
                            type="number" 
                            placeholder="CANTIDAD DE TOKENS" 
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="h-14 bg-white/5 border-white/10 rounded-xl px-12 text-white font-black italic" 
                          />
                          {amount && (
                            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                              <p className="text-3xl font-black text-white italic">S/. {(Number(amount) * 0.01).toFixed(2)}</p>
                            </div>
                          )}
                        </div>
                        <Button 
                          disabled={!amount || Number(amount) <= 0 || Number(amount) > espBalance}
                          onClick={() => setWithdrawStep("method")} 
                          className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl"
                        >
                          Continuar
                        </Button>
                        <Button onClick={() => setWalletView("main")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Cancelar</Button>
                      </div>
                    )}

                    {withdrawStep === "method" && (
                      <div className="w-full space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Método de Retiro</h3>
                        </div>
                        <div className="space-y-3">
                          {[
                            { id: "transfer", label: "Transferencia Bancaria", icon: Landmark },
                            { id: "yape", label: "Yape", icon: Smartphone },
                            { id: "paypal", label: "PayPal", icon: Send },
                            { id: "gift", label: "Código de Regalo", icon: Ticket },
                            { id: "donate", label: "Donar Gaia", icon: HeartHandshake }
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
                            </button>
                          ))}
                        </div>
                        <p className="text-[8px] font-bold text-white/30 uppercase text-center mt-4">Los pagos se realizarán únicamente al titular de la cuenta.</p>
                        <Button onClick={() => setWithdrawStep("input")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Volver</Button>
                      </div>
                    )}

                    {withdrawStep === "details" && (
                      <div className="w-full space-y-6">
                        <div className="text-center">
                          <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Detalles</h3>
                        </div>
                        <div className="space-y-3">
                          {withdrawMethod === 'transfer' && (
                            <>
                              <Input placeholder="BANCO" className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-xs uppercase" />
                              <Input placeholder="CCI" className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-xs" />
                            </>
                          )}
                          {(withdrawMethod === 'yape' || withdrawMethod === 'paypal') && (
                            <Input placeholder={withdrawMethod === 'yape' ? "TELÉFONO" : "CORREO"} className="h-14 bg-white/5 border-white/10 rounded-xl px-6 text-xs" />
                          )}
                        </div>
                        <Button onClick={() => setWithdrawStep("confirm")} className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl">Confirmar</Button>
                      </div>
                    )}

                    {withdrawStep === "confirm" && (
                      <div className="w-full space-y-8 flex flex-col items-center">
                        <div className="text-center">
                           <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Confirmar Retiro</h3>
                        </div>
                        <div className="w-full p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-4 text-center">
                           <p className="text-[10px] font-black uppercase text-white/30">Total a Liquidar</p>
                           <h4 className="text-4xl font-black text-primary italic">S/. {solAmount.toFixed(2)}</h4>
                        </div>
                        <Button 
                          onClick={executeTransaction}
                          disabled={isProcessing}
                          className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-xl"
                        >
                          {isProcessing ? <Loader2 className="animate-spin" /> : "Confirmar Liquidación"}
                        </Button>
                        <Button onClick={() => setWithdrawStep("details")} className="w-full h-14 bg-white/5 text-white/40 font-black uppercase tracking-widest rounded-2xl">Volver</Button>
                      </div>
                    )}

                    {withdrawStep === "success" && (
                      <div className="w-full flex flex-col items-center animate-in slide-in-from-bottom-8 duration-700">
                        <div className="h-20 w-20 rounded-full bg-primary flex items-center justify-center text-black mb-6 shadow-[0_0_40px_rgba(204,255,0,0.5)]">
                          <CheckCircle2 size={48} strokeWidth={2.5} />
                        </div>
                        <div className="w-full max-w-[340px] bg-white rounded-[2rem] p-8 text-black shadow-2xl relative overflow-hidden flex flex-col gap-6">
                           <div className="absolute top-0 right-0 p-6 opacity-10"><Receipt size={100} /></div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-black/40">Voucher de Retiro</p>
                           <div className="space-y-4 pt-4 border-t border-black/5">
                             <div className="flex justify-between items-center">
                               <span className="text-[9px] font-bold uppercase text-black/40">Monto Liquidado</span>
                               <span className="text-lg font-black italic">S/. {solAmount.toFixed(2)}</span>
                             </div>
                             <div className="flex justify-between items-center">
                               <span className="text-[9px] font-bold uppercase text-black/40">Tokens Debatidos</span>
                               <span className="text-sm font-black italic">{amount} ESP</span>
                             </div>
                             <div className="flex justify-between items-center">
                               <span className="text-[9px] font-bold uppercase text-black/40">Método</span>
                               <span className="text-[9px] font-black uppercase">{withdrawMethod}</span>
                             </div>
                           </div>
                           <div className="pt-4 border-t border-black/5 space-y-1">
                             <p className="text-[8px] font-black uppercase text-black/20 text-center italic">Sincronización Gaia v.2.5 Protocol</p>
                           </div>
                        </div>
                        <Button 
                          onClick={() => { setWalletView("main"); setWithdrawStep("input"); setAmount(""); }} 
                          className="w-full h-16 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl mt-8 shadow-xl"
                        >
                          Finalizar
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

      {/* Analíticas Globales */}
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
                    <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Visualizaciones</span>
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
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Seguidores</p>
                    <p className="text-xl font-black text-primary italic tracking-tighter">+1,240</p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 space-y-2">
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest">Me Gusta</p>
                    <p className="text-xl font-black text-accent italic tracking-tighter">+8,420</p>
                  </div>
               </div>

               <div className="w-full p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-8">
                  <h4 className="text-[10px] font-black uppercase text-white tracking-[0.2em] italic">Demografía</h4>
                  <div className="space-y-4">
                    <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Localización</span>
                    {[
                      { label: "Latam North", val: 65, color: "bg-primary" },
                      { label: "Euro Node", val: 20, color: "bg-accent" }
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
                    <span className="text-[8px] font-black uppercase text-white/30 tracking-widest">Rango de Edad</span>
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

