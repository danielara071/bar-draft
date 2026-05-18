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
  })
}
