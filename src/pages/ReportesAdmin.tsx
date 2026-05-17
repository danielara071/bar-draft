import { TriangleAlert, CircleCheckBig, Ban, Eye } from "lucide-react";
import StatCard from "../features/ReportesAdmin/components/StatsCard";
import PendingReportsSection from "../features/ReportesAdmin/components/PendingReportsCard";
import ReviewedReportsSection from "../features/ReportesAdmin/components/ReviewedReportsCard";

const ReportesAdmin = () => {
  return (
    <div className="px-10 py-8 max-w-6xl">
      <div className="flex flex-col gap-2">
        <p className="text-brand-navy text-sm font-semibold tracking-spaced uppercase">
          Mes Que Un Club
        </p>
        <h1 className="text-3xl font-bold text-brand-navy">
          Moderacion y <span className="text-brand-yellow">Reportes</span>
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
          stat={4}
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
          stat={1}
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
          stat={0}
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
          stat={5}
        />
      </div>

      <PendingReportsSection />
      <ReviewedReportsSection />
    </div>
  );
};

export default ReportesAdmin;
