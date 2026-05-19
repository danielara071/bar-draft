import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import ProgrammedWordCard from "./ProgrammedWordCard";

type ProgrammedWord = {
  word: string;
  date: string;
}

export default function ProgrammedWords() {
  const [words, setWords] = useState<ProgrammedWord[]>([]);

  const fetchProgrammedWords = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("wordle_words")
      .select("word, used_on")
      .gt("used_on", today)
      .order("used_on", { ascending: true});

    if (!error && data) {
      const formatted = data.map((item) => ({
        word: item.word,
        date: new Date(item.used_on).toLocaleDateString("es-ES", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
          }),
        }));
        setWords(formatted);
    }
  };

  useEffect(() => {
    fetchProgrammedWords();
  }, []);

  return (
    <>
        <p className="text-md font-semibold text-brand-navy my-4 flex items-center gap-2"> Palabras Programadas: {words.length} </p>
        <div className="flex flex-col gap-2">
          {words.length === 0 ? (
             <p className="text-brand-crimson text-sm px-8 border border-brand-navy rounded-xl py-4">No hay palabras programadas</p>
          ) : (
            words.map((item, index) =>
            <ProgrammedWordCard key={index} word={item.word} date={item.date} onDeleted={fetchProgrammedWords}/>
          )
          )}
        </div>
    </>
  );
};