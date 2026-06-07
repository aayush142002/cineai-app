"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {

  const [creations, setCreations] = useState<any[]>([]);
const [likes, setLikes] = useState<any>({});
const [topCreators, setTopCreators] = useState<any[]>([]);
const [followingCreations, setFollowingCreations] = useState<any[]>([]);


useEffect(() => {
  loadTrending();
}, []);

async function loadTrending() {

  const { data } = await supabase
    .from("generations")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(12);

  if (!data) return;

  setCreations(data);

  const { data: likesData } =
    await supabase
      .from("likes")
      .select("*");

  const likesMap: any = {};

  likesData?.forEach((like) => {

    if (!likesMap[like.generation_id]) {
      likesMap[like.generation_id] = 0;
    }

    likesMap[like.generation_id]++;
  });

  setLikes(likesMap);

  const { data: profiles } =
  await supabase
    .from("profiles")
    .select("*");
   

setTopCreators(
  profiles || []
);

const {
  data: { user },
} = await supabase.auth.getUser();

if (user) {

  const { data: following } =
    await supabase
      .from("followers")
      .select("*")
      .eq(
        "follower_id",
        user.id
      );

  const followingIds =
    following?.map(
      (f) => f.following_id
    ) || [];

  const {
    data: followingPosts,
  } = await supabase
    .from("generations")
    .select("*")
    .in(
      "user_id",
      followingIds
    )
    .order("created_at", {
      ascending: false,
    });

  setFollowingCreations(
    followingPosts || []
  );
}

}

const trendingCreations =
  [...creations].sort(
    (a, b) =>
      (likes[b.id] || 0) -
      (likes[a.id] || 0)
  );

  const creators =
  topCreators.slice(0, 6);
  

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
    {/* Background Glow */}

<div className="absolute inset-0 overflow-hidden">

<div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>

<div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"></div>

<div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-3xl"></div>

</div>
<div className="relative z-10 px-6 md:px-12 py-10">
{/* HERO SECTION */}

<motion.div
  initial={{ opacity: 0, y: 60 }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 1.2,
    ease: "easeOut",
  }}
  className="max-w-7xl mx-auto text-center pt-10 md:pt-20 pb-20"
>

  <div className="inline-flex items-center gap-2 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full px-5 py-2 text-sm text-zinc-300 mb-8">
    ✨ Next Generation AI Filmmaking Platform
  </div>

  <motion.h1
  animate={{
    y: [0, -10, 0],
  }}
  transition={{
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  className="text-5xl md:text-8xl font-black tracking-tight leading-[1.05] max-w-6xl mx-auto"
>

    Create

    <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
      {" "}Cinematic AI{" "}
    </span>

    Stories

    </motion.h1>

  <p className="text-zinc-400 text-lg md:text-2xl max-w-3xl mx-auto mt-8 leading-relaxed">

    Generate ultra realistic AI movie scenes,
    cinematic scripts, futuristic storyboards
    and visually stunning film concepts instantly.

  </p>

  <div className="flex flex-col md:flex-row justify-center gap-4 mt-12">

  <button
  onClick={() => {
    window.location.href = "/auth";
  }}
  className="bg-white text-black px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition"
>
  Start Creating
</button>

    <button className="border border-white/10 bg-white/5 backdrop-blur-xl px-8 py-4 rounded-2xl text-lg hover:bg-white/10 transition">
      Watch Demo
    </button>

  </div>

  </motion.div>

{/* FEATURES */}

{/* FEATURES */}

<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{
      scale: 1.08,
      rotateX: 6,
      rotateY: 6,
    }}
    transition={{
      duration: 0.5,
      type: "spring",
    }}
    viewport={{ once: true }}
    className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:border-purple-500/50 transition duration-500"
  >

    <div className="text-5xl mb-6">🎬</div>

    <h3 className="text-2xl font-bold mb-4">
      AI Storytelling
    </h3>

    <p className="text-zinc-400 leading-relaxed">
      Generate cinematic scripts, emotional narratives and futuristic movie concepts instantly.
    </p>

  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{
      scale: 1.08,
      rotateX: 6,
      rotateY: 6,
    }}
    transition={{
      duration: 0.5,
      type: "spring",
      delay: 0.1,
    }}
    viewport={{ once: true }}
    className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:border-blue-500/50 transition duration-500"
  >

    <div className="text-5xl mb-6">🖼️</div>

    <h3 className="text-2xl font-bold mb-4">
      AI Visuals
    </h3>

    <p className="text-zinc-400 leading-relaxed">
      Create ultra realistic cinematic AI scenes with movie-style composition and lighting.
    </p>

  </motion.div>

  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    whileHover={{
      scale: 1.08,
      rotateX: 6,
      rotateY: 6,
    }}
    transition={{
      duration: 0.5,
      type: "spring",
      delay: 0.2,
    }}
    viewport={{ once: true }}
    className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:border-pink-500/50 transition duration-500"
  >

    <div className="text-5xl mb-6">⚡</div>

    <h3 className="text-2xl font-bold mb-4">
      Instant Creation
    </h3>

    <p className="text-zinc-400 leading-relaxed">
      Generate high-quality cinematic concepts in seconds with next-generation AI automation.
    </p>

  </motion.div>

