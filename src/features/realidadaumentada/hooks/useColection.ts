import { useState, useEffect } from 'react'
import { supabase } from '../../../shared/services/supabaseClient'
import { getTrophiesByUser } from './trophyService'
import type { TrophyWithCapture } from '../interfaces/ar.types'

async function fetchTotalTrophies(): Promise<TrophyWithCapture[]> {
  const { data, error } = await supabase
    .from('trofeos')
    .select(`
      id,
      nombre,
      descripcion,
      file_url,
      created_at,
      tipo_trofeo (
        id,
        tipo_trofeo,
        trofeo_url
      )
    `)
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)

  return (data ?? []).map((t) => {
    const tipoData = (t as any).tipo_trofeo as any
    return {
      id:              t.id,
      nombre:          t.nombre,
      descripcion:     t.descripcion,
      lat:             0,
      lng:             0,
      nombre_lugar:    null,
      glbUrl:          t.file_url,
      trofeo_url:      tipoData?.trofeo_url ?? null,
      captured:        false,
      fecha_obtencion: null,
    }
  })
}

interface UseColeccionResult {
  allTrophies: TrophyWithCapture[]   // todos — capturados y no
  collected: TrophyWithCapture[]     // solo capturados
  totalTrophies: number
  progressPct: number
  loading: boolean
}

export function useColeccion(userId: string): UseColeccionResult {
  const [allTrophies, setAllTrophies]     = useState<TrophyWithCapture[]>([])
  const [collected, setCollected]         = useState<TrophyWithCapture[]>([])
  const [loading, setLoading]             = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [all, userTrophies] = await Promise.all([
          fetchTotalTrophies(),
          getTrophiesByUser(userId),
        ])

        const capturedMap = new Map(userTrophies.map((t) => [t.id, t]))

        // Merge: marca los capturados con sus datos reales
        const merged = all.map((t) =>
          capturedMap.has(t.id)
            ? capturedMap.get(t.id)!
            : {
                ...t,
                captured:    false,
                descripcion: 'No disponible hasta captura',
              }
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