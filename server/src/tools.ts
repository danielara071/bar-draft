import { tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Faltan variables de Supabase. Crea server/.env con SUPABASE_URL y SUPABASE_ANON_KEY (copia server/.env.example).'
  )
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

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
        .limit(limit)

      if (error) throw error
      return data ?? []
    }
  })
}