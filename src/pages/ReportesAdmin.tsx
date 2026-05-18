import { TriangleAlert, CircleCheckBig, Ban, Eye } from "lucide-react";
import StatCard from "../features/ReportesAdmin/components/StatsCard";
import PendingReportsCard from "../features/ReportesAdmin/components/PendingReportsCard";
import ReviewedReportsCard from "../features/ReportesAdmin/components/ReviewedReportsCard";
import { useReports } from "../features/ReportesAdmin/hooks/useReports";

const ReportesAdmin = () => {
  const {
    metrics,
    pendingReports,
    reviewedReports,
    isLoading,
    error,
    actionLoading,
    banReport,
    dismissReport,
  } = useReports();

  return (
    <div className="px-10 py-8 max-w-6xl">
      <div className="flex flex-col gap-2">
        <p className="text-brand-navy text-sm font-semibold tracking-spaced uppercase">
          Més Que Un Club
        </p>
        <h1 className="text-3xl font-bold text-brand-navy">
          Moderación y <span className="text-brand-yellow">Reportes</span>
        </h1>
      </div>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={TriangleAlert}
          title={
            <>
              <span className="block">Reportes</span>
              <span className="block">Pendientes</span>
            </>
          }
          stat={metrics.pending}
          variant="solid"
        />
        <StatCard
          icon={CircleCheckBig}
          title={
            <>
              <span className="block">Reportes</span>
              <span className="block">Revisados</span>
            </>
          }
          stat={metrics.reviewed}
          tone="success"
        />
        <StatCard
          icon={Ban}
          title={
            <>
              <span className="block">Usuarios</span>
              <span className="block">Baneados</span>
            </>
          }
          stat={metrics.banned}
          tone="danger"
        />
        <StatCard
          icon={Eye}
          title={
            <>
              <span className="block">Total</span>
              <span className="block">Reportes</span>
            </>
          }
          stat={metrics.total}
        />
      </div>

      <section className="mt-8">
        <h2 className="text-brand-navy text-lg font-bold mb-4">
          Reportes Pendientes de Revisión
        </h2>
        <PendingReportsCard
          reports={pendingReports}
          isLoading={isLoading}
          error={error}
          actionLoading={actionLoading}
          onBan={banReport}
          onDismiss={dismissReport}
        />
      </section>

      <section className="mt-8">
        <h2 className="text-brand-navy text-lg font-bold mb-4">
          Reportes Revisados Recientemente
        </h2>
        <ReviewedReportsCard
          reports={reviewedReports}
          isLoading={isLoading}
          error={error}
        />
      </section>
    </div>
  );
};

export default ReportesAdmin;
