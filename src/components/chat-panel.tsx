"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Shield } from "lucide-react";
import { aiChatMessageModeration } from "@/ai/flows/ai-chat-message-moderation";
import { toast } from "@/hooks/use-toast";

interface Message {
  id: string;
  user: string;
  text: string;
  isModerated?: boolean;
}

export function ChatPanel() {
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", user: "GardenGuru", text: "Welcome everyone! Ask me anything about soil health." },
    { id: "2", user: "BioFan99", text: "What's the best organic fertilizer?" },
    { id: "3", user: "CyberNature", text: "Loving the neon vibes here! 🌿⚡" },
  ]);
  const [inputText, setInputText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    setIsSending(true);
    try {
      const moderation = await aiChatMessageModeration({ message: inputText });
      
      if (!moderation.isSafe) {
        toast({
          title: "System Guard Active",
          description: moderation.reason || "Signal filtered for safety.",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        user: "Me",
        text: inputText,
      };
      setMessages([...messages, newMessage]);
      setInputText("");
    } catch (error) {
      console.error("Moderation error:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#050906] rounded-t-[3rem] overflow-hidden border-t border-white/10">
      <div className="px-8 py-5 border-b border-white/5 flex items-center justify-between bg-white/2">
        <div className="flex items-center gap-3">
            <Shield size={14} className="text-primary" />
            <h3 className="font-black text-[11px] text-primary uppercase tracking-[0.3em] italic">Bio Community</h3>
        </div>
        <div className="flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(204,255,0,1)]"></div>
          <span className="text-[10px] font-black text-primary uppercase tracking-widest italic">Signal Live</span>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col gap-2 group">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">@{msg.user}</span>
            <div className="bg-white/5 rounded-[1.5rem] rounded-tl-none px-5 py-3.5 text-sm text-white/80 border border-white/5 max-w-[90%] transition-all hover:bg-white/10">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-6 bg-[#050906] border-t border-white/5 flex gap-4">
        <Input 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Inject signal..." 
          className="flex-1 h-14 bg-white/5 border-white/10 rounded-[1.5rem] focus-visible:ring-primary px-6 text-white text-sm placeholder:text-white/20"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isSending}
          className="rounded-[1.5rem] h-14 w-14 bg-primary hover:bg-primary/90 shadow-2xl shadow-primary/30 transition-all hover:scale-105"
        >
          <Send size={22} className="text-black" />
        </Button>
      </form>
    </div>
  );
}