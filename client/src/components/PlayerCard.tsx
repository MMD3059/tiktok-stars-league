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

const posColors: Record<string, string> = {
  GK: "#EAB308", DEF: "#3B82F6", LW: "#10B981",
  RW: "#10B981", MID: "#A855F7", FWD: "#F97316", SUB: "#6B7280",
};

/* ====== Variant 1: FIFA Classic ====== */
function V1Fifa({ player }: { player: Player }) {
  const color = posColors[player.position] || "#6B7280";
  return (
    <div className="inline-flex flex-col items-center w-[88px]" style={{ height: "135px" }}>
      <div className="relative w-full h-full rounded-[10px] overflow-hidden" style={{
        background: `linear-gradient(180deg, #1a1a2e 0%, #8b6914 40%, #1a1a2e 100%)`,
        boxShadow: `0 6px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04)`,
      }}>
        <div className="absolute inset-x-0 top-0 h-[3px]" style={{ background: "linear-gradient(90deg, transparent, #ffd700, transparent)", opacity: 0.6 }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 30% 40%, #ffd700 1px, transparent 1px)", backgroundSize: "8px 8px" }} />

        <div className="absolute inset-0 flex flex-col">
          <div className="flex items-start justify-between px-2 pt-[5px] z-10 shrink-0">
            <div className="flex flex-col items-center">
              <div className="text-white font-black drop-shadow-lg text-[15px] leading-none" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
                {player.goalsScored + 50}
              </div>
              <div className="text-[4px] text-white/35 tracking-wider">OVR</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-white font-black drop-shadow-lg text-[11px] leading-none" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.6)" }}>
                {player.position}
              </div>
              <div className="text-[4px] text-white/35 tracking-wider">POS</div>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center px-2">
            {player.imageUrl ? (
              <img src={player.imageUrl} alt={player.name} className="max-w-full max-h-full object-contain drop-shadow-lg" style={{ filter: "drop-shadow(0 4px 12px rgba(255,215,0,0.2))" }} />
            ) : (
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${adj(color, 40)}, ${adj(color, -30)})`, boxShadow: "0 0 12px rgba(255,215,0,0.15)" }}>
                <span className="text-white/70 text-[18px] font-black">{player.name[0]}</span>
              </div>
            )}
          </div>

          <div className="shrink-0 px-2 pb-[2px]">
            <div className="flex items-center gap-[2px] justify-center">
              <div className="h-[1.5px] flex-1 rounded-full bg-white/10" />
              <span className="text-white font-black text-center leading-tight truncate drop-shadow-lg text-[7px] max-w-[76px]" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.7)" }}>
                {player.name}
              </span>
              <div className="h-[1.5px] flex-1 rounded-full bg-white/10" />
            </div>
          </div>

          <div className="shrink-0 pb-[3px] flex justify-center gap-2">
            {player.isCaptain && <span className="text-[4px] font-bold tracking-wider text-[#D4AF37]">★ C</span>}
            {player.goalsScored > 0 && <span className="text-[4px] font-bold tracking-wider text-emerald-400">⚽ {player.goalsScored}</span>}
          </div>

          <div className="shrink-0 px-2 pb-[5px] space-y-[2px]">
            {["PAC", "SHO", "PAS", "DRI", "DEF", "PHY"].map((l) => (
              <div key={l} className="flex items-center gap-1 w-full">
                <span className="text-[5px] font-bold text-white/50 w-[14px] text-right">{l}</span>
                <div className="flex-1 h-[3px] rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(40 + player.goalsScored * 4, 99)}%`, background: "linear-gradient(90deg, #c89b3c, #ffd700)" }} />
                </div>
                <span className="text-[5px] font-black text-white/60 w-[10px] text-right">{Math.min(40 + player.goalsScored * 4, 99)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====== Variant 2: Gold Frame ====== */
function V2GoldFrame({ player }: { player: Player }) {
  const color = posColors[player.position] || "#6B7280";
  return (
    <div className="relative w-[100px]" style={{ height: "133px" }}>
      {/* Ornate gold frame background */}
      <div className="absolute inset-0 rounded-[4px] overflow-hidden" style={{ background: "linear-gradient(135deg, #d1aa5f, #e8c97a, #a07d30, #e8c97a, #d1aa5f)" }}>
        <div className="absolute inset-[3px] rounded-[3px]" style={{ background: "linear-gradient(180deg, #1a1008, #0a0602, #1a1008)" }} />
      </div>
      {/* Corner ornaments */}
      <div className="absolute top-[5px] left-[5px] w-[6px] h-[6px] rounded-full bg-[#d1aa5f]/40" />
      <div className="absolute top-[5px] right-[5px] w-[6px] h-[6px] rounded-full bg-[#d1aa5f]/40" />
      <div className="absolute bottom-[5px] left-[5px] w-[6px] h-[6px] rounded-full bg-[#d1aa5f]/40" />
      <div className="absolute bottom-[5px] right-[5px] w-[6px] h-[6px] rounded-full bg-[#d1aa5f]/40" />

      {/* Content inside frame */}
      <div className="absolute inset-[6px] flex flex-col items-center justify-center pt-5 pb-3">
        {/* Photo */}
        <div className="w-[48px] h-[48px] rounded-full overflow-hidden border-2 shrink-0" style={{ borderColor: "#d1aa5f", boxShadow: "0 0 20px rgba(209,170,95,0.3)" }}>
          {player.imageUrl ? (
            <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${adj(color, 40)}, ${color})` }}>
              <span className="text-white/70 text-[18px] font-black flex items-center justify-center w-full h-full">{player.name[0]}</span>
            </div>
          )}
        </div>

        {/* Name */}
        <div className="mt-1.5 text-center">
          <div className="text-[9px] font-black text-white leading-tight truncate max-w-[76px] drop-shadow-lg">{player.name}</div>
          <div className="text-[6px] font-bold tracking-widest" style={{ color: "#d1aa5f" }}>{player.position}</div>
        </div>

        {/* Ornamental divider */}
        <div className="flex items-center gap-1 my-1 w-full px-3">
          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg, transparent, rgba(209,170,95,0.3))" }} />
          <svg width="8" height="6" viewBox="0 0 8 6"><path d="M1 3L4 1L7 3L4 5Z" fill="#d1aa5f" opacity="0.5" /></svg>
          <div className="h-px flex-1" style={{ background: "linear-gradient(270deg, transparent, rgba(209,170,95,0.3))" }} />
        </div>

        {/* Stats row */}
        <div className="flex items-center justify-center gap-3 w-full">
          <div className="text-center">
            <div className="text-[8px] font-black text-white">{player.goalsScored}</div>
            <div className="text-[4px] text-white/50 tracking-wider">GLS</div>
          </div>
          {player.isCaptain && (
            <div className="text-center">
              <div className="text-[8px] text-[#D4AF37]">★</div>
              <div className="text-[4px] text-white/50 tracking-wider">CAP</div>
            </div>
          )}
          <div className="text-center">
            <div className="text-[8px] font-black text-white">{player.position === "GK" ? 1 : player.goalsScored + 5}</div>
            <div className="text-[4px] text-white/50 tracking-wider">ASN</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====== Variant 3: Glass Premium ====== */
function V3Glass({ player }: { player: Player }) {
  const color = posColors[player.position] || "#6B7280";
  return (
    <div className="relative w-[90px]" style={{ height: "126px" }}>
      {/* Glass background */}
      <div
        className="absolute inset-0 rounded-[16px] overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.2) 100%)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.04), 0 0 40px rgba(209,170,95,0.06)",
        }}
      >
        {/* Light reflection */}
        <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[16px]" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 100%)" }} />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-start p-2.5 pt-4">
        {/* Photo with glow */}
        <div className="relative w-[44px] h-[44px] shrink-0">
          <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(209,170,95,0.3) 0%, transparent 70%)", transform: "scale(1.3)" }} />
          <div className="w-full h-full rounded-full overflow-hidden border" style={{ borderColor: "rgba(209,170,95,0.3)", boxShadow: "0 0 15px rgba(209,170,95,0.15)" }}>
            {player.imageUrl ? (
              <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${adj(color, 40)}, ${color})` }}>
                <span className="text-white/40 text-[16px] font-black">{player.name[0]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="text-center mt-1.5">
          <div className="text-[9px] font-black text-white leading-tight truncate max-w-[75px] drop-shadow">{player.name}</div>
          <div className="flex items-center justify-center gap-1 mt-0.5">
            <span className="text-[6px] px-1.5 py-[1px] rounded-full font-bold" style={{ background: `${hexToRgba(color, 0.2)}`, color }}>{player.position}</span>
            {player.isCaptain && <span className="text-[6px] text-[#D4AF37]">★</span>}
          </div>
        </div>

        {/* Glass divider */}
        <div className="w-full h-px my-1.5" style={{ background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)" }} />

        {/* Stats */}
        <div className="flex items-center justify-center gap-3 w-full">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-white">{player.goalsScored}</span>
            <span className="text-[4px] text-white/40 tracking-widest">GOALS</span>
          </div>
          <div className="w-px h-[18px]" style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.08), transparent)" }} />
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-black text-white" style={{ color: "#d1aa5f" }}>{player.goalsScored + 50}</span>
            <span className="text-[4px] text-white/40 tracking-widest">RATING</span>
          </div>
        </div>

        {/* Goal badge */}
        {player.goalsScored > 3 && (
          <div className="mt-1 px-2 py-[1px] rounded-full" style={{ background: "rgba(209,170,95,0.12)" }}>
            <span className="text-[5px] font-bold tracking-wider" style={{ color: "#d1aa5f" }}>🔥 HOT</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ====== Variant 4: Vertical Elegance ====== */
function V4Vertical({ player }: { player: Player }) {
  const color = posColors[player.position] || "#6B7280";
  return (
    <div className="relative w-[80px]" style={{ height: "133px" }}>
      <div
        className="absolute inset-0 rounded-[8px] overflow-hidden"
        style={{
          background: `linear-gradient(180deg, #030c13 0%, #060a12 50%, #030c13 100%)`,
          border: "1px solid rgba(209,170,95,0.15)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.6)",
        }}
      >
        {/* Photo top half */}
        <div className="absolute inset-x-0 top-0 h-[55%] overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${hexToRgba(color, 0.08)} 0%, transparent 100%)` }} />
          {player.imageUrl ? (
            <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${adj(color, 20)}, ${adj(color, -40)})` }}>
              <span className="text-white/30 text-[24px] font-black">{player.name[0]}</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: "linear-gradient(0deg, #030c13 0%, transparent 100%)" }} />
        </div>

        {/* Gold divider */}
        <div className="absolute inset-x-[10%] top-[54%] h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.4 }} />

        {/* Bottom half info */}
        <div className="absolute inset-x-0 bottom-0 h-[46%] flex flex-col items-center justify-center px-2 pb-2">
          {/* Position badge */}
          <div className="text-[6px] font-black tracking-[2px] mb-0.5" style={{ color }}>{player.position}</div>

          {/* Name */}
          <div className="text-[8px] font-bold text-white leading-tight text-center truncate max-w-[70px]">{player.name}</div>

          {player.isCaptain && <span className="text-[6px] text-[#D4AF37] mt-0.5">★ CAPTAIN</span>}

          {/* Stats column */}
          <div className="flex items-center gap-2 mt-1">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-white">{player.goalsScored}</span>
              <span className="text-[4px] text-white/40">⚽</span>
            </div>
            <div className="w-px h-[12px]" style={{ background: "linear-gradient(180deg, transparent, rgba(255,255,255,0.06), transparent)" }} />
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-white">{player.goalsScored + 50}</span>
              <span className="text-[4px] text-white/40">★</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ====== Variant 5: Holographic ====== */
function V5Holo({ player }: { player: Player }) {
  const color = posColors[player.position] || "#6B7280";
  return (
    <div className="relative w-[92px]" style={{ height: "135px" }}>
      <motion.div
        className="absolute inset-0 rounded-[12px] overflow-hidden"
        style={{
          background: `linear-gradient(135deg, #0a0a12 0%, #14141f 50%, #0a0a12 100%)`,
          border: "1px solid rgba(209,170,95,0.2)",
          boxShadow: "0 8px 28px rgba(0,0,0,0.5), inset 0 0 30px rgba(209,170,95,0.03)",
        }}
        whileHover={{ scale: 1.05, y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
      >
        {/* Holographic sheen */}
        <motion.div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, transparent 30%, rgba(209,170,95,0.06) 40%, rgba(255,215,0,0.08) 45%, rgba(180,130,255,0.04) 50%, rgba(100,200,255,0.03) 55%, transparent 65%)",
            transform: "skewX(-15deg)",
          }}
          animate={{ x: ["-100%", "200%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />

        {/* Diagonal grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: "linear-gradient(45deg, rgba(209,170,95,0.5) 1px, transparent 1px), linear-gradient(-45deg, rgba(209,170,95,0.5) 1px, transparent 1px)",
          backgroundSize: "12px 12px",
        }} />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center p-2.5 pt-4">
          {/* Photo */}
          <div className="w-[42px] h-[42px] rounded-[14px] overflow-hidden shrink-0 relative" style={{
            border: "1px solid rgba(209,170,95,0.25)",
            boxShadow: "0 0 20px rgba(209,170,95,0.12), inset 0 0 20px rgba(209,170,95,0.04)",
          }}>
            {player.imageUrl ? (
              <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${adj(color, 30)}, ${adj(color, -50)})` }}>
                <span className="text-white/30 text-[18px] font-black">{player.name[0]}</span>
              </div>
            )}
            {/* Holo overlay */}
            <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, transparent 40%, rgba(209,170,95,0.06) 50%, transparent 60%)" }} />
          </div>

          {/* Name with gold gradient */}
          <div className="text-center mt-1.5">
            <div className="text-[9px] font-black leading-tight truncate max-w-[78px]" style={{
              background: "linear-gradient(90deg, #e8c97a, #fff, #e8c97a)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}>
              {player.name}
            </div>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <span className="text-[6px] font-bold px-1.5 py-[1px] rounded" style={{
                background: `${hexToRgba(color, 0.15)}`,
                color,
                border: `1px solid ${hexToRgba(color, 0.2)}`,
              }}>{player.position}</span>
            </div>
          </div>

          {/* Gold divider with glow */}
          <div className="w-3/4 h-px my-1.5 relative">
            <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, transparent, rgba(209,170,95,0.3), transparent)" }} />
            <div className="absolute inset-0 blur-[2px]" style={{ background: "linear-gradient(90deg, transparent, rgba(209,170,95,0.15), transparent)" }} />
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-2.5 w-full">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-white drop-shadow">{player.goalsScored}</span>
              <span className="text-[4px] text-white/40 tracking-[1px]">G</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-white drop-shadow">{player.position === "GK" ? 0 : Math.floor(player.goalsScored / 2)}</span>
              <span className="text-[4px] text-white/40 tracking-[1px]">A</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-[#d1aa5f] drop-shadow">{player.goalsScored + 50}</span>
              <span className="text-[4px] text-white/40 tracking-[1px]">RT</span>
            </div>
          </div>

          {/* Bottom accent */}
          <div className="absolute inset-x-[20%] bottom-[6px] h-[1px]" style={{
            background: "linear-gradient(90deg, transparent, rgba(209,170,95,0.15), transparent)",
          }} />
        </div>
      </motion.div>
    </div>
  );
}

/* ====== Main export ====== */
const variants = {
  "fifa": V1Fifa,
  "goldframe": V2GoldFrame,
  "glass": V3Glass,
  "vertical": V4Vertical,
  "holo": V5Holo,
} as const;

export type CardVariant = keyof typeof variants;

export default function PlayerCard({ player, variant = "fifa" }: { player: Player; variant?: CardVariant }) {
  const Comp = variants[variant] || V1Fifa;
  return <Comp player={player} />;
}

export function getAllVariants(): CardVariant[] {
  return Object.keys(variants) as CardVariant[];
}
