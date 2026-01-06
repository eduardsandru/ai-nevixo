import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) return NextResponse.json({ text: "Lipsește cheia API în Vercel." }, { status: 500 });

    const { prompt } = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: "Ești AI NEVIXO, creat în 2026. Răspunzi scurt în română."
    });

    const result = await model.generateContent(prompt);
    return NextResponse.json({ text: result.response.text() });
  } catch (error: any) {
    return NextResponse.json({ text: "Eroare: " + error.message }, { status: 500 });
  }
}
