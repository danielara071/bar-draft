import type { WatchParty, WatchPartyMatch } from "../interfaces/index.interfaces";

/**
 * Formatea la fecha del partido como "Dom 25 · 20:00"
 */
export function mapToWatchPartyMatch(wp: WatchParty): WatchPartyMatch {
  const date = new Date(wp.match_date);

  const weekday = date.toLocaleString("es-MX", { weekday: "short" });
  const day     = date.getDate();
  const hour    = date.toLocaleString("es-MX", { hour: "2-digit", minute: "2-digit", hour12: false });

  return {
    id:          wp.fixture_id,
    type:        wp.fixture_id.startsWith("femenil") ? "femenil" : "varonil",
    title:       `${wp.home_team} vs ${wp.away_team}`,
    competition: wp.name,
    time:        `${weekday} ${day} · ${hour}`,
    code:        wp.code,
    home_team:   wp.home_team,
    away_team:   wp.away_team,
    match_date:  wp.match_date,
  };
}
