import { useEffect, useMemo, useState } from "react";

export const useMatchClock = (
  elapsedMinutes: number | null | undefined,
  fetchedAt: number | null
) => {
  const [nowMs, setNowMs] = useState(() => Date.now());

  useEffect(() => {
    const timerId = setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, []);

  return useMemo(() => {
    if (elapsedMinutes == null) {
      return "00:00";
    }

    const syncTimeMs = fetchedAt ?? nowMs;
    const elapsedSinceSyncSeconds = Math.max(
      0,
      Math.floor((nowMs - syncTimeMs) / 1000)
    );
    const totalSeconds = elapsedMinutes * 60 + elapsedSinceSyncSeconds;
    const displayMinutes = Math.floor(totalSeconds / 60);
    const displaySeconds = totalSeconds % 60;

    return `${String(displayMinutes).padStart(2, "0")}:${String(
      displaySeconds
    ).padStart(2, "0")}`;
  }, [elapsedMinutes, fetchedAt, nowMs]);
};
