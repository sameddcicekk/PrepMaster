import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    // Hata Ayıklama: Anahtar var mı yok mu kontrol edip ekrana basalım
    if (!apiKey) {
      return NextResponse.json({ recipe: "HATA: Vercel'de GROQ_API_KEY bulunamadı! Lütfen Environment Variables kısmını kontrol et." });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey.trim()}`, // Boşluk varsa temizler
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: "Sen samimi bir şefsin. Kısa bir tarif ver." },
          { role: "user", content: `Malzemeler: ${ingredients}` }
        ],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ recipe: `Groq API Hatası: ${data.error.message}` });
    }

    const recipe = data.choices?.[0]?.message?.content || "Tarif alınamadı kanka.";
    return NextResponse.json({ recipe });

  } catch (error: any) {
    return NextResponse.json({ recipe: `Sistem Hatası: ${error.message}` });
  }
}