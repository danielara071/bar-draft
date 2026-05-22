import { supabase } from '../../../shared/services/supabaseClient'

import type {
  TrophyWithCapture,
  WorldObject,
} from '../interfaces/ar.types'
import { getDistanceMeters } from '../../../lib/geoUtils'

const TROPHY_COLOR_DEFAULT = '#FFD700'




// Carga todas las ubicaciones de trofeos, filtra por cercanía y marca cuáles ya fueron capturados por el usuario.

export async function getTrophiesNearby(
  userLat: number,
  userLng: number,
  userId: string,
  radiusMeters: number = 300,
): Promise<TrophyWithCapture[]> {
  const { data: locations, error: locError } = await supabase
    .from('ubicacion_trofeo')
    .select(`
      id,
      trofeo_id,
      latitud,
      longitud,
      nombre_lugar,
      trofeos (
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
      )
    `)

  if (locError) throw new Error(`Error cargando ubicaciones: ${locError.message}`)
  if (!locations) return []

  const { data: userTrophies, error: utError } = await supabase
    .from('usuarios_trofeos')
    .select('trofeo_id, fecha_obtencion')
    .eq('usuario_id', userId)

  if (utError) throw new Error(`Error cargando trofeos del usuario: ${utError.message}`)

  const capturedIds   = new Set((userTrophies ?? []).map((ut) => ut.trofeo_id))
  const capturedDates = new Map((userTrophies ?? []).map((ut) => [ut.trofeo_id, ut.fecha_obtencion]))

  return locations
    .filter((loc) => {
      const dist = getDistanceMeters(userLat, userLng, Number(loc.latitud), Number(loc.longitud))
      return dist <= radiusMeters
    })
    .filter((loc) => loc.trofeos !== null)
    .map((loc) => {
      const trophy   = loc.trofeos as any
      const tipoData = trophy.tipo_trofeo as any
      return {
        id:              trophy.id,
        nombre:          trophy.nombre,
        descripcion:     trophy.descripcion,
        lat:             Number(loc.latitud),
        lng:             Number(loc.longitud),
        nombre_lugar:    loc.nombre_lugar,
        glbUrl:          trophy.file_url,
        trofeo_url:      tipoData?.trofeo_url ?? null,
        captured:        capturedIds.has(trophy.id),
        fecha_obtencion: capturedDates.get(trophy.id) ?? null,
      }
    })
}

export async function getTrophiesByUser(userId: string): Promise<TrophyWithCapture[]> {
  const { data, error } = await supabase
    .from('usuarios_trofeos')
    .select(`
      trofeo_id,
      fecha_obtencion,
      trofeos (
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
      )
    `)
    .eq('usuario_id', userId)

  if (error) throw new Error(`Error cargando colección: ${error.message}`)
  if (!data || data.length === 0) return []

  return data
    .filter((row) => row.trofeos !== null)
    .map((row) => {
      const trophy   = row.trofeos as any
      const tipoData = trophy.tipo_trofeo as any
      return {
        id:              trophy.id,
        nombre:          trophy.nombre,
        descripcion:     trophy.descripcion,
        lat:             0,
        lng:             0,
        nombre_lugar:    null,
        glbUrl:          trophy.file_url,
        trofeo_url:      tipoData?.trofeo_url ?? null,
        captured:        true,
        fecha_obtencion: row.fecha_obtencion,
      }
    })
}

export async function captureTrophy(userId: string, trophyId: string): Promise<boolean> {
  const { data: existing } = await supabase
    .from('usuarios_trofeos')
    .select('id')
    .eq('usuario_id', userId)
    .eq('trofeo_id', trophyId)
    .maybeSingle()

  if (existing) return false

  const { error } = await supabase.from('usuarios_trofeos').insert({
    usuario_id: userId,
    trofeo_id: trophyId,
  })

  if (error) throw new Error(`Error capturando trofeo: ${error.message}`)
  return true
}

export function toWorldObjects(trophies: TrophyWithCapture[]): WorldObject[] {
  return trophies.map((t) => ({
    id: t.id,
    label: t.nombre,
    color: TROPHY_COLOR_DEFAULT,
    lat: t.lat,
    lng: t.lng,
    glbUrl: t.glbUrl,
    captured: t.captured,
  }))
}