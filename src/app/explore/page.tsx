"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ExplorePage() {

  const [creations, setCreations] = useState<any[]>([]);
  const [selectedCreation, setSelectedCreation] = useState<any>(null);
  const [profiles, setProfiles] = useState<any>({});
  const [likes, setLikes] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("latest");
  const [topCreators, setTopCreators] =
  useState<any[]>([]);

  async function loadCreations() {

    setLoading(true);

    const { data } = await supabase
  .from("generations")
  .select(`
  id,
  image,
  prompt,
  user_id,
  created_at
`)
  .order("created_at", {
    ascending: false,
  })

      if (data) {

        setCreations(data);
        setLoading(false);
        loadProfiles(data);
        loadLikes();
      
        async function loadProfiles(
  creationsData: any[]
) {

  const userIds = [
    ...new Set(
      creationsData
        .map((item) => item.user_id)
        .filter(Boolean)
    ),
  ];

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .in("user_id", userIds);

  const profileMap: any = {};

  data?.forEach((profile) => {
    profileMap[profile.user_id] = profile;
  });

  setProfiles(profileMap);

const creatorsArray =
  Object.values(profileMap);

console.log(
  "CREATORS ARRAY:",
  creatorsArray
);

setTopCreators(
  creatorsArray.slice(0, 5)
);
}

        async function loadLikes() {

  const { data } = await supabase
    .from("likes")
    .select("*");

  const likesMap: any = {};

  data?.forEach((like) => {

    if (!likesMap[like.generation_id]) {
      likesMap[like.generation_id] = 0;
    }

    likesMap[like.generation_id]++;
  });

  setLikes(likesMap);
}
      }
  }

  async function likeCreation(
    generationId: string
  ) {
  
    const {
      data: { user },
    } = await supabase.auth.getUser();
  
    if (!user) {
      alert("Login required");
      return;
    }
  
    const { data: existingLikes } = await supabase
      .from("likes")
      .select("id")
      .eq("user_id", user.id)
      .eq("generation_id", generationId);
  
    const existingLike =
      existingLikes && existingLikes.length > 0
        ? existingLikes[0]
        : null;
  
    if (existingLike) {
  
      await supabase
        .from("likes")
        .delete()
        .eq("id", existingLike.id);
  
    } else {
  
      const { error } = await supabase
        .from("likes")
        .insert([
          {
            user_id: user.id,
            generation_id: generationId,
          },
        ]);
  
      if (error) {
        console.error(error);
        return;
      }
    }
  
    await loadCreations();

const updatedLikes = await supabase
  .from("likes")
  .select("*");

const likesMap: any = {};

updatedLikes.data?.forEach((like) => {
  if (!likesMap[like.generation_id]) {
    likesMap[like.generation_id] = 0;
  }

  likesMap[like.generation_id]++;
});

setLikes(likesMap);
  }

  useEffect(() => {
    loadCreations();
  }, []);

  const displayedCreations =
  activeTab === "latest"
    ? creations
    : [...creations].sort(
        (a, b) =>
          (likes[b.id] || 0) -
          (likes[a.id] || 0)
      );

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-7xl mx-auto">

      <h1 className="text-7xl md:text-8xl font-black mb-6">
  Discover
  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
    Cinematic Worlds
  </span>
</h1>

<p className="text-zinc-400 text-2xl mb-16 max-w-3xl">
  Explore stunning AI-generated stories,
  characters and cinematic scenes created
  by the StoryLens community.
</p>
<div
  className="
    relative
    overflow-hidden
    rounded-[32px]
    border
    border-purple-500/20
    bg-gradient-to-br
    from-purple-500/20
    via-cyan-500/10
    to-black
    p-10
    mb-12
  "
>

  <div className="max-w-3xl">

    <p className="text-purple-400 font-bold mb-3">
      ✨ Featured Community
    </p>

    <h2 className="text-5xl font-black mb-4">
      Explore The Most
      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
        Cinematic Creations
      </span>
    </h2>

    <p className="text-zinc-300 text-lg">
      Discover AI-generated stories,
      characters and worlds created
      by talented StoryLens creators.
    </p>

  </div>

</div>

<div className="grid md:grid-cols-3 gap-6 mb-12">

  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
    <p className="text-zinc-400">
      Creations
    </p>

    <h3 className="text-4xl font-black">
      {creations.length}
    </h3>
  </div>

  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
    <p className="text-zinc-400">
      Creators
    </p>

    <h3 className="text-4xl font-black">
      {Object.keys(profiles).length}
    </h3>
  </div>

  <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
    <p className="text-zinc-400">
      Likes
    </p>

    <h3 className="text-4xl font-black">
  {Object.values(likes)
    .map(Number)
    .reduce((a, b) => a + b, 0)}
</h3>
  </div>

</div>

<div className="mb-12">

  <h2 className="text-3xl font-black mb-6">
  🏆 Featured Creator
  </h2>

