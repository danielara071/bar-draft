import { useEffect, useState } from "react";
import { get_friend_status } from "../../lib/DummyAPI";

export function useFriendStatus(user_id: string, friend_id: string) {
  const [friend_status, setStatus] = useState<string>("none");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStatus = async () => {
    if (!user_id || !friend_id) return;

    try {
      setLoading(true);
      setError("");

      const data = await get_friend_status(user_id, friend_id);
      setStatus(data);
    } catch (err) {
      setError("Error al obtener estado de amistad");
      setStatus("none");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [user_id, friend_id]);

  return {
    friend_status,
    loading,
    error,
    refetch: fetchStatus,
  };
}