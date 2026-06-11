import { motion } from "framer-motion";
import type { Player } from "../types";

function hexToRgba(h: string, a: number) {
  if (!h || h === "transparent") return `rgba(0,0,0,${a})`;
  const c = h.replace("#", "");
  return `rgba(${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)},${a})`;
}

function adj(h: string, n: number) {
  if (!h || h === "transparent") return h;
  const c = parseInt(h.replace("#",""),16);
  const r=Math.min(255,Math.max(0,((c>>16)&255)+n));
  const g=Math.min(255,Math.max(0,((c>>8)&255)+n));
  const b=Math.min(255,Math.max(0,(c&255)+n));
  return `rgb(${r},${g},${b})`;
}

const posLabels: Record<string, string> = {
  GK: "GK", DEF: "DEF", LW: "LW", RW: "RW",
  MID: "MID", FWD: "ST", SUB: "SUB",
};

const statLabels: Record<string, string[]> = {
  GK:  ["DIV", "HAN", "KIC", "REF", "SPD", "PHY"],
  DEF: ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"],
  MID: ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"],
  LW:  ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"],
  RW:  ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"],
  FWD: ["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"],
};

type Tier = { name: string; base: string; light: string; dark: string; accent: string };

function getTier(goals: number): Tier {
  if (goals >= 8) return { name:"Special", base:"#1a1a2e", light:"#e2b714", dark:"#0f0f1a", accent:"#ffd700" };
  if (goals >= 4) return { name:"Gold",    base:"#8b6914", light:"#ffd700", dark:"#3d2e08", accent:"#ffed4a" };
  if (goals >= 1) return { name:"Silver",  base:"#4a5568", light:"#cbd5e0", dark:"#1a202c", accent:"#e2e8f0" };
  return { name:"Bronze", base:"#6b4423", light:"#d4a574", dark:"#2d1b0e", accent:"#c4956a" };
}

