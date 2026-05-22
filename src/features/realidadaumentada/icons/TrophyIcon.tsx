export default function TrophyIcon({ size = 24, color = '#A50044' }: { size?: number; color?: string }) {
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