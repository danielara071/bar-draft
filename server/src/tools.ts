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

export const barcelonaTools = {
  getJugadoresVaronil: tool({
    description:
      'Obtiene jugadores del equipo masculino del FC Barcelona con sus estadísticas acumuladas. Úsala cuando pregunten sobre jugadores, plantilla varonil o estadísticas de un jugador específico.',
    inputSchema: z.object({
      nombre: z.string().optional().describe('Nombre del jugador (búsqueda parcial)'),
      posicion: z.string().optional().describe('Posición: portero, defensa, centrocampista, delantero'),
      limit: z.coerce.number().optional().describe('Máximo de resultados. Default 25'),
    }),
    execute: async ({ nombre, posicion, limit = 25 }) => {
      let query = supabase.from('barcelona_varonil_jugadores').select('*').limit(limit)
      if (nombre) query = query.ilike('nombre', `%${nombre}%`)
      if (posicion) query = query.ilike('posicion', `%${posicion}%`)
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  }),

  getJugadoresFemenil: tool({
    description:
      'Obtiene jugadoras del equipo femenino del FC Barcelona con sus estadísticas acumuladas. Úsala cuando pregunten sobre jugadoras, plantilla femenil o estadísticas de una jugadora específica.',
    inputSchema: z.object({
      nombre: z.string().optional().describe('Nombre de la jugadora (búsqueda parcial)'),
      posicion: z.string().optional().describe('Posición: portera, defensa, centrocampista, delantera'),
      limit: z.coerce.number().optional().describe('Máximo de resultados. Default 25'),
    }),
    execute: async ({ nombre, posicion, limit = 25 }) => {
      let query = supabase.from('barcelona_femenil_jugadores').select('*').limit(limit)
      if (nombre) query = query.ilike('nombre', `%${nombre}%`)
      if (posicion) query = query.ilike('posicion', `%${posicion}%`)
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  }),

  // ── Herramienta de UI (Generative UI) ──────────────────────────────────────
  // El modelo llama a esta herramienta para declarar qué componente renderizar.
  // El cliente intercepta la llamada y monta <PlayerStatsCard> con los datos del input.
  renderizarJugador: tool({
    description:
      'Genera la tarjeta visual interactiva de estadísticas de un jugador/a. ' +
      'Llámala SIEMPRE después de obtener datos con getJugadoresVaronil o getJugadoresFemenil, ' +
      'pasando exactamente los campos del jugador encontrado. ' +
      'NO respondas con texto de estadísticas: delega toda la visualización a esta herramienta.',
    inputSchema: z.object({
      nombre:           z.string().describe('Nombre completo del jugador/a'),
      numero:           z.number().describe('Número de camiseta'),
      posicion:         z.string().describe('Posición en el campo'),
      goles:            z.number().describe('Total de goles'),
      asistencias:      z.number().describe('Total de asistencias'),
      atajadas:         z.number().nullable().describe('Total de atajadas (null si no aplica)'),
      partidos_jugados: z.number().describe('Partidos jugados'),
      minutos_jugados:  z.number().describe('Minutos jugados'),
      imagen_url:       z.string().nullable().describe('URL de la foto del jugador/a'),
    }),
    execute: async () => ({ rendered: true }),
  }),
}
