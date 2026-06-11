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

return ( <main className="min-h-screen text-white">


  <div className="max-w-7xl mx-auto px-6 py-12">

    <h1 className="text-5xl font-black mb-10">
      Dashboard
    </h1>

    {/* STATS */}

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

        <h2 className="text-4xl font-black">
          {generations.length}
        </h2>

        <p className="text-zinc-400 mt-2">
          Total Generations
        </p>

      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

        <h2 className="text-4xl font-black">
          {
            generations.filter(
              (item) => item.favorite === true
            ).length
          }
        </h2>

        <p className="text-zinc-400 mt-2">
          Favorites
        </p>

      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

        <h2 className="text-4xl font-black">
          100
        </h2>

        <p className="text-zinc-400 mt-2">
          Credits
        </p>

      </div>

    </div>

    {/* GENERATIONS */}

    <h2 className="text-3xl font-bold mb-8">
      Recent Creations
    </h2>

    <div className="grid md:grid-cols-2 gap-8">

      {generations.map((item) => (

        <div
          key={item.id}
          className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 transition"
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
              {new Date(
                item.created_at
              ).toLocaleDateString()}
            </p>

            <h2 className="text-xl font-bold mb-4">
              {item.prompt}
            </h2>

            <p className="text-zinc-300 line-clamp-4">
              {item.script}
            </p>

          </div>

        </div>

      ))}

    </div>

  </div>

</main>


);
}
