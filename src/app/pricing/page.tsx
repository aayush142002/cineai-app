"use client";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <div className="max-w-7xl mx-auto px-6 py-20">

        <h1 className="text-6xl font-black text-center mb-4">
          Pricing
        </h1>

        <p className="text-zinc-400 text-center mb-20 text-xl">
          Start free and purchase credits whenever you need more generations.
        </p>

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
              Small Pack
            </h3>

            <p className="text-5xl font-black mt-4">
              $5
            </p>

            <p className="text-zinc-400 mt-2">
              20 Credits
            </p>

            <button
              onClick={() => alert("Small Pack - 20 Credits")}
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
              Medium Pack
            </h3>

            <p className="text-5xl font-black mt-4">
              $10
            </p>

            <p className="text-zinc-400 mt-2">
              50 Credits
            </p>

            <button
              onClick={() => alert("Medium Pack - 50 Credits")}
              className="w-full mt-8 py-4 rounded-2xl bg-green-500 font-bold"
            >
              Buy Credits
            </button>

          </div>

          {/* LARGE */}

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

            <h3 className="text-3xl font-black">
              Large Pack
            </h3>

            <p className="text-5xl font-black mt-4">
              $20
            </p>

            <p className="text-zinc-400 mt-2">
              120 Credits
            </p>

            <button
              onClick={() => alert("Large Pack - 120 Credits")}
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