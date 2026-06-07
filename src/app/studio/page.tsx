"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StudioPage() {

  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [video, setVideo] = useState("");
const [videoLoading, setVideoLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [credits, setCredits] = useState(0);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [notificationCount, setNotificationCount] =
  useState(0);

  async function generateStory() {
    if (credits < 3) {

      alert(`
        You're out of credits.
        
        ✨ Story + Image = 3 Credits
        🎥 AI Video = 5 Credits
        
        Buy more credits to continue creating cinematic content.
        `);
    
      return;
    }

    setLoading(true);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  prompt,
  userEmail: user?.email || "guest@example.com",
  userId: user?.id || null,
}),
    });

    const data = await response.json();

    setResult(data.result);
    setImages(data.images || []);

    const newCredits = credits - 3;

setCredits(newCredits);

await supabase
  .from("users")
  .update({
    credits: newCredits,
  })
  .eq("email", user?.email);

    setLoading(false);
    loadGenerations();
  }

  async function generateVideo() {

    try {
  
      setVideoLoading(true);
  
      const response = await fetch(
        "/api/generate-video",
        {
          method: "POST",
  
          headers: {
            "Content-Type": "application/json",
          },
  
          body: JSON.stringify({
            prompt,
          }),
        }
      );
  
      const data = await response.json();
  
      console.log(JSON.stringify(data, null, 2));
  
      if (data.video) {
  
        if (Array.isArray(data.video)) {
          setVideo(data.video[0]);
        } else {
          setVideo(data.video);
        }
      }
  
    } catch (error) {
  
      console.error(error);
  
    } finally {
  
      setVideoLoading(false);
  
    }
  }

  async function loadGenerations(email?: string) {

    const { data } = await supabase
    .from("generations")
    .select("*")
    .eq("user_email", email || "guest@example.com")
    .order("created_at", { ascending: false });;
  
    if (data) {
      setGenerations(data);
    }
  }
  
  useEffect(() => {

  async function getUser() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    setUser(user);
    const { data: profileData } = await supabase
  .from("profiles")
  .select("*")
  .eq("user_id", user.id)
  .single();

setProfile(profileData);

    setCheckingAuth(false);
      if (user?.email) {

        const { data } = await supabase
          .from("users")
          .select("credits")
          .eq("email", user.email)
          .single();
      
        if (data) {
          setCredits(data.credits);
        }
      }
  
      loadGenerations(user?.email);
      loadNotificationCount();
    }
  
    getUser();
  
  }, []);

  if (checkingAuth) {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      Loading...
    </main>
  );
}

async function loadNotificationCount() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { count } = await supabase
    .from("notifications")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("user_id", user.id)
    .eq("is_read", false);

    console.log("NOTIFICATION COUNT:", count);

  setNotificationCount(count || 0);
}


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

<div className="max-w-6xl mx-auto bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-6 md:p-10 shadow-2xl">

        {/* HERO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">

  <div>

    <h1 className="text-4xl md:text-7xl font-bold tracking-tight">
      CineAI
    </h1>

    <p className="text-zinc-400 text-xl mt-4">
      {user?.email || "Guest User"}
    </p>
    <p className="text-yellow-400 mt-2">
  Credits: {credits}
</p>

{credits <= 0 && (

<button
  className="mt-4 bg-yellow-400 text-black px-6 py-3 rounded-2xl font-bold"
>
  Upgrade to Pro
</button>

)}

  </div>

  <div className="relative flex items-center gap-4">

  <button
  onClick={() => {
    window.location.href =
      "/notifications";
  }}
  className="relative text-2xl"
>
  🔔

  {notificationCount > 0 && (
    <span
      className="
      absolute
      -top-2
      -right-2
      bg-red-500
      text-white
      text-xs
      w-5
      h-5
      rounded-full
      flex
      items-center
      justify-center
      "
    >
      {notificationCount}
    </span>
  )}
</button>

  <button
    onClick={() => setShowMenu(!showMenu)}
    className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 font-bold text-lg"
  >
    {profile?.display_name?.charAt(0) || "A"}
  </button>

  {showMenu && (

    <div className="absolute right-0 mt-3 w-56 bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden z-50">

      <button
        onClick={() => {
          window.location.href = `/creator/${profile?.username}`;
        }}
        className="w-full text-left px-5 py-4 hover:bg-white/5"
      >
        Profile
      </button>

      <button
  onClick={() => {
    window.location.href = "/explore";
  }}
  className="w-full text-left px-5 py-4 hover:bg-white/5"
>
  Explore
</button>

<button
  onClick={() => {
    window.location.href =
      "/notifications";
  }}
  className="w-full text-left px-5 py-4 hover:bg-white/5"
>
  Notifications
</button>


      <button
        onClick={() => {
          window.location.href = "/settings";
        }}
        className="w-full text-left px-5 py-4 hover:bg-white/5"
      >
        Settings
      </button>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          window.location.href = "/auth";
        }}
        className="w-full text-left px-5 py-4 text-red-400 hover:bg-red-500/10"
      >
        Logout
      </button>

    </div>

  )}

</div>

</div>

        {/* INPUT */}
        <div className="mt-16 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl">
        <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[32px] p-6 md:p-10 shadow-2xl hover:scale-[1.01] hover:shadow-[0_0_60px_rgba(168,85,247,0.25)] transition duration-500">

          <div className="flex flex-col md:flex-row gap-4">

            <input
              type="text"
              placeholder="Enter your cinematic story idea..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition backdrop-blur-xl"
            />

            <button
              onClick={generateStory}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-5 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition disabled:opacity-50"
            >
              {loading ? "Generating..." : "Generate"}
            </button>
            <button
  onClick={generateVideo}
  disabled={videoLoading}
  className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition disabled:opacity-50"
