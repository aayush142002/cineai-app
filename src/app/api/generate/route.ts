export const dynamic = "force-dynamic";

import OpenAI from "openai";
import { supabase } from "@/lib/supabase";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();
    const { prompt, userEmail } = body;
    const safePrompt = prompt
  .replace(/kill|murder|blood|gun|weapon|drug|mafia|violence/gi, "cinematic")
  .trim();

    // TEXT GENERATION
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You create cinematic viral short-form video scripts.",
        },
        {
          role: "user",
          content: `Create a cinematic short video idea about: ${safePrompt}`,
        },
      ],
    });

    // STORYBOARD IMAGES
    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `Ultra cinematic dramatic movie scene, professional lighting, emotional storytelling, no violence, inspired by Hollywood style: ${safePrompt}`,
      size: "auto",
    });
    
    const base64 = image.data?.[0]?.b64_json;
    
    const images = [];
    
    if (base64) {
      images.push(
        `data:image/png;base64,${base64}`
      );
    }

    const script = completion.choices[0].message.content;


  const { data, error } = await supabase
  .from("generations")
  .insert([
    {
      user_email: userEmail || "guest",
      prompt: prompt,
      script: script,
      image: images[0] || "",
    },
  ]);

console.log("SUPABASE DATA:", data);
console.log("SUPABASE ERROR:", error);


return Response.json({
  result: script,
  images: images,
});

  } catch (error: any) {

    console.log(error);

    return Response.json({
      result: error.message,
      images: [],
    });

  }
}