import { verifyToken, signTokens } from "@/lib/auth/jwt";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { refreshToken } = await request.json();
  if (!refreshToken) return NextResponse.json({ error: "Thiếu token" }, { status: 400 });
  const payload = verifyToken(refreshToken);
  if (!payload) return NextResponse.json({ error: "Token không hợp lệ" }, { status: 401 });
  const tokens = signTokens(payload);
  return NextResponse.json(tokens);
}
