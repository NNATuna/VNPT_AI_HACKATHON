import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { validateResetToken } from "../forgot-password/route";

export async function POST(request: Request) {
  const { token, newPassword } = await request.json();
  const userId = token ? validateResetToken(token) : null;
  if (!userId) return NextResponse.json({ error: "Token không hợp lệ" }, { status: 400 });
  if (!newPassword || newPassword.length < 6)
    return NextResponse.json({ error: "Mật khẩu quá ngắn" }, { status: 400 });

  const passwordHash = await bcrypt.hash(newPassword, 10);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
  return NextResponse.json({ message: "Đặt lại mật khẩu thành công" });
}
