import './loadEnv'
import { tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en .env (raíz del proyecto)'
  )
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Herramienta que el modelo llama cuando el usuario pregunta algo de la base de datos de Supabase
export const dbTools = {
  getUsuarios: tool({
    description: 'Obtiene los datos de los jugadores masculinos y femeninos del FC Barcelona desde la base de datos',
    parameters: z.object({
      limit: z.number().optional().describe('Límite de resultados')
    }),
    execute: async ({ limit = 10 }: { limit?: number }) => {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .limit(limit) // evita traer toda la tabla de golpe

      if (error) throw error
      return data ?? []
    }
  })
}