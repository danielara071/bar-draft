import 'dotenv/config'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { dbTools } from './tools'

const ollama = createOpenAI({
  baseURL: process.env.OLLAMA_BASE_URL ?? 'http://localhost:11434/v1',
  apiKey: 'ollama'
})

const app = new Hono()

app.use('*', cors())

app.post('/api/chat', async (c) => {
  try {
    const { messages } = await c.req.json()
    console.log('Mensaje recibido:', messages)

    const modelName = process.env.OLLAMA_MODEL ?? 'qwen2.5:7b'

    const result = streamText({
      model: ollama(modelName),
      system: 'Eres un asistente útil que puede consultar información de usuarios en la base de datos. Cuando el usuario pregunte sobre usuarios, usa la herramienta getUsuarios para obtener la información.',
      messages,
      tools: dbTools,
      maxSteps: 5,
      toolChoice: { type: 'tool', toolName: 'getUsuarios' }
    })

    result.text.then(t => console.log('Respuesta:', t))
    result.toolCalls.then(t => console.log('Tool calls:', t))

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
  console.log('🚀 Servidor corriendo en http://localhost:3000')
  console.log(`Modelo: ${model}`)
})