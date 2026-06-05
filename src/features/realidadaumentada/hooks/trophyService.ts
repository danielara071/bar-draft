import { supabase } from '../../../shared/services/supabaseClient'
import type { TrophyWithCapture, WorldObject } from '../interfaces/ar.types'
import { getDistanceMeters } from '../../../lib/geoUtils'

const supabaseUrl          = import.meta.env.VITE_SUPABASE_URL ?? ''
const TROPHY_COLOR_DEFAULT = '#FFD700'


type TipoRow = { id: number; tipo_trofeo: string; trofeo_url: string | null }
type TipoMap = Map<number, TipoRow>

//URLs firmadas por tipo de trofeo (fuente primaria)
export const TIPO_TROFEO_URLS: Record<number, string> = {
  1: `${supabaseUrl}/storage/v1/object/sign/trofeos_png/copadelreytrofeo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85YjVhN2I1MC1iNThkLTRkMzEtOTJiZS1jMWRjNjdmZjY5MGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0cm9mZW9zX3BuZy9jb3BhZGVscmV5dHJvZmVvLnBuZyIsImlhdCI6MTc3OTM5MDE0NCwiZXhwIjoxODEwOTI2MTQ0fQ.Dcfte4RPlAESWH1LlgefbS8AmvE1J7sV5r4Xi8mSKzk`,
  2: `${supabaseUrl}/storage/v1/object/sign/trofeos_png/championstrofeo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85YjVhN2I1MC1iNThkLTRkMzEtOTJiZS1jMWRjNjdmZjY5MGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0cm9mZW9zX3BuZy9jaGFtcGlvbnN0cm9mZW8ucG5nIiwiaWF0IjoxNzc5MzkwMTIwLCJleHAiOjE3ODE5ODIxMjB9.plee39QHKKdoOqNQfzzlgEGvdjCpREB7G1GLLY3bnzo`,
  3: `${supabaseUrl}/storage/v1/object/sign/trofeos_png/balondeoro.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85YjVhN2I1MC1iNThkLTRkMzEtOTJiZS1jMWRjNjdmZjY5MGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0cm9mZW9zX3BuZy9iYWxvbmRlb3JvLnBuZyIsImlhdCI6MTc3OTM5MDEwNCwiZXhwIjoxODEwOTI2MTA0fQ.qBdSLMqLK6XjZvbP87gtYA2L6f2vQ4kVibGCBAEITMc`,
  4: `${supabaseUrl}/storage/v1/object/sign/trofeos_png/ligatrofeo.png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV85YjVhN2I1MC1iNThkLTRkMzEtOTJiZS1jMWRjNjdmZjY5MGYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJ0cm9mZW9zX3BuZy9saWdhdHJvZmVvLnBuZyIsImlhdCI6MTc3OTM5MDA1MywiZXhwIjoxODEwOTI2MDUzfQ.pTN_XyWpSfqzvpFKkNS_kfLYQyDhpytAed59eRu4i1g`,
}

// Cache en memoria para tipos de trofeo, para evitar múltiples consultas a la tabla `tipo_trofeo`.
let tipoMapCache: TipoMap | null = null

async function getTipoMap(): Promise<TipoMap> {
  if (tipoMapCache) return tipoMapCache

  const { data: tipos, error } = await supabase
    .from('tipo_trofeo')
    .select('id, tipo_trofeo, trofeo_url')

  if (error) throw new Error(`Error cargando tipos de trofeo: ${error.message}`)

  tipoMapCache = new Map((tipos ?? []).map((t) => [t.id, t]))
  return tipoMapCache
}

// Dado un tipo_trofeo_id, retorna la URL del PNG del tipo. Usa el cache de URLs fijas (TIPO_TROFEO_URLS) como fuente primaria, y si no existe ahí, busca en el tipoMap (fuente secundaria).
function getTrophyImageUrl(tipoTrofeoId: number | null, tipoMap: TipoMap): string | null {
  if (!tipoTrofeoId) return null
  if (TIPO_TROFEO_URLS[tipoTrofeoId]) return TIPO_TROFEO_URLS[tipoTrofeoId]
  return tipoMap.get(tipoTrofeoId)?.trofeo_url ?? null
}

