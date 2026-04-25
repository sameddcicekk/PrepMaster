import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API anahtarı bulunamadı." }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "Sen profesyonel bir şefsin. Kullanıcının elindeki malzemelerle yapılabilecek, yaratıcı, kısa ve iştah açıcı bir yemek tarifi ver. Yanıtın sadece tarif başlığı ve yapılış adımları olsun. Samimi ve enerjik bir dil kullan.",
          },
          {
            role: "user",
            content: `Elimdeki malzemeler şunlar: ${ingredients}. Bana bu akşam için ne pişirebileceğimi söyle.`,
          },
        ],
      }),
    });

    const data = await response.json();
    const recipe = data.choices[0]?.message?.content || "Üzgünüm kanka, şu an bir tarif oluşturamadım.";

    return NextResponse.json({ recipe });
  } catch (error: any) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 });
  }
}