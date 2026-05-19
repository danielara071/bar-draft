import { PrimaryButton, SecondaryButton } from "@/shared/components/Buttons";

interface ArticleCounterProps {
  count: number;
  onSave: () => void;
  onClear: () => void;
  saving: boolean;
}

export default function ArticleCounter({ count, onSave, onClear, saving }: ArticleCounterProps) {
  return (
    <div className="w-full rounded-xl bg-brand-navy px-6 py-4 flex items-center justify-between">
      
      <div className="flex items-center gap-4">
        <p className="text-white font-semibold">
          Artículos Seleccionados: <span className="text-brand-yellow">{count} / 4</span>
        </p>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(n => (
            <div
              key={n}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                n <= count
                  ? 'bg-brand-yellow text-black'
                  : 'bg-white/20 text-white/40'
              }`}
            >
              {n}
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <PrimaryButton onClick={onClear} size="sm" disabled={count === 0}>
          Limpiar
        </PrimaryButton>
        <SecondaryButton onClick={onSave} size="sm" disabled={count < 4}>
          {saving ? 'Guardando...' : 'Guardar Selección'}
        </SecondaryButton>
      </div>

    </div>
  );
}