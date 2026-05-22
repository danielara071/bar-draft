export default function TrophyCupIcon({ size = 80, gold = true }: { size?: number; gold?: boolean }) {
  const color = gold ? '#EDBB00' : 'rgba(255,255,255,0.3)'

  return (
    <svg width={size} height={size} viewBox="0 0 80 100" fill="none">
      <path
        d="M20 8 H60 V40 C60 58 48 68 40 72 C32 68 20 58 20 40 Z"
        fill={color}
        opacity={gold ? 0.95 : 0.5}
      />
      <path d="M20 14 C8 14 8 36 20 36" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" opacity={gold ? 0.8 : 0.4} />
      <path d="M60 14 C72 14 72 36 60 36" stroke={color} strokeWidth="4" strokeLinecap="round" fill="none" opacity={gold ? 0.8 : 0.4} />
      {gold && (
        <path d="M30 16 C30 16 35 30 33 44" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" />
      )}
      <rect x="35" y="72" width="10" height="16" fill={color} opacity={gold ? 0.9 : 0.4} rx="2" />
      <rect x="24" y="88" width="32" height="6" fill={color} opacity={gold ? 0.95 : 0.5} rx="3" />
      {gold && (
        <rect x="24" y="88" width="32" height="2" fill="rgba(255,255,255,0.2)" rx="1" />
      )}
    </svg>
  )
}