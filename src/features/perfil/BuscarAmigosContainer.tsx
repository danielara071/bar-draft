import { useState } from "react";
import AmigoCard from "./AmigoCard";

// Definimos un tipo básico para los resultados de búsqueda
type UsuarioBusqueda = {
  nombre_usuario: string;
  url_avatar: string;
  logro?: string;
};

export default function BuscarAmigosContainer() {
  const [showModal, setShowModal] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultados, setResultados] = useState<UsuarioBusqueda[]>([]);

  // Función simulada de búsqueda
  const handleBuscar = async () => {
    if (!query) return;
    setLoading(true);
    
    // Integrar API 
    setTimeout(() => {
      setResultados([
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <>
      {/* boton buscar */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-pink-600 hover:bg-pink-700 text-white text-xs px-4 py-2 rounded-full"
      >
        <span className="text-md">+ Añadir Amigos</span> 
      </button>

      {/* pop up */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl overflow-hidden">
            <h2 className="text-3xl font-bold text-black mb-4">Buscar Perfil</h2>
            
            <p className="text-gray-500 text-sm mb-6">
              Ingresa el username de tu amigo para ver su perfil.
            </p>

            {/* Input */}
            <div className="relative mb-8">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="@messi10..."
                className="w-full border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              />
            </div>

            {/* Acciones */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={() => {
                  setShowModal(false);
                  setResultados([]);
                  setQuery("");
                }}
                className="flex-1 bg-[#A50044] text-white py-3 rounded-2xl font-bold hover:bg-[#800035] transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleBuscar}
                disabled={loading}
                className="flex-1 bg-[#FFC107] text-black py-3 rounded-2xl font-bold hover:bg-[#e6ad00] transition-colors disabled:opacity-50"
              >
                {loading ? "Buscando..." : "Buscar"}
              </button>
            </div>

            {/* resultados */}
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {resultados.map((amigo) => (
                <div key={amigo.nombre_usuario} className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                  <AmigoCard 
                    nombre_usuario={amigo.nombre_usuario}
                    url_avatar={amigo.url_avatar}
                    logro={amigo.logro}
                  />
                </div>
              ))}
              
              {resultados.length === 0 && !loading && query && (
                <p className="text-center text-gray-400 text-sm py-4">
                  No se encontraron usuarios con ese nombre.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}