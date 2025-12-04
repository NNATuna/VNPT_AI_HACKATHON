"use client";

import { useEffect, useState } from "react";
import { RobotScene } from "@/components/robot/RobotScene";
import { ChatPopup } from "@/components/ChatPopup";
import { FloatingMenu } from "@/components/FloatingMenu";
import { WebcamEmotionPanel } from "@/components/WebcamEmotionPanel";
import { GradientCard } from "@/components/ui/gradient-card";
import { Activity, Sparkles, Heart } from "lucide-react";

export default function HomePage() {
  const [emotion, setEmotion] = useState("neutral");
  const [role, setRole] = useState<"STUDENT" | "TEACHER" | null>(null);

  useEffect(() => {
    setRole((localStorage.getItem("role") as any) || "STUDENT");
  }, []);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1">
            <GradientCard className="flex flex-col lg:flex-row items-center gap-6">
              <div className="flex-1 space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-neon-cyan">VNPT AI Hackathon</p>
                <h1 className="text-3xl font-bold leading-tight">
                  Nền tảng AI hỗ trợ tâm lý & giám sát cảm xúc học sinh
                </h1>
                <p className="text-slate-300">
                  Chatbot/voice AI, phân tích cảm xúc đa modal và báo cáo tự động cho phụ huynh - giáo viên.
                </p>
                <div className="flex gap-3 text-sm text-slate-300">
                  <span className="flex items-center gap-2"><Sparkles size={16} /> Chatbot & STT/TTS (mock)</span>
                  <span className="flex items-center gap-2"><Activity size={16} /> Vision cảm xúc</span>
                  <span className="flex items-center gap-2"><Heart size={16} /> Báo cáo phụ huynh</span>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-slate-400">Robot cảm nhận bạn đang:</p>
                  <p className="text-xl font-semibold text-neon-cyan">{emotion}</p>
                </div>
              </div>
              <div className="flex-1 w-full">
                <RobotScene expression={emotion} />
              </div>
            </GradientCard>
            <div className="mt-4">
              <WebcamEmotionPanel onEmotion={(e) => setEmotion(e)} />
            </div>
          </div>
          <div className="w-full lg:w-96 space-y-4">
            <GradientCard>
              <h3 className="font-semibold mb-2">Dashboard nhanh</h3>
              <div className="space-y-2 text-sm text-slate-300">
                <div className="flex justify-between"><span>Phiên tư vấn tuần này</span><span>5</span></div>
                <div className="flex justify-between"><span>Điểm cảm xúc trung bình</span><span>72/100</span></div>
                <div className="flex justify-between"><span>Cảnh báo stress</span><span className="text-yellow-400">1</span></div>
              </div>
            </GradientCard>
            <GradientCard>
              <h3 className="font-semibold mb-2">Gợi ý tự chăm sóc</h3>
              <ul className="list-disc list-inside text-sm text-slate-300 space-y-1">
                <li>Thử bài tập thở 4-7-8 trong 2 phút.</li>
                <li>Viết xuống 3 điều làm bạn vui hôm nay.</li>
                <li>Chia sẻ với cố vấn nếu cảm thấy áp lực kéo dài.</li>
              </ul>
            </GradientCard>
          </div>
        </div>
      </div>
      <ChatPopup onEmotionChange={(emo) => setEmotion(emo)} />
      <FloatingMenu role={role || undefined} />
    </main>
  );
}
