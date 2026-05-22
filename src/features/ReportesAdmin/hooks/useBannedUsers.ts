import { useEffect, useState } from "react";
import { fetchBannedUsers, removeUserBan } from "../services/bannedUsersService";
import type { BannedUserEntry } from "../components/BannedUsersModal";

const formatRemainingTime = (bannedUntil: string | null) => {
  if (!bannedUntil) return "Baneo permanente";
  const diffMs = new Date(bannedUntil).getTime() - Date.now();
  if (Number.isNaN(diffMs)) return "Tiempo no disponible";
  if (diffMs <= 0) return "Expirado";

  const minutes = Math.ceil(diffMs / (60 * 1000));
  if (minutes < 60) return `Quedan ${minutes} min`;

  const hours = Math.ceil(diffMs / (60 * 60 * 1000));
  if (hours < 24) return `Quedan ${hours} h`;

  const days = Math.ceil(diffMs / (24 * 60 * 60 * 1000));
  return `Quedan ${days} días`;
};

export const useBannedUsers = () => {
  const [users, setUsers] = useState<BannedUserEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const rows = await fetchBannedUsers();
      const mapped = rows.map((row) => ({
        id: row.id,
        name: row.nombre?.trim() || "Usuario",
        remainingTime: formatRemainingTime(row.banned_until),
      }));
      setUsers(mapped);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error cargando usuarios banneados";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const unbanUser = async (userId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await removeUserBan(userId);
      await load();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error levantando el baneo";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const id = window.setTimeout(() => {
      void load();
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  return { users, isLoading, error, refresh: load, unbanUser };
};