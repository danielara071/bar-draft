import { SecondaryButton } from "@/shared/components/Buttons";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import ConfirmationPopup from "../ConfirmationPopUp";

interface AddWordCardProps {
  onAdded?: () => void;
}

export default function AddWordCard({ onAdded }: AddWordCardProps) {
  const [word, setWord] = useState("")
  const [date, setDate] = useState("")
  const [popup, setPopup] = useState<{message: string; success: boolean;} | null>(null);


  const addWord = async () => {
    console.log(word, date)
    const { error } = await supabase
        .rpc('add_word', {
            new_word: word,
            scheduled_date: date
        })
    
        if (error) {
          setPopup({message: "Error al añadir palabra!", success: false,});
        } else {
          setWord("")
          setDate("")
          setPopup({message: "Palabra añadida correctamente!",success: true,});
          onAdded?.();
        }
  }


  return (
    <div className="w-full rounded-xl bg-brand-navy px-6 py-4">
        <p className="text-white text-sm font-medium mb-4">
            Añadir Nueva Palabra
        </p>

        <div className="flex flex-col sm:flex-row items-end gap-4">
            <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs font-light text-brand-yellow uppercase">
                Palabra
            </label>

            <input
                type="text"
                value={word}
                placeholder="B A R C A"
                maxLength={5}
                onChange={(e) => setWord(e.target.value)}
                style={{ textTransform: "uppercase" }}
                className=" text-center w-full bg-zinc-50 rounded-full px-4 py-3 text-sm font-bold tracking-[0.35em] outline-none placeholder:text-brand-gray-mid placeholder:font-bold placeholder:tracking-[0.35em]"
            />
            </div>

            <div className="flex flex-col gap-2 flex-1">
            <label className="text-xs font-light text-brand-yellow uppercase">
                Fecha Programada
            </label>

            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-zinc-50 rounded-full px-4 py-3 text-sm outline-none"
            />
            </div>

            <SecondaryButton onClick={addWord} size="sm" className="rounded-full px-4 py-3" >
            + Añadir Palabra
            </SecondaryButton>
        </div>

        {popup && (
           <ConfirmationPopup
               message={popup.message}
               success={popup.success}
               onClose={() => {
               setPopup(null);
               }}
           />
        )}

        </div>


  );
}