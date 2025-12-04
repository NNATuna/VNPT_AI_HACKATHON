"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    setError(null);
    if (password !== confirm) {
      setError("Mật khẩu không khớp");
      return;
    }
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Không đặt lại được mật khẩu");
      return;
    }
    setMessage("Đổi mật khẩu thành công");
    setTimeout(() => router.push("/login"), 1000);
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="glass-card rounded-2xl p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-2 text-glow">Đặt lại mật khẩu</h1>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div>
            <label>Mật khẩu mới</label>
            <input value={password} onChange={(e) => setPassword(e.target.value)} className="w-full mt-1" type="password" />
          </div>
          <div>
            <label>Nhập lại mật khẩu</label>
            <input value={confirm} onChange={(e) => setConfirm(e.target.value)} className="w-full mt-1" type="password" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-green-400 text-sm">{message}</p>}
          <button className="btn-primary w-full" type="submit">
            Xác nhận
          </button>
        </form>
      </div>
    </div>
  );
}
