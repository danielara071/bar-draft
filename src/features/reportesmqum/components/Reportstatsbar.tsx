import React from "react";
import type { ReportStats } from "../interfaces/errorReports";

interface ReportStatsBarProps {
  stats: ReportStats;
  onViewResolved: () => void;
}

export const ReportStatsBar: React.FC<ReportStatsBarProps> = ({ stats, onViewResolved }) => {
  return (
    <div className="flex gap-4 mb-6 flex-wrap">

      {/* ── Total ── */}
      <div className="basis-50 shrink-0 bg-brand-navy border-(--navy) rounded-(--radius) py-5 px-6 flex flex-col items-center gap-1.5 border">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EDBB00" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <p className=" text-[2.8rem] font-bold text-white mt-1 leading-none">
          {stats.total.toLocaleString()}
        </p>
        <p className=" text-[0.8rem] font-medium uppercase tracking-[0.5px] text-brand-yellow">
          Reportes totales
        </p>
      </div>

      {/* ── Resueltos (clickable) ── */}
      <button
        onClick={onViewResolved}
        className="flex-1 min-w-45 bg-white border border-gray-200 rounded-(--radius) py-5 px-6 flex flex-col gap-1.5 text-left relative cursor-pointer transition-all hover:border-emerald-500 hover:shadow-sm"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-emerald-500/12">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <span className="font-['DM_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.5px] text-gray-400 leading-tight">
            REPORTES<br />RESUELTOS
          </span>
        </div>
        <p className=" text-[3rem] font-bold text-brand-navy leading-none ml-1 ">
          {stats.resolved}
        </p>
        <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </button>

      {/* ── Pendientes ── */}
      <div className="flex-1 min-w-45 bg-white border border-gray-200 rounded-(--radius) py-5 px-6 flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center bg-red-500/12">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="font-['DM_Sans'] text-[0.7rem] font-semibold uppercase tracking-[0.5px] text-gray-400 leading-tight">
            REPORTES<br />PENDIENTES
          </span>
        </div>
        <p className=" text-[3rem] font-bold text-brand-navy leading-none ml-1 ">
          {stats.pending}
        </p>
      </div>

    </div>
  );
};