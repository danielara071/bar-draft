import { supabase } from "../../../shared/services/supabaseClient";

export type BannedUserRow = {
  id: string;
  nombre: string | null;
  banned_until: string | null;
};

export const fetchBannedUsers = async (): Promise<BannedUserRow[]> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id,nombre,banned_until")
    .eq("is_banned", true)
    .order("banned_until", { ascending: true, nullsFirst: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as BannedUserRow[];
};

export const removeUserBan = async (userId: string) => {
  const { error } = await supabase
    .from("profiles")
    .update({ is_banned: false, banned_until: null })
    .eq("id", userId);

  if (error) throw new Error(error.message);
};