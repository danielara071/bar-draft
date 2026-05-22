import express, { type Request, type Response } from 'express'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import {
  buildPredictionItems,
  type PredictionItem,
  type PredictionApiResponse
} from '../services/predictions'

export const WATCHPARTY_PORT = Number(process.env.WATCHPARTY_PORT ?? 3001)

const liveMatchDummyPath = resolve(process.cwd(), 'src/dummy/live-match.json')
const predictionsDummyPath = resolve(process.cwd(), 'src/dummy/predictions.json')

const readLiveMatchDummy = async (): Promise<unknown> => {
  const content = await readFile(liveMatchDummyPath, 'utf-8')
  return JSON.parse(content)
}

const readPredictionsDummy = async (): Promise<{ fixtureId: number | null; predictions: PredictionItem[] }> => {
  const content = await readFile(predictionsDummyPath, 'utf-8')
  return JSON.parse(content) as { fixtureId: number | null; predictions: PredictionItem[] }
}

export const startWatchpartyExpressServer = () => {
  const app = express()

  app.get('/api/watchparty/live-match', async (_req: Request, res: Response) => {
    try {
      const apiKey = process.env.API_FOOTBALL_KEY

      if (!apiKey) {
        return res.json(await readLiveMatchDummy())
      }

      const response = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
        headers: {
          'x-apisports-key': apiKey
        }
      })

      if (!response.ok) {
        const body = await response.text()
        console.error('API-Football error:', response.status, body)
        return res.json(await readLiveMatchDummy())
      }

      const data = await response.json() as { response?: unknown[] }
      const match = data.response?.[0] || null

      if (!match) {
        return res.json(await readLiveMatchDummy())
      }

      return res.json(match)
    } catch (err) {
      console.error('Error en /api/watchparty/live-match:', err)
      return res.json(await readLiveMatchDummy())
    }
  })

  app.get('/api/watchparty/predictions', async (_req: Request, res: Response) => {
    try {
      const apiKey = process.env.API_FOOTBALL_KEY

      if (!apiKey) {
        return res.json(await readPredictionsDummy())
      }

      const liveResponse = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
        headers: {
          'x-apisports-key': apiKey
        }
      })

      if (!liveResponse.ok) {
        const body = await liveResponse.text()
        console.error('API-Football live fixtures error:', liveResponse.status, body)
        return res.json(await readPredictionsDummy())
      }

      const liveData = await liveResponse.json() as {
        response?: Array<{ fixture?: { id?: number } }>
      }
      const fixtureId = liveData.response?.[0]?.fixture?.id

      if (!fixtureId) {
        return res.json(await readPredictionsDummy())
      }

      // User requested odds endpoint; if it doesn't provide the needed fields, fallback to predictions endpoint.
      const oddsResponse = await fetch(`https://v3.football.api-sports.io/odds?fixture=${fixtureId}`, {
        headers: {
          'x-apisports-key': apiKey
        }
      })

      if (!oddsResponse.ok) {
        const body = await oddsResponse.text()
        console.error('API-Football odds error:', oddsResponse.status, body)
      }

      const predictionsResponse = await fetch(
        `https://v3.football.api-sports.io/predictions?fixture=${fixtureId}`,
        {
          headers: {
            'x-apisports-key': apiKey
          }
        }
      )

      if (!predictionsResponse.ok) {
        const body = await predictionsResponse.text()
        console.error('API-Football predictions error:', predictionsResponse.status, body)
        return res.json(await readPredictionsDummy())
      }

      const predictionData = await predictionsResponse.json() as PredictionApiResponse
      const predictionItems = buildPredictionItems(predictionData.response?.[0])

      return res.json({ fixtureId, predictions: predictionItems })
    } catch (err) {
      console.error('Error en /api/watchparty/predictions:', err)
      return res.json(await readPredictionsDummy())
    }
  })

  const server = app.listen(WATCHPARTY_PORT, () => {
    console.log(`WatchParty Express corriendo en http://localhost:${WATCHPARTY_PORT}`)
  })

  // Sin este handler, EADDRINUSE (puerto ocupado por una sesión anterior)
  // dispara un 'error' event no capturado que mata todo el proceso de Node,
  // incluyendo el servidor principal de Hono en el puerto 3000.
  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`[watchparty] Puerto ${WATCHPARTY_PORT} ocupado — WatchParty no disponible. Reinicia para liberarlo.`)
    } else {
      console.error('[watchparty] Error al iniciar servidor:', err)
    }
  })
}
