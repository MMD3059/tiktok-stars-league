import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "../components/Icon";
import { api } from "../api";
import type { Team, Match } from "../types";
import { SkeletonLine } from "../components/Skeleton";
import TeamBadge from "../components/TeamBadge";
import PlayerCard, { type CardVariant } from "../components/PlayerCard";
import AnimatedCounter from "../components/AnimatedCounter";
import { useCountUp } from "../hooks/useCountUp";

const posColors: Record<string, string> = {
  GK: "#EAB308", DEF: "#3B82F6", LW: "#10B981",
  RW: "#10B981", MID: "#A855F7", FWD: "#F97316", SUB: "#6B7280",
};

function hexToRgba(h: string, a: number) {
  if (!h || h === "transparent") return `rgba(0,0,0,${a})`;
  const c = h.replace("#", "");
  return `rgba(${parseInt(c.slice(0,2),16)},${parseInt(c.slice(2,4),16)},${parseInt(c.slice(4,6),16)},${a})`;
}

const STORAGE_KEY = "preferred_card_variant";
const SQUAD_TABS = ["ALL", "GK", "DEF", "MID", "FWD"] as const;

const sectionVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const cardEnterVariants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.03, duration: 0.3 },
  }),
};

const barVariants = {
  hidden: { width: 0 },
  visible: (pct: number) => ({
    width: `${pct}%`,
    transition: { duration: 0.8, ease: "easeOut" },
  }),
};

function CountUp({ end, suffix = "", className = "", style }: { end: number; suffix?: string; className?: string; style?: React.CSSProperties }) {
  const { count, ref } = useCountUp(end);
  return <span ref={ref} className={className} style={style}>{count}{suffix}</span>;
}

