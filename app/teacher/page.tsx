"use client";

import { useEffect, useState } from "react";
import { GradientCard } from "@/components/ui/gradient-card";
import { formatDate } from "@/lib/utils";
import { AlertTriangle, Users } from "lucide-react";

type Student = {
  mssv: string;
  fullName: string;
  className: string;
  email: string;
  parentEmail: string;
  advisorCode: string;
  lastSession: string;
  sessionsLast7Days: number;
  avgEmotionScore7d: number;
  stressAlertCount: number;
  alertLevel: string;
  lastReportAt: string;
};

export default function TeacherDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filter, setFilter] = useState({ keyword: "", alert: "" });

  useEffect(() => {
    fetch("/api/teacher/students")
      .then((r) => r.json())
      .then((data) => setStudents(data.students));
  }, []);

  const filtered = students.filter((s) => {
    const matchKeyword = s.fullName.toLowerCase().includes(filter.keyword.toLowerCase()) ||
      s.mssv.toLowerCase().includes(filter.keyword.toLowerCase());
    const matchAlert = filter.alert ? s.alertLevel === filter.alert : true;
    return matchKeyword && matchAlert;
  });

  return (
    <main className="container mx-auto px-4 py-8 space-y-4">
      <div className="flex items-center gap-3">
        <Users />
        <div>
          <h1 className="text-2xl font-bold">Quản lý học sinh</h1>
          <p className="text-slate-400">Theo dõi cảm xúc và cảnh báo</p>
        </div>
      </div>
      <GradientCard>
        <div className="flex flex-col md:flex-row gap-3 mb-4">
          <input
            placeholder="Tìm theo tên/MSSV"
            value={filter.keyword}
            onChange={(e) => setFilter({ ...filter, keyword: e.target.value })}
            className="w-full md:w-1/3"
          />
          <select
            value={filter.alert}
            onChange={(e) => setFilter({ ...filter, alert: e.target.value })}
            className="w-full md:w-48"
          >
            <option value="">Tất cả cảnh báo</option>
            <option value="Ổn định">Ổn định</option>
            <option value="Cần quan tâm">Cần quan tâm</option>
            <option value="Nguy cơ cao">Nguy cơ cao</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-slate-300">
              <tr className="text-left">
                <th className="py-2">MSSV</th>
                <th>Họ tên</th>
                <th>Lớp</th>
                <th>Email</th>
                <th>Phụ huynh</th>
                <th>Lần tương tác</th>
                <th>Phiên 7 ngày</th>
                <th>Điểm 7 ngày</th>
                <th>Stress alerts</th>
                <th>Mức cảnh báo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((s) => (
                <tr key={s.mssv} className="hover:bg-slate-800/40">
                  <td className="py-2">{s.mssv}</td>
                  <td>{s.fullName}</td>
                  <td>{s.className}</td>
                  <td>{s.email}</td>
                  <td>{s.parentEmail}</td>
                  <td>{formatDate(s.lastSession)}</td>
                  <td>{s.sessionsLast7Days}</td>
                  <td>
                    <span
                      className={
                        s.avgEmotionScore7d < 40
                          ? "text-red-400"
                          : s.avgEmotionScore7d < 70
                          ? "text-yellow-300"
                          : "text-green-400"
                      }
                    >
                      {s.avgEmotionScore7d}
                    </span>
                  </td>
                  <td>{s.stressAlertCount}</td>
                  <td className="flex items-center gap-1">
                    <AlertTriangle size={14} />
                    {s.alertLevel}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GradientCard>
    </main>
  );
}
