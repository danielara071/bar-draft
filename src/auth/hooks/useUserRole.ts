import { supabase } from "@/shared/services/supabaseClient";
import { useEffect, useState } from "react";

export function useUserRole(userId?: string) {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  setLoading(true);

  if (!userId) {
    setRole(null);
    setLoading(false);
    return;
  }

  const fetchRole = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error(error);
      setRole(null);
    } else {
      setRole(data.role);
    }

    setLoading(false);
  };

  fetchRole();
}, [userId]);

  return { role, loading };
}