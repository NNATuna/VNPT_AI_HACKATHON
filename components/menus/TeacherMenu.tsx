"use client";

import { useState } from "react";
import { Download, LogOut, Menu, User } from "lucide-react";

export function TeacherMenu({ onLogout }: { onLogout?: () => void }) {
  const [open, setOpen] = useState(false);

  async function download() {
    const res = await fetch("/api/download/teacher");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "teacher-dashboard.csv";
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="absolute right-0 mt-2 w-56 glass-card rounded-2xl p-3 space-y-2 z-20">
          <button className="menu-item"><User size={16} />Hồ sơ cá nhân</button>
          <button className="menu-item" onClick={download}><Download size={16} />Tải dữ liệu</button>
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
    </div>
  );
}
