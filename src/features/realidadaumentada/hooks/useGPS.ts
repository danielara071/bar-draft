import { useState, useEffect, useCallback, useRef } from 'react'
import type { UserCoords, WorldObject } from '../interfaces/ar.types'

// buildWorldObjects y VISIBILITY_RADIUS_METERS vienen de data/worldObjects.
import { buildWorldObjects, VISIBILITY_RADIUS_METERS } from '../../../data/worldObjects'
import { getDistanceMeters } from '../../../lib/geoUtils'

interface UseGPSResult {
  userCoords:    UserCoords | null
  worldObjects:  WorldObject[]
  nearbyObjects: WorldObject[]
  error:         string | null
}

// useGPS — gestiona la posición del usuario y los objetos del mundo.
// Solo llama a buildWorldObjects() en la primera posición, y luego filtra por cercanía sin regenerar los objetos del mundo.
export function useGPS(started: boolean): UseGPSResult {
  const [userCoords, setUserCoords]       = useState<UserCoords | null>(null)
  const [worldObjects, setWorldObjects]   = useState<WorldObject[]>([])
  const [nearbyObjects, setNearbyObjects] = useState<WorldObject[]>([])
  const [error, setError]                 = useState<string | null>(null)

  // Garantiza que buildWorldObjects() solo se llame en la primera posición
  const initializedRef = useRef(false)

  const handlePosition = useCallback((pos: GeolocationPosition) => {
    const coords: UserCoords = {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    }
    setUserCoords(coords)

    if (!initializedRef.current) {
      initializedRef.current = true
      const objects = buildWorldObjects(coords.lat, coords.lng)
      setWorldObjects(objects)
      setNearbyObjects(objects)
    } else {
      // Posiciones siguientes: filtra por radio de visibilidad sin regenerar
      setWorldObjects((prev) => {
        const nearby = prev.filter(
          (obj) => getDistanceMeters(coords.lat, coords.lng, obj.lat, obj.lng) <= VISIBILITY_RADIUS_METERS,
        )
        setNearbyObjects(nearby)
        return prev   // worldObjects no cambia, solo nearbyObjects
      })
    }
  }, [])

  useEffect(() => {
    if (!started) return

    if (!navigator.geolocation) {
      setError('GPS no disponible en este dispositivo')
      return
    }

    const watchId = navigator.geolocation.watchPosition(
      handlePosition,
      (err) => setError(err.message),
      { enableHighAccuracy: true, maximumAge: 3000, timeout: 10000 },
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [started, handlePosition])

  return { userCoords, worldObjects, nearbyObjects, error }
}