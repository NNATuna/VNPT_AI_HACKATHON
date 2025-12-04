import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  mssv: z.string().min(3),
  fullName: z.string().min(3),
  dateOfBirth: z.string(),
  email: z.string().email(),
  advisorCode: z.string(),
  parentEmail: z.string().email(),
  role: z.enum(["STUDENT", "TEACHER"]),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parse = schema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
  const data = parse.data;
  const existed = await prisma.user.findUnique({ where: { mssv: data.mssv } });
  if (existed) {
    return NextResponse.json({ error: "MSSV đã tồn tại" }, { status: 409 });
  }
  const passwordHash = await bcrypt.hash(data.password, 10);
  await prisma.user.create({
    data: {
      mssv: data.mssv,
      fullName: data.fullName,
      dateOfBirth: new Date(data.dateOfBirth),
      email: data.email,
      parentEmail: data.parentEmail,
      advisorCode: data.advisorCode,
      role: data.role,
      passwordHash,
    },
  });
  return NextResponse.json({ message: "Đăng ký thành công" });
}
