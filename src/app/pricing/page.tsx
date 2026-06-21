"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function PricingPage() {
  const [credits, setCredits] =
  useState(0);

  useEffect(() => {

    async function loadCredits() {
  
      const {
        data: { user },
      } = await supabase.auth.getUser();
  
      if (!user?.email) return;
  
      const { data } =
        await supabase
          .from("users")
          .select("credits")
          .eq("email", user.email)
          .single();
  
      setCredits(
        data?.credits || 0
      );
    }
  
    loadCredits();
  
  }, []);


  return (
    <main className="min-h-screen text-white">

      <div className="max-w-7xl mx-auto px-6 py-20">

        <h1 className="text-6xl font-black text-center mb-4">
          Pricing
        </h1>

        <p className="text-zinc-400 text-center mb-20 text-xl">
          Start free and purchase credits whenever you need more generations.
        </p>
        <div className="max-w-md mx-auto mb-16">

  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">

    <p className="text-zinc-400 mb-2">
      Current Balance
    </p>

    <h2 className="text-5xl font-black">
      ⭐ {credits}
    </h2>

  </div>

</div>

        {/* FREE PLAN */}

        <h2 className="text-4xl font-black mb-10 text-center">
          Start Free. Upgrade When You Need More Credits.
        </h2>

        <div className="max-w-md mx-auto">

          <div className="bg-gradient-to-b from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-3xl p-10">

            <div className="inline-block px-3 py-1 bg-purple-500 rounded-full text-sm font-bold mb-4">
              FREE PLAN
            </div>

            <h3 className="text-5xl font-black">
              $0
            </h3>

            <p className="text-zinc-400 mt-2">
              Forever
            </p>

            <ul className="space-y-4 mt-8">
              <li>✓ 15 Free Credits</li>
              <li>✓ Story + Image Generation</li>
              <li>✓ Community Access</li>
              <li>✓ Creator Profiles</li>
              <li>✓ Follow Creators</li>
              <li>✓ Notifications</li>
              <li>✗ Premium Models</li>
              <li>✗ AI Video Generation</li>
              <li>✗ Character Consistency</li>
              <li>✗ Priority Queue</li>
            </ul>

            <button
              disabled
              className="w-full mt-8 py-4 rounded-2xl bg-zinc-800 text-zinc-400 font-bold cursor-not-allowed"
            >
              Current Plan
            </button>

          </div>

        </div>

        {/* CREDIT PACKS */}

        <h2 className="text-5xl font-black mt-24 mb-4 text-center">
          Buy Credits
        </h2>

        <p className="text-zinc-400 text-center mb-12">
          Need more generations? Purchase credits anytime.
        </p>

        <div className="grid md:grid-cols-3 gap-8">

          {/* SMALL */}

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <h3 className="text-3xl font-black">
              Starter
            </h3>

            <p className="text-5xl font-black mt-4">
            ₹99
            </p>

            <p className="text-zinc-400 mt-2">
            50 Credits
            </p>

            <button
              onClick={() => alert("Starter Pack - Coming Soon")}
              className="w-full mt-8 py-4 rounded-2xl bg-white text-black font-bold"
            >
              Buy Credits
            </button>

          </div>

          {/* MEDIUM */}

          <div className="bg-gradient-to-b from-green-500/20 to-emerald-500/20 border border-green-500 rounded-3xl p-8">

            <div className="inline-block px-3 py-1 bg-green-500 rounded-full text-sm font-bold mb-4">
              BEST VALUE
            </div>

            <h3 className="text-3xl font-black">
              Creator
            </h3>

            <p className="text-5xl font-black mt-4">
            ₹249
            </p>

            <p className="text-zinc-400 mt-2">
              200 Credits
            </p>

            <button
              onClick={() => alert("Creator Pack - Coming Soon")}
              className="w-full mt-8 py-4 rounded-2xl bg-green-500 font-bold"
            >
              Buy Credits
            </button>

          </div>

          {/* LARGE */}

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <h3 className="text-3xl font-black">
              Pro
            </h3>

            <p className="text-5xl font-black mt-4">
            ₹699
            </p>

            <p className="text-zinc-400 mt-2">
              600 Credits
            </p>

            <button
              onClick={() => alert("Pro Pack - Coming Soon")}
              className="w-full mt-8 py-4 rounded-2xl bg-white text-black font-bold"
            >
              Buy Credits
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}