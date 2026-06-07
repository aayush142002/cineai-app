import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

export async function POST(req: Request) {

  try {

    const body = await req.json();

    const { prompt } = body;

    const output = await replicate.run(
      "wavespeedai/wan-2.1-i2v-480p",
      {
        input: {
          prompt,
          num_frames: 49,
          fps: 8,
        },
      }
    );

    console.log("REPLICATE OUTPUT:", JSON.stringify(output, null, 2));

    return NextResponse.json({
      video: output,
    });

  } catch (error) {

    console.error("VIDEO ERROR:", error);

    return NextResponse.json(
      {
        error: "Video generation failed",
      },
      {
        status: 500,
      }
    );
  }
}