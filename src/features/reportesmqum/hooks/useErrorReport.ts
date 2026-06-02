import { useState, useCallback, useMemo, useEffect } from "react";
import { supabase } from "../../../shared/services/supabaseClient"; // ajusta el path a tu cliente
import type { ErrorReport, ReportView, ReportFilters, ReportStats } from "../interfaces/errorReports";

export function useErrorReports() {
  const [reports, setReports] = useState<ErrorReport[]>([]);
  const [view, setView] = useState<ReportView>("pending");
  const [filters, setFilters] = useState<ReportFilters>({ pantalla: "", fecha: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Carga inicial desde Supabase
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch reports con join a profiles para obtener el nombre del usuario
        const { data, error: fetchError } = await supabase
          .from("error_reports")
          .select(
            `
            id,
            created_at,
            user_id,
            description,
            location,
            screenshot_url,
            resolved,
            profiles:user_id(nombre)
          `
          )
          .order("created_at", { ascending: false });

        if (fetchError) {
          setError(fetchError.message);
        } else {
          // Transformar data para incluir el nombre del usuario
          const transformedData = (data ?? []).map((report: any) => ({
            ...report,
            userName: report.profiles?.nombre || "Anónimo",
          })) as (ErrorReport & { userName: string })[];
          setReports(transformedData);
        }

        // Fetch total count
        const { count, error: countError } = await supabase
          .from("error_reports")
          .select("*", { count: "exact", head: true });

        if (countError) {
          console.error("Error fetching count:", countError);
        } else {
          setTotalCount(count ?? 0);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      }

      setLoading(false);
    };

    fetchReports();
  }, []);

  const stats: ReportStats = useMemo(() => {
    const resolved = reports.filter((r) => r.resolved).length;
    const pending = reports.filter((r) => !r.resolved).length;
    return { total: totalCount, resolved, pending };
  }, [reports, totalCount]);

  // Pantallas únicas extraídas de los reportes cargados
  const availableLocations = useMemo(
    () => Array.from(new Set(reports.map((r) => r.location))).sort(),
    [reports]
  );

  const pendingReports = useMemo(() => reports.filter((r) => !r.resolved), [reports]);
  const resolvedReports = useMemo(() => reports.filter((r) => r.resolved), [reports]);

  const applyFilters = useCallback(
    (list: ErrorReport[]) => {
      return list.filter((r) => {
        const matchScreen = filters.pantalla
          ? r.location === filters.pantalla
          : true;
        const matchDate = filters.fecha
          ? r.created_at.startsWith(filters.fecha)
          : true;
        return matchScreen && matchDate;
      });
    },
    [filters]
  );

  const clearFilters = useCallback(() => {
    setFilters({ pantalla: "", fecha: "" });
  }, []);

  const markAsResolved = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("error_reports")
      .update({ resolved: true })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
    } else {
      // Actualización optimista en el estado local
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, resolved: true } : r))
      );
    }

    setLoading(false);
  }, []);

  const markAsPending = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    const { error: updateError } = await supabase
      .from("error_reports")
      .update({ resolved: false })
      .eq("id", id);

    if (updateError) {
      setError(updateError.message);
    } else {
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, resolved: false } : r))
      );
    }

    setLoading(false);
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
    error,
    availableLocations,
    pendingReports: applyFilters(pendingReports),
    resolvedReports: applyFilters(resolvedReports),
    markAsResolved,
    markAsPending,
    handleSearch,
    clearFilters,
  };
}