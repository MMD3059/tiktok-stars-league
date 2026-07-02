import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Icon from "../components/Icon";
import { api } from "../api";
import type { Match } from "../types";
import { SkeletonCard } from "../components/Skeleton";
import TeamBadge from "../components/TeamBadge";
import MatchDetailModal from "../components/MatchDetailModal";

export default function SchedulePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "played" | "scheduled">("all");
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    const fallback = setTimeout(() => setLoading(false), 10000);
    api.getMatches().then(setMatches).catch(() => {}).finally(() => clearTimeout(fallback));
  }, []);

  const weeks = useMemo(() => {
    let list = matches.filter((m) => {
      if (activeTab === "all") return true;
      return m.status === activeTab;
    });
    list.sort((a, b) => a.week - b.week || a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    const grouped: { week: number; matches: Match[] }[] = [];
    for (const m of list) {
      const g = grouped.find((g) => g.week === m.week);
      if (g) g.matches.push(m);
      else grouped.push({ week: m.week, matches: [m] });
    }
    return grouped;
  }, [matches, activeTab]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl md:text-4xl font-black text-white mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        جدول <span className="text-gold-gradient">المباريات</span>
      </motion.h1>

      {/* Tabs */}
      <div className="flex justify-center gap-2 mb-8">
        {(["all", "played", "scheduled"] as const).map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-xl font-bold text-sm transition-all duration-200 ${
              activeTab === tab
                ? "bg-[#D4AF37] text-black"
                : "bg-dark text-gray-400 border border-[rgba(212,175,55,0.15)] hover:scale-105 hover:text-white active:scale-95"
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {tab === "all" ? "الكل" : tab === "played" ? "المنتهية" : "المجدولة"}
          </motion.button>
        ))}
      </div>

      {/* Week groups */}
      {weeks.length === 0 && (
        <div className="text-center py-16 text-gray-500">لا توجد مباريات</div>
      )}

      {weeks.map(({ week, matches: weekMatches }) => (
        <div key={week} className="mb-10">
          {/* Week header */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2))" }} />
            <motion.h2
              className="text-sm lg:text-base font-black text-[#D4AF37] tracking-widest"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              الجولة {week}
            </motion.h2>
            <div className="h-px flex-1 max-w-[60px]" style={{ background: "linear-gradient(270deg, transparent, rgba(212,175,55,0.2))" }} />
          </div>

          <style>{`
            .schedule-grid {
              display: grid;
              gap: 18px;
              grid-template-columns: 1fr;
            }
            @media (min-width: 1024px) {
              .schedule-grid {
                grid-template-columns: repeat(2, minmax(520px, 1fr));
              }
            }
          `}</style>

          {/* Match cards — responsive grid (1 col mobile, 2 col desktop) */}
          <div className="schedule-grid" style={{ display: "grid" }}>
            {weekMatches.map((match, i) => {
              const isPlayed = match.status === "played";
              const homeWon = isPlayed && match.homeScore != null && match.awayScore != null && match.homeScore > match.awayScore;
              const awayWon = isPlayed && match.homeScore != null && match.awayScore != null && match.awayScore > match.homeScore;
              const isDraw = isPlayed && match.homeScore != null && match.awayScore != null && match.homeScore === match.awayScore;
              const dayNames = ["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"];
              const dayName = dayNames[new Date(match.date + "T12:00:00").getDay()];

              return (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                  className={`flex items-center justify-between transition-all duration-200 hover:bg-white/[0.03] ${isPlayed ? "cursor-pointer" : ""}`}
                  onClick={isPlayed ? () => setSelectedMatch(match) : undefined}
                  style={{
                    width: "100%",
                    minHeight: "130px",
                    borderRadius: "18px",
                    padding: "20px",
                    background: "rgba(20,20,20,0.85)",
                    border: isPlayed
                      ? "1px solid rgba(212,175,55,0.25)"
                      : "1px solid rgba(212,175,55,0.1)",
                  }}
                >
                  {/* Home team */}
                  <div className={`flex items-center gap-2 flex-none ${homeWon ? "opacity-100" : isDraw ? "opacity-80" : "opacity-60"}`}>
                    <TeamBadge src={match.homeTeam.logo} alt={match.homeTeam.shortName} size={14} />
                    <span className="text-[12px] font-bold text-white max-w-[55px] leading-tight truncate">{match.homeTeam.shortName}</span>
                  </div>

                  {/* Score / VS + day + date */}
                  <div className="text-center shrink-0">
                    {isPlayed ? (
                      <span className={`text-base font-black ${homeWon ? "text-win" : awayWon ? "text-loss" : "text-gray-300"}`}>
                        {match.homeScore} - {match.awayScore}
                      </span>
                    ) : (
                      <div className="text-sm font-black text-[#D4AF37]">VS</div>
                    )}
                    <div className="text-[10px] text-gray-500 leading-tight mt-0.5">{match.time}</div>
                    <div className="text-[10px] text-gray-500 leading-tight">{dayName}</div>
                    <div className="text-[10px] text-gray-500 leading-tight">{match.date}</div>
                  </div>

                  {/* Away team */}
                  <div className={`flex items-center gap-2 flex-none justify-end ${awayWon ? "opacity-100" : isDraw ? "opacity-80" : "opacity-60"}`}>
                    <span className="text-[12px] font-bold text-white max-w-[55px] leading-tight truncate">{match.awayTeam.shortName}</span>
                    <TeamBadge src={match.awayTeam.logo} alt={match.awayTeam.shortName} size={14} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      ))}
      <MatchDetailModal match={selectedMatch} onClose={() => setSelectedMatch(null)} />
    </div>
  );
}
