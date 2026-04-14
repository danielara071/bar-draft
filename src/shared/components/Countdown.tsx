import { useEffect, useState } from 'react'

const pad = (n: number) => String(Math.floor(n)).padStart(2, "0");

interface CountdownProps {
  onCategoryLoad: (category: "varonil" | "femenil") => void;
}

const Countdown = ({ onCategoryLoad }: CountdownProps) => {
  const [matchDate, setMatchDate] = useState<Date | null>(null);
  const [time, setTime] = useState({ d: "--", h: "--", m: "--", s: "--" });
  const PROXY = "https://fcb-proxy.onrender.com";

  useEffect(() => {
    const loadMatch = async () => {
      const response = await fetch(`${PROXY}/api/scraper/next-game`);
      const data = await response.json();
      setMatchDate(new Date(data.datetime));
      onCategoryLoad(data.category);
    };
    loadMatch();
  }, []);

  useEffect(() => {
    if (!matchDate) return;
    const tick = () => {
      const diff = matchDate.getTime() - Date.now();
      if (diff <= 0) return;
      setTime({
        d: pad(diff / 86400000),
        h: pad((diff % 86400000) / 3600000),
        m: pad((diff % 3600000) / 60000),
        s: pad((diff % 60000) / 1000),
      });
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [matchDate]);

  return (
      <div className="flex flex-col items-center gap-2">
      <div className="flex gap-6">
        {[
          { label: "días",     value: time.d },
          { label: "horas",    value: time.h },
          { label: "minutos",  value: time.m },
          { label: "segundos", value: time.s },
        ].map(({ label, value }, i) => (
          <>
            {i > 0 && (
              <span key={`sep-${i}`} className="sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-crimson mb-4">:</span>
            )}
            <div key={label} className="flex flex-col items-center">
              <span className="sm:text-4xl md:text-5xl lg:text-6xl font-bold text-brand-crimson">{value}</span>
              <span className="text-xs text-brand-crimson mt-1">{label}</span>
            </div>
          </>
        ))}
      </div>
    </div>
  );
};

export default Countdown;