import LockIcon from '../icons/LockIcon'
import type { TrophyWithCapture } from '../interfaces/ar.types'

interface TrophyDisplayProps {
  trophy: TrophyWithCapture
  isActive: boolean
}

export default function TrophyDisplay({ trophy, isActive }: TrophyDisplayProps) {
  const captured  = trophy.captured
  const imageUrl  = trophy.trofeo_url

  const size = isActive ? 140 : 100

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="relative transition-all duration-500"
        style={{
          width:     size,
          height:    size,
          animation: isActive && captured ? 'float 3s ease-in-out infinite' : 'none',
        }}
      >
        <style>{`
          @keyframes float {
            0%, 100% { transform: translateY(0px);   }
            50%       { transform: translateY(-12px); }
          }
        `}</style>

        {/* Aura dorada — solo si capturado y activo */}
        {captured && isActive && (
          <div
            className="absolute inset-0 rounded-full"
            style={{
              boxShadow:  '0 0 32px 12px rgba(237,187,0,0.55)',
              borderRadius: '50%',
              top: '10%', left: '10%',
              width: '80%', height: '80%',
            }}
          />
        )}

        {/* Imagen PNG del tipo */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={trophy.nombre}
            style={{
              width:     '100%',
              height:    '100%',
              objectFit: 'contain',
              filter:    captured
                ? 'none'
                : 'grayscale(100%) brightness(0.5)',
              transition: 'filter 0.4s ease',
              position:   'relative',
              zIndex:     1,
            }}
          />
        ) : (
          // Fallback SVG copa si no hay imagen
          <FallbackCup size={size} captured={captured} />
        )}

        {/* Candado si no capturado y es el activo */}
        {!captured && isActive && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ zIndex: 2 }}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm">
              <LockIcon size={20} />
            </div>
          </div>
        )}
      </div>

      {/* Sombra suelo */}
      <div
        className="rounded-full blur-sm transition-all duration-500"
        style={{
          width:      isActive ? 80 : 55,
          height:     isActive ? 12 : 8,
          background: captured ? 'rgba(237,187,0,0.25)' : 'rgba(0,0,0,0.1)',
        }}
      />
    </div>
  )
}

function FallbackCup({ size, captured }: { size: number; captured: boolean }) {
  const color = captured ? '#EDBB00' : 'rgba(255,255,255,0.3)'
  return (
    <svg width={size} height={size} viewBox="0 0 80 100" fill="none">
      <path
        d="M20 8 H60 V40 C60 58 48 68 40 72 C32 68 20 58 20 40 Z"
        fill={color} opacity={captured ? 0.95 : 0.5}
      />
      <path d="M20 14 C8 14 8 36 20 36" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" opacity={captured ? 0.8 : 0.4} />
      <path d="M60 14 C72 14 72 36 60 36" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" opacity={captured ? 0.8 : 0.4} />
      <rect x="35" y="72" width="10" height="16" fill={color} opacity={captured ? 0.9 : 0.4} rx="2" />
      <rect x="24" y="88" width="32" height="6"  fill={color} opacity={captured ? 0.95 : 0.5} rx="3" />
    </svg>
  )
}