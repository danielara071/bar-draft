import { useState } from "react";
import Productos from "../features/tienda/components/Productos";
import Rifas from "../features/tienda/components/Rifas";

type Tab = "productos" | "rifas";

const Tienda = () => {
  const [activeTab, setActiveTab] = useState<Tab>("productos");

  return (
    <div>
      {/* Toggle */}
      <div className="h-25 bg-[#001E44] w-full mb-8" />
      <h1 className="text-4xl font-bold mt-4 px-20">Tienda FC Barcelona</h1>
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-8 mx-auto max-w-7xl mt-6">
        <p className="text-[#555555] text-[1.15rem] leading-relaxed font-normal tracking-tight">
          Canjea tus monedas por insignias digitales exclusivas para
          personalizar tu perfil de culé, o participa en rifas increíbles para
          ganar viajes a Barcelona, tours por el Camp Nou, boletos VIP o incluso
          la oportunidad de aparecer en el estadio durante un partido.
        </p>
        <p className="text-[#555555] text-[1.15rem] leading-relaxed font-normal tracking-tight mt-4">
          ¡Demuestra tu pasión blaugrana y vive experiencias únicas! Més que un
          club.
        </p>
      </div>
      <div className="flex justify-center mt-8 mb-2">
        <div className="flex bg-[#E0E8EA] rounded-full p-1 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab("productos")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeTab === "productos"
                ? "bg-[#0F2D52] text-white shadow-sm"
                : "text-[#888888] hover:text-[#0D0D0D]"
            }`}
          >
            Productos
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rifas")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeTab === "rifas"
                ? "bg-[#B5174B] text-white shadow-sm"
                : "text-[#888888] hover:text-[#0D0D0D]"
            }`}
          >
            Rifas
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === "productos" ? <Productos /> : <Rifas />}
    </div>
  );
};

export default Tienda;