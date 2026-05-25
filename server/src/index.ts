import './loadEnv'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { streamText, stepCountIs, convertToModelMessages } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { barcelonaTools } from './tools'
import { startWatchpartyExpressServer } from './routes/watchparty'
import { registerCheckoutRoutes } from './routes/checkout'

// Groq expone una API compatible con OpenAI, así que reutilizamos @ai-sdk/openai
// apuntando a su baseURL. Mismo proveedor que api/chat.ts (Vercel) para que el
// comportamiento en dev e en prod sea idéntico.
const groq = createOpenAI({
  name: 'groq',
  baseURL: 'https://api.groq.com/openai/v1',
  apiKey: process.env.GROQ_API_KEY,
})

const GROQ_MODEL = 'llama-3.3-70b-versatile'

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

// Traduce errores de Groq a un mensaje legible. Idéntico al de api/chat.ts
// para que dev y prod muestren el mismo texto al usuario.
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

const app = new Hono()

app.use('*', cors())

registerCheckoutRoutes(app)

startWatchpartyExpressServer()

app.post('/api/chat', async (c) => {
  try {
    const { messages: uiMessages } = await c.req.json()

    // convertToModelMessages convierte UIMessages (con parts de tool calls/results)
    // al formato ModelMessages que streamText espera, preservando el historial multi-step
    const allMessages = await convertToModelMessages(uiMessages)

    // Mismo recorte que prod: solo el último intercambio completo + la pregunta actual.
    // Llama 3.3 deja de llamar tools cuando acumula demasiado historial.
    const userPositions = allMessages.reduce<number[]>((acc, m: any, i) => {
      if (m.role === 'user') acc.push(i)
      return acc
    }, [])
    const startIdx =
      userPositions.length >= 2 ? userPositions[userPositions.length - 2] : 0
    const messages = allMessages.slice(startIdx)

    const result = streamText({
      model: groq(GROQ_MODEL),
      system: SYSTEM_PROMPT,
      messages,
      tools: barcelonaTools,
      stopWhen: stepCountIs(2),
      toolChoice: 'auto',
      maxOutputTokens: 200,
      onError: ({ error }) => {
        console.error('Error del streamText:', error)
      },
    })

    // toUIMessageStreamResponse envía el nuevo formato de ai@6 que DefaultChatTransport espera.
    // onError aquí controla el mensaje que el cliente ve cuando algo falla a mitad del stream.
    return result.toUIMessageStreamResponse({ onError: formatStreamError })
  } catch (err) {
    console.error('Error en /api/chat:', err)
    return c.json({ error: formatStreamError(err) }, 500)
  }
})

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  () => {
    console.log('Servidor corriendo en http://localhost:3000')
    console.log(`Modelo: ${GROQ_MODEL} (Groq)`)
  },
)