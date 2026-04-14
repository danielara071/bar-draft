export type PredictionItem = {
  label: string
  value: string
}

type TeamSide = 'home' | 'away'

export type PredictionApiResponse = {
  response?: Array<{
    predictions?: {
      winner?: {
        name?: string
        comment?: string
      }
      under_over?: string | null
      goals?: {
        home?: string | null
        away?: string | null
      }
      advice?: string
      percent?: {
        home?: string
        draw?: string
        away?: string
      }
    }
    teams?: {
      home?: {
        name?: string
      }
      away?: {
        name?: string
      }
    }
  }>
}

type PredictionEntry = NonNullable<PredictionApiResponse['response']>[number]

export const fallbackPredictionItems = (): PredictionItem[] => [
  { label: 'Equipo con más probabilidad', value: 'Sin dato disponible' },
  { label: 'Marcador estimado', value: 'Sin marcador estimado' },
  { label: 'Probabilidad de empate', value: 'Sin dato disponible' }
]

const parsePercentNumber = (value?: string): number => {
  if (!value) return Number.NaN
  return Number.parseFloat(value.replace('%', '').trim())
}

const pickLikelyWinner = (
  homePercent?: string,
  awayPercent?: string
): TeamSide | null => {
  const home = parsePercentNumber(homePercent)
  const away = parsePercentNumber(awayPercent)

  if (Number.isNaN(home) && Number.isNaN(away)) return null
  if (Number.isNaN(home)) return 'away'
  if (Number.isNaN(away)) return 'home'

  return home >= away ? 'home' : 'away'
}

export const buildPredictionItems = (predictionData?: PredictionEntry): PredictionItem[] => {
  const predictions = predictionData?.predictions
  const homeTeam = predictionData?.teams?.home?.name ?? 'Local'
  const awayTeam = predictionData?.teams?.away?.name ?? 'Visitante'

  const likelySide = pickLikelyWinner(predictions?.percent?.home, predictions?.percent?.away)
  const likelyWinnerText =
    likelySide === 'home'
      ? `${homeTeam} (${predictions?.percent?.home ?? 'N/D'})`
      : likelySide === 'away'
        ? `${awayTeam} (${predictions?.percent?.away ?? 'N/D'})`
        : predictions?.winner?.name
          ? `${predictions.winner.name} (${predictions?.winner?.comment ?? 'N/D'})`
          : predictions?.advice ?? 'Sin dato disponible'

  const predictedScore =
    predictions?.goals?.home != null && predictions?.goals?.away != null
      ? `${homeTeam}: ${predictions.goals.home} | ${awayTeam}: ${predictions.goals.away}`
      : predictions?.under_over
        ? `Under/Over ${predictions.under_over}`
        : predictions?.advice ?? 'Sin marcador estimado'

  const drawProbability =
    predictions?.percent?.draw ??
    (predictions?.winner?.comment ? `Basado en: ${predictions.winner.comment}` : 'Sin dato disponible')

  return [
    { label: 'Equipo con más probabilidad', value: likelyWinnerText },
    { label: 'Marcador estimado', value: predictedScore },
    { label: 'Probabilidad de empate', value: drawProbability }
  ]
}
