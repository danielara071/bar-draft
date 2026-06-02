import React, { useState } from "react";
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
//  Lightbox
// ──────────────────────────────────────────
interface LightboxProps {
  src: string;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ src, onClose }) => {
  // Close on backdrop click, not on image click
  const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Close on Escape key
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150"
    >
      <div className="relative max-w-4xl w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white/70 hover:text-white transition-colors flex items-center gap-1.5 text-sm font-['DM_Sans']"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
          Cerrar
        </button>

        {/* Image */}
        <img
          src={src}
          alt="Captura del error"
          className="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
        />
      </div>
    </div>
  );
};

// ──────────────────────────────────────────
//  Pending card
// ──────────────────────────────────────────
interface PendingReportCardProps {
  report: ErrorReport;
  onResolve: (id: string) => void;
}

export const PendingReportCard: React.FC<PendingReportCardProps> = ({ report, onResolve }) => {
  const hasImage = Boolean(report.screenshot_url);
  const userName = report.userName || "Anónimo";
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className="border border-gray-200 rounded-(--radius) px-7 py-6 pb-5 bg-white shadow-sm transition-shadow hover:shadow-md">

        {/* Body */}
        <div className={`flex gap-6 ${hasImage ? "flex-row" : "flex-col"}`}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[0.78rem] text-gray-400 lowercase">
                {formatDate(report.created_at)}
              </p>
              <span className="text-gray-300 text-[0.78rem]">·</span>
              <p className="text-[0.78rem] text-gray-400">
                {report.location}
              </p>
            </div>
            <h3 className="font-['Barlow_Condensed'] text-2xl font-bold text-brand-navy mb-2.5">
              {userName}
              <span className="text-brand-navy"> reporta:</span>
            </h3>
            <p className="text-[0.9rem] text-gray-600 leading-relaxed">
              {report.description}
            </p>
          </div>

          {hasImage && (
            <div
              onClick={() => setLightboxOpen(true)}
              className="flex-[0_0_280px] rounded-sm overflow-hidden border border-gray-200 cursor-zoom-in group relative"
            >
              <img
                src={report.screenshot_url!}
                alt="Captura del error"
                className="w-full h-40 object-cover block transition-transform duration-200 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                <svg
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg"
                  width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-center">
          <button
            onClick={() => onResolve(report.id)}
            className="flex items-center gap-2.5 bg-brand-navy text-white border-none rounded-full py-3.5 px-9 font-['DM_Sans'] text-[0.95rem] font-semibold cursor-pointer transition-all hover:bg-(--navy-light) hover:-translate-y-px active:translate-y-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Marcar como resuelto
          </button>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox src={report.screenshot_url!} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
};

// ──────────────────────────────────────────
//  Resolved card
// ──────────────────────────────────────────
interface ResolvedReportCardProps {
  report: ErrorReport;
  onMoveToPending: (id: string) => void;
}

export const ResolvedReportCard: React.FC<ResolvedReportCardProps> = ({ report, onMoveToPending }) => {
  const hasImage = Boolean(report.screenshot_url);
  const userName = report.userName || "Anónimo";
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className="border border-gray-200 rounded-(--radius) px-7 py-6 pb-5 bg-white shadow-sm opacity-90 transition-shadow hover:shadow-md">

        {/* Body */}
        <div className={`flex gap-6 ${hasImage ? "flex-row" : "flex-col"}`}>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <p className="text-[0.78rem] text-gray-400 lowercase">
                {formatDate(report.created_at)}
              </p>
              <span className="text-gray-300 text-[0.78rem]">·</span>
              <p className="text-[0.78rem] text-gray-400">
                {report.location}
              </p>
            </div>
            <h3 className="font-['Barlow_Condensed'] text-2xl font-bold text-brand-navy mb-2.5">
              {userName}
              <span className="text-brand-navy"> reporta:</span>
            </h3>
            <p className="text-[0.9rem] text-gray-600 leading-relaxed">
              {report.description}
            </p>
          </div>

          {hasImage && (
            <div
              onClick={() => setLightboxOpen(true)}
              className="flex-[0_0_280px] rounded-sm overflow-hidden border border-gray-200 cursor-zoom-in group relative"
            >
              <img
                src={report.screenshot_url!}
                alt="Captura del error"
                className="w-full h-40 object-cover block transition-transform duration-200 group-hover:scale-105"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                <svg
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 drop-shadow-lg"
                  width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 flex justify-start gap-3">
          <button
            disabled
            className="flex items-center gap-2 bg-gray-100 text-gray-400 border border-gray-200 rounded-full py-3 px-6 font-['DM_Sans'] text-[0.88rem] font-medium cursor-not-allowed"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            Reporte resuelto
          </button>

          <button
            onClick={() => onMoveToPending(report.id)}
            className="flex items-center gap-2 bg-amber-400 text-brand-navy border-none rounded-full py-3 px-6 font-['DM_Sans'] text-[0.88rem] font-bold cursor-pointer transition-all hover:bg-[#e08e00] hover:-translate-y-px active:translate-y-0"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Regresar a pendientes
          </button>
        </div>
      </div>

      {lightboxOpen && (
        <Lightbox src={report.screenshot_url!} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  );
};