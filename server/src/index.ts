import './loadEnv'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { streamText, stepCountIs, convertToModelMessages } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { barcelonaTools } from './tools'
import { startWatchpartyExpressServer } from './routes/watchparty'
import { registerCheckoutRoutes } from './routes/checkout'

// .chat() usa explícitamente Chat Completions (/v1/chat/completions), no el Responses API.
// Esto es necesario para que Ollama procese las tool calls en formato estructurado.
const ollamaProvider = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1',
  apiKey: 'ollama',
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
      model: ollamaProvider.chat(modelName),
      system: `Eres Barçabot, el asistente virtual oficial del FC Barcelona.

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
- Al iniciar, preséntate brevemente e invita al usuario a preguntar sobre la plantilla.`,
      messages,
      tools: barcelonaTools,
      stopWhen: stepCountIs(3),
      toolChoice: 'auto',
      // 80 tokens ≈ 60 palabras por paso: suficiente para una frase de confirmación,
      // demasiado poco para que el modelo genere tablas, listas o texto en chino.
      maxTokens: 80,
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