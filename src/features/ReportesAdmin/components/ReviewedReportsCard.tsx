import { CircleCheckBig } from "lucide-react";
import type { ReviewedReportCardData } from "../types/reportTypes";

interface ReviewedReportsCardProps {
  reports: ReviewedReportCardData[];
  isLoading?: boolean;
  error?: string | null;
}

const ReviewedReportsCard = ({
  reports,
  isLoading = false,
  error,
}: ReviewedReportsCardProps) => {
  if (isLoading) {
    return (
      <p className="text-sm text-brand-gray-mid">Cargando reportes revisados...</p>
    );
  }

  if (error && reports.length === 0) {
    return <p className="text-sm text-brand-crimson">{error}</p>;
  }

  if (reports.length === 0) {
    return (
      <p className="text-sm text-brand-gray-mid">No hay reportes revisados.</p>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => (
        <div
          key={report.id}
          className="bg-brand-white border border-brand-gray-light rounded-2xl px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-emerald-50 flex items-center justify-center">
              <CircleCheckBig className="text-emerald-600" size={16} />
            </div>
            <div>
              <p className="text-sm font-semibold text-brand-navy">
                {report.summary}
              </p>
              <p className="text-xs text-brand-gray-mid">{report.date}</p>
            </div>
          </div>
          <span className="self-start sm:self-auto rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold px-3 py-1">
            Revisado
          </span>
        </div>
      ))}
    </div>
  );
};

export default ReviewedReportsCard;
