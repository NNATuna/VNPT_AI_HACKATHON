import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { validateResetToken } from "../forgot-password/route";

export async function POST(request: Request) {
  const { token, newPassword } = await request.json();
  const payload = token ? validateResetToken(token) : null;
  if (!payload) return NextResponse.json({ error: "Token không hợp lệ" }, { status: 400 });
  if (!newPassword || newPassword.length < 6)
    return NextResponse.json({ error: "Mật khẩu quá ngắn" }, { status: 400 });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  if (payload.role === "STUDENT") {
    await prisma.student.update({ where: { id: payload.userId }, data: { passwordHash } });
  } else {
    await prisma.teacher.update({ where: { id: payload.userId }, data: { passwordHash } });
  }
  return NextResponse.json({ message: "Đặt lại mật khẩu thành công" });
}
