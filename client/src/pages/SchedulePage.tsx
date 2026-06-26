import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import Icon from "../components/Icon";
import { api } from "../api";
import type { Match } from "../types";
import TiltCard from "../components/TiltCard";
import { SkeletonCard } from "../components/Skeleton";
import TeamBadge from "../components/TeamBadge";

export default function SchedulePage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "played" | "scheduled">("all");

  useEffect(() => {
    api.getMatches().then((data) => {
      setMatches(data);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = matches.filter((m) => {
      if (activeTab === "all") return true;
      return m.status === activeTab;
    });
    list.sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));
    return list;
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
          >
            {tab === "all" ? "الكل" : tab === "played" ? "المنتهية" : "المجدولة"}
          </motion.button>
        ))}
      </div>

      {/* All matches sorted by date */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((match, i) => {
          const isPlayed = match.status === "played";
              const homeWon =
                isPlayed &&
                match.homeScore != null &&
                match.awayScore != null &&
                match.homeScore > match.awayScore;
              const awayWon =
                isPlayed &&
                match.homeScore != null &&
                match.awayScore != null &&
                match.awayScore > match.homeScore;
              const isDraw =
                isPlayed &&
                match.homeScore != null &&
                match.awayScore != null &&
                match.homeScore === match.awayScore;

              return (
                <TiltCard key={match.id}>
                  <motion.div
                    className={`glass-card p-4 group hover:-translate-y-1 transition-transform duration-200 ${isPlayed ? "" : "border-[rgba(212,175,55,0.2)] animate-gold-border"}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <motion.div
                      className="hover:[transform:rotateY(3deg)_rotateX(-2deg)] transition-transform duration-200"
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className={`flex-1 text-center ${homeWon ? "opacity-100" : isDraw ? "opacity-80" : "opacity-60"}`}>
                          <TeamBadge src={match.homeTeam.logo} alt={match.homeTeam.shortName} size={9} />
                          <div className="font-bold text-white text-sm lg:text-lg truncate">{match.homeTeam.shortName}</div>
                        </div>

                        {/* Score */}
                        <div className="text-center">
                          {isPlayed ? (
                            <div className="flex items-center gap-2">
                              <motion.span
                                className={`text-2xl lg:text-3xl font-black ${homeWon ? "text-win" : isDraw ? "text-gray-300" : "text-loss"}`}
                                key={`h-${match.id}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                              >
                                {match.homeScore}
                              </motion.span>
                              <span className="text-gray-500 text-lg lg:text-xl">-</span>
                              <motion.span
                                className={`text-2xl lg:text-3xl font-black ${awayWon ? "text-win" : isDraw ? "text-gray-300" : "text-loss"}`}
                                key={`a-${match.id}`}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", delay: 0.3 }}
                              >
                                {match.awayScore}
                              </motion.span>
                            </div>
                          ) : (
                            <div className="text-[#D4AF37] font-bold">VS</div>
                          )}
                          <div className="text-xs lg:text-sm text-gray-500 mt-1">
                            {["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"][new Date(match.date + "T12:00:00").getDay()]} {match.date}
                          </div>
                          <div className="text-xs lg:text-sm text-gray-500">{match.time}</div>
                        </div>

                        <div className={`flex-1 text-center ${awayWon ? "opacity-100" : isDraw ? "opacity-80" : "opacity-60"}`}>
                          <TeamBadge src={match.awayTeam.logo} alt={match.awayTeam.shortName} size={9} />
                          <div className="font-bold text-white text-sm lg:text-lg truncate">{match.awayTeam.shortName}</div>
                        </div>
                      </div>

                      {isPlayed && (
                        <motion.div
                          className="text-center mt-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.4 }}
                        >
                          {homeWon && (
                              <span className="text-xs lg:text-sm text-win">فوز {match.homeTeam.shortName}</span>
                            )}
                            {awayWon && (
                              <span className="text-xs lg:text-sm text-win">فوز {match.awayTeam.shortName}</span>
                            )}
                            {isDraw && <span className="text-xs lg:text-sm text-gray-400">تعادل</span>}
                        </motion.div>
                      )}

                      {!isPlayed && (
                        <motion.div
                          className="text-center mt-2 flex items-center justify-center gap-1"
                          animate={{ opacity: [0.5, 1, 0.5] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-live-pulse" />
                          <span className="text-xs lg:text-sm text-[#D4AF37]">قادمة</span>
                        </motion.div>
                      )}
                    </motion.div>
                  </motion.div>
                </TiltCard>
              );
        })}
      </div>
    </div>
  );
}
