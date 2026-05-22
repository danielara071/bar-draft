export default function LockIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect x="5" y="11" width="14" height="10" rx="2" stroke="rgba(10,21,53,0.15)" strokeWidth={1.8} />
      <path d="M8 11V7a4 4 0 018 0v4" stroke="rgba(10,21,53,0.15)" strokeWidth={1.8} strokeLinecap="round" />
    </svg>
  )
}