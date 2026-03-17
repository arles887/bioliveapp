"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
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
          title: "Message Blocked",
          description: moderation.reason || "Your message was flagged.",
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
    <div className="flex flex-col h-full bg-white rounded-t-[2.5rem] overflow-hidden border-t">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="font-bold text-sm text-primary tracking-tight">Community Chat</h3>
        <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-full">
          <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></div>
          <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">Live</span>
        </div>
      </div>
      
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col gap-1">
            <span className="text-[10px] font-black text-accent-foreground/50 uppercase tracking-widest">{msg.user}</span>
            <div className="bg-neutral-50 rounded-2xl rounded-tl-none px-4 py-2.5 text-sm text-neutral-800 border border-neutral-100 max-w-[90%]">
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-neutral-50 border-t flex gap-3">
        <Input 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Join the conversation..." 
          className="flex-1 h-12 bg-white border-neutral-200 rounded-2xl focus-visible:ring-primary px-5"
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isSending}
          className="rounded-2xl h-12 w-12 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
        >
          <Send size={20} />
        </Button>
      </form>
    </div>
  );
}