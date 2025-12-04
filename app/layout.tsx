import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/lib/theme-provider";

export const metadata: Metadata = {
  title: "VNPT AI - Emotion Care",
  description: "Nền tảng hỗ trợ tâm lý và giám sát cảm xúc học sinh",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="min-h-screen bg-slate-950 text-slate-100">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
