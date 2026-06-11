import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function FlipCountdown({ target }: { target: string }) {
  const calc = (): TimeLeft => {
    const diff = new Date(target).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };

  const [time, setTime] = useState<TimeLeft>(calc);

  useEffect(() => {
    const id = setInterval(() => setTime(calc), 1000);
    return () => clearInterval(id);
  }, [target]);

  const pad = (n: number) => String(n).padStart(2, "0");

  const units: { label: string; value: number }[] = [
    { label: "يوم", value: time.days },
    { label: "ساعة", value: time.hours },
    { label: "دقيقة", value: time.minutes },
    { label: "ثانية", value: time.seconds },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4" dir="ltr">
      {units.map((u, i) => (
        <div key={u.label} className="flex flex-col items-center">
          <div className="relative overflow-hidden rounded-xl bg-[#1A1A1A] border border-[rgba(212,175,55,0.2)] min-w-[60px] md:min-w-[80px]">
            <div className="px-3 md:px-4 py-2 md:py-3 text-center">
              <span className="text-2xl md:text-4xl font-black text-[#D4AF37] font-mono tabular-nums score-flip">
                <span className="score-flip-inner">{pad(u.value)}</span>
              </span>
            </div>
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-[rgba(212,175,55,0.1)]" />
          </div>
          <span className="text-[10px] md:text-xs text-gray-500 mt-1">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
