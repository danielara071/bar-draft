import { useState, useEffect } from 'react'
import { getTrophiesByUser } from './trophyService'
import { supabase } from '../../../shared/services/supabaseClient'
import { TIPO_TROFEO_URLS } from './trophyService'
import type { TrophyWithCapture } from '../interfaces/ar.types'

type TipoRow = { id: number; tipo_trofeo: string; trofeo_url: string | null }

// Carga todos los trofeos de la BD con sus tipos.
async function fetchAllTrophies(): Promise<TrophyWithCapture[]> {
  const { data: trofeos, error: trofeoError } = await supabase
    .from('trofeos')
    .select('id, nombre, descripcion, file_url, created_at, tipo_trofeo')
    .order('created_at', { ascending: true })

  if (trofeoError) throw new Error(trofeoError.message)
  if (!trofeos) return []

  const { data: tipos, error: tipoError } = await supabase
    .from('tipo_trofeo')
    .select('id, tipo_trofeo, trofeo_url')

  if (tipoError) throw new Error(tipoError.message)

  const tipoMap = new Map<number, TipoRow>((tipos ?? []).map((t) => [t.id, t]))

  return trofeos.map((t) => {
    const tipoData = t.tipo_trofeo ? tipoMap.get(t.tipo_trofeo) : null
    return {
      id:              t.id,
      nombre:          t.nombre,
      descripcion:     t.descripcion,
      lat:             0,
      lng:             0,
      nombre_lugar:    null,
      glbUrl:          t.file_url,
      trofeo_url:      TIPO_TROFEO_URLS[t.tipo_trofeo] ?? tipoData?.trofeo_url ?? null,
      captured:        false,
      fecha_obtencion: null,
    }
  })
}

interface UseColeccionResult {
  allTrophies:   TrophyWithCapture[]
  collected:     TrophyWithCapture[]
  totalTrophies: number
  progressPct:   number
  loading:       boolean
}

export function useColeccion(userId: string): UseColeccionResult {
  const [allTrophies, setAllTrophies] = useState<TrophyWithCapture[]>([])
  const [collected, setCollected]     = useState<TrophyWithCapture[]>([])
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [all, userTrophies] = await Promise.all([
          fetchAllTrophies(),
          getTrophiesByUser(userId),
        ])

        const capturedMap = new Map(userTrophies.map((t) => [t.id, t]))

  
        const merged = all.map((t) =>
          capturedMap.has(t.id)
            ? capturedMap.get(t.id)!
            : { ...t, captured: false, descripcion: 'No disponible hasta captura' }
        )

        setAllTrophies(merged)
        setCollected(userTrophies)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [userId])

  const progressPct = allTrophies.length > 0
    ? Math.round((collected.length / allTrophies.length) * 100)
    : 0

  return { allTrophies, collected, totalTrophies: allTrophies.length, progressPct, loading }
}