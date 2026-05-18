import { useEffect, useState } from "react";
import useSession from "../../WatchParty/Hooks/SessionLogic";
import type { PendingReportCardData, ReportMetrics, ReviewedReportCardData } from "../types/reportTypes";
import {
  banUserAndResolveReport,
  fetchPendingReports,
  fetchPreviousReportsCount,
  fetchReportMetrics,
  fetchReviewedReports,
  updateReportStatus,
} from "../services/reportService";
import { buildReviewedSummary, formatReportDate, formatWatchPartyLabel, getInitials } from "../utils/reportUtils";
const EMPTY_METRICS: ReportMetrics = { pending: 0, reviewed: 0, banned: 0, total: 0 };

export function useReports() {
  const session = useSession();
  const resolvedBy = session?.user?.id ?? null;

  const [metrics, setMetrics] = useState<ReportMetrics>(EMPTY_METRICS);
  const [pendingReports, setPendingReports] = useState<PendingReportCardData[]>([]);
  const [reviewedReports, setReviewedReports] = useState<ReviewedReportCardData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<Record<number, boolean>>({});
  const loadReports = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [pendingRows, reviewedRows, metricsData] = await Promise.all([
        fetchPendingReports(),
        fetchReviewedReports(5),
        fetchReportMetrics(),
      ]);
      const pendingCards = await Promise.all(
        pendingRows.map(async (row) => {
          const reporterName = row.denunciante?.nombre?.trim() || "Usuario";
          const reportedName = row.denunciado?.nombre?.trim() || "Usuario";
          const reporterId = row.denunciante?.id ?? row.denunciante_id;
          const reportedId = row.denunciado?.id ?? row.denunciado_id;
          const previousReports = await fetchPreviousReportsCount(reportedId, row.id);
          return {
            id: row.id,
            category: row.motivo,
            timestamp: formatReportDate(row.creado_en),
            matchLabel: formatWatchPartyLabel(row.watch_party),
            reporter: {
              id: reporterId,
              name: reporterName,
              initials: getInitials(reporterName),
              avatarUrl: row.denunciante?.url_avatar ?? null,
            },
            reported: {
              id: reportedId,
              name: reportedName,
              initials: getInitials(reportedName),
              avatarUrl: row.denunciado?.url_avatar ?? null,
              previousReports,
            },
          } as PendingReportCardData;
        })
      );
      const reviewedCards = reviewedRows.map((row) => {
        const reportedName = row.denunciado?.nombre?.trim() || "Usuario";
        const matchLabel = formatWatchPartyLabel(row.watch_party);
        return {
          id: row.id,
          summary: buildReviewedSummary(reportedName, matchLabel),
          date: formatReportDate(row.resuelto_en || row.creado_en),
          status: row.estado === "resuelto" ? "resuelto" : "descartado",
        } as ReviewedReportCardData;
      });
      setPendingReports(pendingCards);
      setReviewedReports(reviewedCards);
      setMetrics(metricsData);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error cargando reportes";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void Promise.resolve().then(loadReports);
  }, []);
  const runAction = async (reportId: number, action: () => Promise<void>) => {
    setActionLoading((prev) => ({ ...prev, [reportId]: true }));
    setError(null);
    try {
      await action();
      await loadReports();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error actualizando reporte";
      setError(message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [reportId]: false }));
    }
  };

  const banReport = (reportId: number, reportedUserId: string) =>
    runAction(reportId, () => banUserAndResolveReport(reportId, reportedUserId, resolvedBy));
  const dismissReport = (reportId: number) =>
    runAction(reportId, () => updateReportStatus(reportId, "descartado", resolvedBy));

  return {
    metrics,
    pendingReports,
    reviewedReports,
    isLoading,
    error,
    actionLoading,
    banReport,
    dismissReport,
    refetch: loadReports,
  };
}
