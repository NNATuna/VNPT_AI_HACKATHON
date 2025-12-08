"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type FormState = {
  mssv: string;
  fullName: string;
  dateOfBirth: string;
  email: string;
  parentEmail?: string;
  advisorCode?: string;
  department?: string;
  className?: string;
  password: string;
  confirmPassword: string;
};

export default function SignupPage() {
  const params = useSearchParams();
  const router = useRouter();
  const [role, setRole] = useState<"STUDENT" | "TEACHER" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [forms, setForms] = useState<{ STUDENT: FormState; TEACHER: FormState }>(
    () => ({
      STUDENT: {
        mssv: "",
        fullName: "",
        dateOfBirth: "",
        email: "",
        parentEmail: "",
        advisorCode: "",
        className: "",
        department: "",
        password: "",
        confirmPassword: "",
      },
      TEACHER: {
        mssv: "",
        fullName: "",
        dateOfBirth: "",
        email: "",
        parentEmail: "",
        advisorCode: "",
        className: "",
        department: "",
        password: "",
        confirmPassword: "",
      },
    })
  );

  useEffect(() => {
    const paramRole = (params.get("role") as any) || (localStorage.getItem("role") as any);
    if (paramRole === "TEACHER") setRole("TEACHER");
    else if (paramRole === "STUDENT") setRole("STUDENT");
    else router.replace("/");
  }, [params, router]);

  const form = role ? forms[role] : forms.STUDENT;

  function updateField(key: keyof FormState, value: string) {
    setForms((prev) => {
      if (!role) return prev;
      return {
        ...prev,
        [role]: {
          ...prev[role],
          [key]: value,
        },
      };
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!role) return;
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        role,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Đăng ký thất bại");
      return;
    }
    router.push(`/login?role=${role}`);
  }

  if (!role) return null;

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="glass-card rounded-2xl p-8 max-w-3xl w-full">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-neon-cyan">Đăng ký {role === "STUDENT" ? "Học sinh" : "Giáo viên"}</p>
            <h1 className="text-2xl font-bold text-glow">Tạo tài khoản</h1>
            <p className="text-[11px] text-slate-500 mt-1">Vai trò cố định từ màn hình chọn ban đầu. Quay lại trang chủ để đổi.</p>
          </div>
          <Link href="/" className="text-xs text-neon-cyan hover:text-white">
            Quay về menu chính
          </Link>
        </div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={onSubmit}>
          <div>
            <label>MSSV</label>
            <input value={form.mssv} onChange={(e) => updateField("mssv", e.target.value)} required />
          </div>
          <div>
            <label>Họ tên</label>
            <input value={form.fullName} onChange={(e) => updateField("fullName", e.target.value)} required />
          </div>
          <div>
            <label>Ngày sinh</label>
            <input type="date" value={form.dateOfBirth} onChange={(e) => updateField("dateOfBirth", e.target.value)} required />
          </div>
          <div>
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} required />
          </div>
          {role === "STUDENT" ? (
            <>
              <div>
                <label>Mã GV quản lý</label>
                <input value={form.advisorCode} onChange={(e) => updateField("advisorCode", e.target.value)} required />
              </div>
              <div>
                <label>Email phụ huynh</label>
                <input
                  type="email"
                  value={form.parentEmail}
                  onChange={(e) => updateField("parentEmail", e.target.value)}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label>Khoa/Bộ môn (tuỳ chọn)</label>
                <input value={form.department} onChange={(e) => updateField("department", e.target.value)} />
              </div>
              <div>
                <label>Lớp/nhóm phụ trách</label>
                <input value={form.className} onChange={(e) => updateField("className", e.target.value)} />
              </div>
            </>
          )}
          <div>
            <label>Mật khẩu</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => updateField("password", e.target.value)}
              required
            />
          </div>
          <div>
            <label>Nhập lại mật khẩu</label>
            <input
              type="password"
              value={form.confirmPassword}
              onChange={(e) => updateField("confirmPassword", e.target.value)}
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm md:col-span-2">{error}</p>}
          <div className="md:col-span-2 flex justify-between items-center">
            <Link href={`/login?role=${role}`} className="text-sm text-neon-cyan">
              Đã có tài khoản? Đăng nhập
            </Link>
            <button type="submit" className="btn-primary px-6">
              Tạo tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
