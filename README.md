# VNPT AI Hackathon - Emotion Care Platform

MVP web app hỗ trợ tâm lý, giám sát cảm xúc cho học sinh với chatbot/voice AI, phân tích cảm xúc đa modal, avatar 3D và dashboard giáo viên.

## Kiến trúc nhanh
- **Frontend**: Next.js 14 (App Router) + TypeScript + TailwindCSS (theme sci-fi). Giao diện tách role: landing chọn vai trò → login/signup theo `role`, Student Home 1/3 chat – 2/3 robot 3D, Teacher Dashboard bảng + chart mock. React Three Fiber dựng avatar 3D static (không OrbitControls).
- **Backend**: Next.js API routes, JWT auth, bcrypt hash mật khẩu, Prisma ORM (PostgreSQL mặc định).
- **AI adapters (mock)**: `ChatbotService`, `EmotionService`, `EmailService` tách lớp để thay bằng VNPT SmartBot/SmartVoice/SmartVision, SMTP thật.
- **Bảo mật**: Hash mật khẩu, JWT access/refresh, không lưu media gốc, chỉ metadata phiên tư vấn; phân quyền STUDENT/TEACHER qua token & menu.

## Cấu trúc thư mục chính
```
app/
  (auth)/login | signup | forgot-password | reset-password
  api/
    auth/(signup|login|refresh|forgot-password|reset-password)
    chat/         # chatbot + sentiment (mock)
    emotion/vision/ # webcam emotion (mock)
    reports/send/ # gửi báo cáo phụ huynh (mock SMTP)
    teacher/students/ # dashboard giáo viên (mock data)
  teacher/       # màn hình quản lý học sinh
  page.tsx       # landing chọn vai trò
  student/       # bố cục 1/3 chat – 2/3 robot 3D + webcam + menu tải/gửi báo cáo
  teacher/       # màn hình quản lý học sinh, tải dashboard
components/
  StudentChatPanel.tsx, menus/StudentMenu|TeacherMenu, WebcamEmotionPanel.tsx
  robot/RobotScene.tsx
  ui/gradient-card.tsx
lib/
  prisma.ts, utils.ts
  auth/jwt.ts
  services/(chatbot|emotion|email).ts
prisma/schema.prisma
.env.example
```

## Hướng dẫn chạy
1. Cài đặt dependencies (có thể cần đặt registry npm thích hợp):
   ```bash
   npm install
   ```
2. Tạo file `.env` dựa trên `.env.example` (đặt `DATABASE_URL`, `JWT_SECRET`, SMTP nếu có).
3. Migrate DB & generate Prisma:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
4. Chạy dev server:
   ```bash
   npm run dev
   ```
   Ứng dụng chạy tại http://localhost:3000.

## Ghi chú
- API mock: chatbot/emotion/email đang giả lập, thay thế dễ dàng trong `lib/services/*`.
- UI sci-fi/dark mặc định, avatar 3D mô phỏng robot với biểu cảm theo `emotion`.
- Dashboard giáo viên dùng mock data; kết nối DB/analytics thật bằng Prisma models đã khai báo.
