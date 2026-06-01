import React from "react";
import type { ReportStats } from "../interfaces/errorReports";

interface ReportStatsBarProps {
  stats: ReportStats;
  onViewResolved: () => void;
}

export const ReportStatsBar: React.FC<ReportStatsBarProps> = ({ stats, onViewResolved }) => {
  return (
    <div className="stats-bar">
      {/* Total */}
      <div className="stat-card stat-card--total">
        <div className="stat-icon stat-icon--warning">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <p className="stat-number">{stats.total.toLocaleString()}</p>
        <p className="stat-label stat-label--warning">Reportes totales</p>
      </div>

      {/* Resolved — clickable */}
      <button className="stat-card stat-card--resolved" onClick={onViewResolved}>
        <div className="stat-header">
          <div className="stat-icon stat-icon--success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <polyline points="22 4 12 14.01 9 11.01" />
            </svg>
          </div>
          <span className="stat-sub-label">REPORTES<br />RESUELTOS</span>
        </div>
        <p className="stat-number stat-number--sm">{stats.resolved}</p>
        <span className="stat-arrow">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>
      </button>

      {/* Pending */}
      <div className="stat-card stat-card--pending">
        <div className="stat-header">
          <div className="stat-icon stat-icon--danger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="stat-sub-label">REPORTES<br />PENDIENTES</span>
        </div>
        <p className="stat-number stat-number--sm">{stats.pending}</p>
      </div>
    </div>
  );
};