import { useState, useEffect, useCallback } from 'react'
import type { TrophyWithCapture, UserCoords, WorldObject } from '../interfaces/ar.types'
import {
  getTrophiesNearby,
  getTrophiesByUser,
  captureTrophy,
  toWorldObjects,
} from './trophyService'

interface UseUserTrophiesResult {
  // Trofeos cercanos como WorldObjects listos para AFrameScene
  nearbyWorldObjects: WorldObject[]
  // Trofeos capturados por el usuario para el hub de colección
  collectedTrophies: TrophyWithCapture[]
  // Total de trofeos en la BD (para barra de progreso)
  totalTrophies: number
  // Detalle completo de un trofeo seleccionado (para el modal)
  selectedTrophy: TrophyWithCapture | null
  // Carga el detalle de un trofeo por id desde nearbyWorldObjects
  selectTrophy: (trophyId: string) => void
  // Limpia el trofeo seleccionado (cierra modal)
  clearSelectedTrophy: () => void
  // Captura el trofeo seleccionado y actualiza el estado local
  capture: (trophyId: string) => Promise<void>
  loading: boolean
  error: string | null
}

// useUserTrophies — gestiona toda la lógica de trofeos del usuario.

export function useUserTrophies(
  userId: string | null,
  userCoords: UserCoords | null,
  radiusMeters: number = 300,
): UseUserTrophiesResult {
  const [nearbyTrophies, setNearbyTrophies]     = useState<TrophyWithCapture[]>([])
  const [collectedTrophies, setCollectedTrophies] = useState<TrophyWithCapture[]>([])
  const [selectedTrophy, setSelectedTrophy]     = useState<TrophyWithCapture | null>(null)
  const [totalTrophies]       = useState(0)
  const [loading, setLoading]                   = useState(false)
  const [error, setError]                       = useState<string | null>(null)

  //  Carga los trofeos capturados por el usuario al iniciar o cambiar de usuario
  const loadCollected = useCallback(async () => {
    if (!userId) return
    try {
      const collected = await getTrophiesByUser(userId)
      setCollectedTrophies(collected)
    } catch (e: any) {
      setError(e.message)
    }
  }, [userId])

  useEffect(() => {
    loadCollected()
  }, [loadCollected])

  // Carga los trofeos cercanos cada vez que cambian las coordenadas, el usuario o el radio
  useEffect(() => {
    if (!userId || !userCoords) return

    const load = async () => {
      try {
        setLoading(true)
        const nearby = await getTrophiesNearby(
          userCoords.lat,
          userCoords.lng,
          userId,
          radiusMeters,
        )
        setNearbyTrophies(nearby)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [userId, userCoords?.lat, userCoords?.lng, radiusMeters])

  // Selecciona un trofeo por id para el modal
  const selectTrophy = useCallback(
    (trophyId: string) => {
      const found = nearbyTrophies.find((t) => t.id === trophyId) ?? null
      setSelectedTrophy(found)
    },
    [nearbyTrophies],
  )

  const clearSelectedTrophy = useCallback(() => setSelectedTrophy(null), [])

  // Captura un trofeo: llama a la API, marca como capturado en nearbyTrophies y lo agrega a collectedTrophies
  const capture = useCallback(
    async (trophyId: string) => {
      if (!userId) return
      try {
        const saved = await captureTrophy(userId, trophyId)
        if (!saved) return // ya capturado

        const now = new Date().toISOString()

        // Marca como capturado en nearbyTrophies
        setNearbyTrophies((prev) =>
          prev.map((t) =>
            t.id === trophyId ? { ...t, captured: true, fecha_obtencion: now } : t,
          ),
        )

        // Agrega a collectedTrophies si no está ya
        setCollectedTrophies((prev) => {
          const alreadyIn = prev.some((t) => t.id === trophyId)
          if (alreadyIn) return prev
          const trophy = nearbyTrophies.find((t) => t.id === trophyId)
          if (!trophy) return prev
          return [...prev, { ...trophy, captured: true, fecha_obtencion: now }]
        })

        // Actualiza el selectedTrophy si es el mismo
        setSelectedTrophy((prev) =>
          prev?.id === trophyId ? { ...prev, captured: true, fecha_obtencion: now } : prev,
        )
      } catch (e: any) {
        setError(e.message)
      }
    },
    [userId, nearbyTrophies],
  )

  // Convierte los nearbyTrophies a WorldObjects para la ARScene
  const nearbyWorldObjects = toWorldObjects(nearbyTrophies)

  return {
    nearbyWorldObjects,
    collectedTrophies,
    totalTrophies,
    selectedTrophy,
    selectTrophy,
    clearSelectedTrophy,
    capture,
    loading,
    error,
  }
}