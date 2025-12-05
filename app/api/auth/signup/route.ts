import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

const cleanOptional = (value?: string | null) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const schema = z
  .object({
    mssv: z.string().min(3),
    fullName: z.string().min(3),
    dateOfBirth: z.string(),
    email: z.string().email(),
    parentEmail: z
      .string()
      .trim()
      .transform(cleanOptional)
      .pipe(z.string().email().optional())
      .optional(),
    advisorCode: z
      .string()
      .trim()
      .transform(cleanOptional)
      .pipe(z.string().min(1).optional())
      .optional(),
    department: z
      .string()
      .trim()
      .transform(cleanOptional)
      .pipe(z.string().optional())
      .optional(),
    className: z
      .string()
      .trim()
      .transform(cleanOptional)
      .pipe(z.string().optional())
      .optional(),
    role: z.enum(["STUDENT", "TEACHER"]),
    password: z.string().min(6),
  })
  .superRefine((val, ctx) => {
    if (val.role === "STUDENT") {
      if (!val.parentEmail) ctx.addIssue({ code: "custom", message: "Thiếu email phụ huynh" });
      if (!val.advisorCode) ctx.addIssue({ code: "custom", message: "Thiếu mã cố vấn" });
    }
  });

export async function POST(request: Request) {
  const body = await request.json();
  const parse = schema.safeParse(body);
  if (!parse.success) {
    return NextResponse.json({ error: "Dữ liệu không hợp lệ" }, { status: 400 });
  }
  const data = parse.data;
  const existedStudent = await prisma.student.findUnique({ where: { mssv: data.mssv } });
  const existedTeacher = await prisma.teacher.findUnique({ where: { mssv: data.mssv } });
  if (existedStudent || existedTeacher) {
    return NextResponse.json({ error: "MSSV đã tồn tại" }, { status: 409 });
  }
  const passwordHash = await bcrypt.hash(data.password, 10);
  if (data.role === "STUDENT") {
    await prisma.student.create({
      data: {
        mssv: data.mssv,
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        email: data.email,
        parentEmail: data.parentEmail!,
        advisorCode: data.advisorCode,
        className: data.className,
        passwordHash,
      },
    });
  } else {
    await prisma.teacher.create({
      data: {
        mssv: data.mssv,
        fullName: data.fullName,
        dateOfBirth: new Date(data.dateOfBirth),
        email: data.email,
        department: data.department,
        className: data.className,
        passwordHash,
      },
    });
  }
  return NextResponse.json({ message: "Đăng ký thành công" });
}