// Transforma los datos crudos de la consulta a un TrophyWithCapture listo para usar en la UI.
function transformTrophyData(
  trophy: any,
  tipoMap: TipoMap,
  options: {
    captured:        boolean
    fecha_obtencion: string | null
    lat:             number
    lng:             number
    nombre_lugar:    string | null
  },
): TrophyWithCapture {
  return {
    id:              trophy.id,
    nombre:          trophy.nombre,
    descripcion:     trophy.descripcion,
    lat:             options.lat,
    lng:             options.lng,
    nombre_lugar:    options.nombre_lugar,
    glbUrl:          trophy.file_url,
    trofeo_url:      getTrophyImageUrl(trophy.tipo_trofeo, tipoMap),
    captured:        options.captured,
    fecha_obtencion: options.fecha_obtencion,
  }
}

// Carga las ubicaciones de trofeos, filtra por cercanía y marca los capturados.
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
        tipo_trofeo
      )
    `)

  if (locError) throw new Error(`Error cargando ubicaciones: ${locError.message}`)
  if (!locations) return []

  const [tipoMap, userTrophiesResult] = await Promise.all([
    getTipoMap(),
    supabase
      .from('usuarios_trofeos')
      .select('trofeo_id, fecha_obtencion')
      .eq('usuario_id', userId),
  ])

  if (userTrophiesResult.error) {
    throw new Error(`Error cargando trofeos del usuario: ${userTrophiesResult.error.message}`)
  }

  const capturedIds   = new Set((userTrophiesResult.data ?? []).map((ut) => ut.trofeo_id))
  const capturedDates = new Map((userTrophiesResult.data ?? []).map((ut) => [ut.trofeo_id, ut.fecha_obtencion]))

  return locations
    .filter((loc) => loc.trofeos !== null)
    .filter((loc) => {
      const dist = getDistanceMeters(userLat, userLng, Number(loc.latitud), Number(loc.longitud))
      return dist <= radiusMeters
    })
    .map((loc) =>
      transformTrophyData(loc.trofeos as any, tipoMap, {
        captured:        capturedIds.has((loc.trofeos as any).id),
        fecha_obtencion: capturedDates.get((loc.trofeos as any).id) ?? null,
        lat:             Number(loc.latitud),
        lng:             Number(loc.longitud),
        nombre_lugar:    loc.nombre_lugar,
      })
    )
}

// Trofeos capturados por el usuario para el armario culé
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
        tipo_trofeo
      )
    `)
    .eq('usuario_id', userId)

  if (error) throw new Error(`Error cargando colección: ${error.message}`)
  if (!data || data.length === 0) return []

  const tipoMap = await getTipoMap()

  return data
    .filter((row) => row.trofeos !== null)
    .map((row) =>
      transformTrophyData(row.trofeos as any, tipoMap, {
        captured:        true,
        fecha_obtencion: row.fecha_obtencion,
        lat:             0,
        lng:             0,
        nombre_lugar:    null,
      })
    )
}

// Intenta capturar un trofeo para el usuario. Retorna true si se capturó exitosamente, o false si el usuario ya tenía ese trofeo.
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
    trofeo_id:  trophyId,
  })

  if (error) throw new Error(`Error capturando trofeo: ${error.message}`)
  return true
}

// Convierte TrophyWithCapture[] a WorldObject[] para AFrameScene.
export function toWorldObjects(trophies: TrophyWithCapture[]): WorldObject[] {
  return trophies.map((t) => ({
    id:       t.id,
    label:    t.nombre,
    color:    TROPHY_COLOR_DEFAULT,
    lat:      t.lat,
    lng:      t.lng,
    glbUrl:   t.glbUrl,
    captured: t.captured,
  }))
}