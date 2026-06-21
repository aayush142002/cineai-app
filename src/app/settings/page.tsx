"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {

  const [user, setUser] = useState<any>(null);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarFile, setAvatarFile] =
  useState<File | null>(null);

  async function loadProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    setUser(user);
    console.log("USER:", user);

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (data) {
      setUsername(data.username || "");
      setDisplayName(data.display_name || "");
      setBio(data.bio || "");
      setAvatarUrl(data.avatar_url || "");
    }
  }

  async function uploadAvatar() {

    if (!avatarFile || !user) return;
    
    const fileName =
    `${user.id}-${Date.now()}`;
    
    const { data, error } =
    await supabase.storage
    .from("avatars")
    .upload(
    fileName,
    avatarFile,
    {
    upsert: true,
    }
    );
    
    console.log("UPLOAD DATA:", data);
    console.log("UPLOAD ERROR:", error);
    
    if (error) {
    alert(error.message);
    return;
    }
    
    const { data: publicUrlData } =
    supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);
    
    setAvatarUrl(
    publicUrlData.publicUrl
    );
    
    return publicUrlData.publicUrl;
    }
    

    async function saveProfile() {

      if (!user) {
        alert("User not loaded yet");
        return;
      }

      let finalAvatarUrl = avatarUrl;
      
      if (avatarFile) {
      
      
      const uploadedUrl =
        await uploadAvatar();
      
      if (uploadedUrl) {
        finalAvatarUrl =
          uploadedUrl;
      }
      
      
      }
      
      const { error } = await supabase
      .from("profiles")
      .update({
      username,
      display_name: displayName,
      bio,
      avatar_url: finalAvatarUrl,
      })
      .eq("user_id", user.id);
      
      if (error) {
      alert(error.message);
      return;
      }
      
      setAvatarUrl(finalAvatarUrl);
      
      alert("Profile Updated!");
      
      loadProfile();
      }
      useEffect(() => {
        loadProfile();
        }, []);
        if (!user) {
          return ( <div className="min-h-screen flex items-center justify-center text-white">
          Loading... </div>
          );
          }
          

  return (
    <main className="min-h-screen  text-white p-10">

      <div className="max-w-3xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-8">

        <h1 className="text-5xl font-bold mb-10">
          Settings
        </h1>

        <div className="space-y-6">

          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4"
          />

          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Display Name"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4"
          />

          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 h-40"
          />

<div className="space-y-4">

<div
  className="
    w-28
    h-28
    rounded-full
    overflow-hidden
    border
    border-white/10
  "
>

  {avatarUrl ? (

    <img
      src={avatarUrl}
      alt="Avatar"
      className="
        w-full
        h-full
        object-cover
      "
    />

  ) : (

    <div
      className="
        w-full
        h-full
        bg-white/5
      "
    />

  )}

</div>

<input
  type="file"
  accept="image/*"
  onChange={(e) =>
    setAvatarFile(
      e.target.files?.[0] || null
    )
  }
  className="
    w-full
    bg-black/40
    border
    border-white/10
    rounded-2xl
    px-5
    py-4
  "
/>

</div>

          <button
            onClick={saveProfile}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 py-4 rounded-2xl font-bold"
          >
            Save Profile
          </button>

        </div>

      </div>

    </main>
  );
}