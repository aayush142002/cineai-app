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
    const scenePrompts = [
      `Opening cinematic scene of ${prompt}`,
      `Middle intense cinematic scene of ${prompt}`,
      `Final dramatic cinematic scene of ${prompt}`,
    ];

    const images: string[] = [];

    for (const scene of scenePrompts) {

      const image = await openai.images.generate({
        model: "gpt-image-1",
        prompt: scene,
        size: "1024x1024",
      });

      const base64 = image.data[0].b64_json;

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