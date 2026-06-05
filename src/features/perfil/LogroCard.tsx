import { useState } from "react";
import { supabase } from "@/shared/services/supabaseClient";

type LogroCardProps = {
  logro_id: number;
  nombre: string;
  descripcion: string;
  url_image: string;
  desbloqueado: boolean;
  user_id: string;
  clickable?: boolean;
};

export default function LogroCard({
  logro_id,
  nombre,
  descripcion,
  url_image,
  desbloqueado = true,
  user_id,
  clickable = true
}: LogroCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const handleAsignar = async () => {
    setStatus('loading');
    try {
      const { error } = await supabase
        .from('profiles') 
        .update({ logro: logro_id })
        .eq('id', user_id);

      if (error) throw error;

      setStatus('success');
      setShowConfirm(false);
      window.location.reload(); //perdon por no usar estados :(
    } catch (error) {
      console.error("Error al asignar logro:", error); 
      setStatus('error');
      setShowConfirm(false);
    }
  };
  return (
    <>
      <div
        onClick={() => desbloqueado && clickable && setShowConfirm(true)}
        className={`relative cursor-pointer rounded-xl p-4 text-center transition-all hover:scale-102 ${
          desbloqueado ? "bg-[#1a3857] text-white" : "bg-[#9d9d9d] text-gray-600"
        }`}
      >
        <img
          src={desbloqueado ? url_image : 'https://vsywrimuzdnfyztreolz.supabase.co/storage/v1/object/sign/logros/Locked.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85YjVhN2I1MC1iNThkLTRkMzEtOTJiZS1jMWRjNjdmZjY5MGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJsb2dyb3MvTG9ja2VkLnBuZyIsImlhdCI6MTc3NzMwOTU5MywiZXhwIjoxODA4ODQ1NTkzfQ.z0oLl8yHtzMy4HVWmNyKT5fwlcHDQg05KWAX2fKhHTQ'}
          alt={nombre}
          className="w-24 h-24 mx-auto mb-2 rounded-lg"
        />
        <p className="text-sm font-semibold">{nombre}</p>
        <p className="text-xs mt-1 opacity-80">{descripcion}</p>
      </div>


      {showConfirm && (// hacer esto como un prop y reutilizarlo para eliminar amigo
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-gray-800">
            <h3 className="text-xl font-bold mb-2">¿Confirmar Logro?</h3>
            <p className="text-sm text-gray-600 mb-6">
              ¿Quieres asignar <span className="font-bold">"{nombre}"</span> como tu logro actual?
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