import { useState, useRef } from "react";


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
    archivo: File | null;
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

  const [archivo, setArchivo] = useState<File | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState<string >("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.name.endsWith(".glb")) {
        setArchivo(file);
        setNombreArchivo(file.name);
      } else {
        alert("Por favor, selecciona un archivo .glb válido");
      }
    }
  };
const handleConfirmarClick = () => {
    if (!nombre || !latitud || !longitud || !archivo) {
      alert("Por favor, completa los campos obligatorios y sube el objeto GLB.");
      return;
    }

    // Enviamos los datos procesados al padre
    onConfirmar({
      nombre,
      descripcion,
      latitud: Number(latitud),
      longitud: Number(longitud),
      archivo,
      nombreArchivo,
      nombre_lugar,
    });
  };
  return (
        <div className="flex items-center justify-center  p-5">
            <div className="w-full bg-brand-navy rounded-[2.5rem]  p-6 px-10">
              <h2 className="text-xl font-semibold text-white font-sans ">Nuevo Trofeo</h2>
              {/* Columnas */}
      {/* Input de archivo oculto */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleUpload}
                accept=".glb"
                className="hidden"
              />
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
                  <label className="text-sm text-brand-yellow font-sans ">
                    Latitud
                  </label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={latitud}
                    onChange={(e) => setLatitud(parseInt(e.target.value) || 0)}
                    className="w-full bg-white text-gray-500 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#f4bd0e]"
                    />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-brand-yellow">
                    Longitud
                  </label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={longitud}
                    onChange={(e) => setLongitud(parseInt(e.target.value) || 0)}
                    className="w-full bg-white text-gray-500 rounded-full py-3 px-6 outline-none focus:ring-2 focus:ring-[#f4bd0e]"
                   />
                </div>
              </div>
              {/*botones*/}
              <div className="flex justify-between items-center mt-8">
                <button className="bg-brand-yellow hover:bg-[#d9a90d] text-[#001d3d] font-bold py-3 px-10 rounded-full transition-colors duration-200"
                onClick={() => fileInputRef.current?.click()}>
                  Agregar Objeto
                </button>
                
                <button className="bg-brand-yellow hover:bg-[#d9a90d] text-[#001d3d] font-bold py-3 px-14 rounded-full transition-colors duration-200"
                  onClick={handleConfirmarClick}>
                  Confirmar
                </button>
              </div>
              <h2>  {nombreArchivo}</h2>
          </div>
        </div>
  );
}

export default CardAgregarTrofeo