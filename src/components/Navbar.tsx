"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {

const [user, setUser] = useState<any>(null);
const [credits, setCredits] = useState(0);
const [profile, setProfile] = useState<any>(null);
const [showMenu, setShowMenu] = useState(false);

useEffect(() => {

async function loadUser() {

  const {
    data: { user },
  } = await supabase.auth.getUser();

  setUser(user);

  if (user?.email) {

    const { data } = await supabase
      .from("users")
      .select("credits")
      .eq("email", user.email)
      .single();

    setCredits(data?.credits || 0);

    const { data: profileData } =
      await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

    setProfile(profileData);
  }
}

loadUser();

}, []);

return ( <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">

  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

    <a
      href="/"
      className="text-2xl font-black tracking-tight"
    >
      StoryLens AI
    </a>

    <div className="hidden md:flex items-center gap-8">

      <a
        href="/explore"
        className="text-zinc-300 hover:text-white transition"
      >
        Explore
      </a>

      <a
        href="/studio"
        className="text-zinc-300 hover:text-white transition"
      >
        Studio
      </a>

      <a
        href="/pricing"
        className="text-zinc-300 hover:text-white transition"
      >
        Pricing
      </a>

    </div>

    {user ? (

      <div
        onMouseEnter={() =>
          setShowMenu(true)
        }
        onMouseLeave={() =>
          setShowMenu(false)
        }
        className="
          relative
          flex
          items-center
          gap-3
          px-5
          py-3
          rounded-2xl
          bg-white/5
          border
          border-white/10
        "
      >

        <span className="font-semibold">
          ⭐ {credits}
        </span>

        <div
          className="
            w-10
            h-10
            rounded-full
            overflow-hidden
            bg-white/10
            cursor-pointer
          "
        >

          {profile?.avatar_url ? (

            <img
              src={profile.avatar_url}
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
                flex
                items-center
                justify-center
                font-bold
              "
            >
              {profile?.display_name?.charAt(0) || "A"}
            </div>

          )}

        </div>

        {showMenu && (

          <div
            className="
              absolute
              top-16
              right-0
              w-56
              rounded-3xl
              bg-zinc-900
              border
              border-white/10
              p-2
              shadow-2xl
              transition-all
              duration-200
            "
          >

            <a
              href={`/creator/${profile?.username}`}
              className="
                block
                px-4
                py-3
                rounded-2xl
                hover:bg-white/5
              "
            >
              Profile
            </a>

            <a
              href="/settings"
              className="
                block
                px-4
                py-3
                rounded-2xl
                hover:bg-white/5
              "
            >
              Settings
            </a>

            <a
              href="/credits"
              className="
                block
                px-4
                py-3
                rounded-2xl
                hover:bg-white/5
              "
            >
              Credits
            </a>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                window.location.href = "/";
              }}
              className="
                w-full
                text-left
                px-4
                py-3
                rounded-2xl
                hover:bg-red-500/10
                text-red-400
              "
            >
              Logout
            </button>

          </div>

        )}

      </div>

    ) : (

      <a
        href="/auth"
        className="
          px-5
          py-3
          rounded-2xl
          bg-cyan-500
          text-black
          font-bold
          hover:scale-105
          transition
        "
      >
        Start Creating
      </a>

    )}

  </div>

</nav>

);
}
