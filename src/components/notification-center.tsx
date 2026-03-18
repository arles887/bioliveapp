"use client";

import { useState } from "react";
import { MessageSquare, UserPlus, ShieldCheck, ShoppingBag, Plus } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function NotificationCenter() {
  const [activeSection, setActiveSection] = useState<"Chats" | "Seguidores" | "Sistema" | "Compras">("Chats");

  const sections = [
    { id: "Chats", icon: MessageSquare },
    { id: "Seguidores", icon: UserPlus },
    { id: "Sistema", icon: ShieldCheck },
    { id: "Compras", icon: ShoppingBag }
  ] as const;

  const notifications = {
    Chats: [
      { id: "1", name: "Gaia Squad", msg: "Nuevo nodo detectado en el Sector 7.", time: "2m", avatar: "https://picsum.photos/seed/c1/100/100", unread: true },
      { id: "2", name: "BioBotany", msg: "La síntesis de esporas ha terminado.", time: "1h", avatar: "https://picsum.photos/seed/c2/100/100", unread: false },
    ],
    Seguidores: [
      { id: "s1", name: "CyberEntity_04", msg: "ha empezado a seguirte.", time: "12m", avatar: "https://picsum.photos/seed/s1/100/100" },
      { id: "s2", name: "GreenDev", msg: "ha empezado a seguirte.", time: "5h", avatar: "https://picsum.photos/seed/s2/100/100" },
    ],
    Sistema: [
      { id: "sys1", name: "Protocolo Gaia", msg: "Tu nodo ha generado 200kg de CO2 offset.", time: "Ahora", icon: ShieldCheck },
      { id: "sys2", name: "BioLive OS", msg: "Actualización de firmware 0.4.5 lista.", time: "1d", icon: ShieldCheck },
    ],
    Compras: [
      { id: "p1", name: "Tienda Bio", msg: "Has comprado 'Neon Glow Filter'.", time: "2d", icon: ShoppingBag },
    ]
  };

  return (
    <div className="flex flex-col h-full bg-[#020503] animate-in fade-in duration-500">
      <div className="p-8 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Bio<span className="text-primary">Pulse</span></h2>
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary cursor-pointer border border-primary/20">
            <Plus size={20} />
          </div>
        </div>

        {/* Selector de Sección (WhatsApp Style) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {sections.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 min-w-[100px] py-3 rounded-2xl transition-all border",
                activeSection === sec.id 
                  ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(204,255,0,0.2)]" 
                  : "bg-white/5 border-white/5 text-white/30"
              )}
            >
              <sec.icon size={14} />
              <span className="text-[8px] font-black uppercase tracking-widest">{sec.id}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-4 no-scrollbar pb-10">
        {notifications[activeSection].map((item: any) => (
          <div key={item.id} className="group flex items-center gap-5 p-4 rounded-[2rem] hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5">
            <div className="relative">
              <div className="h-12 w-12 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center bg-white/5">
                {item.avatar ? (
                  <Image src={item.avatar} width={48} height={48} alt="Avatar" />
                ) : (
                  <item.icon size={20} className="text-primary/60" />
                )}
              </div>
              {item.unread && <div className="absolute -top-1 -right-1 h-3 w-3 bg-primary rounded-full shadow-[0_0_10px_rgba(204,255,0,0.5)]"></div>}
            </div>
            
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-black text-white text-[12px] italic uppercase tracking-tight">{item.name}</h4>
                <span className="text-[9px] text-white/20 font-bold">{item.time}</span>
              </div>
              <p className="text-[10px] text-white/40 line-clamp-1 font-medium">{item.msg}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
