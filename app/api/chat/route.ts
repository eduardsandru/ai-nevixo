import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();
    
    // Selectăm modelul de top
    const geminiModel = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash", // Cel mai rapid și modern model actual
      systemInstruction: "Ești AI NEVIXO, un sistem de operare AI avansat creat în 2026. Ești extrem de inteligent, politicos și capabil să analizezi orice informație complexă."
    });

    const result = await geminiModel.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    return NextResponse.json({ text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ text: "Eroare la conectarea cu AI-ul. Verifică API Key-ul în Vercel." }, { status: 500 });
  }
}
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // 1. Preluăm cheia direct în interiorul cererii
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey || apiKey === "") {
      return NextResponse.json({ 
        text: "Eroare: Cheia GOOGLE_API_KEY nu a fost detectată în Vercel. Asigură-te că ai dat REDEPLOY după ce ai adăugat-o în Settings." 
      }, { status: 500 });
    }

    const { prompt } = await req.json();
    const genAI = new GoogleGenerativeAI(apiKey);

    // 2. Folosim modelul Gemini 2.0 Flash (standard pentru 2026)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      systemInstruction: "Ești AI NEVIXO, un sistem de operare AI avansat creat în 2026. Ești extrem de inteligent și răspunzi în limba română."
    });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Detailed Error:", error);
    return NextResponse.json({ 
      text: "Eroare tehnică: " + (error.message || "Verifică Log-urile în Vercel Dashboard.") 
    }, { status: 500 });
  }
}
