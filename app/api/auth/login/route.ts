import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signTokens } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  const { mssv, password, role } = await request.json();
  if (!mssv || !password) {
    return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { mssv } });
  if (!user) return NextResponse.json({ error: "Sai thông tin đăng nhập" }, { status: 401 });
  if (role && user.role !== role) {
    return NextResponse.json({ error: "Sai vai trò" }, { status: 403 });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return NextResponse.json({ error: "Sai thông tin đăng nhập" }, { status: 401 });

  const tokens = signTokens({ userId: user.id, role: user.role, mssv: user.mssv });
  return NextResponse.json({
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    role: user.role,
    fullName: user.fullName,
  });
}
