import { useState } from "react";
import { supabase } from "@/shared/services/supabaseClient";

type InsigniaCardProps = {
  user_id: string;
  name: string;
  id_producto : number;
  url_image: string;
};

export default function InsigniaCard({
  user_id,
  name,
  id_producto,
  url_image,
}: InsigniaCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleAsignar = async () => {
    setStatus('loading');
    try {
      const { error } = await supabase
        .from('profiles') 
        .update({ insignia: id_producto })
        .eq('id', user_id);

      if (error) throw error;

      setStatus('success');
      setShowConfirm(false);
      window.location.reload(); //perdon por no usar estados >.<
    } catch (error) {
      console.error("Error al asignar insignia:", error); 
      setStatus('error');
      setShowConfirm(false);
    }
  };
  return (
    <>
      <div
        onClick={() => setShowConfirm(true)}
        className={`relative cursor-pointer rounded-xl p-4 text-center transition-all hover:scale-102 ${
          "bg-[#1a3857] text-white" 
        }`}
      >
        <img
          src={url_image}
          alt={name}
          className="w-24 h-24 mx-auto mb-2 rounded-lg"
        />
        <p className="text-sm font-semibold">{name}</p>
      </div>


      {showConfirm && (// hacer esto como un prop y reutilizarlo para eliminar amigo
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-gray-800">
            <h3 className="text-xl font-bold mb-2">¿Confirmar Logro?</h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Quieres asignar esta insignia?
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleAsignar}
                disabled={status === 'loading'}
                className="px-4 py-2 bg-[#A50044] text-white rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50"
              >
                
                {status === 'loading' ? 'Asignando...' : 'Sí, asignar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}