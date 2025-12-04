"use client";

import { useEffect, useRef, useState } from "react";
import { Camera } from "lucide-react";

export function WebcamEmotionPanel({ onEmotion }: { onEmotion: (emotion: string) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [emotion, setEmotion] = useState("neutral");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = stream;
        interval = setInterval(async () => {
          const frameBase64 = "mock-frame";
          const res = await fetch("/api/emotion/vision", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ frameBase64, token: localStorage.getItem("accessToken") }),
          });
          const data = await res.json();
          setEmotion(data.faceEmotion);
          onEmotion(data.faceEmotion);
        }, 4000);
      } catch (error) {
        console.warn("Camera denied", error);
      }
    }
    if (enabled) startCamera();
    return () => {
      interval && clearInterval(interval);
      const tracks = (videoRef.current?.srcObject as MediaStream | undefined)?.getTracks();
      tracks?.forEach((t) => t.stop());
    };
  }, [enabled, onEmotion]);

  return (
    <div className="glass-card rounded-2xl p-3 w-64">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Camera size={18} />
          <span className="text-sm font-semibold">Webcam cảm xúc</span>
        </div>
        <button
          className="text-xs px-2 py-1 rounded bg-slate-800 border border-slate-700"
          onClick={() => setEnabled((v) => !v)}
        >
          {enabled ? "Tắt" : "Bật"}
        </button>
      </div>
      <video ref={videoRef} autoPlay muted playsInline className="rounded-lg border border-slate-800 bg-black/40 h-32 w-full" />
      <p className="text-xs text-slate-400 mt-2">Trạng thái: {emotion}</p>
    </div>
  );
}
