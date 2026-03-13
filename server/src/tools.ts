import { tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL2
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY2

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de Supabase. Crea server/.env con SUPABASE_URL y SUPABASE_ANON_KEY (copia server/.env.example).'
  )
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Herramienta que el modelo llama cuando el usuario pregunta algo de la base de datos de Supabase
export const dbTools = {
  getUsuarios: tool({
    description: 'Obtiene la lista de usuarios de la base de datos',
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