import type { WorldObject } from '../features/realidadaumentada/interfaces/ar.types'

// Los objetos se posicionan relativos a la ubicación del usuario en tiempo real.
// Los offsets están en grados (~11m por 0.0001°).
// TODO: reemplazar con datos reales de la tabla `ubicacion_trofeo` en Supabase.
export const OBJECT_OFFSETS: Omit<WorldObject, 'lat' | 'lng' | 'glbUrl' | 'captured'>[] = [
  { id: 'w1', label: 'Tesoro',  color: '#FFD700' },
  { id: 'w2', label: 'Cristal', color: '#FF4444' },
  { id: 'w3', label: 'Gema',    color: '#44FFCC' },
  { id: 'w4', label: 'Portal',  color: '#4488FF' },
]

export const OFFSETS_DEG = [
  { dlat:  0.00010, dlng:  0.00000 }, // Norte
  { dlat:  0.00000, dlng:  0.00010 }, // Este
  { dlat:  0.00000, dlng: -0.00010 }, // Oeste
  { dlat: -0.00010, dlng:  0.00000 }, // Sur
]

/** Radio en metros dentro del cual un trofeo se considera "cercano" */
export const VISIBILITY_RADIUS_METERS = 300

/**
 * Genera WorldObjects centrados en la ubicación actual del usuario.
 * Se usa como fallback hasta integrar los datos reales de Supabase.
 */
export function buildWorldObjects(userLat: number, userLng: number): WorldObject[] {
  return OBJECT_OFFSETS.map((obj, i) => ({
    ...obj,
    lat: userLat + OFFSETS_DEG[i].dlat,
    lng: userLng + OFFSETS_DEG[i].dlng,
    glbUrl: null,
    captured: false,
  }))
}