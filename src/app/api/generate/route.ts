import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Using Pollinations.ai free public image generation endpoint (no API key required!)
    const encodedPrompt = encodeURIComponent(prompt.trim());
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}`;

    return NextResponse.json({ url: imageUrl });
  } catch (error: any) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}