</div>

{/* STATS */}

<div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 mb-24">

  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl">

    <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
      10K+
    </h2>

    <p className="text-zinc-400 mt-4">
      Generations
    </p>

  </div>

  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl">

    <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
      2K+
    </h2>

    <p className="text-zinc-400 mt-4">
      Creators
    </p>

  </div>

  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl">

    <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
      4.9★
    </h2>

    <p className="text-zinc-400 mt-4">
      User Rating
    </p>

  </div>

  <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl">

    <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
      24/7
    </h2>

    <p className="text-zinc-400 mt-4">
      AI Creation
    </p>

  </div>

</div>

{/* TESTIMONIALS */}

<div className="max-w-7xl mx-auto mb-24">

  <div className="text-center mb-14">

    <h2 className="text-4xl md:text-6xl font-black mb-6">
      Loved by Creators
    </h2>

    <p className="text-zinc-400 text-xl">
      Filmmakers, storytellers and AI creators use CineAI daily.
    </p>

  </div>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:scale-[1.03] transition duration-500">

      <p className="text-zinc-300 text-lg leading-relaxed mb-8">
        “CineAI completely transformed how I create cinematic concepts for my short films.”
      </p>

      <div>
        <h3 className="font-bold text-xl">
          Alex Carter
        </h3>

        <p className="text-zinc-500">
          Film Director
        </p>
      </div>

    </div>

    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:scale-[1.03] transition duration-500">

      <p className="text-zinc-300 text-lg leading-relaxed mb-8">
        “The AI visuals feel insanely futuristic. It’s like having a Hollywood concept artist.”
      </p>

      <div>
        <h3 className="font-bold text-xl">
          Sarah Lee
        </h3>

        <p className="text-zinc-500">
          Content Creator
        </p>
      </div>

    </div>

    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl hover:scale-[1.03] transition duration-500">

      <p className="text-zinc-300 text-lg leading-relaxed mb-8">
        “The cinematic storytelling workflow is faster than anything I’ve used before.”
      </p>

      <div>
        <h3 className="font-bold text-xl">
          Daniel Cruz
        </h3>

        <p className="text-zinc-500">
          AI Filmmaker
        </p>
      </div>

    </div>

  </div>

</div>

{/* PRICING */}

