"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const [mssv, setMssv] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!mssv || !password) {
      setError("Vui lòng nhập đủ MSSV và mật khẩu");
      return;
    }
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mssv, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Đăng nhập thất bại");
      return;
    }
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("role", data.role);
    router.push("/");
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-glow">Đăng nhập</h1>
        <p className="text-slate-400 mb-6">Nền tảng AI hỗ trợ tâm lý cho học sinh</p>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label>Mã số sinh viên</label>
            <input value={mssv} onChange={(e) => setMssv(e.target.value)} placeholder="VD: SV001" className="w-full mt-1" />
          </div>
          <div>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******"
              className="w-full mt-1"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" className="btn-primary w-full mt-2">
            Đăng nhập
          </button>
        </form>
        <div className="flex items-center justify-between mt-4 text-sm text-slate-400">
          <Link href="/signup" className="hover:text-white">
            Đăng ký tài khoản mới
          </Link>
          <Link href="/forgot-password" className="hover:text-white">
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
}
