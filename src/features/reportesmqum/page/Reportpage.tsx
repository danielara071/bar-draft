import React from "react";
import { useErrorReports } from "../hooks/useErrorReport";
import { ReportFiltersBar } from "../components/Reportfilterbar";
import { ReportStatsBar } from "../components/Reportstatsbar";
import { PendingReportList, ResolvedReportList } from "../components/ReportList";
import "./ReportesPage.css";

export const ReportesPage: React.FC = () => {
  const {
    view,
    setView,
    stats,
    loading,
    pendingReports,
    resolvedReports,
    markAsResolved,
    markAsPending,
    handleSearch,
  } = useErrorReports();

  return (
    <main className="reportes-page">
      {/* ── Page title ── */}
      <h1 className="page-title">
        Reportes <span className="page-title--accent">de la</span>{" "}
        <span className="page-title--highlight">página</span>
      </h1>

      {/* ── Filters ── */}
      <section className="section-card">
        <ReportFiltersBar onSearch={handleSearch} />
      </section>

      {/* ── Stats + report list ── */}
      <section className="section-card section-card--reports">
        {view === "pending" ? (
          <>
            <h2 className="section-title">Reportes de usuario</h2>
            <ReportStatsBar stats={stats} onViewResolved={() => setView("resolved")} />
            <PendingReportList
              reports={pendingReports}
              onResolve={markAsResolved}
            />
          </>
        ) : (
          <>
            <h2 className="section-title">
              Reportes <span className="section-title--resolved">RESUELTOS</span>
            </h2>
            <ResolvedReportList
              reports={resolvedReports}
              onMoveToPending={markAsPending}
              onBack={() => setView("pending")}
            />
          </>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner" />
          </div>
        )}
      </section>
    </main>
  );
};