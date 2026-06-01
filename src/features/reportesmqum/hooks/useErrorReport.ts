import { useState, useCallback, useMemo } from "react";
import type { ErrorReport, ReportView, ReportFilters, ReportStats } from "./errorReports";

// Mock data matching the DB schema
const MOCK_REPORTS: ErrorReport[] = [
  {
    id: "a1b2c3d4-0001-0000-0000-000000000001",
    created_at: "2026-05-12T10:00:00Z",
    user_id: "user-001",
    description:
      "Realidad Aumentada tiene un defecto en la página inicial, cuando intentas acceder a ella el mapa sale muy inclinado y en móvil no funciona correctamente.",
    location: "Realidad Aumentada",
    screenshot_url:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
    resolved: false,
  },
  {
    id: "a1b2c3d4-0002-0000-0000-000000000002",
    created_at: "2026-05-12T11:00:00Z",
    user_id: "user-002",
    description:
      "Realidad Aumentada tiene un defecto en la página inicial, cuando intentas acceder a ella el mapa sale muy inclinado y en móvil no funciona correctamente.",
    location: "Realidad Aumentada",
    screenshot_url: null,
    resolved: false,
  },
  {
    id: "a1b2c3d4-0003-0000-0000-000000000003",
    created_at: "2026-05-12T12:00:00Z",
    user_id: "user-003",
    description:
      "Realidad Aumentada tiene un defecto en la página inicial, cuando intentas acceder a ella el mapa sale muy inclinado y en móvil no funciona correctamente.",
    location: "Realidad Aumentada",
    screenshot_url:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
    resolved: false,
  },
  {
    id: "a1b2c3d4-0004-0000-0000-000000000004",
    created_at: "2026-05-10T09:00:00Z",
    user_id: "user-004",
    description:
      "El login con Google falla intermitentemente en Safari, el usuario queda en bucle de redirección.",
    location: "Inicio de Sesión",
    screenshot_url:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
    resolved: true,
  },
  {
    id: "a1b2c3d4-0005-0000-0000-000000000005",
    created_at: "2026-05-10T10:00:00Z",
    user_id: "user-005",
    description: "El marcador de trofeos no actualiza en tiempo real al ganar un nuevo logro.",
    location: "Mapa de Trofeos",
    screenshot_url: null,
    resolved: true,
  },
  {
    id: "a1b2c3d4-0006-0000-0000-000000000006",
    created_at: "2026-05-09T15:00:00Z",
    user_id: "user-006",
    description:
      "La sección de noticias no carga correctamente cuando hay más de 50 artículos publicados.",
    location: "Gestión de Noticias",
    screenshot_url:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&q=80",
    resolved: true,
  },
];

export function useErrorReports() {
  const [reports, setReports] = useState<ErrorReport[]>(MOCK_REPORTS);
  const [view, setView] = useState<ReportView>("pending");
  const [filters, setFilters] = useState<ReportFilters>({ pantalla: "", fecha: "" });
  const [loading, setLoading] = useState(false);

  const stats: ReportStats = useMemo(() => {
    const resolved = reports.filter((r) => r.resolved).length;
    const pending = reports.filter((r) => !r.resolved).length;
    return { total: reports.length + 1241, resolved, pending };
  }, [reports]);

  const pendingReports = useMemo(() => reports.filter((r) => !r.resolved), [reports]);
  const resolvedReports = useMemo(() => reports.filter((r) => r.resolved), [reports]);

  const applyFilters = useCallback(
    (list: ErrorReport[]) => {
      return list.filter((r) => {
        const matchScreen = filters.pantalla
          ? r.location.toLowerCase().includes(filters.pantalla.toLowerCase())
          : true;
        const matchDate = filters.fecha
          ? r.created_at.startsWith(filters.fecha)
          : true;
        return matchScreen && matchDate;
      });
    },
    [filters]
  );

  const markAsResolved = useCallback((id: string) => {
    setLoading(true);
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, resolved: true } : r))
      );
      setLoading(false);
    }, 600);
  }, []);

  const markAsPending = useCallback((id: string) => {
    setLoading(true);
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, resolved: false } : r))
      );
      setLoading(false);
    }, 600);
  }, []);

  const handleSearch = useCallback((newFilters: ReportFilters) => {
    setFilters(newFilters);
  }, []);

  return {
    view,
    setView,
    stats,
    filters,
    loading,
    pendingReports: applyFilters(pendingReports),
    resolvedReports: applyFilters(resolvedReports),
    markAsResolved,
    markAsPending,
    handleSearch,
  };
}