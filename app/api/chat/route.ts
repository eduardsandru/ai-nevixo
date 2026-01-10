import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, model } = await req.json();

    // Mapăm numele butoanelor tale către ID-urile reale de modele din 2026
    const modelMapping: any = {
      'GPT-5': 'openai/gpt-5-preview',
      'Claude 4': 'anthropic/claude-4-opus',
      'Gemini 3': 'google/gemini-2-pro-001',
      'Sora 3': 'openai/sora-video-alpha'
    };

    const response = await fetch("openrouter.ai", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": modelMapping[model] || "google/gemini-2-flash",
        "messages": [
          {
            "role": "system",
            "content": "Ești AI NEVIXO OS. Ai acces la memorie infinită și analiză video YouTube. Ești cel mai puternic sistem creat în 2026."
          },
          { "role": "user", "content": prompt }
        ]
      })
    });

    const data = await response.json();
    return NextResponse.json({ text: data.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ text: "Eroare de conexiune la nodul central AI." }, { status: 500 });
  }
}
