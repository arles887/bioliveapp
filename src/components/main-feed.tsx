"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  ScanSearch, Droplets, Activity, Cpu, 
  Globe, Trees, Waves, Binary, Shield,
  BarChart3, Settings, Zap, Info, MapPin
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ChatPanel } from "./chat-panel";
import { Button } from "@/components/ui/button";
import { ProtocolWindow } from "./protocol-window";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

const chartData = [
  { time: "00:00", o2: 400, co2: 240 },
  { time: "04:00", o2: 300, co2: 139 },
  { time: "08:00", o2: 500, co2: 980 },
  { time: "12:00", o2: 800, co2: 390 },
  { time: "16:00", o2: 600, co2: 480 },
  { time: "20:00", o2: 700, co2: 380 },
];

export function MainFeed() {
  const [activeProtocol, setActiveProtocol] = useState<string | null>(null);
  const [activeLiveId, setActiveLiveId] = useState<string | null>(null);

  const protocols = [
    { id: "ai-id", title: "Neural Species ID", icon: ScanSearch, content: "Iniciando escaneo de patrones biológicos en el stream activo..." },
    { id: "soil", title: "Soil Analysis", icon: Droplets, content: "Humedad: 42% | pH: 6.8 | Nutrientes: Óptimos" },
    { id: "metrics", title: "Ecosystem Pulse", icon: Activity, isChart: true },
    { id: "map", title: "Geo-Biome Grid", icon: MapPin, content: "Localización: Amazon Basin Cluster 04" },
    { id: "dna", title: "DNA Archivist", icon: Binary, content: "Sincronizando catálogo genético con el Nodo Central..." },
    { id: "security", title: "Gaia Guard", icon: Shield, content: "Protocolo de defensa activado. No se detectan intrusiones." }
  ];

  const feedItems = [
    { 
      id: "1", 
      title: "Amazon Canopy Node", 
      user: "BioGuardian", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'live-1')?.imageUrl || "https://picsum.photos/seed/bio3/1280/720",
      stats: { carbon: "-820kg", oxygen: "+2.4t" }
    },
    { 
      id: "2", 
      title: "Arctic Algae Synthesis", 
      user: "FrostWatcher", 
      thumbnail: PlaceHolderImages.find(img => img.id === 'live-2')?.imageUrl || "https://picsum.photos/seed/bio4/1280/720",
      stats: { carbon: "-120kg", oxygen: "+0.8t" }
    }
  ];

  return (
    <div className="flex flex-col w-full h-full relative overflow-hidden">
      
      {/* Stream Viewer Mode */}
      {activeLiveId && (
        <div className="absolute inset-0 z-40 bg-black flex flex-col">
          <div className="relative flex-1">
            <Image 
              src={feedItems.find(i => i.id === activeLiveId)?.thumbnail || ""} 
              fill alt="Live" 
              className="object-cover opacity-40" 
            />
            <div className="absolute top-6 left-6 right-6 flex justify-between items-start z-50">
               <Button variant="ghost" size="sm" onClick={() => setActiveLiveId(null)} className="bg-black/40 backdrop-blur-xl border border-white/10 text-[10px] uppercase font-black tracking-widest text-white/50 hover:text-primary">
                 Disconnect
               </Button>
               <Badge className="bg-primary text-black text-[9px] font-black tracking-[0.2em]">LIVE NEURAL SIGNAL</Badge>
            </div>
            
            {/* Action HUD */}
            <div className="absolute bottom-10 left-6 right-6 flex gap-3 z-50">
               <Button onClick={() => setActiveProtocol("ai-id")} className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-primary hover:text-black transition-all font-black text-[10px] uppercase tracking-widest">
                 <ScanSearch size={18} className="mr-2" /> AI Identify
               </Button>
               <Button onClick={() => setActiveProtocol("soil")} className="flex-1 h-14 rounded-2xl bg-primary text-black font-black text-[10px] uppercase tracking-widest shadow-2xl shadow-primary/30">
                 <Droplets size={18} className="mr-2" /> Inject Spores
               </Button>
            </div>
          </div>
          <div className="h-[40%]">
            <ChatPanel />
          </div>
        </div>
      )}

      {/* Clean Main Hub */}
      <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar">
        
        {/* Grid de Funciones Rápidas (Decenas de Micro-Funciones) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Active Protocols</h3>
             <Zap size={14} className="text-primary animate-pulse" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {protocols.map((p) => (
              <button 
                key={p.id}
                onClick={() => setActiveProtocol(p.id)}
                className="group flex flex-col items-center justify-center gap-3 aspect-square rounded-[2rem] bg-white/2 border border-white/5 hover:border-primary/40 hover:bg-primary/5 transition-all duration-500"
              >
                <p.icon size={24} className="text-white/20 group-hover:text-primary group-hover:scale-110 transition-all" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/30 group-hover:text-white/60">{p.title}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Live Nodes Feed */}
        <section className="space-y-6">
           <div className="flex items-center justify-between px-2">
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30">Biosphere Nodes</h3>
             <span className="text-[9px] font-black text-primary/40 uppercase tracking-widest">Global Grid v0.4</span>
          </div>
          
          <div className="space-y-6">
            {feedItems.map((item) => (
              <div 
                key={item.id} 
                onClick={() => setActiveLiveId(item.id)}
                className="group relative aspect-video rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/10 cursor-pointer hover:border-primary/30 transition-all duration-700"
              >
                <Image src={item.thumbnail} fill alt={item.title} className="object-cover opacity-50 group-hover:opacity-80 group-hover:scale-105 transition-all duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                
                <div className="absolute bottom-8 left-8 right-8 space-y-3">
                   <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-[9px] font-black text-primary/80 uppercase tracking-widest">@{item.user}</span>
                   </div>
                   <h2 className="text-2xl font-black italic uppercase text-white tracking-tighter leading-none">{item.title}</h2>
                   <div className="flex gap-4 pt-2">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5">
                        <Cpu size={10} className="text-accent" />
                        <span className="text-[8px] font-black text-white/40 uppercase">{item.stats.carbon} Offset</span>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Protocol Window Manager */}
      {activeProtocol && (
        <ProtocolWindow 
          isOpen={!!activeProtocol} 
          onClose={() => setActiveProtocol(null)}
          title={protocols.find(p => p.id === activeProtocol)?.title || "Window"}
        >
          {activeProtocol === "metrics" ? (
            <div className="w-full h-64 mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorO2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#CCFF00" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#CCFF00" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="time" stroke="#ffffff30" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ background: '#050906', border: '1px solid #ffffff10', borderRadius: '1rem', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="o2" stroke="#CCFF00" fillOpacity={1} fill="url(#colorO2)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-between mt-8">
                 <div className="text-center">
                    <p className="text-[8px] font-black uppercase text-white/30">Total Biomass</p>
                    <p className="text-xl font-black text-primary">124.5t</p>
                 </div>
                 <div className="text-center">
                    <p className="text-[8px] font-black uppercase text-white/30">Network TPS</p>
                    <p className="text-xl font-black text-accent">98.2</p>
                 </div>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center space-y-6">
               <div className="w-20 h-20 rounded-[2rem] bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                 <BarChart3 size={32} className="text-primary" />
               </div>
               <p className="text-sm text-white/60 font-medium leading-relaxed max-w-[240px] mx-auto italic">
                 {protocols.find(p => p.id === activeProtocol)?.content}
               </p>
               <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 text-primary font-black uppercase tracking-widest text-[10px]">
                 Execute Sequence
               </Button>
            </div>
          )}
        </ProtocolWindow>
      )}
    </div>
  );
}