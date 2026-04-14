import express, { type Request, type Response } from 'express'
import {
  buildPredictionItems,
  fallbackPredictionItems,
  type PredictionApiResponse
} from '../services/predictions'

export const WATCHPARTY_PORT = Number(process.env.WATCHPARTY_PORT ?? 3001)

export const startWatchpartyExpressServer = () => {
  const app = express()

  app.get('/api/watchparty/live-match', async (_req: Request, res: Response) => {
    try {
      const apiKey = process.env.API_FOOTBALL_KEY

      if (!apiKey) {
        return res.status(500).json({ error: 'Missing API_FOOTBALL_KEY in environment' })
      }

      const response = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
        headers: {
          'x-apisports-key': apiKey
        }
      })

      if (!response.ok) {
        const body = await response.text()
        console.error('API-Football error:', response.status, body)
        return res.status(502).json({ error: 'API-Football request failed', status: response.status })
      }

      const data = await response.json() as { response?: unknown[] }
      const match = data.response?.[0] || null

      return res.json(match)
    } catch (err) {
      console.error('Error en /api/watchparty/live-match:', err)
      return res.status(500).json({ error: String(err) })
    }
  })

  app.get('/api/watchparty/predictions', async (_req: Request, res: Response) => {
    try {
      const apiKey = process.env.API_FOOTBALL_KEY

      if (!apiKey) {
        return res.status(500).json({ error: 'Missing API_FOOTBALL_KEY in environment' })
      }

      const liveResponse = await fetch('https://v3.football.api-sports.io/fixtures?live=all', {
        headers: {
          'x-apisports-key': apiKey
        }
      })

      if (!liveResponse.ok) {
        const body = await liveResponse.text()
        console.error('API-Football live fixtures error:', liveResponse.status, body)
        return res.status(502).json({ error: 'Live fixtures request failed', status: liveResponse.status })
      }

      const liveData = await liveResponse.json() as {
        response?: Array<{ fixture?: { id?: number } }>
      }
      const fixtureId = liveData.response?.[0]?.fixture?.id

      if (!fixtureId) {
        return res.json({ fixtureId: null, predictions: fallbackPredictionItems() })
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
        return res.json({ fixtureId, predictions: fallbackPredictionItems() })
      }

      const predictionData = await predictionsResponse.json() as PredictionApiResponse
      const predictionItems = buildPredictionItems(predictionData.response?.[0])

      return res.json({ fixtureId, predictions: predictionItems })
    } catch (err) {
      console.error('Error en /api/watchparty/predictions:', err)
      return res.status(500).json({ error: String(err) })
    }
  })

  app.listen(WATCHPARTY_PORT, () => {
    console.log(`WatchParty Express corriendo en http://localhost:${WATCHPARTY_PORT}`)
  })
}
