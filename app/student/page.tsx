"use client";

import { useEffect, useState } from "react";
import { RobotScene } from "@/components/robot/RobotScene";
import { StudentChatPanel } from "@/components/StudentChatPanel";
import { WebcamEmotionPanel } from "@/components/WebcamEmotionPanel";
import { StudentMenu } from "@/components/menus/StudentMenu";
import { Activity, Camera } from "lucide-react";
import { VoiceMicControl } from "@/components/VoiceMicControl";

export default function StudentHome() {
  const [emotion, setEmotion] = useState("neutral");
  const [voiceState, setVoiceState] = useState<"idle" | "listening" | "processing" | "speaking">("idle");

  useEffect(() => {
    localStorage.setItem("role", "STUDENT");
  }, []);

  return (
    <main className="min-h-screen relative">
      <div className="absolute top-4 right-4 z-20">
        <StudentMenu onLogout={() => (window.location.href = "/login?role=STUDENT") } />
      </div>
      <div className="container mx-auto px-4 py-6 h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
          <div className="lg:col-span-1 h-full">
            <StudentChatPanel onEmotionChange={(emo) => setEmotion(emo)} />
          </div>
          <div className="lg:col-span-2 h-full relative">
            <div className="glass-card rounded-2xl h-full p-6 border border-purple-700/40">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-neon-cyan">Emotion AI</p>
                  <h2 className="text-2xl font-bold">Robot cảm xúc</h2>
                  <p className="text-slate-400 text-sm">Trạng thái hiện tại: {emotion}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <Activity size={16} />
                  Cảm xúc real-time
                </div>
              </div>
              <div className="bg-gradient-to-br from-slate-900/60 to-slate-800/60 rounded-xl h-[520px] relative overflow-hidden">
                <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.15),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(124,58,237,0.15),transparent_25%)]" />
                <div className="absolute inset-0 z-10">
                  <RobotScene expression={emotion} voiceState={voiceState} />
                </div>
              </div>
            </div>
            <div className="absolute bottom-4 right-6 left-6 z-20 flex flex-wrap justify-center gap-4">
              <VoiceMicControl
                onVoiceStateChange={(state) => setVoiceState(state)}
                onVoiceResponse={(data) => {
                  if (data.emotionLabel) setEmotion(data.emotionLabel);
                }}
              />
              <div className="flex items-end gap-3">
                <div className="glass-card p-3 rounded-xl border border-slate-800 text-sm text-slate-300 flex items-center gap-2">
                  <Camera size={16} />
                  <div>
                    <p className="font-semibold">Camera cảm xúc</p>
                    <p className="text-xs text-slate-400">Bật để gửi frame phân tích</p>
                  </div>
                </div>
                <WebcamEmotionPanel onEmotion={(emo) => setEmotion(emo)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
