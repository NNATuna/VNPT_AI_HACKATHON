import { NextResponse } from "next/server";

const mockStudents = [
  {
    mssv: "SV001",
    fullName: "Nguyễn Minh An",
    className: "KTPM2022",
    email: "an@example.com",
    parentEmail: "phuhuynh.an@example.com",
    advisorCode: "GV01",
    lastSession: "2024-06-10T10:00:00Z",
    sessionsLast7Days: 5,
    avgEmotionScore7d: 72,
    stressAlertCount: 1,
    alertLevel: "Ổn định",
    lastReportAt: "2024-06-08T10:00:00Z",
  },
  {
    mssv: "SV002",
    fullName: "Trần Thu Hà",
    className: "CNTT2022",
    email: "ha@example.com",
    parentEmail: "phuhuynh.ha@example.com",
    advisorCode: "GV01",
    lastSession: "2024-06-09T14:00:00Z",
    sessionsLast7Days: 8,
    avgEmotionScore7d: 45,
    stressAlertCount: 3,
    alertLevel: "Cần quan tâm",
    lastReportAt: "2024-06-07T10:00:00Z",
  },
];

export async function GET() {
  return NextResponse.json({ students: mockStudents });
}
