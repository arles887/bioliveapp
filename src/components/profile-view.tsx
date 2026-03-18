"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Menu, Camera, Play, Music, Heart, 
  Edit3, Share2, Zap, UserPlus, Check, Send, ChevronLeft,
  Wallet, History, UserCircle, LifeBuoy, HelpCircle, Settings, Lock,
  TrendingUp, Gift, DollarSign, PlusCircle, Bell, Shield, Moon, Eye, Globe,
  MessageSquare, Mail, Phone, Calendar, ArrowUpRight, ArrowDownLeft,
  CreditCard, Smartphone, Ticket, RefreshCw
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

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
  
  const avatarUrl = PlaceHolderImages.find(img => img.id === 'user-1')?.imageUrl || null;

  const stats = [
    { label: "Seguidores", value: isOwnProfile ? "12.4K" : "4.2K" },
    { label: "Siguiendo", value: isOwnProfile ? "842" : "120" },
    { label: "ESP Tokens", value: isOwnProfile ? "2,500" : "800" }
  ];

  const handleUpdateProfile = () => {
    setIsEditing(false);
    toast({ title: "Protocolo Actualizado", description: "Identidad digital guardada correctamente." });
  };

  const handleFollow = () => {
    requireAuth(() => {
      setIsFollowing(!isFollowing);
      toast({ 
        title: isFollowing ? "Sincronización Terminada" : "Sincronizado", 
        description: isFollowing ? `Has dejado de seguir a @${profileName}` : `Siguiendo a @${profileName}` 
      });
    });
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
             <Sheet onOpenChange={() => { setActiveMenuSection(null); setWalletView("main"); }}>
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

                    <ScrollArea className="flex-1 p-6">
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
                              if (activeMenuSection === "wallet" && walletView !== "main") {
                                setWalletView("main");
                              } else {
                                setActiveMenuSection(null);
                              }
                            }}
                            className="flex items-center gap-2 text-white/40 hover:text-primary transition-colors"
                          >
                            <ChevronLeft size={16} />
                            <span className="text-[9px] font-black uppercase tracking-widest">
                              {walletView === "main" ? "Volver" : "Volver a Billetera"}
                            </span>
                          </button>

                          {activeMenuSection === "wallet" && (
                            <div className="space-y-8">
                              {walletView === "main" && (
                                <div className="space-y-6">
                                  <div className="p-6 rounded-[2.5rem] bg-primary/10 border border-primary/20 space-y-4">
                                    <div className="flex justify-between items-start">
                                      <span className="text-[9px] font-black uppercase text-primary tracking-widest italic">Balance Bio-Neural</span>
                                      <Zap size={14} className="text-primary animate-pulse" />
                                    </div>
                                    <div className="text-4xl font-black italic text-white leading-none">2,500 <span className="text-sm text-primary">ESP</span></div>
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

                                  <div className="space-y-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/20 ml-2 italic">Historial Gaia</h4>
                                    <div className="space-y-2">
                                      {[
                                        { type: "gift", label: "Regalo enviado", amount: "-50", user: "@Watcher_12" },
                                        { type: "buy", label: "Compra de Tokens", amount: "+500", user: "Protocol Gaia" },
                                        { type: "income", label: "Ingreso por Live", amount: "+120", user: "@Fan_99" },
                                      ].map((t, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                          <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                                              {t.type === 'gift' ? <Gift size={14} className="text-red-400" /> : <DollarSign size={14} className="text-primary" />}
                                            </div>
                                            <div>
                                              <p className="text-[9px] font-black text-white uppercase italic tracking-tight">{t.label}</p>
                                              <p className="text-[7px] font-bold text-white/20 uppercase tracking-widest">{t.user}</p>
                                            </div>
                                          </div>
                                          <span className={cn("text-[10px] font-black italic", t.amount.startsWith('+') ? "text-primary" : "text-red-400")}>{t.amount}</span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}

                              {walletView === "buy" && (
                                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                                  <div className="space-y-2">
                                    <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Inyectar <span className="text-primary">Señal ESP</span></h3>
                                    <p className="text-[9px] text-white/30 uppercase tracking-widest">Selecciona tu método de sincronización de fondos</p>
                                  </div>

                                  <div className="space-y-6">
                                    <div className="space-y-2 px-1">
                                      <label className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Cantidad de Tokens</label>
                                      <Input type="number" placeholder="Ej: 500" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-black" />
                                    </div>

                                    <div className="space-y-3">
                                      <label className="text-[8px] font-black text-primary uppercase tracking-[0.3em] ml-1">Método de Pago</label>
                                      <div className="grid grid-cols-1 gap-2">
                                        {[
                                          { id: 'card', label: 'Tarjeta Crédito/Débito', icon: CreditCard, color: 'text-blue-400' },
                                          { id: 'yape', label: 'Yape / Plin', icon: Smartphone, color: 'text-purple-400' },
                                          { id: 'paypal', label: 'PayPal Global', icon: Globe, color: 'text-blue-500' },
                                          { id: 'code', label: 'Código Regalo / Promo', icon: Ticket, color: 'text-yellow-400' },
                                        ].map((m) => (
                                          <button key={m.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/40 transition-all group text-left">
                                            <div className="flex items-center gap-4">
                                              <m.icon size={18} className={m.color} />
                                              <span className="text-[10px] font-black text-white uppercase italic tracking-tight">{m.label}</span>
                                            </div>
                                            <ArrowUpRight size={14} className="text-white/20 group-hover:text-primary" />
                                          </button>
                                        ))}
                                      </div>
                                    </div>

                                    <Button className="w-full h-14 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl shadow-[0_0_30px_rgba(204,255,0,0.3)]">
                                      Iniciar Transacción Gaia
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {walletView === "withdraw" && (
                                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                                  <div className="space-y-2">
                                    <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Convertir a <span className="text-accent">Soles (PEN)</span></h3>
                                    <p className="text-[9px] text-white/30 uppercase tracking-widest">Transforma tu energía neural en activos reales</p>
                                  </div>

                                  <div className="p-6 rounded-[2.5rem] bg-accent/10 border border-accent/20 space-y-4">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[9px] font-black uppercase text-accent tracking-widest italic">Tasa de Conversión</span>
                                      <span className="text-[10px] text-white font-bold">100 ESP = S/ 1.00</span>
                                    </div>
                                    <div className="space-y-2">
                                      <label className="text-[8px] font-black text-accent uppercase tracking-[0.3em]">Tokens a Retirar</label>
                                      <div className="relative">
                                        <Input type="number" placeholder="Min: 500 ESP" className="h-14 bg-white/5 border-white/10 rounded-2xl text-white font-black pr-16" />
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[10px] font-black text-accent">ESP</span>
                                      </div>
                                    </div>
                                    <div className="pt-2 flex flex-col items-center">
                                      <span className="text-[8px] font-black text-white/20 uppercase tracking-[0.5em] mb-2">Equivale a</span>
                                      <div className="text-3xl font-black italic text-white leading-none">S/ 0.00</div>
                                    </div>
                                  </div>

                                  <div className="space-y-4">
                                    <label className="text-[8px] font-black text-accent uppercase tracking-[0.3em] ml-1">Destino de Fondos</label>
                                    <div className="grid grid-cols-1 gap-2">
                                      {[
                                        { id: 'wyape', label: 'Retiro vía Yape', icon: Smartphone, color: 'text-purple-400' },
                                        { id: 'wcard', label: 'Transferencia Bancaria', icon: CreditCard, color: 'text-blue-400' },
                                        { id: 'wpaypal', label: 'PayPal (USD)', icon: Globe, color: 'text-blue-500' },
                                      ].map((m) => (
                                        <button key={m.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-accent/40 transition-all group text-left">
                                          <div className="flex items-center gap-4">
                                            <m.icon size={18} className={m.color} />
                                            <span className="text-[10px] font-black text-white uppercase italic tracking-tight">{m.label}</span>
                                          </div>
                                          <ArrowDownLeft size={14} className="text-white/20 group-hover:text-accent" />
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="p-5 rounded-2xl bg-red-500/5 border border-red-500/10 space-y-3">
                                    <div className="flex items-center gap-2 text-red-400">
                                      <Shield size={14} />
                                      <span className="text-[9px] font-black uppercase tracking-widest">Protocolo de Seguridad</span>
                                    </div>
                                    <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest leading-relaxed">
                                      Los retiros se efectuarán <span className="text-red-400">únicamente al titular</span> de la cuenta BioLive verificado. El tiempo de procesamiento es de 24 a 48 ciclos horarios.
                                    </p>
                                  </div>

                                  <Button className="w-full h-16 bg-accent text-black font-black uppercase italic tracking-widest rounded-2xl shadow-[0_0_30px_rgba(0,255,187,0.3)]">
                                    Confirmar Retiro Neural
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}

                          {activeMenuSection === "activity" && (
                            <div className="space-y-4">
                              <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Historial de <span className="text-primary">Actividad</span></h3>
                              <div className="space-y-3">
                                {[
                                  { action: "Te gustó el Reel de @NatureLover", time: "hace 2m", icon: Heart },
                                  { action: "Comentaste en el Live de @EcoExplorer", time: "hace 1h", icon: MessageSquare },
                                  { action: "Empezaste a seguir a @BioHacker", time: "hace 5h", icon: UserPlus },
                                  { action: "Compartiste la señal de @GaiaNode", time: "ayer", icon: Share2 },
                                ].map((item, i) => (
                                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                                    <item.icon size={16} className="text-primary" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] text-white/80 font-medium leading-tight">{item.action}</p>
                                      <p className="text-[8px] text-white/20 font-black uppercase tracking-widest mt-1">{item.time}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {activeMenuSection === "account" && (
                            <div className="space-y-6">
                              <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Información <span className="text-primary">Cuenta</span></h3>
                              <div className="space-y-4">
                                <div className="space-y-1.5 px-2">
                                  <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Correo Electrónico</p>
                                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <Mail size={14} className="text-white/20" />
                                    <span className="text-[10px] text-white/80 font-bold tracking-widest">ENTITY_01@GAIA.OS</span>
                                  </div>
                                </div>
                                <div className="space-y-1.5 px-2">
                                  <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Teléfono Sincronizado</p>
                                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <Phone size={14} className="text-white/20" />
                                    <span className="text-[10px] text-white/80 font-bold tracking-widest">+54 9 11 1234 5678</span>
                                  </div>
                                </div>
                                <div className="space-y-1.5 px-2">
                                  <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">Edad Registrada</p>
                                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                                    <Calendar size={14} className="text-white/20" />
                                    <span className="text-[10px] text-white/80 font-bold tracking-widest">24 CICLOS SOLARES</span>
                                  </div>
                                </div>
                                <Button className="w-full h-12 bg-white/5 border border-white/10 text-white font-black uppercase text-[9px] tracking-widest rounded-xl hover:bg-primary hover:text-black" onClick={() => toast({ title: "Cifrado Quantum", description: "Verifica tu identidad para editar." })}>
                                  Editar Datos Sensibles
                                </Button>
                              </div>
                            </div>
                          )}

                          {activeMenuSection === "support" && (
                            <div className="space-y-6 text-center pt-8">
                               <div className="h-20 w-20 rounded-[2.5rem] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mx-auto">
                                 <LifeBuoy size={40} className="animate-spin-slow" />
                               </div>
                               <div className="space-y-2">
                                 <h3 className="text-2xl font-black italic uppercase text-white tracking-tighter">Soporte <span className="text-primary">Técnico</span></h3>
                                 <p className="text-[10px] text-white/40 uppercase tracking-widest leading-relaxed">Conexión directa con el núcleo Gaia</p>
                               </div>
                               <div className="space-y-2">
                                 <Button className="w-full h-14 bg-primary text-black font-black uppercase italic tracking-widest rounded-2xl">Chat en Tiempo Real</Button>
                                 <Button className="w-full h-14 bg-white/5 border border-white/10 text-white font-black uppercase italic tracking-widest rounded-2xl">Enviar Ticket Neural</Button>
                               </div>
                            </div>
                          )}

                          {activeMenuSection === "help" && (
                            <div className="space-y-4">
                              <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Base de <span className="text-primary">Datos</span></h3>
                              <div className="space-y-2">
                                {[
                                  "¿Cómo minar tokens ESP?",
                                  "Seguridad de la señal Live",
                                  "Privacidad del bioma digital",
                                  "Reglas de la red Gaia",
                                ].map((q, i) => (
                                  <button key={i} className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-left">
                                    <span className="text-[10px] text-white/80 font-bold uppercase tracking-tight">{q}</span>
                                    <ChevronLeft size={14} className="rotate-180 text-white/20" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {activeMenuSection === "settings" && (
                            <div className="space-y-6">
                              <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Ajustes <span className="text-primary">Sistema</span></h3>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <div className="flex items-center gap-3">
                                    <Bell size={16} className="text-primary" />
                                    <span className="text-[10px] text-white/80 font-black uppercase tracking-widest">Notificaciones</span>
                                  </div>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <div className="flex items-center gap-3">
                                    <Moon size={16} className="text-primary" />
                                    <span className="text-[10px] text-white/80 font-black uppercase tracking-widest">Modo Oscuro Absoluto</span>
                                  </div>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <div className="flex items-center gap-3">
                                    <Shield size={16} className="text-primary" />
                                    <span className="text-[10px] text-white/80 font-black uppercase tracking-widest">Seguridad Biométrica</span>
                                  </div>
                                  <Switch />
                                </div>
                              </div>
                            </div>
                          )}

                          {activeMenuSection === "privacy" && (
                            <div className="space-y-6">
                              <h3 className="text-xl font-black italic uppercase text-white tracking-tighter">Protocolo <span className="text-accent">Privacidad</span></h3>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <div className="flex items-center gap-3">
                                    <Eye size={16} className="text-accent" />
                                    <span className="text-[10px] text-white/80 font-black uppercase tracking-widest">Perfil Público</span>
                                  </div>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <div className="flex items-center gap-3">
                                    <Globe size={16} className="text-accent" />
                                    <span className="text-[10px] text-white/80 font-black uppercase tracking-widest">Visibilidad Global</span>
                                  </div>
                                  <Switch defaultChecked />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <div className="flex items-center gap-3">
                                    <Lock size={16} className="text-accent" />
                                    <span className="text-[10px] text-white/80 font-black uppercase tracking-widest">Cuenta Encriptada</span>
                                  </div>
                                  <Switch />
                                </div>
                              </div>
                              <Button variant="destructive" className="w-full h-12 rounded-xl text-[9px] font-black uppercase tracking-widest bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white" onClick={() => toast({ variant: "destructive", title: "ALERTA", description: "Protocolo de eliminación no disponible." })}>
                                Eliminar Identidad Digital
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
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
            {isOwnProfile 
              ? "Explorador de biomas digitales y coleccionista de señales orgánicas. 🌱⚡ #BioCyber #NatureTech"
              : "Creador de contenido neural. Generando esporas de información 24/7. #BioLive #PublicSignal"}
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
          {isOwnProfile && (
            <TabsTrigger value="likes" className="data-[state=active]:text-primary text-white/20 bg-transparent rounded-none border-b-2 border-transparent data-[state=active]:border-primary px-4 font-black uppercase text-[9px] tracking-widest transition-all">
              Favoritos
            </TabsTrigger>
          )}
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

        <TabsContent value="music" className="p-6 space-y-4 animate-in fade-in duration-500">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/30 transition-all group cursor-pointer active:bg-white/10">
              <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center text-primary shrink-0">
                <Music size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-black text-white uppercase italic tracking-tight truncate">Signal Mix #0{i} Deep Forest</h4>
                <p className="text-[8px] text-white/30 font-bold uppercase tracking-widest truncate">Deep Forest Techno Protocol</p>
              </div>
              <Button size="icon" variant="ghost" className="text-white/20 group-hover:text-primary shrink-0">
                <Play size={18} />
              </Button>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="likes" className="p-4 grid grid-cols-2 gap-3 animate-in fade-in duration-500">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-white/5 border border-white/5 cursor-pointer active:scale-95 transition-all">
              <Image src={`https://picsum.photos/seed/like${i}/300/400`} fill alt="Liked" className="object-cover opacity-50" />
              <div className="absolute top-3 right-3 h-6 w-6 rounded-full bg-primary/10 backdrop-blur-md flex items-center justify-center text-primary">
                <Heart size={12} fill="currentColor" />
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
          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/60 ml-2">Bio-Descripción</label>
            <Input 
              placeholder="Explorador de biomas..."
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
