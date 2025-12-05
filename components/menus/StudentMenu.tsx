"use client";

import { useState } from "react";
import { Download, LogOut, Send, User, Menu, FileText } from "lucide-react";

export function StudentMenu({ onLogout }: { onLogout?: () => void }) {
  const [open, setOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [range, setRange] = useState("7d");
  const [status, setStatus] = useState<string | null>(null);

  async function download() {
    const res = await fetch("/api/download/student");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "student-report.txt";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function sendReport() {
    setStatus("Đang gửi...");
    const res = await fetch("/api/reports/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: "Bạn",
        parentEmail: "parent@example.com",
        range,
        summary: "Trạng thái ổn định, đôi lúc căng thẳng nhẹ.",
      }),
    });
    const data = await res.json();
    setStatus(data.status === "ok" ? "Đã gửi báo cáo (mock)" : "Gửi thất bại");
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-full bg-slate-900 border border-purple-700/60 shadow-glow"
      >
        <Menu />
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-64 glass-card rounded-2xl p-3 space-y-2 z-20">
          <button className="menu-item"><User size={16} />Hồ sơ cá nhân</button>
          <button className="menu-item" onClick={download}><Download size={16} />Tải dữ liệu</button>
          <button className="menu-item" onClick={() => setShowReport(true)}><Send size={16} />Gửi báo cáo phụ huynh</button>
          <button
            className="menu-item"
            onClick={() => {
              localStorage.clear();
              onLogout?.();
            }}
          >
            <LogOut size={16} />Đăng xuất
          </button>
        </div>
      )}
      {showReport && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30">
          <div className="glass-card p-6 rounded-2xl w-full max-w-md space-y-4">
            <div className="flex items-center gap-2">
              <FileText size={18} />
              <h3 className="font-semibold">Gửi báo cáo cho phụ huynh</h3>
            </div>
            <div className="space-y-2 text-sm">
              <p>Chọn khoảng thời gian:</p>
              <select value={range} onChange={(e) => setRange(e.target.value)} className="w-full">
                <option value="7d">7 ngày gần nhất</option>
                <option value="month">Tháng này</option>
                <option value="custom">Tùy chỉnh (mock)</option>
              </select>
              <p className="text-slate-400">Cảm xúc trung bình: 0.62 • Số lần stress: 1 • Gợi ý: ngủ đủ 7-8h.</p>
            </div>
            {status && <p className="text-xs text-neon-cyan">{status}</p>}
            <div className="flex justify-end gap-2">
              <button className="text-sm px-4 py-2" onClick={() => setShowReport(false)}>Đóng</button>
              <button className="btn-primary text-sm" onClick={sendReport}>Gửi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
