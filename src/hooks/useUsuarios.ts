import { useEffect, useState } from 'react'

interface Usuario {
  id: number
  [key: string]: any
}

interface UseUsuariosResult {
  usuarios: Usuario[]
  loading: boolean
  error: string | null
}

// Al montar el componente pide la lista de usuarios al backend (GET /api/usuarios) y la guarda en estado
export const useUsuarios = (): UseUsuariosResult => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/usuarios') // datos directos de la BD, sin pasar por el modelo
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`)
        }
        const data = await response.json()
        setUsuarios(data.usuarios ?? [])
      } catch (err: any) {
        setError(err.message ?? String(err))
      } finally {
        setLoading(false)
      }
    }

    fetchUsuarios()
  }, [])

  return { usuarios, loading, error }
}

