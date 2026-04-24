import { useState } from "react";
import { usefetchAmigosByName } from "../../shared/hooks/useBuscarAmigos"; 
import AmigoCard from "./AmigoCard";

export default function BuscarAmigosContainer() {
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState(""); // lo que se escribe
  const [searchTerm, setSearchTerm] = useState(""); // el valor a buscar

  // uso de hook con el valor escrito por el usuario 
  const { amigos, loading, error } = usefetchAmigosByName(searchTerm);

  const handleBuscar = () => {
    setSearchTerm(inputValue);
  };

  const closeAndReset = () => {
    setShowModal(false);
    setInputValue("");
    setSearchTerm("");
  };

  return (
    <>
      {/* boton buscar */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-pink-600 hover:bg-pink-700 text-white text-xs px-4 py-2 rounded-full"
      >
        <span className="text-md">Buscar Amigos</span> 
      </button>

      {/* pop up */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] p-8 shadow-2xl overflow-hidden border border-gray-100">
            <h2 className="text-3xl font-bold text-black mb-4">Buscar Perfil</h2>
            
            <p className="text-gray-500 text-sm mb-6">
              Ingresa el username de tu amigo para ver su perfil.
            </p>

            {/* Input */}
            <div className="relative mb-8">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="@messi10"
                className="w-full border border-gray-200 rounded-xl py-3 px-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
              />
            </div>

            {/* Acciones */}
            <div className="flex gap-4 mb-8">
              <button
                onClick={closeAndReset}
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
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {error && (
                <p className="text-center text-red-500 text-sm py-2">{error}</p>
              )}

              {amigos && amigos.map((amigo) => (
                <div key={amigo.nombre_usuario} >
                  <AmigoCard
                    id={amigo.id}
                    nombre_usuario={amigo.nombre_usuario}
                    url_avatar={amigo.url_avatar}
                    logro={amigo.logro}
                  />
                </div>
              ))}
              
              {searchTerm && !loading && !amigos && !error && (
                <p className="text-center text-gray-400 text-sm py-4">
                  No se encontró a ningún amigo con ese nombre.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}