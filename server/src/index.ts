import './loadEnv'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { barcelonaTools } from './tools'
import { startWatchpartyExpressServer } from './routes/watchparty'
import { registerCheckoutRoutes } from './routes/checkout'

const ollama = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1',
  apiKey: 'ollama'
})

const app = new Hono()

app.use('*', cors())

registerCheckoutRoutes(app)

startWatchpartyExpressServer()

app.post('/api/chat', async (c) => {
  try {
    const { messages: uiMessages } = await c.req.json()

    // El cliente usa ai@6 que manda UIMessages con `parts[]`.
    // streamText de ai@4 espera CoreMessages con `content` como string.
    // Por eso extraemos solo las partes de texto antes de pasarlos al modelo.
    const messages = uiMessages.map((msg: any) => ({
      role: msg.role,
      content: Array.isArray(msg.parts)
        ? msg.parts
            .filter((p: any) => p.type === 'text')
            .map((p: any) => p.text as string)
            .join('')
        : (msg.content ?? ''),
    }))

    const modelName = process.env.OLLAMA_MODEL ?? 'qwen2.5:7b'

    const result = streamText({
      model: ollama(modelName),
      system: `Eres Barçabot, el asistente virtual oficial del FC Barcelona.
      Antes de que el usuario haga la primera pregunta, preséntate con un mensaje de bienvenida y una breve descripción de lo que puedes hacer. Resalta que tienes acceso a información actualizada de la plantilla, estadísticas y palmarés del club.
Respondes siempre en el idioma que usa el usuario (español, catalán o inglés).
Eres apasionado del Barça: conoces su historia, jugadores, palmarés y estilo de juego (La Masia, tiki-taka).
Tienes acceso a la base de datos del club con estas herramientas:
- getJugadoresVaronil: plantilla masculina (goles, asistencias, posición, etc.)
- getJugadoresFemenil: plantilla femenina (goles, asistencias, posición, etc.)
- getEstadisticasMesVaronil: goles por mes del equipo masculino (usa jugador_id de getJugadoresVaronil)
- getEstadisticasMesFemenil: goles por mes del equipo femenino (usa jugadora_id de getJugadoresFemenil)
- getPalmares: trofeos y títulos de ambos equipos
Cuando el usuario pida datos de jugadores, estadísticas o títulos, usa la herramienta correspondiente.
Tono cercano y entusiasta, acorde con el espíritu del club: "Més que un club".
No hables de temas sin relación con el FC Barcelona. Si el usuario te dice hola, responde con un saludo y una invitación a preguntar sobre el Barça.`,
      messages,
      tools: barcelonaTools,
      maxSteps: 5, // permite encadenar llamadas (ej: buscar jugador_id y luego sus stats)
      toolChoice: 'auto',
      onError: (error) => {
        console.error('Error del streamText:', error)
      },
    })

    // toDataStreamResponse envía text + tool calls + tool results en el stream
    // es la pareja de DefaultChatTransport en el cliente, que permite generative UI
    return result.toDataStreamResponse()
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