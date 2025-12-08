import { NextResponse } from "next/server";

export async function POST() {
  const mock = {
    replyText: "Thầy/cô đã nhận tín hiệu, em hãy hít thở sâu và nói ra cảm xúc của mình nhé!",
    emotionLabel: "happy",
  };

  return NextResponse.json(mock);
}
