import React from "react";
import { useErrorReports } from "../../reportesmqum/hooks/useErrorReport";
import { ReportFiltersBar } from "../../reportesmqum/components/Reportfilterbar";
import { ReportStatsBar } from "../../reportesmqum/components/Reportstatsbar";
import { PendingReportList, ResolvedReportList } from "../../reportesmqum/components/ReportList";

export const ReportesPage: React.FC = () => {
  const {
    view,
    setView,
    stats,
    loading,
    availableLocations,
    pendingReports,
    resolvedReports,
    markAsResolved,
    markAsPending,
    handleSearch,
    clearFilters,
  } = useErrorReports();

  return (
    <main className="min-h-screen py-5 px-4 md:py-8 md:px-10 flex flex-col gap-6 bg-(--bg)">

      {/* ── Page title ── */}
      <h1 className="text-[2.4rem] font-bold text-(--navy) tracking-tight leading-none m-0">
        Reportes{" "}
        <span className="font-semibold text-(--navy)">de la</span>{" "}
        <span className="text-(--red)">página</span>
      </h1>

      {/* ── Filters ── */}
      <section className="bg-brand-navy rounded-(--radius) p-7 px-8">
        <ReportFiltersBar
          onSearch={handleSearch}
          onClear={clearFilters}
          availableLocations={availableLocations}
        />
      </section>

      {/* ── Stats + report list ── */}
      <section className="bg-white rounded-(--radius) p-7 px-8 relative overflow-hidden">
        {view === "pending" ? (
          <>
            <h2 className=" text-[1.4rem] font-semibold text-(--navy) mb-5 tracking-tight">
              Reportes de usuario
            </h2>
            <ReportStatsBar stats={stats} onViewResolved={() => setView("resolved")} />
            <PendingReportList reports={pendingReports} onResolve={markAsResolved} />
          </>
        ) : (
          <>
            <h2 className=" text-[1.4rem] font-semibold text-(--navy) mb-5 tracking-tight">
              Reportes{" "}
              <span className="text-brand-navy">RESUELTOS</span>
            </h2>
            <ResolvedReportList
              reports={resolvedReports}
              onMoveToPending={markAsPending}
              onBack={() => setView("pending")}
            />
          </>
        )}

        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-(--radius) z-10">
            <div className="w-9 h-9 border-[3px] border-gray-200 border-t-(--navy) rounded-full animate-spin" />
          </div>
        )}
      </section>
    </main>
  );
};