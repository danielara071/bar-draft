import { useState } from 'react'
import type { CollectionItem } from '../interfaces/ar.types'
import ARScene from '../components/ARScene'

// ── Mock data — reemplazar con API real ──────────────────────────
const MOCK_COLLECTION: CollectionItem[] = [
  { id: 'c1', label: 'Balón de Oro 2023', collected: true,  region: 'Europa'  },
  { id: 'c2', label: 'Copa del Rey',       collected: true,  region: 'Europa'  },
  { id: 'c3', label: 'Champions League',   collected: false, region: 'Europa'  },
  { id: 'c4', label: 'LaLiga 2024',        collected: true,  region: 'Europa'  },
  { id: 'c5', label: 'Supercopa',          collected: false, region: 'América' },
  { id: 'c6', label: 'Trofeo Joan Gamper', collected: false, region: 'Asia'    },
]

const TOTAL_ITEMS   = 63
const COLLECTED_N   = MOCK_COLLECTION.filter((i) => i.collected).length
const PROGRESS_PCT  = Math.round((COLLECTED_N / TOTAL_ITEMS) * 100)

//* ARHub — página principal de la experiencia "Mundo Culé".
//* Al pulsar "Activar Cámara" monta ARScene directamente (sin pantalla intermedia).
//* ARScene recibe onBack para regresar aquí y apagar la cámara.
interface ARHubProps {
  userId: string
}

export default function ARHub({ userId }: ARHubProps) {
  const [arActive, setArActive] = useState(false)

  if (arActive) return <ARScene userId={userId} onBack={() => setArActive(false)} />

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#0A1535] font-serif text-white">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="mx-auto flex max-w-275 flex-col items-center gap-12 px-6 py-16 md:flex-row md:px-12">

        {/* Texto */}
        <div className="flex-1">
          <h1 className="mb-5 text-6xl font-black leading-none tracking-tight">
            <span className="text-white">Mundo</span>
            <br />
            <span className="text-[#EDBB00]">Culé</span>
          </h1>
          <p className="mb-9 max-w-85 font-sans text-[15px] leading-relaxed text-white/65">
            Activa tu cámara y colecciona trofeos virtuales del Barça
            en el mundo real.
          </p>
          <button
            onClick={() => setArActive(true)}
            className="rounded-lg bg-[#A50044] px-9 py-3.5 font-sans text-sm font-bold tracking-wide text-white transition-opacity hover:opacity-90 active:opacity-75"
          >
            Activar Cámara
          </button>
          <p className="mt-3 font-sans text-[11px] text-white/35">
            Se recomienda acceder desde el teléfono móvil
          </p>
        </div>

        {/* Preview AR */}
        <div className="flex flex-1 justify-center">
          <div className="relative aspect-4/3 w-full max-w-110 overflow-hidden rounded-xl border border-white/8 bg-linear-to-br from-[#1a2a50] to-[#0d1a35]">
            {/* Grid decorativo */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
            {/* Marker flotante */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex animate-bounce flex-col items-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EDBB00] shadow-[0_0_24px_rgba(237,187,0,0.5)]">
                  <TrophyIcon size={24} color="#A50044" />
                </div>
                <div className="h-0 w-0 border-x-8 border-t-10 border-x-transparent border-t-[#EDBB00]" />
              </div>
            </div>
            <span className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-sans text-[11px] uppercase tracking-[1.5px] text-white/35">
              Modo AR activo
            </span>
          </div>
        </div>
      </section>

      {/* ── COLECCIÓN ─────────────────────────────────────────── */}
      <section className="rounded-t-3xl bg-white pb-20">
        <div className="mx-auto max-w-275 px-6 md:px-12">

          {/* Header con progreso */}
          <div className="-mt-px mb-8 flex flex-col items-start gap-6 rounded-xl bg-[#A50044] px-7 py-5 sm:flex-row sm:items-center">
            <span className="whitespace-nowrap font-sans text-[11px] font-extrabold uppercase tracking-[2px] text-white/70">
              Tu Colección
            </span>
            <div className="flex-1 w-full">
              <div className="mb-2 flex items-baseline gap-3">
                <span className="font-sans text-[13px] font-medium text-white">Tu Progreso</span>
                <span className="ml-auto font-sans text-xs text-white/60">
                  {COLLECTED_N}/{TOTAL_ITEMS} Items
                </span>
                <span className="font-serif text-3xl font-black leading-none text-white">
                  {PROGRESS_PCT}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-[#EDBB00] transition-all duration-700"
                  style={{ width: `${PROGRESS_PCT}%` }}
                />
              </div>
            </div>
          </div>

          {/* Grid de items */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {MOCK_COLLECTION.map((item) => (
              <div
                key={item.id}
                className={`relative flex flex-col items-center gap-2 rounded-xl px-4 py-5 transition-transform hover:-translate-y-0.5 ${
                  item.collected
                    ? 'border border-[#A50044]/30 bg-[#0A1535]'
                    : 'border border-white/5 bg-[#1a2540]'
                }`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                  <TrophyIcon
                    size={28}
                    color={item.collected ? '#A50044' : 'rgba(255,255,255,0.2)'}
                  />
                </div>
                <span className="text-center font-sans text-xs font-bold leading-tight text-white">
                  {item.label}
                </span>
                <span className="font-sans text-[10px] uppercase tracking-[1px] text-white/35">
                  {item.region}
                </span>
                {item.collected && (
                  <div className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-[#EDBB00]" />
                )}
              </div>
            ))}

            {/* Cards bloqueadas de relleno */}
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`lock-${i}`}
                className="flex flex-col items-center gap-2 rounded-xl border border-white/5 bg-[#1a2540] px-4 py-5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5">
                  <LockIcon />
                </div>
                <span className="font-sans text-xs font-bold text-white">???</span>
                <span className="font-sans text-[10px] uppercase tracking-[1px] text-white/35">
                  Por descubrir
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

// ── Iconos SVG inline ─────────────────────────────────────────────
function TrophyIcon({ size = 24, color = '#A50044' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M6 2h12v6a6 6 0 01-12 0V2zM4 2h2M18 2h2M4 4H2v2a4 4 0 004 4M20 4h2v2a4 4 0 01-4 4M12 14v4M8 22h8M9 18h6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="rgba(255,255,255,0.15)" strokeWidth={1.8} />
      <path d="M8 11V7a4 4 0 018 0v4" stroke="rgba(255,255,255,0.15)" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  )
}