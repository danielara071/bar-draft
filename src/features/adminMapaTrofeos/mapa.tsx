import { MapContainer, TileLayer, useMapEvents, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet" ;

const AnyMapContainer = MapContainer as any;

function ClickHandler() {
  useMapEvents({
    click(e:any) {
      console.log(e.latlng);
    },
  });

  return null;
}



export type Trofeo = {
  id: number;
  nombre: string;
  descripcion: string;
  coordenadas: [number, number];
};

type MapaProps = {
  trofeos : Trofeo[]
}
export default function Mapa({
  trofeos
}: MapaProps) {
  const mapCenter = [25.6866, -100.3161] as [number, number];

  return (
    <AnyMapContainer
      className="rounded-[2.5rem] border-4 border-brand-yellow overflow-hidden"
      center={mapCenter}
      zoom={2}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {trofeos.map((trofeos) => (
        <Marker
          key={trofeos.id}
          position={trofeos.coordenadas}
          icon={L.divIcon({
            className: "custom-div-icon",
            html: `<div class="bg-[#f4bd0e] rounded-full flex items-center justify-center h-12 w-12 shrink-0"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trophy text-[#001d3d] w-6 h-6" aria-hidden="true"><path d="M10 14.66v1.626a2 2 0 0 1-.976 1.696A5 5 0 0 0 7 21.978"></path><path d="M14 14.66v1.626a2 2 0 0 0 .976 1.696A5 5 0 0 1 17 21.978"></path><path d="M18 9h1.5a1 1 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"></path><path d="M6 9H4.5a1 1 0 0 1 0-5H6"></path></svg></div>`
          })}
        >
          <Popup>
            {trofeos.nombre}
          </Popup>
        </Marker>
      ))}

      <ClickHandler />
    </AnyMapContainer>
  );
}