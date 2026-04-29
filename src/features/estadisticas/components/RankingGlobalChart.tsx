import type { RankingItem } from "../types";

const MALE_BG = "#0A1D3A";
const FEMALE_BG = "#9B2743";

function RankingGlobalChart({
  leftTitle,
  rightTitle,
  leftItems,
  rightItems,
  formatValue,
}: {
  leftTitle: string;
  rightTitle: string;
  leftItems: RankingItem[];
  rightItems: RankingItem[];
  formatValue?: (value: number) => string;
}) {
  const left = leftItems.slice(0, 5);
  const right = rightItems.slice(0, 5);
  const leftMaxValue = Math.max(1, ...left.map((i) => i.value));
  const rightMaxValue = Math.max(1, ...right.map((i) => i.value));

  return (
    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 md:p-6 shadow-sm">
      <h4 className="text-lg font-bold text-slate-900 mb-4">Cuadro de Honor</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <p className="font-semibold text-slate-800 mb-3">{leftTitle}</p>
          <div className="space-y-3">
            {left.map((item, idx) => (
              <div key={item.id}>
                <div className="flex justify-between text-ls text-slate-700 mb-1">
                  <span className="truncate pr-2">
                    {idx + 1}. {item.nombre}
                  </span>
                  <span className="font-semibold">
                    {formatValue ? formatValue(item.value) : item.value}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(
                        8,
                        Math.round((item.value / leftMaxValue) * 100)
                      )}%`,
                      backgroundColor: MALE_BG,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold text-slate-800 mb-3">{rightTitle}</p>
          <div className="space-y-3">
            {right.map((item, idx) => (
              <div key={item.id}>
                <div className="flex justify-between text-ls text-slate-700 mb-1">
                  <span className="truncate pr-2">
                    {idx + 1}. {item.nombre}
                  </span>
                  <span className="font-semibold">
                    {formatValue ? formatValue(item.value) : item.value}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${Math.max(
                        8,
                        Math.round((item.value / rightMaxValue) * 100)
                      )}%`,
                      backgroundColor: FEMALE_BG,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RankingGlobalChart;
