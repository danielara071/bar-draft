import 'dotenv/config'
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { cors } from 'hono/cors'
import { streamText } from 'ai'
import { ollama } from 'ollama-ai-provider'
import { dbTools } from './tools'

const app = new Hono()

app.use('*', cors())

app.post('/api/chat', async (c) => {
  const { messages } = await c.req.json()
  console.log('📨 Mensaje recibido:', messages)

  const result = await streamText({
    model: ollama('llama3.1'),
    system: 'Eres un asistente útil que puede consultar información de usuarios en la base de datos. Cuando el usuario pregunte sobre usuarios, SIEMPRE usa la herramienta getUsuarios para obtener la información. Nunca respondas sin consultar la base de datos primero.',
    messages,
    tools: dbTools,
    maxSteps: 3
  })

  result.text.then(t => console.log('🤖 Respuesta:', t))
  result.toolCalls.then(t => console.log('🔧 Tool calls:', t))

  return result.toDataStreamResponse()
})

serve({
  fetch: app.fetch,
  port: 3000
}, () => {
  console.log('🚀 Servidor corriendo en http://localhost:3000')
})