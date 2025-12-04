export type ChatRequest = { message: string; history?: Array<{ sender: "user" | "bot"; text: string }> };
export type ChatResponse = {
  replyText: string;
  sentimentScore: number;
  emotionLabel: "happy" | "sad" | "neutral" | "stress";
};

// Mock service, replace with VNPT SmartBot integration later
export class ChatbotService {
  async sendMessage(payload: ChatRequest): Promise<ChatResponse> {
    const moodSeed = payload.message.toLowerCase();
    let emotion: ChatResponse["emotionLabel"] = "neutral";
    if (moodSeed.includes("vui")) emotion = "happy";
    else if (moodSeed.includes("buồn")) emotion = "sad";
    else if (moodSeed.includes("stress") || moodSeed.includes("áp lực")) emotion = "stress";

    return {
      replyText: `Sunny: Mình đã nhận được chia sẻ của bạn. Mình gợi ý bạn thử hít thở sâu và viết ra cảm xúc hiện tại nhé!`,
      sentimentScore: emotion === "happy" ? 0.7 : emotion === "sad" ? -0.4 : emotion === "stress" ? -0.6 : 0.1,
      emotionLabel: emotion,
    };
  }
}
