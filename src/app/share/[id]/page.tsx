import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function SharePage({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
  
    const { id } = await params;

  const { data } = await supabase
    .from("generations")
    .select("*")
    .eq("id", id)
    .single();

  if (!data) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Generation not found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-10">

      <div className="max-w-4xl mx-auto">

        <h1 className="text-5xl font-bold mb-8">
          {data.prompt}
        </h1>

        {data.image && (
          <img
            src={data.image}
            alt="Generated"
            className="w-full rounded-3xl mb-10"
          />
        )}

        <div className="bg-white/5 border border-white/10 rounded-3xl p-8">

          <p className="text-zinc-300 whitespace-pre-wrap text-lg leading-relaxed">
            {data.script}
          </p>

        </div>

      </div>

    </main>
  );
}