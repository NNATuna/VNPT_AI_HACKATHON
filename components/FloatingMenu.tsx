"use client";

import { useState } from "react";
import { LogOut, Menu, Settings, User, Send, Users } from "lucide-react";

export function FloatingMenu({ role }: { role?: "STUDENT" | "TEACHER" }) {
  const [open, setOpen] = useState(false);
  const actions = [
    { label: "Cài đặt", icon: <Settings size={18} /> },
    { label: "Hồ sơ cá nhân", icon: <User size={18} /> },
    { label: "Gửi báo cáo cho phụ huynh", icon: <Send size={18} />, id: "report" },
    ...(role === "TEACHER" ? [{ label: "Quản lý học sinh", icon: <Users size={18} />, id: "students" }] : []),
    { label: "Đăng xuất", icon: <LogOut size={18} /> },
  ];

  return (
    <div className="fixed bottom-6 right-6 text-sm">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-slate-900 border border-purple-700/60 shadow-glow flex items-center justify-center hover:scale-105 transition"
      >
        <Menu />
      </button>
      {open && (
        <div className="mt-3 w-64 glass-card rounded-2xl p-3 space-y-2">
          {actions.map((action) => (
            <button
              key={action.label}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-900/40 hover:bg-slate-800 border border-slate-800"
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