<div className="max-w-7xl mx-auto mb-24">

  <div className="text-center mb-16">

    <h2 className="text-4xl md:text-6xl font-black mb-6">
      Simple Pricing
    </h2>

    <p className="text-zinc-400 text-xl">
      Start creating for free. Upgrade when you’re ready.
    </p>

  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">

    {/* FREE PLAN */}

    <div className="bg-white/5 border border-white/10 rounded-[32px] p-10 backdrop-blur-xl">

      <h3 className="text-3xl font-black mb-4">
        Free
      </h3>

      <p className="text-zinc-400 mb-8">
        Perfect for exploring cinematic AI creation.
      </p>

      <h2 className="text-6xl font-black mb-10">
        $0
      </h2>

      <div className="space-y-4 text-zinc-300">

        <p>✓ 5 Free Credits</p>

        <p>✓ AI Story Generation</p>

        <p>✓ AI Image Generation</p>

        <p>✓ Public Share Links</p>

      </div>

      <button className="w-full mt-10 border border-white/10 bg-white/5 py-4 rounded-2xl">
        Current Plan
      </button>

    </div>

    {/* PRO PLAN */}

    <div className="relative bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-[32px] p-10 backdrop-blur-xl overflow-hidden">

      <div className="absolute top-4 right-4 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
        MOST POPULAR
      </div>

      <h3 className="text-3xl font-black mb-4">
        Pro
      </h3>

      <p className="text-zinc-300 mb-8">
        Built for creators, filmmakers and AI storytellers.
      </p>

      <h2 className="text-6xl font-black mb-10">
        $19
        <span className="text-2xl text-zinc-400">
          /mo
        </span>
      </h2>

      <div className="space-y-4 text-zinc-200">

        <p>✓ Unlimited Generations</p>

        <p>✓ Premium AI Visuals</p>

        <p>✓ AI Video Generation (Coming Soon)</p>

        <p>✓ Priority Rendering</p>

        <p>✓ Early Access Features</p>

      </div>

      <button className="w-full mt-10 bg-gradient-to-r from-purple-500 to-blue-500 py-4 rounded-2xl font-bold hover:scale-[1.02] transition">
        Upgrade to Pro
      </button>

    </div>

  </div>

</div>

</div>
<div className="max-w-7xl mx-auto px-6 py-20">

  <h2 className="text-5xl font-black mb-10">
    🏆 Top Creators
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    {creators.map((creator) => (

      <a
        key={creator.user_id}
        href={`/creator/${creator.username}`}
        className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-purple-500/50 transition"
      >

        <div className="flex items-center gap-4">

          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/10">

            {creator.avatar_url ? (

              <img
                src={creator.avatar_url}
                className="w-full h-full object-cover"
              />

            ) : (

              <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                {creator.display_name?.charAt(0)}
              </div>

            )}

          </div>

          <div>

            <h3 className="font-bold text-xl">
              {creator.display_name}
            </h3>

            <p className="text-zinc-400">
              @{creator.username}
            </p>

          </div>

        </div>

      </a>

    ))}

  </div>

</div>

<div className="max-w-7xl mx-auto px-6 py-20">

<div className="max-w-7xl mx-auto px-6 py-20">

  <h2 className="text-5xl font-black mb-10">
    👥 Following Feed
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

    {followingCreations
      .slice(0, 8)
      .map((item) => (

      <div
        key={item.id}
        className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
      >

        <img
          src={item.image}
          alt={item.prompt}
          className="w-full h-64 object-cover"
        />

      </div>

    ))}

  </div>

</div>

  <h2 className="text-5xl font-black mb-10">
    🔥 Trending Creations
  </h2>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

    {trendingCreations
      .slice(0, 8)
      .map((item) => (

      <div
        key={item.id}
        className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
      >

        <img
          src={item.image}
          alt={item.prompt}
          className="w-full h-64 object-cover"
        />

        <div className="p-4">

          <p className="text-sm text-zinc-300 line-clamp-2">
            {item.prompt}
          </p>

          <p className="mt-3">
            ❤️ {likes[item.id] || 0}
          </p>

        </div>

      </div>

    ))}

  </div>

</div>
    </main>
  );
}