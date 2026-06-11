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
    <main className="min-h-screen text-white">
    {/* Background Glow */}

<div className="absolute inset-0 overflow-hidden">

<div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>

<div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"></div>

<div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-3xl"></div>

</div>
<div className="relative z-10 px-6 md:px-12 py-10">
{/* HERO SECTION */}

<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  className="max-w-6xl mx-auto text-center pt-20 md:pt-32 pb-24"
>

  <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 backdrop-blur-xl text-cyan-300 text-sm mb-10">
    ✨ AI Storytelling Platform
  </div>

  <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-none">

    StoryLens

    <span className="block mt-4 bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-500 bg-clip-text text-transparent glow-text">
      AI
    </span>

  </h1>

  <p className="text-2xl md:text-4xl font-bold mt-10 max-w-4xl mx-auto">
    Turn Stories Into Cinematic Worlds
  </p>

  <p className="text-zinc-400 text-lg md:text-xl max-w-3xl mx-auto mt-8 leading-relaxed">
    Generate stories, images and videos with AI.
    Create cinematic scenes, characters and visual worlds
    in seconds.
  </p>

  <div className="flex flex-col md:flex-row justify-center gap-4 mt-12">

    <a
      href="/studio"
      className="primary-button px-8 py-4 rounded-2xl text-lg"
    >
      Start Creating
    </a>

    <a
      href="/explore"
      className="px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-lg hover:bg-white/10 transition"
    >
      Explore Creations
    </a>

  </div>

  <div className="flex flex-wrap justify-center gap-8 mt-12 text-zinc-400">

    <div>⚡ 15 Free Credits</div>

    <div>🎬 AI Story Generation</div>

    <div>🖼️ AI Image Generation</div>

  </div>

</motion.div>

{/* FEATURES */}

<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">

  {/* STORY */}

  <motion.div
    whileHover={{
      y: -8,
      scale: 1.03,
    }}
    transition={{ duration: 0.25 }}
    className="glass-card p-10 group"
  >

    <div className="text-6xl mb-8">
      🎬
    </div>

    <h3 className="text-3xl font-black mb-4">
      AI Storytelling
    </h3>

    <p className="text-zinc-400 leading-relaxed text-lg">
      Generate cinematic scripts, emotional narratives and complete story worlds in seconds.
    </p>

    <div className="mt-8 h-1 w-12 bg-cyan-400 rounded-full group-hover:w-24 transition-all duration-300"></div>

  </motion.div>

  {/* VISUALS */}

  <motion.div
    whileHover={{
      y: -8,
      scale: 1.03,
    }}
    transition={{ duration: 0.25 }}
    className="glass-card p-10 group"
  >

    <div className="text-6xl mb-8">
      🖼️
    </div>

    <h3 className="text-3xl font-black mb-4">
      AI Visual Worlds
    </h3>

    <p className="text-zinc-400 leading-relaxed text-lg">
      Transform ideas into ultra-realistic scenes, characters and cinematic imagery.
    </p>

    <div className="mt-8 h-1 w-12 bg-cyan-400 rounded-full group-hover:w-24 transition-all duration-300"></div>

  </motion.div>

  {/* SPEED */}

  <motion.div
    whileHover={{
      y: -8,
      scale: 1.03,
    }}
    transition={{ duration: 0.25 }}
    className="glass-card p-10 group"
  >

    <div className="text-6xl mb-8">
      ⚡
    </div>

    <h3 className="text-3xl font-black mb-4">
      Instant Creation
    </h3>

    <p className="text-zinc-400 leading-relaxed text-lg">
      Go from prompt to cinematic concept in seconds using next-generation AI.
    </p>

    <div className="mt-8 h-1 w-12 bg-cyan-400 rounded-full group-hover:w-24 transition-all duration-300"></div>

  </motion.div>

</div>

{/* PRICING */}

<div className="max-w-7xl mx-auto mb-24">

  <div className="text-center mb-16">

    <h2 className="text-4xl md:text-6xl font-black mb-6">
      Buy Credits
    </h2>

    <p className="text-zinc-400 text-xl">
      Start free and purchase credits whenever you need more generations.
    </p>

  </div>

  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

    {/* FREE */}

    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">

      <h3 className="text-3xl font-black mb-4">
        Free
      </h3>

      <p className="text-zinc-400 mb-8">
        Perfect for exploring StoryLens AI.
      </p>

      <h2 className="text-5xl font-black mb-6">
        $0
      </h2>

      <div className="space-y-4 text-zinc-300">

        <p>✓ 15 Free Credits</p>
        <p>✓ Story Generation</p>
        <p>✓ AI Images</p>
        <p>✓ Community Access</p>

      </div>

      <button className="w-full mt-10 border border-white/10 bg-white/5 py-4 rounded-2xl">
        Current Plan
      </button>

    </div>

    {/* SMALL */}

    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">

      <h3 className="text-3xl font-black mb-4">
        Small Pack
      </h3>

      <h2 className="text-5xl font-black mb-6">
        $5
      </h2>

      <div className="space-y-4 text-zinc-300">

        <p>✓ 20 Credits</p>
        <p>✓ Story Generation</p>
        <p>✓ AI Images</p>

      </div>

      <button className="w-full mt-10 bg-white text-black py-4 rounded-2xl font-bold">
        Buy Credits
      </button>

    </div>

    {/* MEDIUM */}

    <div className="relative bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-[32px] p-8 backdrop-blur-xl">

      <div className="absolute top-4 right-4 bg-cyan-500 text-black px-4 py-1 rounded-full text-sm font-bold">
        BEST VALUE
      </div>

      <h3 className="text-3xl font-black mb-4">
        Medium Pack
      </h3>

      <h2 className="text-5xl font-black mb-6">
        $10
      </h2>

      <div className="space-y-4 text-zinc-200">

        <p>✓ 50 Credits</p>
        <p>✓ Story Generation</p>
        <p>✓ AI Images</p>

      </div>

      <button className="w-full mt-10 bg-cyan-500 text-black py-4 rounded-2xl font-bold">
        Buy Credits
      </button>

    </div>

    {/* LARGE */}

    <div className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl">

      <h3 className="text-3xl font-black mb-4">
        Large Pack
      </h3>

      <h2 className="text-5xl font-black mb-6">
        $20
      </h2>

      <div className="space-y-4 text-zinc-300">

        <p>✓ 120 Credits</p>
        <p>✓ Story Generation</p>
        <p>✓ AI Images</p>

      </div>

      <button className="w-full mt-10 bg-white text-black py-4 rounded-2xl font-bold">
        Buy Credits
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