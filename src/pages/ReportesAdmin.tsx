import { TriangleAlert, CircleCheckBig, Ban, Eye } from "lucide-react";
import StatCard from "../features/ReportesAdmin/components/StatsCard";

const ReportesAdmin = () => {
  return (
    <div>
      <StatCard icon={TriangleAlert} title={"dobabes"} stat={3} />
      <StatCard icon={CircleCheckBig} title={"dobabes"} stat={3} />
      <StatCard icon={Ban} title={"dobabes"} stat={3} />
      <StatCard icon={Eye} title={"dobabes"} stat={3} />
    </div>
  );
};

export default ReportesAdmin;
