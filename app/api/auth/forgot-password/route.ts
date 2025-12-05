import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

const tokens = new Map<string, { userId: string; role: "STUDENT" | "TEACHER"; expireAt: number }>();

export async function POST(request: Request) {
  const { mssv, email } = await request.json();
  if (!mssv || !email) return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
  const student = await prisma.student.findUnique({ where: { mssv } });
  const teacher = await prisma.teacher.findUnique({ where: { mssv } });
  const matched = student?.email === email ? { role: "STUDENT" as const, id: student.id } : teacher?.email === email ? { role: "TEACHER" as const, id: teacher.id } : null;
  if (!matched) return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
  const token = crypto.randomBytes(16).toString("hex");
  tokens.set(token, { userId: matched.id, role: matched.role, expireAt: Date.now() + 1000 * 60 * 30 });
  const resetUrl = `${process.env.NEXT_PUBLIC_API_BASE}/reset-password?token=${token}`;
  console.info("[MockResetLink]", resetUrl);
  return NextResponse.json({ message: "Đã gửi liên kết đặt lại mật khẩu (mock)", resetUrl });
}

export function validateResetToken(token: string) {
  const payload = tokens.get(token);
  if (!payload || payload.expireAt < Date.now()) return null;
  return payload;
}
