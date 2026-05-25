export const dynamic = "force-dynamic";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();
    const { prompt } = body;

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
          content: `Create a cinematic short video idea about: ${prompt}`,
        },
      ],
    });

    // STORYBOARD IMAGES
    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt: `Ultra cinematic movie scene of ${prompt}`,
      size: "auto",
    });
    
    const base64 = image.data?.[0]?.b64_json;
    
    const images = [];
    
    if (base64) {
      images.push(
        `data:image/png;base64,${base64}`
      );
    }

    return Response.json({
      result: completion.choices[0].message.content,
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