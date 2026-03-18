"use client";

import { useState } from "react";
import { 
  MessageSquare, UserPlus, ShieldCheck, 
  ShoppingBag, Plus, MoreHorizontal,
  Circle
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

type SectionType = "Chats" | "Seguidores" | "Sistema" | "Compras";

export function NotificationCenter() {
  const [activeSection, setActiveSection] = useState<SectionType>("Chats");

  const sections = [
    { id: "Chats", icon: MessageSquare, label: "Chats" },
    { id: "Seguidores", icon: UserPlus, label: "Social" },
    { id: "Sistema", icon: ShieldCheck, label: "Alertas" },
    { id: "Compras", icon: ShoppingBag, label: "Tienda" }
  ] as const;

  const notifications = {
    Chats: [
      { id: "1", name: "Gaia Squad", msg: "Nuevo nodo detectado en el Sector 7. ¿Revisamos?", time: "2m", avatar: "https://picsum.photos/seed/c1/100/100", unread: true },
      { id: "2", name: "BioBotany Lab", msg: "La síntesis de esporas ha terminado con éxito.", time: "1h", avatar: "https://picsum.photos/seed/c2/100/100", unread: false },
      { id: "3", name: "Neon Explorer", msg: "Envié las coordenadas del bioma.", time: "3h", avatar: "https://picsum.photos/seed/c3/100/100", unread: false },
    ],
    Seguidores: [
      { id: "s1", name: "CyberEntity_04", msg: "ha empezado a seguir tu señal.", time: "12m", avatar: "https://picsum.photos/seed/s1/100/100" },
      { id: "s2", name: "GreenDev Alpha", msg: "te ha añadido a su círculo neural.", time: "5h", avatar: "https://picsum.photos/seed/s2/100/100" },
      { id: "s3", name: "EcoWatcher", msg: "compartió tu último Bio-Reel.", time: "1d", avatar: "https://picsum.photos/seed/s3/100/100" },
    ],
    Sistema: [
      { id: "sys1", name: "Protocolo Gaia", msg: "Tu nodo ha generado 200kg de CO2 offset.", time: "Ahora", icon: ShieldCheck, isAlert: true },
      { id: "sys2", name: "BioLive OS", msg: "Actualización de firmware 0.4.5 instalada.", time: "1d", icon: ShieldCheck, isAlert: false },
      { id: "sys3", name: "Seguridad", msg: "Nueva conexión desde nodo externo autorizada.", time: "2d", icon: ShieldCheck, isAlert: false },
    ],
    Compras: [
      { id: "p1", name: "Tienda Bio", msg: "Has adquirido 'Neon Glow Filter Pack'.", time: "2d", icon: ShoppingBag },
      { id: "p2", name: "Bio-Market", msg: "Tokens ESP inyectados correctamente.", time: "1w", icon: ShoppingBag },
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#020503] animate-in fade-in duration-700">
      {/* Header Compacto */}
      <div className="px-6 pt-4 pb-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter leading-none">Bio<span className="text-primary">Pulse</span></h2>
            <p className="text-[8px] font-black uppercase tracking-[0.4em] text-primary/40 mt-2">Centro de Actividad Neural</p>
          </div>
          <button className="h-10 w-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 hover:text-primary border border-white/5 transition-all">
            <Plus size={18} />
          </button>
        </div>

        {/* Selector de Sección Estilizado */}
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={cn(
                "flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl transition-all duration-300",
                activeSection === sec.id 
                  ? "bg-primary text-black shadow-[0_5px_15px_rgba(204,255,0,0.2)]" 
                  : "text-white/30 hover:text-white/60"
              )}
            >
              <sec.icon size={14} strokeWidth={activeSection === sec.id ? 3 : 2} />
              <span className="text-[7px] font-black uppercase tracking-widest">{sec.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Lista de Notificaciones - Diseño Limpio */}
      <div className="flex-1 overflow-y-auto px-4 space-y-1 no-scrollbar pb-24">
        {notifications[activeSection].map((item: any) => (
          <div 
            key={item.id} 
            className={cn(
              "group relative flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer border border-transparent",
              item.unread ? "bg-primary/[0.03] border-primary/10" : "hover:bg-white/[0.02]"
            )}
          >
            {/* Avatar / Icono */}
            <div className="relative shrink-0">
              <div className={cn(
                "h-12 w-12 rounded-xl overflow-hidden border flex items-center justify-center bg-white/5",
                item.unread ? "border-primary/40" : "border-white/10"
              )}>
                {item.avatar ? (
                  <Image src={item.avatar} width={48} height={48} alt="Avatar" className={cn("object-cover", !item.unread && "opacity-60 grayscale")} />
                ) : (
                  <item.icon size={20} className={cn(item.isAlert ? "text-primary" : "text-white/20")} />
                )}
              </div>
              {item.unread && (
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full shadow-[0_0_10px_rgba(204,255,0,0.8)] border-2 border-[#020503]"></div>
              )}
            </div>
            
            {/* Contenido Texto */}
            <div className="flex-1 min-w-0 space-y-0.5">
              <div className="flex justify-between items-baseline gap-2">
                <h4 className={cn(
                  "font-black text-[11px] italic uppercase tracking-tight truncate",
                  item.unread ? "text-white" : "text-white/60"
                )}>
                  {item.name}
                </h4>
                <span className="text-[8px] text-white/20 font-bold uppercase shrink-0">{item.time}</span>
              </div>
              <p className={cn(
                "text-[10px] line-clamp-1 font-medium leading-relaxed",
                item.unread ? "text-white/80" : "text-white/30"
              )}>
                {item.msg}
              </p>
            </div>

            {/* Acciones Rápidas (Hov) */}
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreHorizontal size={14} className="text-white/20" />
            </div>
          </div>
        ))}

        {notifications[activeSection].length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-white/10">
            <Circle size={40} className="mb-4 opacity-20" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Nodo Despejado</p>
          </div>
        )}
      </div>
    </div>
  );
}
