import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StoryLens AI",
  description:
    "Turn Stories Into Cinematic Worlds with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">

<nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">

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

    <a
      href="/auth"
      className="px-5 py-3 rounded-2xl bg-cyan-500 text-black font-bold hover:scale-105 transition"
    >
      Start Creating
    </a>

  </div>

</nav>

{children}

</body>
    </html>
  );
}
