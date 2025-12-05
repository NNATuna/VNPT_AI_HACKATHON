"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Rocket, Users, Sparkles } from "lucide-react";
import Link from "next/link";

const roles = [
  {
    key: "STUDENT",
    title: "Tôi là Học sinh",
    desc: "Chat với robot AI, phân tích cảm xúc đa modal và gửi báo cáo cho phụ huynh.",
    href: "/login?role=STUDENT",
  },
  {
    key: "TEACHER",
    title: "Tôi là Giáo viên",
    desc: "Xem dashboard cảm xúc của lớp, tải báo cáo và theo dõi cảnh báo.",
    href: "/login?role=TEACHER",
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("role");
    if (saved === "STUDENT") return;
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-6xl w-full space-y-8">
        <div className="text-center space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-neon-cyan">VNPT AI Hackathon</p>
          <h1 className="text-3xl md:text-4xl font-bold">Chọn vai trò của bạn</h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Nền tảng AI hỗ trợ tâm lý – giám sát cảm xúc học sinh bằng chatbot, vision và báo cáo tự động.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <button
              key={role.key}
              onClick={() => {
                localStorage.setItem("role", role.key);
                router.push(role.href);
              }}
              className="glass-card rounded-2xl p-6 text-left border border-purple-700/50 hover:border-neon-cyan shadow-glow transition"
            >
              <div className="flex items-center gap-3 text-neon-cyan mb-2">
                <Rocket size={18} />
                <span className="text-xs uppercase tracking-[0.2em]">{role.key}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{role.title}</h3>
              <p className="text-slate-300 text-sm">{role.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-neon-cyan">
                <Sparkles size={16} /> Bắt đầu ngay
              </div>
            </button>
          ))}
        </div>
        <div className="glass-card rounded-2xl p-6 border border-slate-800 text-sm text-slate-300">
          <div className="flex items-center gap-2 mb-2">
            <Users size={18} />
            <p className="font-semibold">Flow Auth</p>
          </div>
          <ul className="list-disc list-inside space-y-1">
            <li>Đăng nhập / Đăng ký tách theo vai trò, form tự động điền role đã chọn.</li>
            <li>Quên mật khẩu qua MSSV + email, gửi link reset (mock).</li>
            <li>Bảo mật JWT + hash mật khẩu, sẵn sàng nối API VNPT SmartBot/SmartVoice/SmartVision.</li>
          </ul>
          <div className="mt-3 flex gap-4 text-xs text-neon-cyan">
            <Link href="/login">Đăng nhập</Link>
            <Link href="/signup">Đăng ký</Link>
            <Link href="/student">Xem giao diện học sinh</Link>
            <Link href="/teacher">Xem dashboard giáo viên</Link>
          </div>
        </div>
      </div>
    </main>
  );
}
