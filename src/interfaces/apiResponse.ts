export interface ApiResponse {
  results: number
  paging: Paging
  response: any[]
}

export interface Paging {
  current: number
  total: number
}