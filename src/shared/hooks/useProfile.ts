// src/hooks/useProfile.ts
import { useEffect, useState } from 'react'
import { supabase } from '../services/supabaseClient'
import { useSession } from './useSession'

interface Profile {
  monedas: number
  puntos: number
  nivel: number
}

export function useProfile() {
  const session = useSession()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (!session?.user) return

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from('profiles')     
        .select('monedas, puntos, nivel')
        .eq('id', session.user.id)
        .single()

      if (!error) setProfile(data)
    }

    fetchProfile()
  }, [session])

  return profile
}