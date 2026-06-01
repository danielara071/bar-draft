import React from "react";
import type { ErrorReport } from "../interfaces/errorReports";

function formatDate(isoDate: string): string {
  const d = new Date(isoDate);
  const days = ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"];
  const months = [
    "ene", "feb", "mar", "abr", "may", "jun",
    "jul", "ago", "sep", "oct", "nov", "dic",
  ];
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

// ──────────────────────────────────────────
//  Pending card (with "Marcar como resuelto")
// ──────────────────────────────────────────
interface PendingReportCardProps {
  report: ErrorReport;
  onResolve: (id: string) => void;
}

export const PendingReportCard: React.FC<PendingReportCardProps> = ({ report, onResolve }) => {
  const hasImage = Boolean(report.screenshot_url);

  return (
    <div className="report-card">
      <div className={`report-card__body ${hasImage ? "report-card__body--with-img" : ""}`}>
        <div className="report-card__content">
          <p className="report-card__date">{formatDate(report.created_at)}</p>
          <h3 className="report-card__title">
            Usuario<span className="text-muted">##</span> reporta:
          </h3>
          <p className="report-card__desc">{report.description}</p>
        </div>

        {hasImage && (
          <div className="report-card__screenshot">
            <img
              src={report.screenshot_url!}
              alt="Captura del error"
              className="report-card__img"
            />
          </div>
        )}
      </div>

      <div className="report-card__actions">
        <button
          className="btn-resolve"
          onClick={() => onResolve(report.id)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Marcar como resuelto
        </button>
      </div>
    </div>
  );
};

// ──────────────────────────────────────────
//  Resolved card (with "Regresar a pendientes")
// ──────────────────────────────────────────
interface ResolvedReportCardProps {
  report: ErrorReport;
  onMoveToPending: (id: string) => void;
}

export const ResolvedReportCard: React.FC<ResolvedReportCardProps> = ({ report, onMoveToPending }) => {
  const hasImage = Boolean(report.screenshot_url);

  return (
    <div className="report-card report-card--resolved">
      <div className={`report-card__body ${hasImage ? "report-card__body--with-img" : ""}`}>
        <div className="report-card__content">
          <p className="report-card__date">{formatDate(report.created_at)}</p>
          <h3 className="report-card__title">
            Usuario<span className="text-muted">##</span> reporta:
          </h3>
          <p className="report-card__desc">{report.description}</p>
        </div>

        {hasImage && (
          <div className="report-card__screenshot">
            <img
              src={report.screenshot_url!}
              alt="Captura del error"
              className="report-card__img"
            />
          </div>
        )}
      </div>

      <div className="report-card__actions report-card__actions--resolved">
        <button className="btn-resolved-tag" disabled>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Reporte resuelto
        </button>

        <button
          className="btn-back-pending"
          onClick={() => onMoveToPending(report.id)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Regresar a pendientes
        </button>
      </div>
    </div>
  );
};