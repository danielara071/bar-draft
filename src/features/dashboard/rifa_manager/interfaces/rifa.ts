export interface Rifa {
  id: number;
  name: string;
  type: "boleto" | "experiencia" | "viaje";
  total_boletos: number;
  costo_monedas: number;
  premium: boolean;
  image_url: string | null;
  estado: "activa" | "terminada";
  fecha_cierre: string | null;
  ganador_id: string | null;
  created_at: string;
  boletos_vendidos: number;
}

export interface RifaGanador {
  rifa: Rifa;
  ganador: {
    id: string;
    nombre: string | null;
    email: string | null;
  };
}
