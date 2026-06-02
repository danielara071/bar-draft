import React, { useState } from "react";
import type { ReportFilters } from "../interfaces/errorReports";

interface ReportFiltersBarProps {
  onSearch: (filters: ReportFilters) => void;
  onClear: () => void;
  availableLocations: string[];
}

export const ReportFiltersBar: React.FC<ReportFiltersBarProps> = ({
  onSearch,
  onClear,
  availableLocations,
}) => {
  const [pantalla, setPantalla] = useState("");
  const [fecha, setFecha] = useState("");

  const handleSearch = () => onSearch({ pantalla, fecha });

  const handleClear = () => {
    setPantalla("");
    setFecha("");
    onClear();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  const inputBase =
    "w-full appearance-none bg-white/[0.08] border border-white/[0.18] rounded-full " +
    "py-3.5 pl-[22px] pr-12 text-white/70 font-['Barlow_Condensed'] text-[0.95rem] " +
    "font-semibold uppercase tracking-[1.5px] outline-none transition-all " +
    "focus:border-[var(--gold)] focus:bg-white/[0.12]";

  return (
    <div className="flex flex-col gap-4">
      <p className=" text-[1.1rem] font-semibold text-white m-0 tracking-[0.5px]">
        Filtros
      </p>

      <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center flex-wrap">

        {/* ── Select de pantallas ── */}
        <div className="font-sans relative flex-1 min-w-45">
          <select
            className={`${inputBase} cursor-pointer`}
            value={pantalla}
            onChange={(e) => setPantalla(e.target.value)}
          >
            <option value="" style={{ backgroundColor: "002244", color: "rgba(255,255,255,0.4)" }}>
              PANTALLA
            </option>
            {availableLocations.map((loc) => (
              <option
                key={loc}
                value={loc}
                style={{ backgroundColor: "002244", color: "white" }}
              >
                {loc}
              </option>
            ))}
          </select>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none flex items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </span>
        </div>

        {/* ── Input de fecha ── */}
        <div className="font-sans relative flex-1 min-w-45">
          <input
            className={`${inputBase} [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3.5 [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:w-6 [&::-webkit-calendar-picker-indicator]:h-6`}
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none flex items-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
        </div>

        {/* ── Buscar ── */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 bg-amber-400 text-(--navy) border-none rounded-full py-3.5 px-7  text-base font-bold tracking-[0.5px] cursor-pointer whitespace-nowrap transition-all hover:bg-[#e08e00] hover:-translate-y-px active:translate-y-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          Buscar
        </button>

        {/* ── Borrar campos ── */}
        <button
          onClick={handleClear}
          className="flex items-center justify-center gap-2 bg-brand-crimson text-white border border-white/25 rounded-full py-3.5 px-7  text-base font-bold tracking-[0.5px] cursor-pointer whitespace-nowrap transition-all hover:bg-white/13 hover:text-white/80 hover:-translate-y-px active:translate-y-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Borrar campos
        </button>
      </div>
    </div>
  );
};