function seeded(id: number, idx: number): number {
  const x = Math.sin(id * 12.9898 + idx * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function computeStats(player: Player): { ovr: number; stats: number[]; labels: string[] } {
  const g = player.goalsScored;
  const labels = statLabels[player.position] || statLabels["FWD"];
  const base = 40 + Math.min(g * 4, 40);

  const posBonus: Record<string, number[]> = {
    GK:  [15, 10, 10, 15, -5, 5],
    DEF: [5, -5, 5, 0, 15, 10],
    MID: [5, 5, 15, 10, 0, 5],
    LW:  [15, 15, 5, 10, -10, 0],
    RW:  [15, 15, 5, 10, -10, 0],
    FWD: [15, 15, 5, 10, -10, 5],
  };

  const bonus = posBonus[player.position] || posBonus["FWD"];
  const stats = labels.map((_, i) => {
    const variance = Math.floor(seeded(player.id, i) * 8);
    return Math.min(99, Math.max(1, base + (bonus[i] || 0) + variance));
  });
  const ovr = Math.round(stats.reduce((a, b) => a + b, 0) / stats.length);
  return { ovr, stats, labels };
}

function PlayerSilhouette({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 50 62" className="w-full h-full" style={{ filter: `drop-shadow(0 4px 12px ${hexToRgba(color, 0.3)})` }}>
      <defs>
        <linearGradient id="kitBody" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={adj(color, 60)} />
          <stop offset="100%" stopColor={adj(color, -20)} />
        </linearGradient>
        <linearGradient id="kitSleeve" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={adj(color, 80)} />
          <stop offset="100%" stopColor={adj(color, 30)} />
        </linearGradient>
        <linearGradient id="shortsGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={adj(color, -40)} />
          <stop offset="100%" stopColor={adj(color, -60)} />
        </linearGradient>
      </defs>
      <g>
        <ellipse cx="25" cy="8" rx="6" ry="6.5" fill="#1a1008" />
        <ellipse cx="25" cy="8" rx="5.5" ry="6" fill="#2a1a0a" />
        <path d="M19 4 Q19 0 25 -1 Q31 0 31 4 Q31 2 25 1 Q19 2 19 4Z" fill="#0a0602" />
        <path d="M10 17 L6 22 Q3 25 4 28 L6 30 L8 27 L10 24 L14 20 Z" fill="url(#kitSleeve)" stroke={adj(color, -30)} strokeWidth="0.3" />
        <path d="M36 17 L38 20 Q40 22 42 25 L44 24 L42 22 L40 20 L35 18 Z" fill="url(#kitSleeve)" stroke={adj(color, -30)} strokeWidth="0.3" />
        <path d="M12 13 L12 20 Q10 23 10 28 L10 36 L14 36 L14 28 Q14 24 16 22 L16 13 Z" fill="url(#kitBody)" stroke={adj(color, -30)} strokeWidth="0.3" />
        <path d="M34 13 L34 20 Q36 23 36 28 L36 36 L40 36 L40 28 Q40 23 38 20 L38 13 Z" fill="url(#kitBody)" stroke={adj(color, -30)} strokeWidth="0.3" />
        <path d="M16 13 L16 20 Q18 24 20 25 L20 36 L30 36 L30 25 Q32 24 34 20 L34 13 Z" fill="url(#kitBody)" stroke={adj(color, -40)} strokeWidth="0.3" />
        <line x1="25" y1="12" x2="25" y2="24" stroke={adj(color, 60)} strokeWidth="0.6" opacity="0.3" />
        <path d="M20 12 L22 15 L25 13 L28 15 L30 12" fill="none" stroke={adj(color, 60)} strokeWidth="0.8" opacity="0.4" />
        <path d="M12 36 L12 42 Q10 44 10 46 L10 48 L16 48 L16 46 Q16 44 17.5 42 L18 36 Z" fill="url(#shortsGrad)" />
        <path d="M28 36 L28.5 42 Q30 44 30 46 L30 48 L36 48 L36 46 Q36 44 34 42 L34 36 Z" fill="url(#shortsGrad)" />
        <path d="M13 48 L13 54 L14 62 Q14 63 13 63 L10 63 Q9 63 9 62 L8 54 L8 48 Z" fill={adj(color, -60)} />
        <path d="M30 48 L30 54 L31 62 Q31 63 30 63 L26 63 Q25 63 25 62 L24 54 L24 48 Z" fill={adj(color, -60)} />
        <rect x="8" y="51" width="6" height="7" rx="1" fill="white" opacity="0.85" />
        <rect x="24" y="51" width="7" height="7" rx="1" fill="white" opacity="0.85" />
        <path d="M7 58 Q7 56 9 56 L14 56 Q16 56 16 58 L16 62 L7 62 Z" fill="#111" />
        <path d="M23 58 Q23 56 25 56 L30 56 Q32 56 32 58 L32 62 L23 62 Z" fill="#111" />
      </g>
    </svg>
  );
}

function StatBar({ label, value, color }: { label: string; value: number; color: string }) {
  const pct = (value / 99) * 100;
  return (
    <div className="flex items-center gap-1 w-full">
      <span className="text-[5px] font-bold text-white/50 w-[14px] text-right">{label}</span>
      <div className="flex-1 h-[3px] rounded-full bg-white/[0.06] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${adj(color, -10)}, ${color})` }} />
      </div>
      <span className="text-[5px] font-black text-white/60 w-[10px] text-right">{value}</span>
    </div>
  );
}

export default function FutCard({ player, color, small }: { player: Player; color: string; small?: boolean }) {
  const tier = getTier(player.goalsScored);
  const { ovr, stats, labels } = computeStats(player);

  return (
    <motion.div
      className="relative select-none cursor-pointer card-3d"
      whileHover={{ scale: 1.06, y: -6, z: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      style={{ transformStyle: "preserve-3d", perspective: "800px", willChange: "transform" }}
    >
      <div
        className={`relative overflow-hidden ${small ? "w-[64px]" : "w-[88px]"}`}
        style={{
          aspectRatio: small ? "3/4.4" : "3/4.6",
          borderRadius: small ? "8px" : "10px",
          background: `linear-gradient(180deg, ${tier.dark} 0%, ${tier.base} 40%, ${tier.dark} 100%)`,
          boxShadow: `0 6px 20px rgba(0,0,0,0.5), 0 0 0 1px ${hexToRgba("#fff", 0.04)}, inset 0 0 0 1px ${hexToRgba("#fff", 0.03)}`,
          willChange: "transform, box-shadow",
          transform: "translateZ(0)",
          transition: "box-shadow 0.3s ease, border-color 0.3s ease",
        }}
      >
        <div className="card-shine absolute inset-0 pointer-events-none z-20" />

        {/* Tier-colored top accent */}
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{
          background: `linear-gradient(90deg, transparent, ${tier.accent}, transparent)`,
          opacity: 0.6,
        }} />

        {/* Dynamic card pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, ${tier.accent} 1px, transparent 1px)`,
            backgroundSize: small ? "6px 6px" : "8px 8px",
          }} />
        </div>

        {/* Main content */}
        <div className="absolute inset-0 flex flex-col">
          {/* Top: OVR + Position */}
          <div className="flex items-start justify-between px-2 pt-[5px] z-10 shrink-0">
            <div className="flex flex-col items-center">
              <div className="text-white font-black drop-shadow-lg" style={{
                fontSize: small ? "10px" : "15px", lineHeight: 1,
                textShadow: "0 2px 6px rgba(0,0,0,0.6)",
              }}>{ovr}</div>
              <div style={{ fontSize: "4px", color: hexToRgba("#fff", 0.35), letterSpacing: "1px", marginTop: "-1px" }}>OVR</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-white font-black drop-shadow-lg" style={{
                fontSize: small ? "8px" : "11px", lineHeight: 1,
                textShadow: "0 2px 6px rgba(0,0,0,0.6)",
              }}>{posLabels[player.position] || player.position}</div>
              <div style={{ fontSize: "4px", color: hexToRgba("#fff", 0.35), letterSpacing: "1px", marginTop: "-1px" }}>POS</div>
            </div>
          </div>

          {/* Player figure */}
          <div className="flex-1 flex items-center justify-center px-2" style={{ marginTop: small ? "-6px" : "-4px", marginBottom: small ? "-4px" : "-2px" }}>
            <PlayerSilhouette color={color} />
          </div>

          {/* Name */}
          <div className="shrink-0 px-2 pb-[2px]">
            <div className="flex items-center gap-[2px] justify-center">
              <div className="h-[1.5px] flex-1 rounded-full bg-white/[0.06]" />
              <div className="text-white font-black text-center leading-tight truncate drop-shadow-lg" style={{
                fontSize: small ? "5px" : "7px", maxWidth: small ? "56px" : "76px",
                textShadow: "0 1px 4px rgba(0,0,0,0.7)",
              }}>{player.name}</div>
              <div className="h-[1.5px] flex-1 rounded-full bg-white/[0.06]" />
            </div>
          </div>

          {/* Captain / Goals badge */}
          <div className="shrink-0 pb-[3px] flex justify-center gap-2">
            {player.isCaptain && (
              <span className="text-[4px] font-bold tracking-wider text-[#D4AF37]" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>★ C</span>
            )}
            {player.goalsScored > 0 && (
              <span className="text-[4px] font-bold tracking-wider text-win" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>⚽ {player.goalsScored}</span>
            )}
          </div>

          {/* Stats */}
          {!small && (
            <div className="shrink-0 px-2 pb-[5px] space-y-[2px]">
              {labels.map((label, i) => (
                <StatBar key={label} label={label} value={stats[i]} color={tier.accent} />
              ))}
            </div>
          )}
        </div>

        {/* Bottom tier accent */}
        <div className="absolute inset-x-0 bottom-0 h-[2px]" style={{
          background: `linear-gradient(90deg, transparent, ${tier.accent}, transparent)`, opacity: 0.3,
        }} />

        {/* Special card animated shimmer */}
        {tier.name === "Special" && !small && (
          <div className="absolute inset-0 rounded-[10px] overflow-hidden pointer-events-none" style={{ zIndex: 25 }}>
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255,215,0,0.08), transparent)`,
                transform: "skewX(-20deg)",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        )}
      </div>
    </motion.div>
  );
}
