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
      archivo: File | null;
      nombreArchivo: string;
      nombre_lugar: string;
    }) => {
      setCargando(true);
      try {
        console.log("Datos recibidos en AdminMapaTrofeos:", datos);

        if (!datos.archivo) {
          throw new Error("El archivo .glb es obligatorio.");
        }

        const { data: storageData, error: storageError } = await supabase.storage
          .from('trofeos_bucket')
          .upload(datos.nombreArchivo, datos.archivo);
        
        if (storageError && storageError.message !== "The resource already exists") {
          throw new Error(`Error al subir el archivo: ${storageError.message}`);
        }
        else if (storageError && storageError.message === "The resource already exists") {
          console.warn(`Archivo ${datos.nombreArchivo} ya existe en el bucket. Continuando con la URL existente.`);
        }
        else {
          console.log("Archivo subido con éxito:", storageData);
        }
        const { data } = supabase.storage.from('trofeos_bucket').getPublicUrl(datos.nombreArchivo)
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
        console.error("Error en la transacción de Supabase:", error);
        alert(error.message || "Hubo un error inesperado.");
      } finally {
        setCargando(false);
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
        
        <div className="p-8 h-200 w-150">
          <Mapa
            trofeos={listaTrofeos}
            onSelectCoords={(lat, lng) => {
              setLat(lat);
              setLng(lng);
            }}
          />
        </div>
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
    </div>
  );
}

export default AdminMapaTrofeos
