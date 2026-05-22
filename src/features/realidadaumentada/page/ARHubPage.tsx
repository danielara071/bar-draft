import { useState } from 'react'
import ARScene from '../components/ARScene'
import HeroSection from '../components/HeroSection'
import ColeccionHeader from '../components/ColectionHeader'
import Armario from '../components/Armario'
import { useColeccion } from '../hooks/useColection'

interface ARHubProps {
  userId: string
}

export default function ARHub({ userId }: ARHubProps) {
  const [arActive, setArActive] = useState(false)
  const { allTrophies, collected, totalTrophies, progressPct, loading } = useColeccion(userId)

  if (arActive) return <ARScene userId={userId} onBack={() => setArActive(false)} />

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#002244] font-serif text-white">

      <HeroSection onActivate={() => setArActive(true)} />

      <section className="rounded-t-3xl bg-white pb-24">
        <div className="mx-auto max-w-275 px-6 pt-10 md:px-12">
          <ColeccionHeader
            collected={collected.length}
            total={totalTrophies}
            progressPct={progressPct}
            loading={loading}
          />
          <Armario trophies={allTrophies} loading={loading} />
        </div>
      </section>

    </div>
  )
}