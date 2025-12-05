"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const params = useSearchParams();
  const [mssv, setMssv] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"STUDENT" | "TEACHER">("STUDENT");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const paramRole = (params.get("role") as any) || (localStorage.getItem("role") as any);
    if (paramRole === "TEACHER") setRole("TEACHER");
    if (paramRole === "STUDENT") setRole("STUDENT");
  }, [params]);

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
      body: JSON.stringify({ mssv, password, role }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Đăng nhập thất bại");
      return;
    }
    localStorage.setItem("accessToken", data.accessToken);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("role", data.role);
    router.push(data.role === "TEACHER" ? "/teacher" : "/student");
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-neon-cyan">{role === "STUDENT" ? "Học sinh" : "Giáo viên"}</p>
          <h1 className="text-2xl font-bold mb-2 text-glow">Đăng nhập</h1>
          <p className="text-slate-400 mb-2">AI chatbot, vision & báo cáo cảm xúc.</p>
          <div className="flex gap-2 text-xs text-slate-400">
            <button className={`px-2 py-1 rounded ${role === "STUDENT" ? "bg-slate-800" : ""}`} onClick={() => setRole("STUDENT")}>Học sinh</button>
            <button className={`px-2 py-1 rounded ${role === "TEACHER" ? "bg-slate-800" : ""}`} onClick={() => setRole("TEACHER")}>Giáo viên</button>
          </div>
        </div>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label>{role === "TEACHER" ? "Mã GV / MSSV" : "Mã số sinh viên"}</label>
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
        <div className="flex items-center justify-between mt-2 text-sm text-slate-400">
          <Link href={`/signup?role=${role}`} className="hover:text-white">
            Đăng ký tài khoản mới
          </Link>
          <Link href={`/forgot-password?role=${role}`} className="hover:text-white">
            Quên mật khẩu?
          </Link>
        </div>
      </div>
    </div>
  );
}
