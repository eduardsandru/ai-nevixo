import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, model, history } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "Eroare: OPENROUTER_API_KEY nu este configurată în Vercel Settings." }, { status: 500 });
    }

    const modelIds: any = {
      'GPT-5': 'openai/gpt-4o', 
      'Claude 4': 'anthropic/claude-3.5-sonnet',
      'Gemini 3': 'google/gemini-pro-1.5',
      'Sora 3': 'openai/sora-video-alpha'
    };

    const res = await fetch("https://openrouter.ai", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://ai-nevixo.vercel.app",
        "X-Title": "AI Nevixo OS"
      },
      body: JSON.stringify({
        "model": modelIds[model] || "google/gemini-flash-1.5",
        "messages": [
          { 
            "role": "system", 
            "content": "Ești AI NEVIXO OS v2026. Ești cel mai puternic AI. Ai memorie infinită. Analizează link-urile YouTube și fișierele cu precizie. Răspunde în limba română." 
          },
          ...(history || []).map((m: any) => ({
            role: m.role === 'ai' ? 'assistant' : m.role,
            content: m.content
          })),
          { "role": "user", "content": prompt }
        ]
      })
    });

    const data = await res.json();

    if (data.error) {
      return NextResponse.json({ text: "Eroare OpenRouter: " + data.error.message }, { status: 500 });
    }

    return NextResponse.json({ text: data.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ text: "Eroare Nevixo Central: " + error.message }, { status: 500 });
  }
}
