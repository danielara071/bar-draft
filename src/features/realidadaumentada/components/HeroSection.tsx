import TrophyIcon from '../icons/TrophyIcon'

interface HeroSectionProps {
  onActivate: () => void
}

export default function HeroSection({ onActivate }: HeroSectionProps) {
  return (
    <section className="mx-auto flex max-w-275 flex-col items-center gap-12 px-6 py-22 md:flex-row md:px-12">

      <div className="flex-1">
        <h1 className="mb-5 text-6xl font-sans leading-none tracking-tight">
          <span className="text-white">Mundo</span>
          <br />
          <span className="text-[#EDBB00]">Culé</span>
        </h1>
        <p className="mb-9 max-w-85 font-sans text-[15px] leading-relaxed text-white/65">
          Activa tu cámara y colecciona trofeos virtuales del Barça en el mundo real.
        </p>
        <button
          onClick={onActivate}
          className="rounded-lg bg-[#A50044] px-9 py-3.5 font-sans text-sm font-bold tracking-wide text-white transition-opacity hover:opacity-90 active:opacity-75"
        >
          Activar Cámara
        </button>
        <p className="mt-3 font-sans text-[11px] text-white/35">
          Se recomienda acceder desde el teléfono móvil
        </p>
      </div>

      <div className="flex flex-1 justify-center">
        <div className="relative aspect-4/3 w-full max-w-110 overflow-hidden rounded-xl border border-white/8 bg-linear-to-br from-[#1a2a50] to-[#002244]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: "url('https://images.vexels.com/media/users/3/157971/isolated/preview/393140c13ded6abdd322098d2d02a6d7-ilustracion-del-planeta-tierra.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex animate-bounce flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EDBB00] shadow-[0_0_24px_rgba(237,187,0,0.5)]">
                <TrophyIcon size={24} color="#A50044" />
              </div>
              <div className="h-0 w-0 border-x-8 border-t-10 border-x-transparent border-t-[#EDBB00]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}