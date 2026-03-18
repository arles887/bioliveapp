
"use client";

import { Search, Plus } from "lucide-react";
import Image from "next/image";

export function ChatList() {
  const chats = [
    { id: "1", name: "Gaia Guard Squad", lastMsg: "Detection at Sector 7, analysis required.", time: "12:45", unread: 2, avatar: "https://picsum.photos/seed/chat1/100/100" },
    { id: "2", name: "Botany Labs", lastMsg: "The spores are evolving as expected.", time: "10:20", unread: 0, avatar: "https://picsum.photos/seed/chat2/100/100" },
    { id: "3", name: "Solaris Node", lastMsg: "Sync complete. Uploading DNA logs.", time: "Yesterday", unread: 0, avatar: "https://picsum.photos/seed/chat3/100/100" },
  ];

  return (
    <div className="flex flex-col h-full bg-[#020503] animate-in fade-in duration-500">
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black italic uppercase text-white tracking-tighter">Bio<span className="text-primary">Talk</span></h2>
          <div className="h-10 w-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-black transition-all">
            <Plus size={20} />
          </div>
        </div>

        <div className="relative">
          <Search size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20" />
          <input 
            type="text" 
            placeholder="Search signals..." 
            className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-sm text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-white/20"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 space-y-4 no-scrollbar">
        {chats.map((chat) => (
          <div key={chat.id} className="group flex items-center gap-5 p-4 rounded-[2rem] hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/5">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all border border-white/10">
                <Image src={chat.avatar} width={56} height={56} alt="Avatar" />
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-primary border-4 border-[#020503] rounded-full"></div>
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-black text-white text-sm italic uppercase tracking-tight">{chat.name}</h4>
                <span className="text-[10px] text-white/20 font-bold">{chat.time}</span>
              </div>
              <p className="text-xs text-white/40 line-clamp-1 font-medium">{chat.lastMsg}</p>
            </div>
            {chat.unread > 0 && (
              <div className="h-5 w-5 bg-primary rounded-full flex items-center justify-center">
                <span className="text-[10px] font-black text-black">{chat.unread}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
