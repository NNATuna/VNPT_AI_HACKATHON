import { EmailService } from "@/lib/services/email";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { studentName, parentEmail, summary, range, userId } = await request.json();
  if (!studentName || !parentEmail) return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
  const service = new EmailService();
  const subject = `Báo cáo cảm xúc ${range || "tuần này"} của ${studentName}`;
  const contentSummary = summary || "Tâm trạng ổn định, cần duy trì giao tiếp tích cực.";
  const html = `
    <h3>Chào phụ huynh,</h3>
    <p>Đây là báo cáo nhanh cho ${studentName}.</p>
    <p><strong>Tóm tắt:</strong> ${contentSummary}</p>
    <p>Trân trọng,</p>
    <p>Hệ thống AI Cố Vấn</p>
  `;
  const result = await service.sendEmail({ to: parentEmail, subject, html });
  if (userId) {
    await prisma.parentReport.create({
      data: {
        userId,
        fromDate: new Date(),
        toDate: new Date(),
        contentSummary,
        emailStatus: result.mocked ? "SENT" : "FAILED",
      },
    });
  }
  return NextResponse.json({ status: "ok", mocked: result.mocked });
}
