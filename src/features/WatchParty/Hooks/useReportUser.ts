import { useState } from "react";
import { createWatchPartyReport } from "../Services/reportService";
import type { WatchPartyReportDraft } from "../Types/reportType";

export function useReportUser() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReport = async (draft: WatchPartyReportDraft) => {
    setIsSubmitting(true);
    setError(null);

    try {
      return await createWatchPartyReport(draft);
    } catch (err) {
      const message = err instanceof Error ? err.message : "No se pudo enviar el reporte.";
      setError(message);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearError = () => setError(null);

  return { submitReport, isSubmitting, error, clearError };
}