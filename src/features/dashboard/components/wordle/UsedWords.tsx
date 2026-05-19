import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import UsedWordCard from "./UsedWordCard";

type UsedWord = {
  word: string;
  date: string;
  players: number;
  won: number;
  success: number;
  used_on: string;
};

export default function UsedWords() {
  const [words, setWords] = useState<UsedWord[]>([]);
  const [weekFilter, setWeekFilter] = useState("all");

  useEffect(() => {
    const fetchUsedWords = async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data, error } = await supabase
        .from("wordle_stats")
        .select("word, used_on, total_players, total_won, success_rate")
        .lt("used_on", today)
        .order("used_on", { ascending: false });

      if (!error && data) {
        const formatted = data.map((item) => ({
          word: item.word,
          used_on: item.used_on,
          date: new Date(item.used_on).toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          players: item.total_players,
          won: item.total_won,
          success: item.success_rate,
        }));
        setWords(formatted);
      }
    };

    fetchUsedWords();
  }, []);

  const weekOptions = Array.from(
    new Set(
      words.map((w) => {
        const d = new Date(w.used_on);
        const start = new Date(d);
        start.setDate(d.getDate() - d.getDay());
        return start.toISOString().split("T")[0];
      })
    )
  ).sort((a, b) => b.localeCompare(a));

  const filtered =
    weekFilter === "all"
      ? words
      : words.filter((w) => {
          const d = new Date(w.used_on);
          const start = new Date(d);
          start.setDate(d.getDate() - d.getDay());
          return start.toISOString().split("T")[0] === weekFilter;
        });

  return (
    <>
      <div className="flex items-center justify-between my-4">
        <p className="text-md font-semibold text-brand-navy">
          Palabras Usadas
        </p>
        <select
          value={weekFilter}
          onChange={(e) => setWeekFilter(e.target.value)}
          className="text-sm border border-brand-navy rounded-lg px-2 py-1 text-brand-navy"
        >
          <option value="all">Todas</option>
          {weekOptions.map((week) => (
            <option key={week} value={week}>
              Semana del{" "}
              {new Date(week).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
              })}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-brand-crimson text-sm px-8 border border-brand-navy rounded-xl py-4">
          No hay palabras usadas
        </p>
      ) : (
        <div className="flex flex-col gap-2 overflow-y-auto max-h-[420px] pr-1">
          {filtered.map((item, index) => (
            <UsedWordCard
              key={index}
              word={item.word}
              date={item.date}
              players={item.players}
              won={item.won}
              success={item.success}
            />
          ))}
        </div>
      )}
    </>
  );
}