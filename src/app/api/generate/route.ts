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
    const {
      prompt,
      imageSize,
      imageCount,
      userEmail,
      userId,
    } = body;
    const totalImages =
  imageCount || 1;
    let imageGenerationSize = "1024x1024";

if (imageSize === "9:16") {
  imageGenerationSize = "1024x1536";
}

if (imageSize === "16:9") {
  imageGenerationSize = "1536x1024";
}
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
    const generatedImages = [];

for (
  let i = 0;
  i < totalImages;
  i++
) {

  const image =
    await openai.images.generate({
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
Variation ${i + 1},
${safePrompt}
`,

      size:
        imageGenerationSize as any,
    });

  generatedImages.push(image);
}
let imageUrls: string[] = [];

for (const img of generatedImages) {

  const base64 =
    img.data?.[0]?.b64_json;

  if (!base64) continue;

  const buffer = Buffer.from(
    base64,
    "base64"
  );

  const fileName =
    `${Date.now()}-${Math.random()}.png`;

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
    continue;
  }

  const { data: publicUrlData } =
    supabaseAdmin.storage
      .from("generation-images")
      .getPublicUrl(fileName);

  imageUrls.push(
    publicUrlData.publicUrl
  );
}


const script =
  completion.choices[0].message.content;

const { data, error } =
  await supabaseAdmin
    .from("generations")
    .insert([
      {
        user_email:
          userEmail || "guest",
        user_id:
          userId || null,
        prompt: prompt,
        script: script,
        image: imageUrls[0] || "",
      },
    ]);

console.log(
  "SUPABASE DATA:",
  data
);

console.log(
  "SUPABASE ERROR:",
  error
);

return Response.json({
  result: script,
  images: imageUrls,
});


} catch (error: any) {

  console.log(error);
  
  return Response.json({
    result: error.message,
    images: [],
  });

}
}