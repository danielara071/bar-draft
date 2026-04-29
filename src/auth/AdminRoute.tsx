import { Navigate } from "react-router-dom";
import { useUserRole } from "./hooks/useUserRole";
import useSesh from "./hooks/useSesh";

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const {session, loading: sessionLoading} = useSesh();
  const { role, loading: roleLoading } = useUserRole(session?.user.id);
  if ( sessionLoading || roleLoading) {
    return <p>Loading...</p>;
  }

  if (!session) {
    console.log("no hay session");

    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
