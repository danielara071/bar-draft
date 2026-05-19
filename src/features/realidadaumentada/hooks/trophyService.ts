import { supabase } from '../../../shared/services/supabaseClient'
import type {
  Trophy,
  TrophyLocation,
  TrophyWithCapture,
  WorldObject,
} from '../interfaces/ar.types'
import { getDistanceMeters } from '../../../lib/geoUtils'

const TROPHY_COLOR_DEFAULT = '#FFD700'

// ── Helpers privados ──────────────────────────────────────────────

function mergeTrophyData(
  trophy: Trophy,
  location: TrophyLocation,
  capturedIds: Set<string>,
  capturedDates: Map<string, string>,
): TrophyWithCapture {
  return {
    id: trophy.id,
    nombre: trophy.nombre,
    descripcion: trophy.descripcion,
    jugador_asociado: trophy.jugador_asociado,
    lat: Number(location.latitud),
    lng: Number(location.longitud),
    nombre_lugar: location.nombre_lugar,
    glbUrl: trophy.file_url,          // ya es URL pública directa
    captured: capturedIds.has(trophy.id),
    fecha_obtencion: capturedDates.get(trophy.id) ?? null,
  }
}

// ── API pública ───────────────────────────────────────────────────

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
        jugador_asociado,
        file_url,
        created_at
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
    .map((loc) => {
      const trophy = (loc as any).trofeos as Trophy
      const location: TrophyLocation = {
        id: loc.id,
        trofeo_id: loc.trofeo_id,
        latitud: loc.latitud,
        longitud: loc.longitud,
        nombre_lugar: loc.nombre_lugar,
      }
      return mergeTrophyData(trophy, location, capturedIds, capturedDates)
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
        jugador_asociado,
        file_url,
        created_at
      )
    `)
    .eq('usuario_id', userId)

  if (error) throw new Error(`Error cargando colección: ${error.message}`)
  if (!data) return []

  return data.map((row) => {
    const trophy = (row as any).trofeos as Trophy
    return {
      id: trophy.id,
      nombre: trophy.nombre,
      descripcion: trophy.descripcion,
      jugador_asociado: trophy.jugador_asociado,
      lat: 0,
      lng: 0,
      nombre_lugar: null,
      glbUrl: trophy.file_url,
      captured: true,
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