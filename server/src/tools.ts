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
    parameters: z.object({
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

  // Columnas: id, nombre, numero, posicion, goles, asistencias, atajadas,
  //           goles_recibidos, partidos_jugados, minutos_jugados, imagen_url
  getJugadoresFemenil: tool({
    description:
      'Obtiene jugadoras del equipo femenino del FC Barcelona con sus estadísticas acumuladas. Úsala cuando pregunten sobre jugadoras, plantilla femenil o estadísticas de una jugadora específica.',
    parameters: z.object({
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

  // Columnas: id, jugador_id (FK a varonil_jugadores), mes, año, goles
  getEstadisticasMesVaronil: tool({
    description:
      'Obtiene estadísticas mensuales de goles del equipo masculino. Útil para ver el rendimiento de un jugador en un mes o año concreto. jugador_id viene de getJugadoresVaronil.',
    parameters: z.object({
      jugador_id: z.coerce.number().optional().describe('ID del jugador (obtenido de getJugadoresVaronil)'),
      mes: z.coerce.number().min(1).max(12).optional().describe('Mes (1-12)'),
      año: z.coerce.number().optional().describe('Año'),
      limit: z.coerce.number().optional().describe('Máximo de resultados. Default 20'),
    }),
    execute: async ({ jugador_id, mes, año, limit = 20 }) => {
      let query = supabase.from('estadisticas_mes_varonil').select('*').limit(limit)
      if (jugador_id) query = query.eq('jugador_id', jugador_id)
      if (mes) query = query.eq('mes', mes)
      if (año) query = query.eq('año', año)
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  }),

  // Columnas: id, jugadora_id (FK a femenil_jugadores), mes, año, goles
  getEstadisticasMesFemenil: tool({
    description:
      'Obtiene estadísticas mensuales de goles del equipo femenino. Útil para ver el rendimiento de una jugadora en un mes o año concreto. jugadora_id viene de getJugadoresFemenil.',
    parameters: z.object({
      jugadora_id: z.coerce.number().optional().describe('ID de la jugadora (obtenido de getJugadoresFemenil)'),
      mes: z.coerce.number().min(1).max(12).optional().describe('Mes (1-12)'),
      año: z.coerce.number().optional().describe('Año'),
      limit: z.coerce.number().optional().describe('Máximo de resultados. Default 20'),
    }),
    execute: async ({ jugadora_id, mes, año, limit = 20 }) => {
      let query = supabase.from('estadisticas_mes_femenil').select('*').limit(limit)
      if (jugadora_id) query = query.eq('jugadora_id', jugadora_id)
      if (mes) query = query.eq('mes', mes)
      if (año) query = query.eq('año', año)
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  }),

  // Columnas: id, equipo, nombre_oficial, nombre_agrupado, ambito, cantidad
  getPalmares: tool({
    description:
      'Obtiene el palmarés completo del FC Barcelona (trofeos y títulos). Filtra por equipo (masculino/femenino), ámbito (Internacional/Nacional) o tipo de trofeo.',
    parameters: z.object({
      equipo: z.string().optional().describe('Equipo: masculino o femenino'),
      ambito: z.string().optional().describe('Ámbito del torneo: Internacional, Nacional, etc.'),
      nombre_agrupado: z.string().optional().describe('Tipo de trofeo (ej: Champions League, Liga, Copa del Rey)'),
      limit: z.coerce.number().optional().describe('Máximo de resultados. Default 50'),
    }),
    execute: async ({ equipo, ambito, nombre_agrupado, limit = 50 }) => {
      let query = supabase.from('palmares_barcelona_unificado').select('*').limit(limit)
      if (equipo) query = query.ilike('equipo', `%${equipo}%`)
      if (ambito) query = query.ilike('ambito', `%${ambito}%`)
      if (nombre_agrupado) query = query.ilike('nombre_agrupado', `%${nombre_agrupado}%`)
      const { data, error } = await query
      if (error) throw error
      return data ?? []
    },
  }),
}