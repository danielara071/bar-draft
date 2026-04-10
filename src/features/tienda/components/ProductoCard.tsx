import { useState } from "react";

export type Producto = {
  id: number;
  imagen: string;
  categoria: { nombre: string };
  nombre: string;
  precio: number;
  premium_only: boolean;
};

const ProductoCard = ({ producto }: { producto: Producto }) => {
  const [isHovered, setIsHovered] = useState(false);

  const imgSrc = producto.imagen?.trim(); // Se usa trim para eliminar espacios en blanco
  const categoriaNombre = producto.categoria?.nombre ?? "Objeto"; 

  return (
    <div
      className="relative bg-white rounded-lg shadow-md overflow-hidden py-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img src={imgSrc} alt={producto.nombre} className="w-full h-48 object-cover" />

      <div className="p-4">
        <p className="text-gray-600">{categoriaNombre}</p>
        <h2 className="text-lg font-bold">{producto.nombre}</h2>
        <p className="text-xl font-bold text-[#A50044]">{producto.precio} Monedas</p>
        {producto.premium_only && (
          <span className="inline-block mt-1 text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full"> Premium </span>
        )}
      </div>

      <div className="absolute inset-0 px-10 flex items-center justify-center pointer-events-none">
        <button
          type="button"
          className={`pointer-events-auto text-xl bg-[#A50044] text-white font-bold px-10 py-3 rounded-xl hover:bg-[#A50044]/90 transition-all duration-200 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => alert("Comprando")}
        >
          Comprar
        </button>
      </div>
    </div>
  );
};

export default ProductoCard;
