import React from "react";
import type { ErrorReport } from "../interfaces/errorReports";
import { PendingReportCard, ResolvedReportCard } from "./Reportcard";

// ──────────────────────────────────────────
//  Pending list
// ──────────────────────────────────────────
interface PendingReportListProps {
  reports: ErrorReport[];
  onResolve: (id: string) => void;
}

export const PendingReportList: React.FC<PendingReportListProps> = ({ reports, onResolve }) => {
  if (reports.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 px-6 text-gray-400 text-base">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <p>¡Sin reportes pendientes!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {reports.map((r) => (
        <PendingReportCard key={r.id} report={r} onResolve={onResolve} />
      ))}
    </div>
  );
};

// ──────────────────────────────────────────
//  Resolved list
// ──────────────────────────────────────────
interface ResolvedReportListProps {
  reports: ErrorReport[];
  onMoveToPending: (id: string) => void;
  onBack: () => void;
}

export const ResolvedReportList: React.FC<ResolvedReportListProps> = ({
  reports,
  onMoveToPending,
  onBack,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Back button */}
      <div className="mb-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 bg-(--navy) text-white border-none rounded-full py-3 px-6 font-['DM_Sans'] text-[0.9rem] font-semibold cursor-pointer transition-colors hover:bg-(--navy-light)"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Volver
        </button>
      </div>

      {reports.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 px-6 text-gray-400 text-base">
          <p>No hay reportes resueltos aún.</p>
        </div>
      ) : (
        reports.map((r) => (
          <ResolvedReportCard key={r.id} report={r} onMoveToPending={onMoveToPending} />
        ))
      )}
    </div>
  );
};