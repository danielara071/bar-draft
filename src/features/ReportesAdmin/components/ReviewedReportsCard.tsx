import { CircleCheckBig } from "lucide-react";

type ReviewedReport = {
  id: string;
  summary: string;
  date: string;
};

const reviewedReports: ReviewedReport[] = [
  {
    id: "rev-001",
    summary: "Juan Perez en 'Barcelona vs Valencia'",
    date: "08/5/2026",
  },
  {
    id: "rev-002",
    summary: "Maria Garcia en 'Barcelona vs Sevilla'",
    date: "07/5/2026",
  },
];

const ReviewedReportsSection = () => {
  return (
    <section className="mt-8">
      <h2 className="text-brand-navy text-lg font-bold mb-4">
        Reportes Revisados Recientemente
      </h2>

      <div className="space-y-3">
        {reviewedReports.map((report) => (
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
    </section>
  );
};

export default ReviewedReportsSection;
