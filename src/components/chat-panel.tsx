
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, AlertCircle } from "lucide-react";
import { aiChatMessageModeration } from "@/ai/flows/ai-chat-message-moderation";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

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
      // AI Content Moderation
      const moderation = await aiChatMessageModeration({ message: inputText });
      
      if (!moderation.isSafe) {
        toast({
          title: "Message Blocked",
          description: moderation.reason || "Your message was flagged as inappropriate.",
          variant: "destructive",
        });
        setIsSending(false);
        return;
      }

      const newMessage: Message = {
        id: Date.now().toString(),
        user: "You",
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
    <div className="flex flex-col h-full bg-black/20 backdrop-blur-sm rounded-t-2xl border-x border-t overflow-hidden">
      <div className="p-3 border-b bg-primary/10 flex items-center justify-between">
        <h3 className="font-semibold text-sm">Live Chat</h3>
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Live</span>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col gap-0.5">
            <span className="text-[11px] font-bold text-accent">{msg.user}</span>
            <div className="bg-white/10 rounded-xl rounded-tl-none p-2 text-sm text-white">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-3 bg-white/5 flex gap-2">
        <Input 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Say something nice..." 
          className="flex-1 h-10 bg-white/10 border-none text-white placeholder:text-white/40 rounded-full focus-visible:ring-primary"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isSending}
          className="rounded-full bg-primary hover:bg-primary/90 shrink-0"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}
