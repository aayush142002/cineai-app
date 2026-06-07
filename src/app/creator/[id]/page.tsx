import { createClient } from "@supabase/supabase-js";
import FollowButton
from "@/components/FollowButton";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  console.log("CREATOR ID:", id);

 

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", id)
    .single();
    console.log("PROFILE:", profile);

      if (!profile) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">
        Creator not found
      </div>
    );
  }

  const { count: generationCount } = await supabase
  .from("generations")
  .select("*", {
    count: "exact",
    head: true,
  })
  .eq("user_id", profile.user_id);

const { data: creations } = await supabase
  .from("generations")
  .select("*")
  .eq("user_id", profile.user_id)
  .order("created_at", { ascending: false })
  .limit(12);

  const generationIds =
  creations?.map((c) => c.id) || [];


  const { data: likesData } =
  await supabase
    .from("likes")
    .select("*")
    .in("generation_id", generationIds);



const totalLikes =
  likesData?.length || 0;

  const {
  count: followerCount,
} = await supabase
  .from("followers")
  .select("*", {
    count: "exact",
    head: true,
  })
  .eq(
    "following_id",
    profile.user_id
  );


  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-20">

        {/* PROFILE CARD */}

        <div className="bg-white/5 border border-white/10 rounded-[32px] p-10 backdrop-blur-xl">

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">

            <div className="w-32 h-32 rounded-full overflow-hidden bg-white/10">

  {profile.avatar_url ? (

    <img
      src={profile.avatar_url}
      alt={profile.display_name}
      className="w-full h-full object-cover"
    />

  ) : (

    <div className="w-full h-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-5xl font-bold">
      {profile.display_name?.charAt(0) || "A"}
    </div>

  )}

</div>

            <div>

              <h1 className="text-5xl font-black mb-3">
                {profile.display_name}
              </h1>

              <p className="text-zinc-400 text-lg mb-6">
                @{profile.username}
              </p>

              <p className="text-zinc-300 text-lg max-w-2xl">
                {profile.bio}
              </p>

              <FollowButton
  creatorId={profile.user_id}
/>

            </div>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">

            <h2 className="text-4xl font-black">
              {generationCount || 0}
            </h2>

            <p className="text-zinc-400 mt-2">
              Generations
            </p>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">

            <h2 className="text-4xl font-black">
              {followerCount || 0}
            </h2>

            <p className="text-zinc-400 mt-2">
              Followers
            </p>

          </div>

          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">

            <h2 className="text-4xl font-black">
              {totalLikes}
            </h2>

            <p className="text-zinc-400 mt-2">
              Likes
            </p>

          </div>

        </div>

        {/* PUBLIC CREATIONS */}

        <div className="mt-16">

          <h2 className="text-4xl font-black mb-8">
            Public Creations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

  {creations?.map((item) => (

    <div
      key={item.id}
      className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden"
    >

      <img
        src={item.image}
        alt={item.prompt}
        className="w-full h-72 object-cover"
      />

      <div className="p-4">

        <p className="text-sm text-zinc-300 line-clamp-3">
          {item.prompt}
        </p>

      </div>

    </div>

  ))}

</div>

        </div>

      </div>
    </main>
  );
}