"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function FollowButton({
  creatorId,
}: {
  creatorId: string;
}) {

  const [following, setFollowing] =
    useState(false);
    useEffect(() => {

      checkFollow();
    
    }, []);
    
    async function checkFollow() {
    
      const {
        data: { user },
      } = await supabase.auth.getUser();
    
      if (!user) return;
    
      const { data } = await supabase
        .from("followers")
        .select("*")
        .eq("follower_id", user.id)
        .eq("following_id", creatorId)
        .maybeSingle();
    
      if (data) {
        setFollowing(true);
      }
    }

  async function follow() {

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Login required");
      return;
    }
    if (following) {

      await supabase
        .from("followers")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", creatorId);
    
      setFollowing(false);
    
      return;
    }

    const { error } = await supabase
      .from("followers")
      .insert([
        {
          follower_id: user.id,
          following_id: creatorId,
        },
      ]);

      await supabase
  .from("notifications")
  .insert([
    {
      user_id: creatorId,
      actor_id: user.id,
      type: "follow",
      message: "started following you",
    },
  ]);

    if (!error) {
      setFollowing(true);
    }
  }

  return (
    <button
      onClick={follow}
      className="mt-6 px-6 py-3 bg-white text-black rounded-2xl font-semibold"
    >
      {following
        ? "Following"
        : "Follow"}
    </button>
  );
}