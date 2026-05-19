// ── Dominio de UI ─────────────────────────────────────────────────

export interface UserCoords {
  lat: number
  lng: number
}

export interface SelectedObject {
  id: string
  label: string
  distance: number
}

export interface CollectionItem {
  id: string
  label: string
  collected: boolean
  region: string
}

// ── Base de datos: tabla `trofeos` ────────────────────────────────

export interface Trophy {
  id: string
  nombre: string
  descripcion: string | null
  jugador_asociado: string | null
  file_url: string | null        // URL pública directa (antes file_name)
  created_at: string
}

// ── Base de datos: tabla `ubicacion_trofeo` ───────────────────────

export interface TrophyLocation {
  id: string
  trofeo_id: string
  latitud: string               // text en BD — convertir a number al usar
  longitud: string
  nombre_lugar: string | null
}

// ── Base de datos: tabla `usuarios_trofeos` ───────────────────────

export interface UserTrophy {
  id: string
  usuario_id: string
  trofeo_id: string
  fecha_obtencion: string
}

// ── Tipo combinado para uso en la escena AR ───────────────────────

export interface TrophyWithCapture {
  id: string
  nombre: string
  descripcion: string | null
  jugador_asociado: string | null
  lat: number
  lng: number
  nombre_lugar: string | null
  glbUrl: string | null          // file_url directo de la BD
  captured: boolean
  fecha_obtencion: string | null
}

// ── WorldObject: forma que consume AFrameScene ────────────────────

export interface WorldObject {
  id: string
  label: string
  color: string
  lat: number
  lng: number
  glbUrl: string | null
  captured: boolean
}