interface UsedWordCardProps {
    word: string
    date: string
    players: number
    won: number
    success: number
}

export default function UsedWordCard( { word, date, players, won, success } : UsedWordCardProps) {
  return (
      <div className="w-full rounded-xl border border-brand-navy px-6 py-4 flex flex-col items-start">
            <p className="text-brand-gray-mid text-lg font-bold tracking-[0.5em] uppercase">
              {word}
            </p>
            <p className="text-brand-gray-mid text-xs capitalize">{date}</p>
            <hr className="border-brand-gray-light border border-t w-full my-3" />
            <div className="grid grid-cols-3 gap-3">
                    <div className="px-4 flex flex-col items-center justify-center gap-1">
                      <p className="text-brand-gray text-sm font-bold">{players}</p>
                      <p className="text-brand-gray-mid text-[10px]">Jugadores</p>
                    </div>
            
                    <div className="px-4 flex flex-col items-center justify-center gap-1">
                      <p className="text-green-600 text-sm font-bold">{won}</p>
                      <p className="text-brand-gray-mid text-[10px]">Acertaron</p>
                    </div>
            
                    <div className="px-4 flex flex-col items-center justify-center gap-1">
                      <p className="text-brand-yellow text-sm font-bold">{success}%</p>
                      <p className="text-brand-gray-mid text-[10px]">Éxito</p>
                    </div>
            </div>
    </div>
  );
}