>
  {videoLoading
    ? "Generating Video..."
    : "Generate Video"}
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
        {loading && (

<div className="mt-12 text-center">

  <div className="w-16 h-16 border-4 border-white/10 border-t-white rounded-full animate-spin mx-auto"></div>

  <p className="text-zinc-400 text-xl mt-6">
    Generating cinematic experience...
  </p>

</div>

)}


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
      </div>


      {video && (

<div className="max-w-5xl mx-auto mt-10">

  <video
    controls
    autoPlay
    loop
    className="w-full rounded-3xl border border-white/10"
  >
    <source src={video} />
  </video>

</div>

)}
      {/* HISTORY */}

<div className="mt-20">

<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">

  <h2 className="text-4xl font-bold">
    Previous Generations
  </h2>

  <button
    onClick={() =>
      setShowFavoritesOnly(!showFavoritesOnly)
    }
    className="border border-white/20 px-5 py-3 rounded-2xl"
  >
    {showFavoritesOnly
      ? "Show All"
      : "Show Favorites"}
  </button>

</div>

<div className="grid md:grid-cols-2 gap-8">

{generations
  .filter((item) =>
    showFavoritesOnly ? item.favorite : true
  )
  .map((item) => (

    <div
      key={item.id}
      className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden backdrop-blur-xl hover:scale-[1.02] hover:border-purple-500/30 transition duration-500"
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
        <div className="flex flex-col md:flex-row gap-4">

  <a
    href={item.image}
    download
    className="bg-white text-black px-5 py-3 rounded-2xl font-semibold"
  >
    Download Image
  </a>

  <button
    onClick={() => {
      navigator.clipboard.writeText(item.script);
      alert("Script copied!");
    }}
    className="border border-white/20 px-5 py-3 rounded-2xl"
  >
    Copy Script
  </button>

  <button
  onClick={() => {

    const shareUrl =
      `${window.location.origin}/share/${item.id}`;

    navigator.clipboard.writeText(shareUrl);

    alert("Share link copied!");

  }}
  className="border border-blue-500/30 text-blue-400 px-5 py-3 rounded-2xl"
>
  Share
</button>

  
  <button
  onClick={async () => {

    await supabase
      .from("generations")
      .delete()
      .eq("id", item.id);

    loadGenerations(user?.email);

  }}
  className="border border-red-500/30 text-red-400 px-5 py-3 rounded-2xl"
>
  Delete
</button>
<button
  onClick={async () => {

    await supabase
      .from("generations")
      .update({
        favorite: !item.favorite,
      })
      .eq("id", item.id);

    loadGenerations(user?.email);

  }}
  className={`px-5 py-3 rounded-2xl ${
    item.favorite
      ? "bg-yellow-400 text-black"
      : "border border-white/20"
  }`}
>
  {item.favorite ? "★ Favorited" : "☆ Favorite"}
</button>

</div>

      </div>

    </div>

  ))}

</div>

</div>

      </div> 

    </main>
  );
}