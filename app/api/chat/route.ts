import { NextResponse } from "next/server";
import { ChatbotService } from "@/lib/services/chatbot";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth/jwt";

export async function POST(request: Request) {
  const chatbot = new ChatbotService();
  const { message, token } = await request.json();
  if (!message) return NextResponse.json({ error: "Thiếu message" }, { status: 400 });
  const payload = token ? verifyToken(token) : null;

  const reply = await chatbot.sendMessage({ message });

  if (payload) {
    await prisma.sessionLog.create({
      data: {
        userId: payload.userId,
        source: "CHAT",
        userMessage: message,
        botReply: reply.replyText,
        sentimentScore: reply.sentimentScore,
        emotionLabel: reply.emotionLabel,
      },
    });
  }

  return NextResponse.json(reply);
}
