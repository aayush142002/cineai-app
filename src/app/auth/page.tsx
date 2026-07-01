"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function signUp() {

    const {
      data,
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });
  
    if (error) {
  
      alert(error.message);
      return;
  
    }
  
    const user = data.user;
  
    if (!user) {
  
      alert(
        "Please verify your email before continuing."
      );
      return;
  
    }
  
    const { error: insertError } =
      await supabase
        .from("users")
        .insert([
          {
            user_id: user.id,
            email: user.email,
            credits: 15,
          },
        ]);
  
    if (insertError) {
  
      alert(insertError.message);
      return;
  
    }
  
    window.location.href = "/studio";
  }

  async function login() {

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
  
    if (error) {
  
      alert(error.message);
  
    } else {
  
      window.location.href = "/studio";
  
    }
  }

  return (
    <main className="min-h-screen text-white flex items-center justify-center px-6">

      <div className="bg-white/5 border border-white/10 p-10 rounded-3xl w-full max-w-md backdrop-blur-xl">

        <h1 className="text-4xl font-bold text-center mb-8">
          CineAI Auth
        </h1>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/40 border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/40 border border-zinc-700 rounded-2xl px-5 py-4 outline-none"
          />

          <button
            onClick={signUp}
            className="w-full bg-white text-black py-4 rounded-2xl font-semibold"
          >
            Sign Up
          </button>

          <button
            onClick={login}
            className="w-full border border-white/20 py-4 rounded-2xl"
          >
            Login
          </button>

        </div>

      </div>

    </main>
  );
}