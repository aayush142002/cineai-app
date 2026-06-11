"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<any[]>([]);

  const [profileMap, setProfileMap] =
    useState<any>({});

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("USER:", user);

    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    setNotifications(data || []);

    await supabase
  .from("notifications")
  .update({
    is_read: true,
  })
  .eq("user_id", user.id)
  .eq("is_read", false);

    const actorIds = [
      ...new Set(
        data?.map(
          (n) => n.actor_id
        ) || []
      ),
    ];

    if (actorIds.length === 0) return;

    const { data: profiles } =
      await supabase
        .from("profiles")
        .select("*")
        .in("user_id", actorIds);

    const map: any = {};

    profiles?.forEach((profile) => {
      map[profile.user_id] = profile;
    });

    setProfileMap(map);
  }

  return (
    <main className="min-h-screen text-white p-10">
      <h1 className="text-5xl font-black mb-10">
        🔔 Notifications
      </h1>

      <div className="space-y-4">
        {notifications.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            No notifications yet
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-3xl p-6"
            >
              @
              {profileMap[item.actor_id]
                ?.username || "unknown"}{" "}
              {item.message}
            </div>
          ))
        )}
      </div>
    </main>
  );
}