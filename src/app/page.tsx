"use client";

import { useState } from "react";

export default function Home() {

  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function generateStory() {

    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    setResult(data.result);
    setImages(data.images || []);

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-black text-white px-6 py-16">

      <div className="max-w-6xl mx-auto">

        {/* HERO */}
        <div className="text-center">

          <h1 className="text-7xl font-bold tracking-tight">
            CineAI
          </h1>

          <p className="text-zinc-400 text-xl mt-6 max-w-2xl mx-auto">
            Generate cinematic AI shorts, storyboards,
            scripts and ultra realistic movie scenes instantly.
          </p>

        </div>

        {/* INPUT */}
        <div className="mt-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder="Enter your cinematic story idea..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 bg-black/40 border border-zinc-700 rounded-2xl px-6 py-5 outline-none text-lg"
            />

            <button
              onClick={generateStory}
              className="bg-white text-black px-8 py-5 rounded-2xl font-semibold hover:scale-105 transition duration-300"
            >
              Generate
            </button>

          </div>

        </div>

        {/* LOADING */}
        {loading && (

          <div className="mt-12 text-center">

            <div className="animate-pulse text-zinc-400 text-lg">
              Generating cinematic masterpiece...
            </div>

          </div>

        )}

        {/* RESULTS */}
        {result && (

          <div className="mt-12 grid lg:grid-cols-2 gap-8">

            {/* SCRIPT */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">

              <h2 className="text-2xl font-bold mb-6">
                AI Story Script
              </h2>

              <div className="text-zinc-300 whitespace-pre-wrap leading-8">
                {result}
              </div>

            </div>

            {/* STORYBOARD IMAGES */}
            <div className="grid gap-6">

              {Array.isArray(images) && images.map((img, index) => (

                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl"
                >

                  <img
                    src={img}
                    alt={`Scene ${index + 1}`}
                    className="rounded-2xl w-full"
                  />

                </div>

              ))}

            </div>

          </div>

        )}

      </div>

    </main>
  );
}