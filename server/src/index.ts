import './loadEnv'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { dbTools } from './tools'
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

// Devuelve usuarios directo de la BD, es para el recuadro debajo del chat
app.get('/api/usuarios', async (c) => {
  try {
    const executeGetUsuarios = dbTools.getUsuarios.execute as (args: { limit?: number }) => Promise<unknown>
    const data = await executeGetUsuarios({ limit: 3 })
    return c.json({ usuarios: data })
  } catch (err) {
    console.error('Error en /api/usuarios:', err)
    return c.json({ error: String(err) }, 500)
  }
})

// Recibe el historial de mensajes del frontend, llama al modelo (Ollama) con la herramienta getUsuarios y devuelve la respuesta en streaming
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

    // El modelo puede usar getUsuarios para consultar la BD y la respuesta se manda por chunks al navegador
    const result = streamText({
      model: ollama(modelName),
      system: `Eres Barçabot, el asistente virtual oficial del FC Barcelona.
Respondes siempre en el idioma que usa el usuario (español, catalán o inglés).
Eres apasionado del Barça: conoces su historia, jugadores, palmarés y estilo de juego (La Masia, tiki-taka).
Cuando el usuario pregunte sobre datos del sistema, usa la herramienta getUsuarios.
Tono cercano y entusiasta, acorde con el espíritu del club: "Més que un club".
No hables de temas que no tengan relación con el FC Barcelona.`,
      messages,
      tools: dbTools,
      maxSteps: 5,
      toolChoice: 'auto',
      onError: (error) => {
        console.error('Error del streamText:', error)
      },
    })

    // toTextStreamResponse es la pareja correcta de TextStreamChatTransport (ai@6 cliente)
    // Cuando implementes generative UI, tendrás que migrar server a ai@6 y usar createUIMessageStreamResponse
    return result.toTextStreamResponse()
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