import './loadEnv'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { streamText, stepCountIs, convertToModelMessages } from 'ai'
import { createOpenAICompatible } from '@ai-sdk/openai-compatible'
import { barcelonaTools } from './tools'
import { startWatchpartyExpressServer } from './routes/watchparty'
import { registerCheckoutRoutes } from './routes/checkout'

const ollama = createOpenAICompatible({
  name: 'ollama',
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1',
})

const app = new Hono()

app.use('*', cors())

registerCheckoutRoutes(app)

startWatchpartyExpressServer()

app.post('/api/chat', async (c) => {
  try {
    const { messages: uiMessages } = await c.req.json()

    // convertToModelMessages convierte UIMessages (con parts de tool calls/results)
    // al formato ModelMessages que streamText espera, preservando el historial multi-step
    const messages = await convertToModelMessages(uiMessages)

    const modelName = process.env.OLLAMA_MODEL ?? 'qwen2.5:7b'

    const result = streamText({
      model: ollama(modelName),
      system: `Eres Barçabot, el asistente virtual oficial del FC Barcelona.

## ÚNICA FUENTE DE VERDAD — REGLA ABSOLUTA
Tu ÚNICA fuente de información son estas tablas:
- barcelona_varonil_jugadores: id, nombre, numero, posicion, goles, asistencias, atajadas, goles_recibidos, partidos_jugados, minutos_jugados, imagen_url
- barcelona_femenil_jugadores: id, nombre, numero, posicion, goles, asistencias, atajadas, goles_recibidos, partidos_jugados, minutos_jugados, imagen_url

PROHIBIDO: usar conocimiento previo, inventar datos, o responder sobre jugadores sin haber consultado la BD primero.

## FLUJO OBLIGATORIO PARA ESTADÍSTICAS (Generative UI)
Cuando el usuario pida estadísticas o datos de un jugador/a, sigue SIEMPRE estos pasos en orden:

PASO 1 — Buscar en BD:
  - Llama a getJugadoresVaronil(nombre="X") para el equipo masculino.
  - Llama a getJugadoresFemenil(nombre="X") para el equipo femenino.

PASO 2 — Si encontraste al jugador:
  - Llama a renderizarJugador() con EXACTAMENTE estos campos del resultado:
    { nombre, numero, posicion, goles, asistencias, atajadas, partidos_jugados, minutos_jugados, imagen_url }
  - El sistema generará automáticamente la tarjeta visual. No escribas las estadísticas en texto.
  - Después de llamar a renderizarJugador, escribe solo una frase corta de confirmación.

PASO 3 — Si NO encontraste al jugador:
  - Di: "No encontré a [nombre] en la base de datos."

NUNCA omitas el PASO 2 cuando encuentres datos. NUNCA escribas estadísticas en texto plano.

## COMPORTAMIENTO GENERAL
- Responde en el idioma del usuario (español, catalán o inglés).
- Tono cercano y entusiasta: "Més que un club".
- No respondas temas ajenos al FC Barcelona.
- Al iniciar, preséntate brevemente e invita al usuario a preguntar sobre la plantilla.`,
      messages,
      tools: barcelonaTools,
      stopWhen: stepCountIs(5), // permite encadenar llamadas (ej: buscar jugador_id y luego sus stats)
      toolChoice: 'auto',
      onError: ({ error }) => {
        console.error('Error del streamText:', error)
      },
    })

    // toUIMessageStreamResponse envía el nuevo formato de ai@6 que DefaultChatTransport espera
    return result.toUIMessageStreamResponse()
  } catch (err) {
    console.error('Error en /api/chat:', err)
    return c.json({ error: String(err) }, 500)
  }
})

serve({
  fetch: app.fetch,
  port: 3000
}, () => {
  const model = process.env.OLLAMA_MODEL ?? 'qwen2.5:7b'
  console.log('Servidor corriendo en http://localhost:3000')
  console.log(`Modelo: ${model}`)
})