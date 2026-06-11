import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { Player } from "../types";

function hexToRgba(h: string, a: number) {
  if (!h || h === "transparent") return `rgba(0,0,0,${a})`;
  const c = h.replace("#", "");
  return `rgba(${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)},${a})`;
}

const posColors: Record<string, string> = {
  GK: "#EAB308", DEF: "#3B82F6", LW: "#10B981",
  RW: "#10B981", MID: "#A855F7", FWD: "#F97316", SUB: "#6B7280",
};

interface Props {
  player: Player;
  teamColor?: string;
}

export default function SpotlightCard({ player, teamColor = "#D4AF37" }: Props) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const springX = useSpring(mx, { stiffness: 300, damping: 30 });
  const springY = useSpring(my, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(springY, [0, 1], [12, -12]);
  const rotateY = useTransform(springX, [0, 1], [-12, 12]);

  const glareX = useTransform(springX, [0, 1], [30, -30]);
  const glareY = useTransform(springY, [0, 1], [30, -30]);

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => { mx.set(0.5); my.set(0.5); };

  const color = posColors[player.position] || "#6B7280";

  return (
    <motion.div
      className="relative w-full max-w-sm mx-auto cursor-pointer"
      style={{ perspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.7, ease: "easeOut" }}
    >
      <motion.div
        className="relative rounded-2xl overflow-hidden p-5 md:p-6"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          background: `linear-gradient(135deg, rgba(25,25,35,0.96), rgba(35,25,15,0.92))`,
          border: "1px solid rgba(212,175,55,0.15)",
          boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Gold glow sphere */}
        <motion.div
          className="absolute -inset-20 rounded-full opacity-25 blur-3xl pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${hexToRgba(teamColor, 0.3)} 0%, transparent 70%)`,
            x: glareX,
            y: glareY,
          }}
        />

        <div className="relative z-10 flex items-center gap-4 md:gap-5">
          {/* Photo */}
          <motion.div
            className="relative shrink-0"
          >
            <div
              className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden"
              style={{
                border: "2px solid rgba(212,175,55,0.35)",
                boxShadow: "0 0 20px rgba(212,175,55,0.15)",
              }}
            >
              {player.imageUrl ? (
                <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-xl md:text-2xl font-black"
                  style={{ background: `linear-gradient(135deg, ${color}44, ${color}22)`, color }}
                >
                  {player.name.charAt(0)}
                </div>
              )}
            </div>
            {/* Pulse ring */}
            <div
              className="absolute -inset-1.5 rounded-full animate-gold-pulse"
              style={{ border: "1px solid rgba(212,175,55,0.25)" }}
            />
          </motion.div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="text-[10px] font-black px-2 py-0.5 rounded"
                  style={{ background: `${hexToRgba(color, 0.2)}`, color }}
                >
                  {player.position}
                </span>
                {player.isCaptain && (
                  <span className="text-[9px]" style={{ color: "#D4AF37" }}>★ CAPTAIN</span>
                )}
              </div>
              <h3 className="text-lg md:text-xl font-black text-white truncate leading-tight">
                {player.name}
              </h3>
            </motion.div>

            <motion.div
              className="flex gap-4 md:gap-6 mt-2 md:mt-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45, duration: 0.5 }}
            >
              <div className="text-center">
                <div className="text-lg md:text-xl font-black" style={{ color: "#D4AF37" }}>
                  {player.goalsScored}
                </div>
                <div className="text-[8px] text-gray-500 uppercase tracking-wide">Goals</div>
              </div>
              <div className="w-px bg-[rgba(212,175,55,0.1)]" />
              <div className="text-center">
                <div className="text-lg md:text-xl font-black text-white">
                  {Math.min(99, Math.floor(player.goalsScored * 6.7 + 50))}
                </div>
                <div className="text-[8px] text-gray-500 uppercase tracking-wide">Rating</div>
              </div>
              <div className="w-px bg-[rgba(212,175,55,0.1)]" />
              <div className="text-center">
                <div className="text-lg md:text-xl font-black text-white">{player.goalsScored > 0 ? 1 : 0}</div>
                <div className="text-[8px] text-gray-500 uppercase tracking-wide">MVP</div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Shine sweep */}
        <div className="shine-overlay absolute inset-0 pointer-events-none rounded-2xl" />
      </motion.div>
    </motion.div>
  );
}
