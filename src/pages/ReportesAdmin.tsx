import { useState } from "react";
import { TriangleAlert, CircleCheckBig, Ban, Eye } from "lucide-react";
import StatCard from "../features/ReportesAdmin/components/StatsCard";
import PendingReportsCard from "../features/ReportesAdmin/components/PendingReportsCard";
import ReviewedReportsCard from "../features/ReportesAdmin/components/ReviewedReportsCard";
import BanUserModal from "../features/ReportesAdmin/components/BanUserModal";
import { useReports } from "../features/ReportesAdmin/hooks/useReports";
import type {
  BanDuration,
  PendingReportCardData,
} from "../features/ReportesAdmin/types/reportTypes";

const ReportesAdmin = () => {
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] =
    useState<PendingReportCardData | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<BanDuration>("7d");
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

  const openBanModal = (report: PendingReportCardData) => {
    setSelectedReport(report);
    setSelectedDuration("7d");
    setBanModalOpen(true);
  };

  const closeBanModal = () => {
    setBanModalOpen(false);
    setSelectedReport(null);
  };

  const confirmBan = async () => {
    if (!selectedReport) return;
    await banReport(
      selectedReport.id,
      selectedReport.reported.id,
      selectedDuration,
    );
    closeBanModal();
  };

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
          onBanRequest={openBanModal}
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

      <BanUserModal
        isOpen={banModalOpen}
        reportedUserName={selectedReport?.reported.name ?? "Usuario"}
        selectedDuration={selectedDuration}
        onClose={closeBanModal}
        onSelectDuration={setSelectedDuration}
        onConfirmBan={confirmBan}
        isSubmitting={
          selectedReport ? Boolean(actionLoading[selectedReport.id]) : false
        }
      />
    </div>
  );
};

export default ReportesAdmin;
