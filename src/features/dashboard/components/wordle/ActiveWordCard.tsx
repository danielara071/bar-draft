import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ActiveWordCard() {
  const [word, setWord] = useState<string | null>(null);
  const [date, setDate] = useState<string | null>(null);

  useEffect(() => {
    const fetchWord = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("wordle_words")
        .select("word, used_on")
        .eq("used_on", today)
        .single();

      if (!error && data) {
        setWord(data.word);
        setDate(new Date(data.used_on).toLocaleDateString("es-ES", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }));
      }
    };

    fetchWord();
  }, []);

  return (
    <div>
      <p className="text-sm font-semibold text-brand-navy my-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
        Palabra Activa Ahora
      </p>

      <div className="w-full rounded-xl bg-brand-navy px-6 py-8 flex flex-col items-center justify-center">
        {word ? (
          <>
            <p className="text-white text-5xl font-bold tracking-[0.5em] uppercase">
              {word}
            </p>
            <p className="text-brand-yellow text-xs mt-2 capitalize">{date}</p>
          </>
        ) : (
          <p className="text-zinc-400 text-sm">No hay palabra para hoy</p>
        )}
      </div>
    </div>
  );
}