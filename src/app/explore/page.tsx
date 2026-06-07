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

        <h1 className="text-6xl font-black mb-4">
          Explore
        </h1>

        <p className="text-zinc-400 text-xl mb-12">
          Discover creations from the CineAI community.
        </p>
        <div className="flex gap-4 mb-10">

  <button
    onClick={() =>
      setActiveTab("latest")
    }
    className={`px-6 py-3 rounded-2xl ${
      activeTab === "latest"
        ? "bg-white text-black"
        : "bg-white/5"
    }`}
  >
    Latest
  </button>

  <button
    onClick={() =>
      setActiveTab("trending")
    }
    className={`px-6 py-3 rounded-2xl ${
      activeTab === "trending"
        ? "bg-white text-black"
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

  <div className="grid md:grid-cols-3 gap-8">

    {displayedCreations.map((item) => (

      <div
        key={item.id}
        onClick={() => {
          setSelectedCreation(item);
        }}
        className="cursor-pointer rounded-3xl overflow-hidden hover:scale-[1.02] transition"
      >

        {item.image && (

          <img
            src={item.image}
            alt={item.prompt}
            className="w-full h-72 object-cover"
          />

        )}

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
            className="bg-white text-black px-6 py-3 rounded-2xl"
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