"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, StopCircle, Waves } from "lucide-react";

type VoiceState = "idle" | "listening" | "processing" | "speaking";

type VoiceResponse = {
  replyText: string;
  emotionLabel: string;
};

interface VoiceMicControlProps {
  onVoiceStateChange?: (state: VoiceState) => void;
  onVoiceResponse?: (data: VoiceResponse) => void;
}

export function VoiceMicControl({ onVoiceResponse, onVoiceStateChange }: VoiceMicControlProps) {
  const [state, setState] = useState<VoiceState>("idle");
  const [hint, setHint] = useState<string>("Nhấn giữ để nói, thả để gửi");
  const [disabled, setDisabled] = useState(false);
  const isHolding = useRef(false);

  const updateState = (next: VoiceState) => {
    setState(next);
    onVoiceStateChange?.(next);
  };

  const stopAll = () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    isHolding.current = false;
    updateState("idle");
    setHint("Nhấn giữ để nói, thả để gửi");
  };

  const sendVoiceMock = async () => {
    try {
      updateState("processing");
      setHint("Đang gửi lên AI...");
      const res = await fetch("/api/chat/voice", { method: "POST" });
      if (!res.ok) throw new Error("Voice API error");
      const data = await res.json();
      onVoiceResponse?.(data);
      if (typeof window !== "undefined" && "speechSynthesis" in window && data.replyText) {
        const uttr = new SpeechSynthesisUtterance(data.replyText);
        uttr.onend = () => updateState("idle");
        updateState("speaking");
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(uttr);
        setHint("AI đang nói, nhấn Stop để ngắt");
      } else {
        updateState("idle");
        setHint("Nhấn giữ để nói, thả để gửi");
      }
    } catch (err) {
      console.error(err);
      updateState("idle");
      setHint("Không gửi được, thử lại");
    }
  };

  const handlePressStart = () => {
    if (disabled) return;
    isHolding.current = true;
    updateState("listening");
    setHint("Đang ghi âm, thả để gửi");
  };

  const handlePressEnd = () => {
    if (!isHolding.current || disabled) return;
    isHolding.current = false;
    sendVoiceMock().catch(() => {
      updateState("idle");
      setHint("Không gửi được, thử lại");
    });
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" && !isHolding.current) {
        e.preventDefault();
        handlePressStart();
      }
      if (e.code === "Escape") {
        e.preventDefault();
        stopAll();
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handlePressEnd();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return (
    <div className="glass-card border border-purple-700/50 rounded-2xl p-4 flex flex-col items-center gap-3 w-[240px]">
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Waves size={14} className="text-neon-cyan" />
        <span>Voice chat với AI</span>
      </div>
      <button
        className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-glow transition transform active:scale-95 ${
          state === "listening" ? "bg-cyan-500/80" : state === "speaking" ? "bg-violet-600/80" : "bg-slate-800"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:border hover:border-cyan-400"}`}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={(e) => {
          e.preventDefault();
          handlePressStart();
        }}
        onTouchEnd={(e) => {
          e.preventDefault();
          handlePressEnd();
        }}
        aria-label="Voice mic button"
      >
        {state === "speaking" ? <MicOff size={32} /> : <Mic size={32} />}
      </button>
      <p className="text-center text-xs text-slate-300 min-h-[28px]">{hint}</p>
      <div className="flex items-center gap-2">
        <button
          onClick={stopAll}
          className="flex items-center gap-1 text-xs text-red-300 hover:text-red-200"
        >
          <StopCircle size={14} /> Stop
        </button>
        <button
          onClick={() => setDisabled((d) => !d)}
          className="flex items-center gap-1 text-xs text-slate-400 hover:text-white"
        >
          {disabled ? "Bật mic" : "Tắt mic"}
        </button>
      </div>
      <p className="text-[10px] text-slate-500 text-center">
        Giữ Space để nói, thả Space để gửi. Nhấn Esc hoặc Stop để ngắt.
      </p>
    </div>
  );
}
