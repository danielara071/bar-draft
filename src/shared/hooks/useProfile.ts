// src/hooks/useProfile.ts
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../services/supabaseClient'
import  useSession  from './useSession'

interface Profile {
  nombre: string
  monedas: number
  puntos: number
  nivel: number
  logros: number
  predicciones: number
}

export function useProfile() {
  const session = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (!session?.user) return

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')     
        .select('monedas, puntos, nivel, nombre, logros, predicciones')
        .eq('id', session.user.id)
        .single()

      if (!error) setProfile(data)
    }

    void fetchProfile()

    }, [session])

  return profile
}

export function useProfileWithRefetch() {
  const session = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)

  const fetchProfile = useCallback(async () => {
    if (!session?.user) return

    const { data, error } = await supabase
      .from('profiles')     
      .select('monedas, puntos, nivel, nombre, logros, predicciones')
      .eq('id', session.user.id)
      .single()

    if (!error) setProfile(data)
  }, [session?.user])

  useEffect(() => {
    void fetchProfile()
  }, [fetchProfile])

  return { profile, refetch: fetchProfile }
}