import './loadEnv'
import { tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env')
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

type Equipo = 'varonil' | 'femenil'

const tableEquipos: Record<Equipo, string> = {
  varonil: 'barcelona_varonil_jugadores',
  femenil: 'barcelona_femenil_jugadores',
}

// Payload de UN jugador == props de <PlayerStatsCard>.
// Sale 100% de la query: el modelo NO transcribe estadísticas (no puede inventar).
interface PlayerPayload {
  id: string
  nombre: string
  numero: number | null
  posicion: string | null
  goles: number
  asistencias: number
  atajadas: number | null
  partidos_jugados: number
  minutos_jugados: number
  imagen_url: string | null
  equipo: Equipo
}

// Payload por fila de <PlayerListCard>.
interface PlayerSummary {
  id: string
  nombre: string
  numero: number | null
  posicion: string | null
  goles: number
  asistencias: number
  imagen_url: string | null
}

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

const toPlayer = (row: any, equipo: Equipo): PlayerPayload => ({
  id: row.id,
  nombre: row.nombre,
  numero: row.numero ?? null,
  posicion: row.posicion ?? null,
  goles: row.goles ?? 0,
  asistencias: row.asistencias ?? 0,
  atajadas: row.atajadas ?? null,
  partidos_jugados: row.partidos_jugados ?? 0,
  minutos_jugados: row.minutos_jugados ?? 0,
  imagen_url: row.imagen_url ?? null,
  equipo,
})

const toSummary = (row: any): PlayerSummary => ({
  id: row.id,
  nombre: row.nombre,
  numero: row.numero ?? null,
  posicion: row.posicion ?? null,
  goles: row.goles ?? 0,
  asistencias: row.asistencias ?? 0,
  imagen_url: row.imagen_url ?? null,
})

export const barcelonaTools = {
  // El modelo solo decide LLAMARLA con el nombre. La query produce el payload;
  // el cliente lo mapea a <PlayerStatsCard> vía el registry GenUI.
  getPlayerStats: tool({
    description:
      'Obtiene las estadísticas de UN jugador o jugadora concreto del FC ' +
      'Barcelona y genera su tarjeta visual detallada. Úsala cuando el usuario ' +
      'pida datos/estadísticas/ficha de UNA persona (ej: "estadísticas de ' +
      'Lewandowski"). No describas las estadísticas en texto: la tarjeta ya ' +
      'las muestra con los datos reales.',
    inputSchema: z.object({
      nombre: z.string().describe('Nombre (o parte) del jugador/a a buscar'),
      equipo: z
        .enum(['varonil', 'femenil', 'auto'])
        .optional()
        .describe(
          "Equipo. 'auto' (o vacío) busca en ambos. Usa 'femenil' solo si el " +
            'usuario indica explícitamente que es del equipo femenino.',
        ),
    }),
    execute: async ({ nombre, equipo = 'auto' }) => {
      const order: Equipo[] =
        equipo === 'femenil' ? ['femenil', 'varonil'] : ['varonil', 'femenil']

      for (const e of order) {
        const { data, error } = await supabase
          .from(tableEquipos[e])
          .select('*')
          .ilike('nombre', `%${nombre}%`)
          .limit(10)
        if (error) throw error
        if (data && data.length > 0) {
          const target = normalize(nombre)
          const exact = data.find((r) => normalize(r.nombre) === target)
          return { found: true as const, player: toPlayer(exact ?? data[0], e) }
        }
      }
      return { found: false as const, query: nombre }
    },
  }),

  // Igual que arriba: la query produce la lista; el cliente la mapea a
  // <PlayerListCard>. El modelo no arma el array a mano (no puede inventar).
  getPlayerList: tool({
    description:
      'Obtiene una LISTA de jugadores/as del FC Barcelona y genera la tarjeta ' +
      'de lista compacta. Úsala cuando el usuario pida un grupo: todos los ' +
      'delanteros, los máximos goleadores, la plantilla, etc. No escribas la ' +
      'lista en texto: la tarjeta ya la muestra.',
    inputSchema: z.object({
      titulo: z
        .string()
        .describe('Título descriptivo, ej: "Delanteros" o "Top goleadores"'),
      equipo: z
        .enum(['varonil', 'femenil'])
        .optional()
        .describe("Equipo a listar. Default 'varonil'."),
      posicion: z
        .string()
        .optional()
        .describe('Filtra por posición (búsqueda parcial), ej: "delantero"'),
      orden: z
        .enum(['goles', 'asistencias', 'nombre'])
        .optional()
        .describe('Criterio de orden. Default "nombre".'),
      limit: z.coerce.number().optional().describe('Máximo de filas. Default 12'),
    }),
    execute: async ({
      titulo,
      equipo = 'varonil',
      posicion,
      orden = 'nombre',
      limit = 12,
    }) => {
      let query = supabase
        .from(tableEquipos[equipo as Equipo])
        .select('*')
        .limit(limit)
      if (posicion) query = query.ilike('posicion', `%${posicion}%`)
      query = query.order(orden, { ascending: orden === 'nombre' })

      const { data, error } = await query
      if (error) throw error
      return {
        titulo,
        equipo,
        jugadores: (data ?? []).map(toSummary),
      }
    },
  }),
}
