"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChatMessage = { id: string; sender: "user" | "bot"; text: string };

export function StudentChatPanel({ onEmotionChange }: { onEmotionChange?: (emotion: string) => void }) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", sender: "bot", text: "Xin chào! Mình là Sunny, trợ lý cảm xúc của bạn." },
  ]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    const text = input.trim();
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, token: localStorage.getItem("accessToken") }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "bot", text: data.replyText }]);
      onEmotionChange?.(data.emotionLabel);
    } catch (error) {
      setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender: "bot", text: "Bot đang bận, thử lại nhé!" }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col glass-card rounded-2xl border border-purple-700/60 shadow-glow">
      <div className="p-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-600 to-cyan-500 flex items-center justify-center font-semibold">
          AI
        </div>
        <div>
          <p className="font-semibold text-lg">Sunny – AI Cố Vấn</p>
          <p className="text-xs text-slate-400">Luôn lắng nghe cảm xúc của bạn</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m) => (
          <div key={m.id} className={cn("text-sm", m.sender === "user" ? "text-right" : "text-left")}> 
            <span
              className={cn(
                "inline-block px-3 py-2 rounded-xl",
                m.sender === "user"
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                  : "bg-slate-800 text-slate-100"
              )}
            >
              {m.text}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div className="p-4 border-t border-slate-800 flex items-center gap-2">
        <button className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300" title="STT (mock)">
          <Mic size={18} />
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 bg-slate-900/60 border border-slate-700 rounded-lg px-3 py-2 text-sm"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-cyan-400 text-white disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
