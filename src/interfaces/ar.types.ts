
export interface WorldObject {
    id: string
    label: string
    color: string
    lat: number
    lng: number
}

export interface SelectedObject {
  id: string
  label: string
  distance: number
}

export interface UserCoords {
  lat: number
  lng: number
}