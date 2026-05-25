import { streamText, stepCountIs, convertToModelMessages, tool } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { z } from 'zod'
import { createClient } from '@supabase/supabase-js'

export const config = { runtime: 'edge' }

// Groq es compatible con la API de OpenAI, así que usamos @ai-sdk/openai
// apuntando al endpoint de Groq — evita incompatibilidad de versiones con @ai-sdk/groq
const groq = createOpenAI({
  name: 'groq',
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
})

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!,
)

type Equipo = 'varonil' | 'femenil'

const tableEquipos: Record<Equipo, string> = {
  varonil: 'barcelona_varonil_jugadores',
  femenil: 'barcelona_femenil_jugadores',
}

const normalize = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

const toPlayer = (row: any, equipo: Equipo) => ({
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

const toSummary = (row: any) => ({
  id: row.id,
  nombre: row.nombre,
  numero: row.numero ?? null,
  posicion: row.posicion ?? null,
  goles: row.goles ?? 0,
  asistencias: row.asistencias ?? 0,
  imagen_url: row.imagen_url ?? null,
})

const barcelonaTools = {
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
          const exact = data.find((r: any) => normalize(r.nombre) === target)
          return { found: true as const, player: toPlayer(exact ?? data[0], e) }
        }
      }
      return { found: false as const, query: nombre }
    },
  }),

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
      return { titulo, equipo, jugadores: (data ?? []).map(toSummary) }
    },
  }),
}

const SYSTEM_PROMPT = `Eres Barçabot, el asistente virtual oficial del FC Barcelona.

## ÚNICA FUENTE DE VERDAD — REGLA ABSOLUTA
Tu ÚNICA fuente de información son estas tablas:
- barcelona_varonil_jugadores: id, nombre, numero, posicion, goles, asistencias, atajadas, goles_recibidos, partidos_jugados, minutos_jugados, imagen_url
- barcelona_femenil_jugadores: id, nombre, numero, posicion, goles, asistencias, atajadas, goles_recibidos, partidos_jugados, minutos_jugados, imagen_url

PROHIBIDO: usar conocimiento previo, inventar datos, o responder sobre jugadores sin haber consultado la BD primero.

## HERRAMIENTAS DE INTERFAZ (Generative UI) — USO OBLIGATORIO
Tienes dos herramientas. Cada una consulta la BD y genera SU componente visual.
Tú solo decides CUÁL llamar y CON QUÉ buscar; los datos los pone la herramienta.

A) getPlayerStats(nombre, equipo?) → para UN jugador/a específico.
   Úsala cuando pidan datos de una persona concreta (ej: "estadísticas de Lewandowski").
   Pasa equipo="femenil" solo si el usuario dice que es del equipo femenino.

B) getPlayerList(titulo, equipo?, posicion?, orden?, limit?) → para VARIOS jugadores.
   Úsala para grupos/rankings (ej: "todos los delanteros", "los máximos goleadores").
   Pon un 'titulo' descriptivo; usa 'posicion' y 'orden' para filtrar/ordenar.

REGLAS — CRÍTICAS:
  - SIEMPRE llama a la herramienta correspondiente cuando el usuario pida estadísticas
    o listas, incluso si ya lo hiciste antes en la conversación. CADA pregunta nueva
    requiere una llamada nueva a la herramienta. NUNCA te saltes este paso.
  - Después de llamar la herramienta, tu ÚNICO texto permitido es UNA frase corta:
      "¡Aquí tienes a Lewandowski! 💙❤️"
      "Estos son los delanteros del Barça 🙌"
  - ABSOLUTAMENTE PROHIBIDO en el texto: goles, asistencias, partidos, minutos,
    posición, número, URLs, imágenes markdown (![](...)), ni ningún dato técnico.
    La tarjeta ya muestra todo eso.
  - Si getPlayerStats devuelve found=false, di solo: "No encontré a [nombre] en la base de datos."

## COMPORTAMIENTO GENERAL
- Responde en el idioma del usuario (español, catalán o inglés).
- Tono cercano y entusiasta: "Més que un club".
- No respondas temas ajenos al FC Barcelona.
- Al iniciar, preséntate brevemente e invita al usuario a preguntar sobre la plantilla.`

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { messages: uiMessages } = await req.json() as { messages: any[] }
    const allMessages = await convertToModelMessages(uiMessages)

    // Llama 3.3 deja de llamar herramientas si acumula demasiado historial de tool calls.
    // Solución: enviar solo el último intercambio completo (user→assistant→tool→assistant)
    // más la pregunta actual. Así el modelo siempre ve UN ejemplo de cómo usar la herramienta.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userPositions = allMessages.reduce<number[]>((acc, m: any, i) => {
      if (m.role === 'user') acc.push(i)
      return acc
    }, [])
    const startIdx = userPositions.length >= 2
      ? userPositions[userPositions.length - 2]
      : 0
    const messages = allMessages.slice(startIdx)

    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      system: SYSTEM_PROMPT,
      messages,
      tools: barcelonaTools,
      stopWhen: stepCountIs(2),
      toolChoice: 'auto',
      // El bot solo dice una frase corta tras la tool; capar la salida reduce
      // tokens-por-minuto y baja la probabilidad de pegar el rate limit free-tier.
      maxOutputTokens: 200,
      onError: ({ error }) => {
        console.error('Error del streamText:', error)
      },
    })

    // onError aquí decide QUÉ texto recibe el cliente cuando hubo error en el
    // stream. Sin esto, el cliente recibe un stream vacío y "parece" colgado.
    return result.toUIMessageStreamResponse({ onError: formatStreamError })
  } catch (err) {
    console.error('Error en /api/chat:', err)
    return new Response(JSON.stringify({ error: formatStreamError(err) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Traduce errores del proveedor (Groq) a un mensaje legible en español.
// Detectamos 429 y "context length" porque son los dos modos de fallo del
// tier gratuito que el usuario ve más seguido.
function formatStreamError(error: unknown): string {
  const raw =
    error instanceof Error
      ? `${error.message} ${(error as any).cause ?? ''}`
      : typeof error === 'string'
        ? error
        : JSON.stringify(error ?? {})
  const msg = raw.toLowerCase()

  if (
    msg.includes('429') ||
    msg.includes('rate limit') ||
    msg.includes('rate_limit') ||
    msg.includes('too many requests') ||
    msg.includes('quota')
  ) {
    return '⚠️ Límite alcanzado. Por favor espera unos segundos e intenta de nuevo.'
  }
  if (msg.includes('context length') || msg.includes('context_length') || msg.includes('maximum context')) {
    return '⚠️ La conversación es demasiado larga. Recarga el chat para empezar de nuevo.'
  }
  if (msg.includes('401') || msg.includes('unauthorized') || msg.includes('invalid api key')) {
    return '⚠️ Error de configuración del servidor. Avisa al administrador.'
  }
  return '⚠️ Ocurrió un error al generar la respuesta. Inténtalo de nuevo.'
}
