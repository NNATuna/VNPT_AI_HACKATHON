import { EmotionService } from "@/lib/services/emotion";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  const { frameBase64, token } = await request.json();
  if (!frameBase64) return NextResponse.json({ error: "Thiếu frame" }, { status: 400 });
  const payload = token ? verifyToken(token) : null;
  const service = new EmotionService();
  const result = await service.analyzeImage(frameBase64);

  if (payload) {
    await prisma.sessionLog.create({
      data: {
        userId: payload.userId,
        source: "CHAT",
        sentimentScore: 0,
        emotionLabel: result.faceEmotion,
        faceEmotion: result.faceEmotion,
      },
    });
  }

  return NextResponse.json(result);
}
