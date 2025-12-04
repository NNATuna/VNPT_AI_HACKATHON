"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [mssv, setMssv] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mssv, email }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Không gửi được liên kết");
      return;
    }
    setMessage(data.message);
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-glow">Quên mật khẩu</h1>
        <p className="text-slate-400 mb-6">Nhập MSSV và email để nhận liên kết đặt lại mật khẩu.</p>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label>Mã số sinh viên</label>
            <input value={mssv} onChange={(e) => setMssv(e.target.value)} className="w-full mt-1" />
          </div>
          <div>
            <label>Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}
          <button type="submit" className="btn-primary w-full">
            Gửi liên kết
          </button>
        </form>
        <div className="text-sm text-slate-400 mt-4">
          <Link href="/login" className="hover:text-white">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
}
