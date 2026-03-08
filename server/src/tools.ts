import { tool } from 'ai'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

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