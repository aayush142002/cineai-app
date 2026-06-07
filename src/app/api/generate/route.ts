export const dynamic = "force-dynamic";

import OpenAI from "openai";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Buffer } from "buffer";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();
    const { prompt, userEmail, userId } = body;
    const safePrompt = prompt
  .replace(/kill/gi, "dramatic")
  .replace(/murder/gi, "cinematic")
  .replace(/blood/gi, "red lighting")
  .replace(/gun/gi, "action")
  .replace(/weapon/gi, "prop")
  .replace(/drug/gi, "mystery")
  .replace(/mafia/gi, "crime drama")
  .replace(/violence/gi, "tension")
  .replace(/dead/gi, "emotional")
  .replace(/war/gi, "epic battle")
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
      prompt: `
Ultra cinematic Hollywood movie scene,
professional lighting,
dramatic atmosphere,
high-budget film still,
beautiful composition,
safe for all audiences,
no gore,
no violence,
no blood,
${safePrompt}
`,
      size: "auto",
    });
    
    const base64 = image.data?.[0]?.b64_json;

let imageUrl = "";

if (base64) {

  const buffer = Buffer.from(
    base64,
    "base64"
  );

  const fileName =
    `${Date.now()}.png`;

  const { error: uploadError } =
    await supabaseAdmin.storage
      .from("generation-images")
      .upload(
        fileName,
        buffer,
        {
          contentType: "image/png",
        }
      );

  if (uploadError) {
    console.log(uploadError);
  }

  const { data: publicUrlData } =
    supabaseAdmin.storage
      .from("generation-images")
      .getPublicUrl(fileName);

  imageUrl =
    publicUrlData.publicUrl;

    console.log(
  "IMAGE URL:",
  imageUrl
);
}

    const script = completion.choices[0].message.content;


    const { data, error } = await supabaseAdmin
  .from("generations")
  .insert([
      {
        user_email: userEmail || "guest",
        user_id: userId || null,
        prompt: prompt,
        script: script,
        image: imageUrl,
      },
    ]);

console.log("SUPABASE DATA:", data);
console.log("SUPABASE ERROR:", error);


return Response.json({
  result: script,
  images: [imageUrl],
});

  } catch (error: any) {

    console.log(error);

    return Response.json({
      result: error.message,
      images: [],
    });

  }
}