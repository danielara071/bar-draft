import { useState } from "react";
import { updateUsuarioLogro } from "../../lib/DummyAPI";

type LogroCardProps = {
  logro_id: number;
  nombre: string;
  descripcion: string;
  url_image: string;
  desbloqueado: boolean;
  user_id: string;
};

export default function LogroCard({
  logro_id,
  nombre,
  descripcion,
  url_image,
  desbloqueado = true,
  user_id,
}: LogroCardProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleAsignar = async () => {
    setStatus('loading');
    try {
      await updateUsuarioLogro(user_id, logro_id);
      setStatus('success');
      setShowConfirm(false);
    } catch (error) {
      console.error(error); //Nota, sigo sin saber bien porque me regresa error, creo que debo de manejarlo por status del response
      setStatus('idle');
      setShowConfirm(false)
    }
  };

  return (
    <>
      <div
        onClick={() => desbloqueado && setShowConfirm(true)}
        className={`relative cursor-pointer rounded-xl p-4 text-center transition-all hover:scale-105 ${
          desbloqueado ? "bg-[#1a3857] text-white" : "bg-[#9d9d9d] text-gray-600"
        }`}
      >
        <img
          src={`src/assets/Logros/${desbloqueado ? url_image : 'Locked'}.png`}
          alt={nombre}
          className="w-24 h-24 mx-auto mb-2 rounded-lg"
        />
        <p className="text-sm font-semibold">{nombre}</p>
        <p className="text-xs mt-1 opacity-80">{descripcion}</p>

        {/* Indicador de éxito pequeño */}
        {status === 'success' && (
          <div className="absolute top-2 right-2 bg-green-500 text-white text-[10px] px-2 py-1 rounded-full">
            ¡Asignado!
          </div>
        )}
      </div>


      {showConfirm && (
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