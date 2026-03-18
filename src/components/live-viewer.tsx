"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Gamepad2, Leaf, ShieldAlert, Globe, 
  Search, Lock, Zap, Flame 
} from "lucide-react";
import { cn } from "@/lib/utils";

export function LiveViewer() {
  const [activeCategory, setActiveCategory] = useState("Global");

  const categories = [
    { id: "Global", icon: Globe },
    { id: "Gaming", icon: Gamepad2 },
    { id: "Naturaleza", icon: Leaf },
    { id: "Privadas", icon: Lock },
    { id: "Trending", icon: Flame }
  ];

  const lives = [
    { id: "1", title: "Amazon Rainforest 4K", category: "Naturaleza", user: "EcoWatcher", watchers: "4.2K", img: "https://picsum.photos/seed/l1/600/400" },
    { id: "2", title: "Cyber-Organic Chess", category: "Gaming", user: "GrandMaster", watchers: "1.1K", img: "https://picsum.photos/seed/l2/600/400" },
    { id: "3", title: "Secret Lab Stream", category: "Privadas", user: "Unknown", watchers: "0", img: "https://picsum.photos/seed/l3/600/400", locked: true },
    { id: "4", title: "Coral Reef Flow", category: "Naturaleza", user: "OceanPulse", watchers: "12K", img: "https://picsum.photos/seed/l4/600/400" },
  ];

  return (
    <div className="flex flex-col w-full h-full bg-[#020503] animate-in fade-in duration-500">
      {/* Categorías / Filtros Live */}
      <div className="p-6 pb-2 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Bio<span className="text-primary">Live</span></h2>
          <Search size={20} className="text-white/40" />
        </div>

        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-2xl transition-all border",
                activeCategory === cat.id 
                  ? "bg-primary/10 border-primary/40 text-primary" 
                  : "bg-white/5 border-white/5 text-white/30"
              )}
            >
              <cat.icon size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">{cat.id}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 grid grid-cols-2 gap-4 no-scrollbar pb-10">
        {lives.map((live) => (
          <div key={live.id} className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-white/5 border border-white/10 hover:border-primary/30 transition-all">
            <Image src={live.img} fill alt="Live" className="object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            
            {live.locked && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <Lock size={24} className="text-primary animate-pulse" />
              </div>
            )}

            <div className="absolute top-4 left-4 flex gap-1 items-center">
              <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[8px] font-black text-white uppercase tracking-tighter">{live.watchers}</span>
            </div>

            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-[7px] font-black text-primary/60 uppercase tracking-widest">@{live.user}</span>
              <h4 className="text-[10px] font-black text-white uppercase italic leading-tight mt-0.5 line-clamp-2">{live.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
