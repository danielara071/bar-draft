import CardAgregarTrofeo from "../features/adminMapaTrofeos/cardAgregarTrofeo";
import CardTrofeoAdmin from "../features/adminMapaTrofeos/cardTrofeoAdmin";
import type { Trofeo } from "../features/adminMapaTrofeos/mapa";
import Mapa from "../features/adminMapaTrofeos/mapa";
import { useState, useEffect } from "react";
import { supabase } from "@/shared/services/supabaseClient";


function AdminMapaTrofeos() {
  const [listaTrofeos, setListaTrofeos] = useState<Trofeo[]>([]);
  const [cargandoTrofeos, setCargandoTrofeos] = useState<boolean>(true);
  const [cargando, setCargando] = useState<boolean>(false);
  // esto es para poder pasar las coordenadas del mapa al card
  const [lat, setLat] = useState<number>(0); 
  const [lng, setLng] = useState<number>(0);
  //mensajes
  const [showConfirm, setShowConfirm] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const fetchTrofeos = async () => {
      try {
        setCargandoTrofeos(true);
        const { data, error } = await supabase.rpc("obtener_lista_trofeos");
        if (error) {throw new Error(`Error al obtener trofeos: ${error.message}`);}
        if (data) {
          setListaTrofeos(data as Trofeo[]);
        }
      } catch (error: any) {
        console.error("Error en fetchTrofeos:", error);
      } finally {
        setCargandoTrofeos(false);
      }
    };

  useEffect(() => {fetchTrofeos();}, []);  
    
  const handleEnviarApi = async (datos: {
      nombre: string;
      descripcion: string;
      latitud: number;
      longitud: number;
      nombreArchivo: string;
      nombre_lugar: string;
    }) => {
      setCargando(true);
      try {
        console.log("Datos recibidos en AdminMapaTrofeos:", datos);
        const { data } = supabase.storage.from('trofeos_bucket').getPublicUrl(datos.nombreArchivo + ".glb");  
        console.log(data.publicUrl)
        const formatoTextoFileUrl = data.publicUrl;

        // insertar en trofeos
        const { data: trofeoInsertado, error: trofeoError } = await supabase
          .from("trofeos")
          .insert([
            {
              nombre: datos.nombre,
              descripcion: datos.descripcion,
              file_url: formatoTextoFileUrl,
            },
          ])
          .select(); //obtener id

        if (trofeoError) {
          throw new Error(`Error al insertar el trofeo: ${trofeoError.message}`);
        }

        if (!trofeoInsertado || trofeoInsertado.length === 0) {
          throw new Error("No se pudo obtener el ID del trofeo creado.");
        }

        const nuevoTrofeoId = trofeoInsertado[0].id;

        // insertar en ubicacion_trofeo
        const { error: ubicacionError } = await supabase
          .from("ubicacion_trofeo")
          .insert([
            {
              trofeo_id: nuevoTrofeoId, 
              latitud: datos.latitud,
              longitud: datos.longitud,
              nombre_lugar: datos.nombre_lugar, 
            },
          ]);

        if (ubicacionError) {
          throw new Error(`Error al insertar la ubicación: ${ubicacionError.message}`);
        }

        console.log("Trofeo y ubicación insertados");

        // actualizar array en local
        const nuevoTrofeoParaMapa = {
          id: nuevoTrofeoId,
          nombre: datos.nombre,
          descripcion: datos.descripcion,
          coordenadas: [datos.latitud, datos.longitud] as [number, number],
        };
        setListaTrofeos((prev) => [...prev, nuevoTrofeoParaMapa]);

      } catch (error: any) {
        setMensaje(`Error: ${error.message}`);
        setShowConfirm(true);
      } finally {
        setCargando(false);
        setMensaje(`Trofeo agregado`);
        setShowConfirm(true);
      }
    };



  return (
    <div>
        <div className="flex flex-row gap-1 mt-5 ml-5 text-4xl font-semibold">
          <p className="text-brand-navy">
              Mapa de
          </p>
          <p className="text-brand-yellow">
              Trofeos
          </p>
        </div>
        <CardAgregarTrofeo
          latitud={lat}
          setLatitud={setLat}
          longitud={lng}
          setLongitud={setLng}
          onConfirmar={handleEnviarApi}
        />
        {cargando && (
            <p className="text-center text-brand-navy font-bold animate-pulse my-2">
              Guardando datos
            </p>
          )}
        
        
        {cargandoTrofeos ? (
          <p className="text-center text-gray-500 my-8 font-medium animate-pulse">
            Cargando trofeos
          </p>
        ) : (
        <div className="flex flex-row">
        {!showConfirm && (
          <div className="flex-auto p-8 h-200 min-w-150 max-w-full">
            <Mapa
              trofeos={listaTrofeos}
              onSelectCoords={(lat, lng) => {
                setLat(lat);
                setLng(lng);
              }}
            />
          </div>
        )}
          <div className="flex flex-col w-100 max-h-[700px] overflow-y-auto gap-4 pr-2">
            <h2 className="text-xl font-semibold text-brand-navy font-sans sticky top-0 bg-brand-bg-white">
              Lista de Trofeos
            </h2>

            {listaTrofeos.map((trofeo) => (
              <CardTrofeoAdmin
                key={trofeo.id}
                nombre={trofeo.nombre}
                descripcion={trofeo.descripcion}
                coordenadas={`${trofeo.coordenadas[0]}, ${trofeo.coordenadas[1]}`}
              />
            ))}
          </div>
        </div>
        ) }
      {showConfirm && (// hacer esto como un prop y reutilizarlo para eliminar amigo
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-sm w-full mx-4 text-gray-800">
            <h3 className="text-xl font-bold mb-2">{mensaje}</h3>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-brand-yellow hover:bg-[#d9a90d] text-[#001d3d] rounded-lg transition-colors"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminMapaTrofeos
