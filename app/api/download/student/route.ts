import { NextResponse } from "next/server";
export async function GET() {
  const now = new Date();
  const content = `Báo cáo tương tác học sinh\n\nTổng số phiên tuần này: 5\nĐiểm cảm xúc trung bình: 0.62\nCảnh báo stress: 1 lần\nGợi ý: duy trì ngủ đủ giấc, tập thở 4-7-8 mỗi tối.`;
  return new NextResponse(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="student-report-${now.toISOString().slice(0, 10).replace(/-/g, "")}.txt"`,
    },
  });
}
