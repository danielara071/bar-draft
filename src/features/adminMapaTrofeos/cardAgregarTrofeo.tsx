import { useState } from "react";


type CardAgregarTrofeoProps = {
  latitud: number;
  setLatitud: (latitud: number) => void;
  longitud: number;
  setLongitud: (longitud: number) => void;  
  onConfirmar: (datos: {
    nombre: string;
    descripcion: string;
    latitud: number;
    longitud: number;
    nombreArchivo: string;
    nombre_lugar: string;
  }) => void;
};

function CardAgregarTrofeo({
  latitud,
  setLatitud,
  longitud,
  setLongitud,
  onConfirmar 
}: CardAgregarTrofeoProps) {
  const [nombre, setNombre] = useState<string>("");
  const [descripcion, setDescripcion] = useState<string>("");
  const [nombre_lugar, setNombreLugar] = useState<string>("");
  const OPCIONES_TROFEO = [
    "balondeoro", 
    "champions", 
    "Copa del rey", 
    "Trofeo Especial"];

  const [opcionSeleccionada, setOpcionSeleccionada] = useState<string>("");
  const handleConfirmarClick = () => {
  if (!nombre || !latitud || !longitud || !opcionSeleccionada) {
      console.log("Por favor, completa los campos obligatorios y sube el objeto GLB.");
      return;
    }

    // Enviamos los datos procesados al padre
    onConfirmar({
      nombre,
      descripcion,
      latitud: Number(latitud),
      longitud: Number(longitud),
      nombreArchivo: opcionSeleccionada,
      nombre_lugar,
    });
  };
  return (
        <div className="flex items-center justify-center  p-5">
            <div className="w-full bg-brand-navy rounded-[2.5rem]  p-6 px-10">
              <h2 className="text-xl font-semibold text-white font-sans ">Nuevo Trofeo</h2>
              <div className="grid grid-cols-3 gap-8 mt-4 mb-4">
                <div className="flex flex-col gap-2">
                    <label className="text-sm text-brand-yellow font-sans ">
                      NOMBRE DEL TROFEO
                    </label>
                    <input
                      type="text"
                      placeholder="Trofeo Barcelona"
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      className="w-full bg-white text-gray-500 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#f4bd0e]"
                      />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-brand-yellow">
                    DESCRIPCIÓN
                  </label>
                  <input
                    type="text"
                    placeholder="Trofeo Barcelona"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    className="w-full bg-white text-gray-500 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#f4bd0e]"
                   />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-brand-yellow">
                    LUGAR
                  </label>
                  <input
                    type="text"
                    placeholder="Trofeo Barcelona"
                    value={nombre_lugar}
                    onChange={(e) => setNombreLugar(e.target.value)}
                    className="w-full bg-white text-gray-500 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#f4bd0e]"
                   />
                </div>
              </div>
              {/*Fin Columnas*/}
              <label className="text-sm text-brand-yellow font-sans">COORDENADAS</label>
              <div className="grid grid-cols-2 gap-8 mt-4 mb-4">
               <div className="flex flex-col gap-2">
  <label className="text-sm text-brand-yellow font-sans">
    Latitud
  </label>
  <input
    type="number"
    inputMode="decimal"
    placeholder="100000"
    value={latitud || ""}
    onChange={(e) => {
      const val = e.target.value;
      // Permite números negativos, dígitos, un punto y más dígitos
      if (/^-?\d*\.?\d*$/.test(val)) {
        setLatitud(Number(val)); 
      }
    }}
    onKeyDown={(e) => {
      const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "-", "."];
      if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault();
    }}
    className="w-full bg-white text-gray-500 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#f4bd0e]"
  />
</div>

<div className="flex flex-col gap-2">
  <label className="text-sm text-brand-yellow">
    Longitud
  </label>
  <input
    type="number"
    inputMode="decimal"
    placeholder="100000"
    value={longitud || ""}
    onChange={(e) => {
      const val = e.target.value;
      if (/^-?\d*\.?\d*$/.test(val)) {
        setLongitud(Number(val));
      }
    }}
    onKeyDown={(e) => {
      const allowed = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "-", "."];
      if (!allowed.includes(e.key) && !/^\d$/.test(e.key)) e.preventDefault();
    }}
    className="w-full bg-white text-gray-500 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#f4bd0e]"
  />
</div>
              </div>
              {/*botones*/}
              <div className="flex justify-between items-center mt-8">
              {/* Selector de 4 opciones */}
                <div className="flex flex-col gap-2 w-full md:w-1/2">
                  <label className="text-sm text-brand-yellow font-sans">
                    SELECCIONAR TIPO DE OBJETO
                  </label>
                  <select
                    value={opcionSeleccionada}
                    onChange={(e) => setOpcionSeleccionada(e.target.value)}
                    className="w-full bg-white text-gray-500 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#f4bd0e] appearance-none"
                  >
                    <option value="" disabled>Selecciona una opción...</option>
                    {OPCIONES_TROFEO.map((opcion, index) => (
                      <option key={index} value={opcion}>
                        {opcion}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="bg-brand-yellow hover:bg-[#d9a90d] text-[#001d3d] font-bold py-3 px-14 rounded-full transition-colors duration-200"
                  onClick={handleConfirmarClick}>
                  Confirmar
                </button>
              </div>
          </div>
        </div>
  );
}

export default CardAgregarTrofeo