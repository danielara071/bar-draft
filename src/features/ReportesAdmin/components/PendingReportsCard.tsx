import { Ban, XCircle } from "lucide-react";

type PendingReport = {
  id: string;
  category: string;
  timestamp: string;
  matchLabel: string;
  reporter: {
    name: string;
    initials: string;
    id: string;
  };
  reported: {
    name: string;
    initials: string;
    id: string;
    previousReports: number;
  };
};

const pendingReports: PendingReport[] = [
  {
    id: "rep-001",
    category: "Lenguaje ofensivo",
    timestamp: "12 de mayo de 2026 a las 20:45",
    matchLabel: "Barcelona vs Real Madrid",
    reporter: { name: "Carlos Martínez", initials: "CM", id: "101" },
    reported: {
      name: "Juan Pérez",
      initials: "JP",
      id: "204",
      previousReports: 3,
    },
  },
  {
    id: "rep-002",
    category: "Comentario negativo",
    timestamp: "11 de mayo de 2026 a las 19:30",
    matchLabel: "Barcelona vs Villarreal",
    reporter: { name: "María García", initials: "MG", id: "142" },
    reported: {
      name: "Pedro López",
      initials: "PL",
      id: "208",
      previousReports: 1,
    },
  },
];

const PendingReportsCard = () => {
  return (
    <div className="space-y-5">
      {pendingReports.map((report) => (
        <article
          key={report.id}
          className="bg-brand-white border border-brand-navy/20 rounded-2xl p-6"
        >
          <div className="flex flex-wrap items-center gap-3 text-xs text-brand-gray-mid">
            <span className="rounded-full bg-brand-yellow/20 px-3 py-1 text-brand-yellow font-semibold">
              {report.category}
            </span>
            <span>{report.timestamp}</span>
          </div>

          <p className="mt-3 text-sm text-brand-gray-mid">
            Watch Party:{" "}
            <span className="text-brand-navy font-semibold">
              {report.matchLabel}
            </span>
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl bg-brand-gray-light/30 p-4">
              <p className="text-[0.65rem] uppercase tracking-spaced text-brand-gray-mid font-semibold">
                Reportado por
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-navy text-white text-xs font-bold flex items-center justify-center">
                  {report.reporter.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">
                    {report.reporter.name}
                  </p>
                  <p className="text-xs text-brand-gray-mid">
                    ID: {report.reporter.id}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl bg-brand-yellow/10 p-4">
              <p className="text-[0.65rem] uppercase tracking-spaced text-brand-gray-mid font-semibold">
                Usuario reportado
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-brand-crimson text-white text-xs font-bold flex items-center justify-center">
                  {report.reported.initials}
                </div>
                <div>
                  <p className="text-sm font-semibold text-brand-navy">
                    {report.reported.name}
                  </p>
                  <p className="text-xs text-brand-gray-mid">
                    ID: {report.reported.id}
                  </p>
                </div>
              </div>
              <div className="mt-3 rounded-lg bg-brand-white px-3 py-2 text-xs text-brand-crimson font-semibold">
                {report.reported.previousReports} reportes previos
              </div>
            </div>
          </div>

          <div className="mt-5 flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand-navy text-white py-3 text-sm font-semibold hover:brightness-110 transition"
            >
              <Ban size={16} />
              Banear Usuario
            </button>
            <button
              type="button"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-brand-gray-light text-brand-navy py-3 text-sm font-semibold hover:bg-brand-gray-light/70 transition"
            >
              <XCircle size={16} />
              Desestimar Reporte
            </button>
          </div>
        </article>
      ))}
    </div>
  );
};

export default PendingReportsCard;
