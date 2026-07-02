import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "../components/Icon";
import { api } from "../api";
import type { Player } from "../types";
import { SkeletonTable } from "../components/Skeleton";
import TeamBadge from "../components/TeamBadge";

const medalColors = ["#FFD700", "#94a3b8", "#b45309"];

export default function TopScorersPage() {
  const [scorers, setScorers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallback = setTimeout(() => setLoading(false), 10000);
    api.getTopScorers().then((data) => {
      setScorers(data);
    }).catch(() => {});
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SkeletonTable rows={10} cols={4} />
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
        قائمة <span className="text-gold-gradient">الهدافين</span>
      </motion.h1>

      {/* Top 3 podium */}
      {scorers.length >= 3 && (
        <div className="flex items-end justify-center gap-4 mb-12 flex-wrap">
          {[1, 0, 2].map((pos) => {
            const scorer = scorers[pos];
            if (!scorer) return null;
            const heights = ["h-24 sm:h-32", "h-32 sm:h-40", "h-20 sm:h-28"];
            const labels = ["الوصيف", "الهداف", "الثالث"];
            const medalIcons = [
              <Icon name="medal" key="silver" className="text-gray-300" size={32} />,
              <Icon name="crown" key="gold" className="text-[#FFD700]" size={36} />,
              <Icon name="medal" key="bronze" className="text-amber-600" size={32} />,
            ];
            return (
              <motion.div
                key={scorer.id}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: pos * 0.1 }}
              >
                <div className="flex justify-center mb-2">
                  {medalIcons[pos]}
                </div>
                <div className={`glass-card p-3 sm:p-4 text-center w-28 sm:w-36 flex flex-col items-center justify-end ${heights[pos]}`}
                  style={pos === 1 ? { borderColor: "rgba(212, 175, 55, 0.3)" } : {}}
                >
                  <div className="flex justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                      <path d="M12 8v4"/>
                      <path d="M12 16h.01"/>
                    </svg>
                  </div>
                    <div className="font-bold text-white text-xs sm:text-sm lg:text-base mt-1 truncate max-w-full">{scorer.name}</div>
                  <div className="text-xs lg:text-sm text-gray-400 truncate max-w-full">{scorer.team?.shortName}</div>
                  <motion.div
                    className={`text-2xl sm:text-3xl font-black ${pos === 0 ? "text-[#FFD700]" : pos === 1 ? "text-gray-300" : "text-amber-600"}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.3 + pos * 0.1 }}
                  >
                    {scorer.goalsScored}
                  </motion.div>
                    <div className="text-[10px] lg:text-xs text-gray-500">هدف</div>
                </div>
                <div className="text-xs text-gray-400 mt-2">{labels[pos]}</div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Full list */}
      <motion.div
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center px-4 py-3 border-b border-[rgba(212,175,55,0.12)] text-xs lg:text-sm text-gray-500 font-bold tracking-wider gap-1">
          <span style={{ width: 40 }}>#</span>
          <span style={{ width: 60, textAlign: 'center' }}>المركز</span>
          <span style={{ width: 100 }}>الفريق</span>
          <span className="flex-1 min-w-0">اللاعب</span>
          <span style={{ width: 60, textAlign: 'center' }}>الأهداف</span>
        </div>

        {scorers.map((scorer, i) => (
          <motion.div
            key={scorer.id}
            className="flex items-center px-4 py-3 border-b border-[rgba(212,175,55,0.06)] hover:bg-card-hover transition-all duration-200 hover:translate-x-1 gap-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.03 }}
          >
            <span style={{ width: 40 }} className={`font-bold text-sm ${i < 3 ? "text-[#D4AF37]" : "text-gray-400"}`}>
              {i < 3 ? (
                <Icon
                  name="medal"
                  size={18}
                  className={i === 0 ? "text-[#FFD700]" : i === 1 ? "text-gray-300" : "text-amber-600"}
                />
              ) : (
                i + 1
              )}
            </span>
            <span style={{ width: 60, textAlign: 'center' }} className="text-xs lg:text-sm text-gray-500 font-bold">
              {scorer.position}
            </span>
            <div style={{ width: 100 }} className="flex items-center gap-1">
              {scorer.team && <TeamBadge src={scorer.team.logo} alt={scorer.team.shortName} size={5} />}
              <span className="text-xs lg:text-sm text-gray-400 truncate">{scorer.team?.shortName}</span>
            </div>
            <div className="flex-1 min-w-0 flex items-center gap-1.5">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span className="font-bold text-white text-sm lg:text-base truncate">
                {scorer.name}
                {scorer.isCaptain && (
                  <svg className="inline mr-1 text-[#D4AF37] shrink-0" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                )}
              </span>
            </div>
            <motion.span
              className="text-center font-black text-base lg:text-lg text-[#D4AF37]"
              style={{ width: 60 }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.5 + i * 0.03 }}
            >
              {scorer.goalsScored}
            </motion.span>
          </motion.div>
        ))}
      </motion.div>

      {scorers.length === 0 && (
        <motion.div
          className="text-center py-16 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <svg className="mx-auto mb-4" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <div>لا يوجد أهداف حتى الآن</div>
        </motion.div>
      )}
    </div>
  );
}
