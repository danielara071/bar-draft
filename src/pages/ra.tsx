import ARHub from '../features/realidadaumentada/page/ARHubPage'
import useSession from '../shared/hooks/useSession'

const RA = () => {
  const session = useSession()
  const userId = session?.user?.id

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#0A1535] px-6 py-16 font-serif text-white">
        <p className="font-sans text-base text-white/80">
          Inicia sesión para acceder a Mundo Culé.
        </p>
      </div>
    )
  }

  return <ARHub userId={userId} />
}

export default RA
