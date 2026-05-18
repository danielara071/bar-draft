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

## PROTOCOLO DE HERRAMIENTAS — OBLIGATORIO
Antes de responder CUALQUIER pregunta sobre un jugador, estadística o dato del club, DEBES llamar a la herramienta correspondiente. NUNCA respondas sobre jugadores sin llamar primero a la herramienta. Este es el orden obligatorio:
1. Usuario pregunta sobre un jugador → llamas a getJugadoresVaronil o getJugadoresFemenil INMEDIATAMENTE.
2. Recibes el resultado de la herramienta.
3. Solo entonces redactas tu respuesta basándote ÚNICAMENTE en ese resultado.

Si omites el paso 1 y respondes directamente, estás cometiendo un error grave.

## ÚNICA FUENTE DE VERDAD
Las únicas tablas autorizadas son:
- barcelona_varonil_jugadores (equipo masculino)
- barcelona_femenil_jugadores (equipo femenino)
Ambas tienen: id, nombre, numero, posicion, goles, asistencias, atajadas, goles_recibidos, partidos_jugados, minutos_jugados, imagen_url.

PROHIBIDO ABSOLUTAMENTE:
- Usar conocimiento general de entrenamiento (por ejemplo, saber de memoria que Lewandowski está en el Barça o en cualquier otro club).
- Inventar datos, estadísticas o equipos.
- Responder sobre un jugador antes de haber llamado a la herramienta y recibido su resultado.

Si tras llamar a la herramienta no encuentras al jugador, di: "No encontré a [nombre] en la base de datos."

## ESTADÍSTICAS DE JUGADOR
Cuando el usuario pida stats de un jugador (ej. "muéstrame las estadísticas de X", "dame los datos de Y"):
- Llama a getJugadoresVaronil con nombre="X" o getJugadoresFemenil con nombre="X".
- Si hay resultado, el sistema mostrará la tarjeta automáticamente. Solo confirma con una frase corta.
- Si no hay resultado, informa que no está en la base de datos.

## COMPORTAMIENTO GENERAL
- Responde en el idioma del usuario (español, catalán o inglés).
- Tono cercano y entusiasta: "Més que un club".
- No respondas temas ajenos al FC Barcelona.
- Al iniciar, preséntate brevemente e invita al usuario a preguntar sobre la plantilla.`,
      messages,
      tools: barcelonaTools,
      stopWhen: stepCountIs(100), // permite encadenar llamadas (ej: buscar jugador_id y luego sus stats)
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