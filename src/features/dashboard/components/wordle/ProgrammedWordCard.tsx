import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import ConfirmationPopup from "../ConfirmationPopUp";
import ConfirmPopup from "./ConfirmPopUp";

interface ProgrammedWordCardProps {
    word: string
    date: string
    onDeleted?: () => void;
}

export default function ProgrammedWordCard({ word, date, onDeleted} : ProgrammedWordCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [popup, setPopup] = useState<{ message: string; success: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const { error } = await supabase.rpc("delete_word", { p_word: word });
    setLoading(false);
    setShowConfirm(false);

    if (error) {
      setPopup({ message: "Error al eliminar la palabra.", success: false });
    } else {
      setPopup({ message: "Palabra eliminada correctamente.", success: true });
    }
  };

  const handlePopupClose = () => {
    if (popup?.success) onDeleted?.();
    setPopup(null);
  };

  return (
    <>
    <div className="w-full rounded-xl border border-brand-navy px-6 py-4">
      <div className="flex items-start justify-between">
        <div className="flex flex-col items-start">
          <p className="text-brand-navy text-xl font-bold tracking-[0.5em] uppercase">{word}</p>
          <p className="text-brand-navy text-xs mt-2 capitalize">{date}</p>
        </div>
      
      <button onClick={() => setShowConfirm(true)} className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-crimson/10 text-brand-crimson hover:bg-brand-crimson/20 transition">
      <FaRegTrashAlt />
      </ button>
      </div>
    </div>  

    {showConfirm && (
      <ConfirmPopup
        message={`¿Eliminar ${word}?`}
        subMessage="Esta acción no se puede deshacer."
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
        loading={loading}
      />
    )}  

    {popup && (
        <ConfirmationPopup
          message={popup.message}
          success={popup.success}
          onClose={handlePopupClose}
        />
    )}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     
    </>
  );
}