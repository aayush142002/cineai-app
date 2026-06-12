"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function StudioPage() {

  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [imageSize, setImageSize] = useState("1:1");
  const [imageCount, setImageCount] =
  useState(1);
  const [video, setVideo] = useState("");
const [videoLoading, setVideoLoading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] =
  useState("");
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
    const requiredCredits =
  imageCount === 1
    ? 3
    : imageCount === 2
    ? 5
    : 8;

if (credits < requiredCredits) {

      alert(`
        You're out of credits.
        
        1 Image = 3 Credits
2 Images = 5 Credits
4 Images = 8 Credits
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
        imageSize,
        imageCount,
        userEmail: user?.email || "guest@example.com",
        userId: user?.id || null,
      })
    });

    const data = await response.json();

    setResult(data.result);
    setImages(data.images || []);

    const newCredits =
  credits - requiredCredits;

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
    <main className="min-h-screen text-white flex items-center justify-center">
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
    <main className="relative min-h-screen overflow-hidden text-white">
    {/* Background Glow */}

<div className="absolute inset-0 overflow-hidden">

<div className="absolute top-[-200px] left-[-150px] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-3xl"></div>

<div className="absolute bottom-[-200px] right-[-150px] w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"></div>

<div className="absolute top-[30%] left-[40%] w-[300px] h-[300px] bg-pink-500/10 rounded-full blur-3xl"></div>

</div>
<div className="relative z-10 px-6 md:px-12 py-10">
        {/* HERO */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">

  <div>

  <h1 className="text-5xl md:text-7xl font-black tracking-tight">
  Create Your Next Cinematic World
</h1>

<p className="text-zinc-400 text-xl mt-4">
  AI Story & Visual Generation Studio
</p>
    <p className="text-yellow-400 mt-2">
    ⚡ Available Credits: {credits}
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

<div className="flex flex-col gap-2">

  <span className="text-sm text-zinc-400">
    Aspect Ratio
  </span>

  <div className="flex gap-2 flex-wrap">

    <button
      type="button"
      onClick={() => setImageSize("1:1")}
      className={`px-4 py-3 rounded-xl transition ${
        imageSize === "1:1"
          ? "bg-cyan-500 text-black font-bold"
          : "bg-white/5 border border-white/10"
      }`}
    >
      Square
    </button>

    <button
      type="button"
      onClick={() => setImageSize("9:16")}
      className={`px-4 py-3 rounded-xl transition ${
        imageSize === "9:16"
          ? "bg-cyan-500 text-black font-bold"
          : "bg-white/5 border border-white/10"
      }`}
    >
      Mobile Reel
    </button>

    <button
      type="button"
      onClick={() => setImageSize("16:9")}
      className={`px-4 py-3 rounded-xl transition ${
        imageSize === "16:9"
          ? "bg-cyan-500 text-black font-bold"
          : "bg-white/5 border border-white/10"
      }`}
    >
      Cinematic Wide
    </button>

  </div>

</div>

<div className="flex flex-col gap-2">

  <span className="text-sm text-zinc-400">
    Images
  </span>

  <div className="flex gap-2">

    <button
      type="button"
      onClick={() => setImageCount(1)}
      className={`w-14 py-3 rounded-xl transition ${
        imageCount === 1
          ? "bg-purple-500 text-white font-bold"
          : "bg-white/5 border border-white/10"
      }`}
    >
      1
    </button>

    <button
      type="button"
      onClick={() => setImageCount(2)}
      className={`w-14 py-3 rounded-xl transition ${
        imageCount === 2
          ? "bg-purple-500 text-white font-bold"
          : "bg-white/5 border border-white/10"
      }`}
    >
      2
    </button>

    <button
      type="button"
      onClick={() => setImageCount(4)}
      className={`w-14 py-3 rounded-xl transition ${
        imageCount === 4
          ? "bg-purple-500 text-white font-bold"
          : "bg-white/5 border border-white/10"
      }`}
    >
      4
    </button>

  </div>

</div>
            <input
              type="text"
              placeholder="Describe a cinematic scene, character, world or story..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-lg outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition backdrop-blur-xl"
            />

            <button
              onClick={generateStory}
              disabled={loading}
              className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-5 rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-[0_0_40px_rgba(168,85,247,0.5)] transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "✨ Create Story"}
            </button>
            <button
  onClick={generateVideo}
  disabled={videoLoading}
  className="bg-gradient-to-r from-pink-500 to-purple-500 px-8 py-5 rounded-2xl font-bold text-lg hover:scale-105 transition disabled:opacity-50"
>
  {videoLoading
    ? "Creating Video..."
    : "🎥 Create Video"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {Array.isArray(images) && images.map((img, index) => (

                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-3xl p-4 backdrop-blur-xl"
                >

<img
  src={img}
  alt={`Scene ${index + 1}`}
  onClick={() => setSelectedImage(img)}
  className="
    rounded-2xl
    w-full
    aspect-square
    object-cover
    cursor-pointer
    hover:scale-[1.03]
    transition
    duration-300
  "
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
  href={selectedImage}
  target="_blank"
  rel="noopener noreferrer"
  className="
    bg-white
    text-black
    px-6
    py-3
    rounded-2xl
    font-bold
  "
>
  Open Full Resolution
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
{selectedImage && (

<div
  className="
    fixed
    inset-0
    bg-black/90
    z-[9999]
    flex
    items-center
    justify-center
    p-6
  "
  onClick={() => setSelectedImage("")}
>

  <div
    className="relative max-w-6xl w-full"
    onClick={(e) => e.stopPropagation()}
  >

    <button
      onClick={() => setSelectedImage("")}
      className="
        absolute
        top-4
        right-4
        bg-black/50
        px-4
        py-2
        rounded-xl
        text-white
      "
    >
      ✕
    </button>

    <img
      src={selectedImage}
      alt="Preview"
      className="
        w-full
        max-h-[85vh]
        object-contain
        rounded-3xl
      "
    />

    <div className="flex justify-center mt-6">

      <a
        href={selectedImage}
        download
        className="
          bg-white
          text-black
          px-6
          py-3
          rounded-2xl
          font-bold
        "
      >
        Download Image
      </a>

    </div>

  </div>

</div>

)}

    </main>
  );
}