function TeamMatchCard({ match, teamId, highlighted }: { match: Match; teamId: number; highlighted?: boolean }) {
  const isHome = match.homeTeamId === teamId;
  const opponent = isHome ? match.awayTeam : match.homeTeam;
  const teamScore = isHome ? match.homeScore : match.awayScore;
  const oppScore = isHome ? match.awayScore : match.homeScore;
  const isPlayed = match.status === "played";
  const won = isPlayed && teamScore != null && oppScore != null && teamScore > oppScore;
  const lost = isPlayed && teamScore != null && oppScore != null && teamScore < oppScore;

  return (
    <motion.div
      className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
        highlighted ? "bg-[rgba(212,175,55,0.06)] border border-[rgba(212,175,55,0.15)]" : "hover:bg-white/[0.03]"
      }`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <TeamBadge src={opponent.logo} alt={opponent.shortName} size={6} />
        <span className="text-[11px] lg:text-sm font-bold text-white truncate">{opponent.shortName}</span>
      </div>
      <div className="text-center shrink-0">
        {isPlayed ? (
          <motion.span
            className={`text-sm lg:text-base font-black ${won ? "text-win" : lost ? "text-loss" : "text-gray-300"}`}
            initial={{ scale: 0, rotateX: 90 }}
            animate={{ scale: 1, rotateX: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <AnimatedCounter end={teamScore ?? 0} />-<AnimatedCounter end={oppScore ?? 0} />
          </motion.span>
        ) : (
          <span className="text-[11px] lg:text-sm font-bold text-[#D4AF37]">{match.time}</span>
        )}
      </div>
      <div className="text-[9px] lg:text-xs text-gray-500 shrink-0 text-left min-w-[60px]" dir="ltr">
        <div>{match.date}</div>
      </div>
    </motion.div>
  );
}

export default function TeamPage() {
  const { id } = useParams();
  const [team, setTeam] = useState<Team | null>(null);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [squadTab, setSquadTab] = useState("ALL");
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [cardVariant] = useState<CardVariant>(() => {
    return (localStorage.getItem(STORAGE_KEY) as CardVariant) || "fifa";
  });

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setTeam(null);
    setAllMatches([]);
    const fallback = setTimeout(() => setLoading(false), 10000);
    Promise.all([
      api.getTeam(Number(id)),
      api.getMatches(),
    ]).then(([teamData, matchesData]) => {
      setTeam(teamData);
      setAllMatches(matchesData);
    }).catch(() => {});
  }, [id]);

  useEffect(() => {
    const handler = (e: MouseEvent) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <SkeletonLine width="200px" />
        <SkeletonLine width="100%" />
        <SkeletonLine width="100%" />
      </div>
    );
  }

  if (!team) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-400">الفريق غير موجود</div>
    );
  }

  const allPlayers = team.players || [];
  const captain = allPlayers.find((p) => p.isCaptain);
  const totalGoals = allPlayers.reduce((sum, p) => sum + p.goalsScored, 0);
  const scorersCount = allPlayers.filter((p) => p.goalsScored > 0).length;
  const topScorer = [...allPlayers].sort((a, b) => b.goalsScored - a.goalsScored)[0];

  const filtered =
    squadTab === "ALL"
      ? allPlayers
      : squadTab === "FWD"
        ? allPlayers.filter((p) => ["LW","RW","FWD"].includes(p.position))
        : allPlayers.filter((p) => p.position === squadTab);

  const scorers = allPlayers
    .filter((p) => p.goalsScored > 0)
    .sort((a, b) => b.goalsScored - a.goalsScored);

  const maxGoals = scorers.length > 0 ? Math.max(...scorers.map((x) => x.goalsScored)) : 1;

  const teamId = Number(id);
  const teamMatches = allMatches
    .filter((m) => m.homeTeamId === teamId || m.awayTeamId === teamId)
    .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
  const previousMatches = teamMatches.filter((m) => m.status === "played").reverse();
  const upcomingMatches = teamMatches.filter((m) => m.status === "scheduled");
  const currentMatch = upcomingMatches[0] || null;
  const nextMatches = upcomingMatches.slice(1);

  return (
    <div className="min-h-screen relative">
      {/* Mouse glow */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: `radial-gradient(700px at ${mousePos.x}px ${mousePos.y}px, rgba(212,175,55,0.03) 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 space-y-10">
        {/* ═══════════════ 1. HERO BANNER ═══════════════ */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative overflow-hidden rounded-2xl p-6 md:p-10 text-center"
          style={{
            background: `linear-gradient(180deg, ${hexToRgba(team.color, 0.07)} 0%, rgba(20,20,20,0.95) 100%)`,
            border: "1px solid rgba(212,175,55,0.1)",
          }}
        >
          {/* Shimmer top line */}
          <div
            className="absolute top-0 inset-x-0 h-0.5"
            style={{
              background: "linear-gradient(90deg, transparent, #D4AF37, #FFD700, #D4AF37, transparent)",
              backgroundSize: "200% 100%",
              animation: "shine 3s ease-in-out infinite",
            }}
          />

          {/* Animated glow behind logo */}
          <motion.div
            className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full blur-3xl pointer-events-none"
            style={{ background: hexToRgba(team.color, 0.12) }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Floating logo */}
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative inline-block mb-3"
          >
            <div className="relative">
              <TeamBadge src={team.logo} alt={team.shortName} size={20} className="relative z-10" />
              <div
                className="absolute inset-0 rounded-full blur-md"
                style={{ background: hexToRgba("#D4AF37", 0.15) }}
              />
            </div>
          </motion.div>

          {/* Team name */}
          <h1 className="text-2xl md:text-4xl font-black mb-5 text-gold-gradient-clip">
            {team.name || team.shortName}
          </h1>

          {/* Stats row */}
          <div className="flex justify-center gap-3 md:gap-4">
            <div
              className="rounded-xl px-4 py-3 min-w-[80px] text-center"
              style={{
                background: "rgba(20,20,20,0.85)",
                border: "1px solid rgba(212,175,55,0.1)",
              }}
            >
              <CountUp end={allPlayers.length} className="text-xl md:text-2xl font-black block" style={{ color: "#D4AF37" }} />
              <span className="text-[8px] lg:text-xs text-gray-500 uppercase">Players</span>
            </div>
            <div
              className="rounded-xl px-4 py-3 min-w-[80px] text-center"
              style={{
                background: "rgba(20,20,20,0.85)",
                border: "1px solid rgba(212,175,55,0.1)",
              }}
            >
              <CountUp end={totalGoals} className="text-xl md:text-2xl font-black block text-win" />
              <span className="text-[8px] lg:text-xs text-gray-500 uppercase">Goals</span>
            </div>
            <div
              className="rounded-xl px-4 py-3 min-w-[80px] text-center"
              style={{
                background: "rgba(20,20,20,0.85)",
                border: "1px solid rgba(212,175,55,0.1)",
              }}
            >
              <CountUp end={scorersCount} className="text-xl md:text-2xl font-black block" style={{ color: "#D4AF37" }} />
              <span className="text-[8px] lg:text-xs text-gray-500 uppercase">Scorers</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex justify-center gap-3 mt-4 flex-wrap">
            {captain && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{
                  background: "rgba(212,175,55,0.08)",
                  border: "1px solid rgba(212,175,55,0.15)",
                }}
              >
                <Icon name="star" size={12} className="text-[#D4AF37]" />
                <span className="text-[10px] lg:text-sm text-gray-300">
                  C: <span className="text-[#D4AF37] font-bold">{captain.name}</span>
                </span>
              </motion.div>
            )}
            {topScorer && topScorer.goalsScored > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                style={{
                  background: "rgba(34,197,94,0.08)",
                  border: "1px solid rgba(34,197,94,0.15)",
                }}
              >
                <Icon name="target" size={12} className="text-win" />
                <span className="text-[10px] lg:text-sm text-gray-300">
                  Top: <span className="text-win font-bold">{topScorer.name}</span>
                </span>
              </motion.div>
            )}
          </div>

          {/* Bottom shimmer line */}
          <div
            className="absolute bottom-0 inset-x-0 h-0.5"
            style={{
              background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.15), transparent)",
            }}
          />
        </motion.div>



        {/* ═══════════════ 3. SQUAD GALLERY ═══════════════ */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="rounded-2xl p-4 md:p-6"
          style={{
            background: "rgba(20,20,20,0.85)",
            border: "1px solid rgba(212,175,55,0.1)",
          }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <div
              className="h-px flex-1 max-w-[80px]"
              style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2))" }}
            />
            <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
              <Icon name="trophy" size={14} className="text-[#D4AF37]" />
              SQUAD
              <span className="text-gray-500 text-[10px] lg:text-xs">({allPlayers.length})</span>
            </h2>
            <div
              className="h-px flex-1 max-w-[80px]"
              style={{ background: "linear-gradient(270deg, transparent, rgba(212,175,55,0.2))" }}
            />
          </div>

          {/* Tabs */}
          <div className="flex justify-center gap-1 mb-6 flex-wrap">
            {SQUAD_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setSquadTab(tab)}
                className="relative px-3 py-1.5 text-[10px] lg:text-xs font-bold rounded-lg transition-all duration-200"
                style={{
                  background:
                    squadTab === tab ? "rgba(212,175,55,0.1)" : "transparent",
                  color:
                    squadTab === tab ? "#D4AF37" : "rgba(255,255,255,0.35)",
                }}
              >
                {tab === "ALL" ? "All" : tab}
                {squadTab === tab && (
                  <motion.div
                    layoutId="tab-active"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full"
                    style={{ background: "#D4AF37" }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Cards */}
          <AnimatePresence mode="wait">
            <motion.div
              key={squadTab + filtered.length}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="flex flex-wrap justify-center gap-3"
            >
              {filtered.map((p, i) => (
                <motion.div
                  key={p.id}
                  custom={i}
                  variants={cardEnterVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <PlayerCard player={p} variant={cardVariant} />
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="text-gray-500 text-xs lg:text-sm py-8">
                  لا يوجد لاعبون في هذا المركز
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        {/* ═══════════════ 4. STATS DASHBOARD ═══════════════ */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {/* Top Scorers */}
          <div
            className="rounded-2xl p-4 md:p-5"
            style={{
              background: "rgba(20,20,20,0.85)",
              border: "1px solid rgba(212,175,55,0.1)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-4">
              <Icon name="zap" size={13} className="text-[#D4AF37]" />
              <span className="text-xs lg:text-sm font-bold text-white">TOP SCORERS</span>
            </div>
            <div className="space-y-2.5">
              {scorers.slice(0, 5).map((p, i) => {
                const pct = (p.goalsScored / maxGoals) * 100;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.4 }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-[9px] lg:text-xs font-bold text-gray-500 w-3 shrink-0">
                      {i + 1}
                    </span>
                    <div
                      className="w-5 h-5 rounded-full overflow-hidden shrink-0 border"
                      style={{ borderColor: "rgba(212,175,55,0.15)" }}
                    >
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-[6px] lg:text-[9px] font-black"
                          style={{
                            background: hexToRgba(
                              posColors[p.position] || "#D4AF37",
                              0.2
                            ),
                            color: posColors[p.position] || "#D4AF37",
                          }}
                        >
                          {p.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] lg:text-xs font-bold text-white w-14 md:w-20 truncate">
                      {p.name}
                    </span>
                    <div className="flex-1 h-2.5 rounded-full overflow-hidden bg-dark">
                      <motion.div
                        className="h-full rounded-full"
                        custom={pct}
                        variants={barVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        style={{
                          background: `linear-gradient(90deg, ${posColors[p.position] || "#D4AF37"}, #D4AF37)`,
                          boxShadow: "0 0 6px rgba(212,175,55,0.15)",
                        }}
                      />
                    </div>
                    <span className="text-[10px] lg:text-xs font-black text-white w-5 text-right shrink-0">
                      {p.goalsScored}
                    </span>
                  </motion.div>
                );
              })}
              {scorers.length === 0 && (
                <div className="text-gray-500 text-xs lg:text-sm text-center py-4">
                  No goals scored yet
                </div>
              )}
            </div>
          </div>

          {/* Full Roster */}
          <div
            className="rounded-2xl p-4 md:p-5"
            style={{
              background: "rgba(20,20,20,0.85)",
              border: "1px solid rgba(212,175,55,0.1)",
            }}
          >
            <div className="flex items-center gap-1.5 mb-4">
              <Icon name="user" size={13} className="text-[#D4AF37]" />
              <span className="text-xs lg:text-sm font-bold text-white">FULL ROSTER</span>
              <span className="text-[9px] lg:text-xs text-gray-500">({allPlayers.length})</span>
            </div>
            <div
              className="space-y-0.5 max-h-[320px] overflow-y-auto pr-1"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(212,175,55,0.15) transparent",
              }}
            >
              {allPlayers.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -8 : 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.015, duration: 0.3 }}
                  className="flex items-center justify-between p-1.5 rounded-lg transition-all duration-150 group cursor-default hover:bg-white/[0.03]"
                  style={{
                    borderLeft: "2px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderLeftColor = "rgba(212,175,55,0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderLeftColor = "transparent";
                  }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center text-[6px] lg:text-[9px] font-black shrink-0"
                      style={{
                        background: hexToRgba(
                          posColors[p.position] || "#6B7280",
                          0.12
                        ),
                        color: posColors[p.position] || "#6B7280",
                      }}
                    >
                      {p.position}
                    </div>
                    <div
                      className="w-5 h-5 rounded-full overflow-hidden shrink-0 border"
                      style={{ borderColor: "rgba(212,175,55,0.1)" }}
                    >
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[6px] lg:text-[9px] font-black text-gray-500 bg-white/[0.03]">
                          {p.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <span className="text-[9px] lg:text-xs font-bold text-white truncate max-w-[90px] md:max-w-[120px]">
                      {p.name}
                    </span>
                    {p.isCaptain && (
                      <Icon name="star" size={7} className="text-[#D4AF37] shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[8px] lg:text-[11px] font-bold text-win">{p.goalsScored}⚽</span>
                    {p.price != null && (
                      <span className="text-[7px] lg:text-[10px] font-bold text-[#D4AF37]">{p.price.toLocaleString()}$</span>
                    )}
                    <span
                      className="text-[6px] lg:text-[9px] px-1.5 py-0.5 rounded font-bold"
                      style={{
                        background:
                          p.isSubstitute || p.position === "SUB"
                            ? "rgba(107,114,128,0.12)"
                            : "rgba(34,197,94,0.12)",
                        color:
                          p.isSubstitute || p.position === "SUB"
                            ? "#9CA3AF"
                            : "#22C55E",
                      }}
                    >
                      {p.isSubstitute || p.position === "SUB" ? "SUB" : "XI"}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* ═══════════════ 5. MATCHES ═══════════════ */}
        {teamMatches.length > 0 && (
          <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="rounded-2xl p-4 md:p-5"
            style={{
              background: "rgba(20,20,20,0.85)",
              border: "1px solid rgba(212,175,55,0.1)",
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2))" }} />
              <h2 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                <Icon name="calendar-days" size={14} className="text-[#D4AF37]" />
                MATCHES
              </h2>
              <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(270deg, transparent, rgba(212,175,55,0.2))" }} />
            </div>

            {/* Current / Next Match */}
            {currentMatch && (
              <div className="mb-5">
                <div className="text-[10px] lg:text-xs text-[#D4AF37] font-bold mb-2 text-center tracking-widest">
                  {previousMatches.length === 0 ? "NEXT MATCH" : "CURRENT / NEXT"}
                </div>
                <TeamMatchCard match={currentMatch} teamId={teamId} highlighted />
              </div>
            )}

            {/* Previous Matches */}
            {previousMatches.length > 0 && (
              <div className="mb-4">
                <div className="text-[10px] lg:text-xs text-gray-500 font-bold mb-2 tracking-widest">PREVIOUS</div>
                <div className="space-y-1.5">
                  {previousMatches.map((m) => (
                    <TeamMatchCard key={m.id} match={m} teamId={teamId} />
                  ))}
                </div>
              </div>
            )}

            {/* Next Matches */}
            {nextMatches.length > 0 && (
              <div>
                <div className="text-[10px] lg:text-xs text-gray-500 font-bold mb-2 tracking-widest">UPCOMING</div>
                <div className="space-y-1.5">
                  {nextMatches.map((m) => (
                    <TeamMatchCard key={m.id} match={m} teamId={teamId} />
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* ═══════════════ 6. BACK BUTTON ═══════════════ */}
        <div className="text-center pb-6">
          <Link to="/teams">
            <motion.span
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl border text-[11px] lg:text-sm font-bold cursor-pointer transition-all duration-200"
              style={{
                borderColor: "rgba(212,175,55,0.15)",
                color: "#D4AF37",
              }}
              whileHover={{
                scale: 1.05,
                borderColor: "rgba(212,175,55,0.4)",
                boxShadow: "0 0 20px rgba(212,175,55,0.1)",
              }}
              whileTap={{ scale: 0.97 }}
            >
              <Icon name="arrow-up-right" size={12} />
              ALL TEAMS
            </motion.span>
          </Link>
        </div>
      </div>
    </div>
  );
}
