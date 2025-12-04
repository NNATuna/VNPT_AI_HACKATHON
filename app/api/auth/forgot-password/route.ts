import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

const tokens = new Map<string, { userId: string; expireAt: number }>();

export async function POST(request: Request) {
  const { mssv, email } = await request.json();
  if (!mssv || !email) return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
  const user = await prisma.user.findUnique({ where: { mssv } });
  if (!user || user.email !== email) return NextResponse.json({ error: "Không tìm thấy người dùng" }, { status: 404 });
  const token = crypto.randomBytes(16).toString("hex");
  tokens.set(token, { userId: user.id, expireAt: Date.now() + 1000 * 60 * 30 });
  const resetUrl = `${process.env.NEXT_PUBLIC_API_BASE}/reset-password?token=${token}`;
  console.info("[MockResetLink]", resetUrl);
  return NextResponse.json({ message: "Đã gửi liên kết đặt lại mật khẩu (mock)", resetUrl });
}

export function validateResetToken(token: string) {
  const payload = tokens.get(token);
  if (!payload || payload.expireAt < Date.now()) return null;
  return payload.userId;
}
