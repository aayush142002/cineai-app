"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {

  const [generations, setGenerations] = useState<any[]>([]);

  async function loadGenerations() {

    const { data, error } = await supabase
      .from("generations")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setGenerations(data);
    }

    console.log(error);
  }

  useEffect(() => {
    loadGenerations();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <h1 className="text-5xl font-bold mb-10">
        Your AI Generations
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {generations.map((item) => (

          <div
            key={item.id}
            className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
          >

            {item.image && (
              <img
                src={item.image}
                alt="Generated"
                className="w-full h-80 object-cover"
              />
            )}

            <div className="p-6">

              <p className="text-sm text-zinc-400 mb-3">
                {item.created_at}
              </p>

              <h2 className="text-2xl font-bold mb-4">
                {item.prompt}
              </h2>

              <p className="text-zinc-300 whitespace-pre-wrap">
                {item.script}
              </p>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}