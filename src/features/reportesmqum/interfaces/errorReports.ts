export interface ErrorReport {
  id: string;
  created_at: string;
  user_id: string | null;
  description: string;
  location: string;
  screenshot_url: string | null;
  resolved?: boolean;
  userName?: string;
}

export type ReportView = "pending" | "resolved";

export interface ReportFilters {
  pantalla: string;
  fecha: string;
}

export interface ReportStats {
  total: number;
  resolved: number;
  pending: number;
}