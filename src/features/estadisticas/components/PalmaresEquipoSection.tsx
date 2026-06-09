import { formatNumber } from "@/lib/utils";
import type { PalmaresEquipo, PalmaresTitulo } from "../types";

const AMBITO_ORDER = ["Internacional", "Nacional", "Regional"] as const;

const AMBITO_META: Record<string, { label: string }> = {
  Internacional: { label: "Internacional" },
  Nacional: { label: "Nacional" },
  Regional: { label: "Regional" },
};

function TrophyIcon({ color }: { color: string }) {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden="true"
    >
      <path d="M18 2H6v2H4v4c0 2.21 1.79 4 4 4h.08A5.01 5.01 0 0 0 12 15a5.01 5.01 0 0 0 3.92-3H16c2.21 0 4-1.79 4-4V4h-2V2zm-2 8H8V4h8v6zm-4 5a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3zm4 5H8v-2h8v2zm2 2H6v-2h12v2z" />
    </svg>
  );
}

function TeamColumn({
  teamName,
  foundedYear,
  titulos,
  accentColor,
  headerGradient,
}: {
  teamName: string;
  foundedYear: number;
  titulos: PalmaresTitulo[];
  accentColor: string;
  headerGradient: string;
}) {
  const total = titulos.reduce((sum, t) => sum + t.cantidad, 0);

  const grouped = AMBITO_ORDER.reduce<Record<string, PalmaresTitulo[]>>(
    (acc, ambito) => {
      const items = titulos
        .filter((t) => t.ambito === ambito && t.cantidad > 0)
        .sort((a, b) => b.cantidad - a.cantidad);
      if (items.length > 0) acc[ambito] = items;
      return acc;
    },
    {}
  );

  const hasData = Object.keys(grouped).length > 0;

  return (
    <div className="rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col">
      {/* Header */}
      <div
        className="px-6 py-5 flex items-center justify-between"
        style={{ background: headerGradient }}
      >
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
            Desde {foundedYear}
          </p>
          <h3 className="text-2xl font-extrabold text-white leading-tight mt-0.5">
            {teamName}
          </h3>
        </div>
        <div className="text-right">
          <p
            className="text-4xl font-extrabold leading-none"
            style={{ color: "#D4A017" }}
          >
            {formatNumber(total)}
          </p>
          <p className="text-[11px] text-white/60 mt-1 uppercase tracking-wide">
            títulos totales
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white flex-1">
        {hasData ? (
          <div className="divide-y divide-gray-100">
            {Object.entries(grouped).map(([ambito, items]) => {
              const meta = AMBITO_META[ambito];
              return (
                <div key={ambito} className="px-6 py-5">
                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className="text-xs font-bold uppercase tracking-widest"
                      style={{ color: accentColor }}
                    >
                      {meta.label}
                    </span>
                    <div
                      className="flex-1 h-px ml-1"
                      style={{ backgroundColor: accentColor, opacity: 0.15 }}
                    />
                  </div>
                  <ul className="space-y-3">
                    {items.map((titulo) => (
                      <li
                        key={titulo.nombre_agrupado}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <TrophyIcon color={accentColor} />
                          <span className="text-base text-gray-800 font-medium truncate">
                            {titulo.nombre_agrupado}
                          </span>
                        </div>
                        <span
                          className="flex-shrink-0 text-sm font-bold px-3 py-0.5 rounded-full text-white"
                          style={{ backgroundColor: accentColor }}
                        >
                          x{formatNumber(titulo.cantidad)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="px-6 py-10 text-center text-gray-400 text-base">
            Sin títulos registrados
          </div>
        )}
      </div>
    </div>
  );
}

export default function PalmaresEquipoSection({
  data,
}: {
  data: PalmaresEquipo;
}) {
  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
      <TeamColumn
        teamName="Varonil"
        foundedYear={1899}
        titulos={data.varonil}
        accentColor="#0A1D3A"
        headerGradient="linear-gradient(135deg, #0A1D3A 0%, #1a3a6b 100%)"
      />
      <TeamColumn
        teamName="Femenil"
        foundedYear={1970}
        titulos={data.femenil}
        accentColor="#9B2743"
        headerGradient="linear-gradient(135deg, #9B2743 0%, #c4355a 100%)"
      />
    </div>
  );
}
