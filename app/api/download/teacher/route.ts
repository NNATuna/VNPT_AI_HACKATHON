import { NextResponse } from "next/server";
export async function GET() {
  const now = new Date();
  const csv = [
    "MSSV,Họ tên,Alert,Điểm7d,StressCount",
    "SV001,Nguyễn Minh An,Ổn định,72,1",
    "SV002,Trần Thu Hà,Cần quan tâm,45,3",
    "SV003,Phạm Đức Long,Nguy cơ cao,30,4",
  ].join("\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="teacher-dashboard-${now.toISOString().slice(0, 10).replace(/-/g, "")}.csv"`,
    },
  });
}