<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">

    {topCreators.map(
      (creator, index) => (

        <div
        key={creator.user_id}
        className="
          bg-gradient-to-br
          from-purple-500/20
          to-cyan-500/10
          border
          border-purple-500/30
          rounded-3xl
          p-6
          text-center
          hover:scale-105
          transition
          duration-300
        "
      >

<div className="flex justify-center mb-4">

<img
  src={
    creator.avatar_url ||
    "https://ui-avatars.com/api/?name=Creator"
  }
  alt="Avatar"
  className="
    w-20
    h-20
    rounded-full
    object-cover
    border-2
    border-purple-500/40
  "
/>

</div>

          <div className="text-3xl mb-2">
            {["🥇","🥈","🥉","⭐","⭐"][index]}
          </div>

          <h3
  onClick={() => {
    window.location.href =
      `/creator/${creator.username}`;
  }}
  className="
    font-bold
    cursor-pointer
    hover:text-purple-400
  "
>
            {creator.display_name ||
             creator.username}
          </h3>

          <p className="text-zinc-400 text-sm">
            @{creator.username}
          </p>

        </div>

      )
    )}

  </div>

</div>

        <div className="flex gap-4 mb-10">

  <button
    onClick={() =>
      setActiveTab("latest")
    }
    className={`px-6 py-3 rounded-2xl font-semibold transition ${
      activeTab === "latest"
        ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
        : "bg-white/5"
    }`}
  >
    Latest
  </button>

  <button
    onClick={() =>
      setActiveTab("trending")
    }
    className={`px-6 py-3 rounded-2xl font-semibold transition ${
      activeTab === "trending"
        ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
        : "bg-white/5"
    }`}
  >
    Trending
  </button>

</div>

       {loading ? (

<div className="grid md:grid-cols-3 gap-8">

    {[...Array(9)].map((_, i) => (

      <div
        key={i}
        className="h-72 rounded-3xl bg-white/5 animate-pulse"
      />

    ))}

  </div>

) : (

  <div className="columns-1 md:columns-3 gap-6 space-y-6">

    {displayedCreations.map((item) => (

<div
key={item.id}
onClick={() => {
  setSelectedCreation(item);
}}
className="
  cursor-pointer
  rounded-3xl
  overflow-hidden
  mb-6
  break-inside-avoid
  bg-white/5
  border
  border-white/10
  backdrop-blur-xl
  hover:border-purple-500/30
  hover:scale-[1.02]
  transition
  duration-500
"
>

<div className="relative">

<img
  src={item.image}
  alt={item.prompt}
  className="
    w-full
    min-h-[280px]
max-h-[520px]
    object-cover
    transition
    duration-500
    hover:scale-105
  "
/>

<div
  className="
    absolute
    inset-0
    bg-gradient-to-t
    from-black/90
    via-transparent
    to-transparent
  "
/>

<div
  className="
    absolute
    bottom-0
    left-0
    right-0
    p-4
  "
>

  <p className="font-bold text-lg truncate">
    {profiles[item.user_id]?.display_name ||
     profiles[item.user_id]?.username ||
     "Creator"}
  </p>

  <p className="text-sm text-zinc-300">
    ❤️ {likes[item.id] || 0} Likes
  </p>

</div>

</div>

      </div>

    ))}

  </div>

)}

      </div>
      {selectedCreation && (

  <div
    className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-6"
    onClick={() => setSelectedCreation(null)}
  >

    <div
      onClick={(e) => e.stopPropagation()}
      className="bg-zinc-900 rounded-3xl max-w-6xl w-full overflow-hidden grid lg:grid-cols-2"
    >

      <img
        src={selectedCreation.image}
        alt=""
        className="w-full h-full object-cover"
      />

      <div className="p-8 overflow-y-auto">
      <div className="mb-8">

  <button
    onClick={() => {
      const creator =
        profiles[selectedCreation.user_id];

      if (creator?.username) {
        window.location.href =
          `/creator/${creator.username}`;
      }
    }}
    className="text-left"
  >

  
    <h3 className="text-2xl font-bold">
      {
        profiles[selectedCreation.user_id]
  ?.display_name ||
profiles[selectedCreation.user_id]
  ?.username ||
"Creator"
      }
    </h3>

    <a
  href={`/creator/${
    profiles[selectedCreation.user_id]
      ?.username
  }`}
  className="text-zinc-400 hover:text-purple-400"
>
  @
  {
    profiles[selectedCreation.user_id]
      ?.username || "unknown"
  }
</a>

  </button>

</div>

        <h2 className="text-3xl font-bold mb-6">
          Prompt
        </h2>

        <p className="text-zinc-300 whitespace-pre-wrap">
          {selectedCreation.prompt}
        </p>

        <div className="mt-8 flex gap-4">

        <button
  onClick={() =>
    likeCreation(selectedCreation.id)
  }
  className="border border-white/20 px-6 py-3 rounded-2xl"
>
  ❤️ {likes[selectedCreation.id] ?? 0}
</button>

          <a
            href={selectedCreation.image}
            download
            className="bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-2xl"
          >
            Download
          </a>

          <button
            onClick={() => {
              navigator.clipboard.writeText(
                selectedCreation.prompt
              );
              alert("Prompt copied!");
            }}
            className="border border-white/20 px-6 py-3 rounded-2xl"
          >
            Copy Prompt
          </button>

        </div>

      </div>

    </div>

  </div>

)}

    </main>
  );
}