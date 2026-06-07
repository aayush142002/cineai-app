"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<File | null>(null);

  async function loadProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setDisplayName(data.display_name || "");
      setBio(data.bio || "");
    }
  }

  async function saveProfile() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    let avatarUrl = null;

    if (avatar) {

      const fileName =
        `${user?.id}-${Date.now()}`;
    
      const { data: uploadData, error: uploadError } =
        await supabase.storage
          .from("avatars")
          .upload(fileName, avatar);
    
      console.log("UPLOAD DATA:", uploadData);
      console.log("UPLOAD ERROR:", uploadError);
    
      if (!uploadError) {
    
        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(fileName);
    
        avatarUrl = data.publicUrl;
    
        console.log("AVATAR URL:", avatarUrl);
    
      }
    
    } 

    if (!user) return;

    const { data: existingProfile } = await supabase
  .from("profiles")
  .select("*")
  .eq("user_id", user.id)
  .single();

if (existingProfile) {

  await supabase
  .from("profiles")
  .update({
    display_name: displayName,
    bio: bio,
    avatar_url: avatarUrl,
  })
  .eq("user_id", user.id);

} else {

  await supabase
  .from("profiles")
  .insert([
    {
      user_id: user.id,
      username: user.email
        ?.split("@")[0]
        .toLowerCase(),
      display_name: displayName,
      bio: bio,
      avatar_url: avatarUrl,
    },
  ]);

}
    alert("Profile updated!");

    setLoading(false);
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">

        <h1 className="text-5xl font-black mb-10">
          Edit Profile
        </h1>

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

          <label className="block mb-3 text-zinc-300">
            Display Name
          </label>

          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-2xl p-4 mb-8"
          />

          <label className="block mb-3 text-zinc-300">
            Bio
          </label>

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            className="w-full bg-black border border-white/10 rounded-2xl p-4 mb-8"
          />

<label className="block mb-3 text-zinc-300">
  Profile Photo
</label>

<input
  type="file"
  accept="image/*"
  onChange={(e) => {
    if (e.target.files?.[0]) {
      setAvatar(e.target.files[0]);
    }
  }}
  className="mb-8 block w-full"
/>

          <button
            onClick={saveProfile}
            disabled={loading}
            className="bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 rounded-2xl font-bold"
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>

        </div>

      </div>
    </main>
  );
}