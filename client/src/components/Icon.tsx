import { motion } from "framer-motion";

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const icons: Record<string, (size: number) => JSX.Element> = {
  star: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <polygon points="12,2 15,9 22,9 16,14 18,21 12,16 6,21 8,14 2,9 9,9" />
    </svg>
  ),
  trophy: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M6 9H4a2 2 0 01-2-2V5a2 2 0 012-2h2" />
      <path d="M18 9h2a2 2 0 002-2V5a2 2 0 00-2-2h-2" />
      <path d="M6 3h12v6a6 6 0 01-12 0V3z" />
      <path d="M8 21h8" />
      <path d="M12 17v4" />
    </svg>
  ),
  user: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="12" cy="5" r="3" />
      <path d="M8 9h8v4l-2 2v6h-4v-6l-2-2V9z" />
    </svg>
  ),
  shield: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M12 1l9 4v6c0 5.5-9 11-9 11S3 16.5 3 11V5l9-4z" />
      <path d="M8 9l3 3 5-5" />
    </svg>
  ),
  swords: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M5 2l4 4" />
      <path d="M19 2l-4 4" />
      <path d="M9 6L7 22" />
      <path d="M15 6l2 16" />
      <path d="M12 6l-1 16" />
      <path d="M3 10h18" />
    </svg>
  ),
  target: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  zap: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <polygon points="13,2 4,14 11,14 10,22 20,10 13,10" />
    </svg>
  ),
  "arrow-up-right": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M7 17L17 7" />
      <path d="M7 7h10v10" />
    </svg>
  ),
  "calendar-days": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h18" />
      <path d="M8 14h.01" />
      <path d="M12 14h.01" />
      <path d="M16 14h.01" />
      <path d="M8 18h.01" />
      <path d="M12 18h.01" />
      <path d="M16 18h.01" />
    </svg>
  ),
  clock: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  medal: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="12" cy="8" r="5" />
      <path d="M8 21l4-3 4 3V13h-8v8z" />
      <circle cx="12" cy="8" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  crown: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M2 19l3-14 4 5 3-6 3 6 4-5 3 14H2z" />
      <circle cx="6" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="19" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  "trending-up": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M23 6l-9.5 9.5-5-5L1 18" />
      <path d="M17 6h6v6" />
    </svg>
  ),
  diamond: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <rect x="4" y="4" width="16" height="16" rx="2" transform="rotate(45 12 12)" />
      <rect x="8" y="8" width="8" height="8" rx="1" transform="rotate(45 12 12)" />
    </svg>
  ),
  sparkles: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M12 3l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" />
      <path d="M18 8l1 1 1-1-1-1z" opacity="0.6" />
      <path d="M6 14l1 1 1-1-1-1z" opacity="0.6" />
      <path d="M17 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1z" opacity="0.8" />
      <path d="M5 4l1 1 1-1-1-1z" opacity="0.4" />
    </svg>
  ),
  "clipboard-list": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v2h6V3" />
      <path d="M9 12h6" />
      <path d="M9 16h6" />
      <path d="M9 8h.01" />
    </svg>
  ),
  "help-circle": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 1.5-2.5 3-2.5 5v.5" />
      <circle cx="12" cy="17.5" r=".5" fill="currentColor" stroke="none" />
    </svg>
  ),
  timer: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l2 2" />
      <path d="M10 2h4" />
      <path d="M12 2v3" />
    </svg>
  ),
  repeat: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M3 12a9 9 0 019-9 9 9 0 019 9 9 9 0 01-9 9" />
      <path d="M3 12h4l-2 3" />
      <path d="M21 12h-4l2-3" />
    </svg>
  ),
  "x-circle": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6" />
      <path d="M9 9l6 6" />
    </svg>
  ),
  users: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="8" cy="5" r="2.5" />
      <circle cx="16" cy="5" r="2.5" />
      <circle cx="12" cy="10" r="2.5" />
      <path d="M4 14c0-2 2-3.5 4-3.5" />
      <path d="M20 14c0-2-2-3.5-4-3.5" />
      <path d="M8 14c0-2 2-3 4-3s4 1 4 3" />
      <path d="M2 20c0-3 2.5-4 6-4" />
      <path d="M22 20c0-3-2.5-4-6-4" />
      <path d="M6 20c0-2 2-3 6-3s6 1 6 3" />
    </svg>
  ),
  "alert-triangle": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M12 3L2 20h20L12 3z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  ),
  ban: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="12" cy="12" r="9" />
      <path d="M5.6 5.6l12.8 12.8" />
    </svg>
  ),
  "arrow-left-right": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M8 3L4 7l4 4" />
      <path d="M4 7h16" />
      <path d="M16 21l4-4-4-4" />
      <path d="M20 17H4" />
    </svg>
  ),
  "user-check": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="8" cy="6" r="3" />
      <path d="M2 16c0-2.5 2-4 6-4s6 1.5 6 4" />
      <path d="M16 14l2 2 4-4" />
    </svg>
  ),
  flag: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M4 22V3h10l1 4h6v11H11l-1-4H4z" />
    </svg>
  ),
  "graduation-cap": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5" />
    </svg>
  ),
  "building-2": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <rect x="3" y="7" width="4" height="14" />
      <rect x="9" y="3" width="6" height="18" />
      <rect x="17" y="10" width="4" height="11" />
      <path d="M9 21V7l3-2 3 2v14" />
    </svg>
  ),
  gavel: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M12 14l6-6" />
      <path d="M16 10l2-2" />
      <path d="M6 18l4-4" />
      <path d="M3 21l3-3" />
      <rect x="8" y="4" width="4" height="10" rx="1" />
      <path d="M14 6l4-4 2 2-4 4" />
    </svg>
  ),
  globe: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a15 15 0 010 18 15 15 0 010-18z" />
      <path d="M3 12h18" />
    </svg>
  ),
  "bar-chart-3": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M3 20V10" />
      <path d="M8 20V4" />
      <path d="M13 20v-7" />
      <path d="M18 20V8" />
      <path d="M21 20h-18" />
    </svg>
  ),
  football: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
      <path d="M3 12h18" />
      <path d="M5.6 5.6l12.8 12.8" />
      <path d="M18.4 5.6L5.6 18.4" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  ),
  gift: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <rect x="4" y="8" width="16" height="12" rx="2" />
      <path d="M4 12h16" />
      <path d="M12 8v12" />
      <path d="M12 4c-2-2-6-1-5 2s4 2 5 0" />
      <path d="M12 4c2-2 6-1 5 2s-4 2-5 0" />
    </svg>
  ),
  question: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5c0-1.5 1-2.5 2.5-2.5s2.5 1 2.5 2.5c0 1.5-2.5 3-2.5 5v.5" />
      <circle cx="12" cy="17.5" r=".5" fill="currentColor" stroke="none" />
    </svg>
  ),
  stadium: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M4 10c0-4.4 3.6-8 8-8s8 3.6 8 8" />
      <path d="M4 10h2v12H4z" />
      <path d="M18 10h2v12h-2z" />
      <path d="M6 14h4v8H6z" />
      <path d="M14 14h4v8h-4z" />
      <path d="M10 12h4v10h-4z" />
    </svg>
  ),
  "cat-player": (s) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}>
      <circle cx="50" cy="28" r="14"/><path d="M28 54c0-14 44-14 44 0v8l-8 6v22H36V68l-8-6v-8z"/><path d="M28 62l-8 6M72 62l8 6"/><circle cx="50" cy="28" r="6" fill="currentColor" stroke="none"/>
    </svg>
  ),
  "cat-coach": (s) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}>
      <circle cx="50" cy="22" r="10"/><path d="M32 38c0-10 36-10 36 0v6l-6 5v20H38V49l-6-5v-6z"/><path d="M32 48l-6 4M68 48l6 4"/><circle cx="72" cy="76" r="8"/><path d="M64 76l-18-6v-4l18 6"/><circle cx="72" cy="76" r="3" fill="currentColor" stroke="none"/>
    </svg>
  ),
  "cat-stadium": (s) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}>
      <path d="M16 44c0-18 68-18 68 0"/><path d="M16 44h8v36h-8zM76 44h8v36h-8z"/><path d="M28 56h12v24H28zM60 56h12v24H60z"/><path d="M44 50h12v30H44z"/><path d="M38 32h24M44 24h12"/><path d="M50 50v8M44 54h12" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  ),
  "cat-auction": (s) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}>
      <path d="M52 56l24-24"/><path d="M66 42l8-8"/><path d="M30 74l14-14"/><path d="M16 88l10-10"/><rect x="38" y="22" width="12" height="36" rx="3"/><path d="M58 30l14-14 8 8-14 14"/><path d="M26 60l-4 4"/><rect x="54" y="16" width="8" height="12" rx="1" fill="currentColor" stroke="none"/>
    </svg>
  ),
  "cat-teams": (s) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}>
      <circle cx="34" cy="28" r="10"/><circle cx="66" cy="28" r="10"/><circle cx="50" cy="46" r="10"/><path d="M18 58c0-8 8-14 16-14"/><path d="M82 58c0-8-8-14-16-14"/><path d="M34 58c0-8 8-12 16-12s16 4 16 12"/><path d="M10 80c0-10 10-14 24-14"/><path d="M90 80c0-10-10-14-24-14"/><path d="M26 80c0-8 8-10 24-10s24 2 24 10"/>
    </svg>
  ),
  "cat-national": (s) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}>
      <circle cx="50" cy="50" r="36"/><path d="M50 14c12 0 22 16 22 36s-10 36-22 36"/><path d="M50 14c-12 0-22 16-22 36s10 36 22 36"/><ellipse cx="50" cy="50" rx="22" ry="36"/><path d="M14 50h72"/><path d="M28 34c0 0 8 16 22 16s22-16 22-16" opacity="0.4"/><path d="M28 66c0 0 8-16 22-16s22 16 22 16" opacity="0.4"/>
    </svg>
  ),
  "cat-leagues": (s) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}>
      <rect x="10" y="56" width="16" height="34" rx="2"/><rect x="34" y="34" width="16" height="56" rx="2"/><rect x="58" y="44" width="16" height="46" rx="2"/><rect x="82" y="20" width="10" height="70" rx="2"/><path d="M50 10c-4 0-8 4-8 8v4h16v-4c0-4-4-8-8-8z"/><path d="M42 14h-4c-2 0-4-2-4-4v-2c0-2 2-4 4-4h4M58 14h4c2 0 4-2 4-4v-2c0-2-2-4-4-4h-4"/>
    </svg>
  ),
  "cat-cups": (s) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}>
      <path d="M30 14h40v8c0 16-20 28-20 28s-20-12-20-28v-8z"/><path d="M25 14h-4c-3 0-5-2-5-5V6c0-3 2-5 5-5h4M75 14h4c3 0 5-2 5-5V6c0-3-2-5-5-5h-4"/><polygon points="50,20 54,32 66,32 56,40 60,52 50,44 40,52 44,40 34,32 46,32" fill="currentColor" stroke="none"/><path d="M36 46c6 8 14 12 14 12s8-4 14-12"/><path d="M50 58v24"/><path d="M44 76h12"/>
    </svg>
  ),
  "cat-more": (s) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width={s} height={s}>
      <circle cx="50" cy="50" r="8" fill="currentColor" stroke="none"/><path d="M50 18v6M50 76v6"/><path d="M18 50h6M76 50h6"/><path d="M27 27l4 4M69 69l4 4"/><path d="M27 73l4-4M69 31l4-4"/><rect x="16" y="16" width="6" height="6" rx="1" transform="rotate(45 19 19)" fill="currentColor" stroke="none"/><rect x="78" y="78" width="6" height="6" rx="1" transform="rotate(45 81 81)" fill="currentColor" stroke="none"/><rect x="78" y="16" width="6" height="6" rx="1" transform="rotate(45 81 19)" fill="currentColor" stroke="none"/><rect x="16" y="78" width="6" height="6" rx="1" transform="rotate(45 19 81)" fill="currentColor" stroke="none"/>
    </svg>
  ),
  search: (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="11" cy="11" r="7" />
      <path d="M16 16l5 5" />
    </svg>
  ),
  "sun-moon": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M5 5l1 1M18 18l1 1M2 12h2M20 12h2M5 19l1-1M18 6l1-1" />
      <path d="M16 8a6 6 0 000 8" opacity="0.5" />
    </svg>
  ),
  "arrow-left": (s) => (
    <svg {...svgProps} width={s} height={s}>
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  ),
};

export type IconName = keyof typeof icons;

export default function Icon({ name, size = 16, className = "" }: { name: IconName; size?: number; className?: string }) {
  const render = icons[name];
  if (!render) return null;
  return (
    <span className={`inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {render(size)}
    </span>
  );
}
