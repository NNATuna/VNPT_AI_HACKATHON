"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const roles = [
  { label: "Học sinh", value: "STUDENT" },
  { label: "Giáo viên", value: "TEACHER" },
];

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    mssv: "",
    fullName: "",
    dateOfBirth: "",
    email: "",
    advisorCode: "",
    parentEmail: "",
    role: "STUDENT",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không trùng khớp");
      return;
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, confirmPassword: undefined }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Đăng ký thất bại");
      return;
    }
    setSuccess("Đăng ký thành công, vui lòng đăng nhập");
    setTimeout(() => router.push("/login"), 1000);
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="glass-card rounded-2xl p-8 max-w-2xl w-full">
        <h1 className="text-2xl font-bold mb-2 text-glow">Đăng ký</h1>
        <p className="text-slate-400 mb-6">Tạo tài khoản học sinh hoặc giáo viên</p>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
          <div>
            <label>Mã số sinh viên</label>
            <input value={form.mssv} onChange={(e) => setForm({ ...form, mssv: e.target.value })} className="w-full mt-1" />
          </div>
          <div>
            <label>Họ tên</label>
            <input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label>Ngày sinh</label>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label>Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full mt-1" />
          </div>
          <div>
            <label>Mã giáo viên quản lý</label>
            <input
              value={form.advisorCode}
              onChange={(e) => setForm({ ...form, advisorCode: e.target.value })}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label>Email phụ huynh</label>
            <input
              value={form.parentEmail}
              onChange={(e) => setForm({ ...form, parentEmail: e.target.value })}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label>Vai trò</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full mt-1"
            >
              {roles.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1"
            />
          </div>
          <div>
            <label>Nhập lại mật khẩu</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              className="w-full mt-1"
            />
          </div>
          {error && <p className="text-red-400 text-sm col-span-2">{error}</p>}
          {success && <p className="text-green-400 text-sm col-span-2">{success}</p>}
          <div className="col-span-2">
            <button type="submit" className="btn-primary w-full">
              Tạo tài khoản
            </button>
          </div>
        </form>
        <div className="text-sm text-slate-400 mt-4">
          Đã có tài khoản? <Link href="/login" className="hover:text-white">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
}
