export type EmotionResult = {
  faceEmotion: "happy" | "sad" | "neutral" | "tired" | "stress";
  confidence: number;
};

export class EmotionService {
  async analyzeImage(_base64: string): Promise<EmotionResult> {
    const labels: EmotionResult["faceEmotion"][] = ["happy", "neutral", "sad", "stress", "tired"];
    const faceEmotion = labels[Math.floor(Math.random() * labels.length)];
    return { faceEmotion, confidence: Math.random() * 0.5 + 0.5 };
  }
}
