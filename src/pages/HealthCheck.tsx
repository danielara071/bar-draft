import { useEffect, useState } from "react";
import { supabase } from "../shared/services/supabaseClient";

type HealthStatus = "loading" | "ok" | "error";

const SCRAPER_URLS = ["/rss", "/next-game"];

const checkUrl = async (url: string) => {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);

  try {
    const response = await fetch(url, {
      method: "GET",
      cache: "no-store",
      signal: controller.signal,
    });

    return response.ok;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timeout);
  }
};

const HealthCheck = () => {
  const [status, setStatus] = useState<HealthStatus>("loading");

  useEffect(() => {
    let active = true;

    const checkConnection = async () => {
      try {
        const [{ error }, ...scraperChecks] = await Promise.all([
          supabase.from("profiles").select("id").limit(1),
          ...SCRAPER_URLS.map((url) => checkUrl(url)),
        ]);

        const scraperOk = scraperChecks.some(Boolean);
        if (!active) return;
        setStatus(error || !scraperOk ? "error" : "ok");
      } catch {
        if (!active) return;
        setStatus("error");
      }
    };

    void checkConnection();

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") return <p>Health check: loading...</p>;
  if (status === "ok") return <p>Health check: ok</p>;
  return <p>Health check: error</p>;
};

export default HealthCheck;
