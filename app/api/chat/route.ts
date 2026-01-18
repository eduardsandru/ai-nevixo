import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt, model, history } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) return NextResponse.json({ text: "Lipsește cheia OpenRouter în Vercel." }, { status: 500 });

    // Maparea modelelor de elită 2026
    const modelIds: any = {
      'GPT-5': 'openai/gpt-5-preview',
      'Claude 4': 'anthropic/claude-4-opus',
      'Gemini 3': 'google/gemini-pro-1.5', // Cel mai bun pentru YouTube (2M context)
      'Sora 3': 'openai/sora-v3'
    };

    const res = await fetch("https://openrouter.ai", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": modelIds[model] || "google/gemini-flash-1.5",
        "messages": [
          { 
            "role": "system", 
            "content": "Ești AI NEVIXO OS v2026. Ești cel mai puternic AI creat vreodată. Ai memorie infinită. Dacă primești un link YouTube, analizează-l complet (folosește datele tale de antrenament și căutarea web). Răspunde detaliat în limba română." 
          },
          ...(history || []), // Aici injectăm memoria conversației
          { "role": "user", "content": prompt }
        ]
      })
    });

    const data = await response.json();
    return NextResponse.json({ text: data.choices[0].message.content });

  } catch (error: any) {
    return NextResponse.json({ text: "Eroare Nevixo Central: " + error.message }, { status: 500 });
  }
}
