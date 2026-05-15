import CardAgregarTrofeo from "../features/adminMapaTrofeos/cardAgregarTrofeo";
import CardTrofeoAdmin from "../features/adminMapaTrofeos/cardTrofeoAdmin";
import type { Trofeo } from "../features/adminMapaTrofeos/mapa";
import Mapa from "../features/adminMapaTrofeos/mapa";

const trofeos : Trofeo[] = [
  {
    id: 1,
    nombre: "México",
    descripcion: "desc mex",
    coordenadas: [25.6866, -100.3161] as [number, number],
    
  },
  {
    id: 2,
    nombre: "Europa",
    descripcion: "desc eur",
    coordenadas: [40.4168, -3.7038] as [number, number],
  },
    {
    id: 1,
    nombre: "México",
    descripcion: "desc mex",
    coordenadas: [25.6866, -100.3161] as [number, number],
    
  },
  {
    id: 2,
    nombre: "Europa",
    descripcion: "desc eur",
    coordenadas: [40.4168, -3.7038] as [number, number],
  },
    {
    id: 1,
    nombre: "México",
    descripcion: "desc mex",
    coordenadas: [25.6866, -100.3161] as [number, number],
    
  },
  {
    id: 2,
    nombre: "Europa",
    descripcion: "desc eur",
    coordenadas: [40.4168, -3.7038] as [number, number],
  },
];




function AdminMapaTrofeos() {
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
          onUpload={() => console.log("Subir imagen")}
          onConfirmar={() => console.log("Confirmar nuevo trofeo")}
        />

        <div className="flex flex-row">
        <div className="p-8 h-200 w-150"><Mapa trofeos={trofeos} /></div>
        <div className="flex flex-col w-100 max-h-[700px] overflow-y-auto gap-4 pr-2">
          <h2 className="text-xl font-semibold text-brand-navy font-sans sticky top-0 bg-brand-bg-white">
            Lista de Trofeos
          </h2>

          {trofeos.map((trofeo) => (
            <CardTrofeoAdmin
              key={trofeo.id}
              nombre={trofeo.nombre}
              descripcion={trofeo.descripcion}
              coordenadas={`${trofeo.coordenadas[0]}, ${trofeo.coordenadas[1]}`}
              onDeleate={() =>
                console.log(`Eliminar trofeo ${trofeo.id}`)
              }
            />
          ))}
        </div>
        </div>
    </div>
  );
}

export default AdminMapaTrofeos
