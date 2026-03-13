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

// Devuelve usuarios directo de la BD, es para el recuadro debajo del chat
app.get('/api/usuarios', async (c) => {
  try {
    const data = await (dbTools.getUsuarios.execute as any)({ limit: 3 })
    return c.json({ usuarios: data })
  } catch (err) {
    console.error('Error en /api/usuarios:', err)
    return c.json({ error: String(err) }, 500)
  }
})

// Recibe el historial de mensajes del frontend, llama al modelo (Ollama) con la herramienta getUsuarios y devuelve la respuesta en streaming
app.post('/api/chat', async (c) => {
  try {
    const { messages } = await c.req.json()
    console.log('Mensaje recibido:', messages)

    const modelName = process.env.OLLAMA_MODEL ?? 'qwen2.5:7b'

    // El modelo puede usar getUsuarios para consultar la BD y la respuesta se manda por chunks al navegador
    const result = streamText({
      model: ollama(modelName),
      system: 'Eres un asistente útil que puede consultar información de usuarios en la base de datos. Cuando el usuario pregunte sobre usuarios, usa la herramienta getUsuarios para obtener la información.',
      messages,
      tools: dbTools,
      maxSteps: 5,
      toolChoice: 'auto',
      onError: (error) => {
        console.error('Error del streamText:', error)
      },
      onFinish: ({ text, toolCalls, toolResults }) => {
        console.log('Finalizó respuesta:', text)
        console.log('Tool calls:', toolCalls)
        console.log('Tool results:', toolResults)
      }
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
  console.log('Servidor corriendo en http://localhost:3000')
  console.log(`Modelo: ${model}`)
})