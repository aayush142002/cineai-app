"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {

  const [user, setUser] = useState<any>(null);

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  async function loadProfile() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/auth";
      return;
    }

    setUser(user);

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

  async function saveProfile() {

    const { error } = await supabase
      .from("profiles")
      .update({
        username,
        display_name: displayName,
        bio,
        avatar_url: avatarUrl,
      })
      .eq("user_id", user.id);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Profile Updated!");
  }

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white p-10">

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

          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="Avatar URL"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4"
          />

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