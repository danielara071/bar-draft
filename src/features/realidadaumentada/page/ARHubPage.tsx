import { useState, useRef } from 'react'
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
  const armarioRef = useRef<HTMLDivElement>(null)
  const { allTrophies, collected, totalTrophies, progressPct, loading } = useColeccion(userId)

  const scrollToArmario = () => {
    armarioRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleGoToArmario = () => {
    setArActive(false)
    // requestAnimationFrame garantiza que el hub ya está montado antes de hacer scroll
    requestAnimationFrame(scrollToArmario)
  }

  if (arActive) {
    return (
      <ARScene
        userId={userId}
        onBack={() => setArActive(false)}
        onGoToArmario={handleGoToArmario}
      />
    )
  }

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

          {/* ref para scroll programático + id para hash #armario */}
          <div ref={armarioRef} id="armario" className="scroll-mt-6">
            <Armario trophies={allTrophies} loading={loading} />
          </div>
        </div>
      </section>

    </div>
  )
}