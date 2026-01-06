import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Eroare: GOOGLE_API_KEY lipsește din Vercel." }, { status: 500 });
    }

    const { prompt } = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: "Ești AI NEVIXO, un sistem de operare AI creat în 2026. Răspunzi inteligent și scurt în limba română."
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return NextResponse.json({ text: response.text() });
  } catch (error: any) {
    return NextResponse.json({ text: "Eroare tehnică: " + error.message }, { status: 500 });
  }
}
