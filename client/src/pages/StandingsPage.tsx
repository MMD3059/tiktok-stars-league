import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "../components/Icon";
import { api } from "../api";
import type { Standing } from "../types";
import AnimatedBar from "../components/AnimatedBar";
import { SkeletonTable } from "../components/Skeleton";
import TeamBadge from "../components/TeamBadge";

const medalColors = [
  { color: "text-[#FFD700]", bg: "rgba(212,175,55,0.3)" },
  { color: "text-gray-300", bg: "rgba(156,163,175,0.3)" },
  { color: "text-amber-600", bg: "rgba(217,119,6,0.3)" },
];

const podiumTargets = [192, 144, 112];

export default function StandingsPage() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getStandings().then((data) => {
      setStandings(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SkeletonTable rows={10} cols={6} />
      </div>
    );
  }

  const maxPoints = Math.max(...standings.map((s) => s.points), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl md:text-4xl font-black text-white mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        جدول <span className="text-gold-gradient">الترتيب</span>
      </motion.h1>

      {/* ====== ANIMATED PODIUM ====== */}
      <div className="flex items-end justify-center gap-4 mb-12" dir="ltr">
        {standings.slice(0, 3).map((team, i) => {
          const order = i === 0 ? 1 : i === 1 ? 0 : 2;
          return (
            <Link key={team.id} to={`/team/${team.id}`}>
              <motion.div
                className="flex flex-col items-center gap-2"
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: order * 0.15, type: "spring", stiffness: 100 }}
              >
                {/* Badge */}
                <div className="hover-scale">
                  {i === 0 ? (
                    <Icon name="crown" className="text-[#FFD700] mb-1" size={28} />
                  ) : (
                    <Icon name="medal" className={medalColors[i].color} size={24} />
                  )}
                  <TeamBadge src={team.logo} alt={team.shortName} size={i === 0 ? 14 : 10} />
                </div>
                <div className={`font-bold text-sm ${medalColors[i].color} truncate max-w-20 md:max-w-28`}>{team.shortName}</div>
                {/* Podium bar */}
                <motion.div
                  className="w-20 md:w-28 rounded-t-xl flex items-center justify-center"
                  style={{
                    background: i === 0
                      ? "linear-gradient(180deg, #D4AF37, #B8860B)"
                      : i === 1
                      ? "linear-gradient(180deg, #9CA3AF, #6B7280)"
                      : "linear-gradient(180deg, #B45309, #92400E)",
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: podiumTargets[i] }}
                  transition={{ delay: 0.3 + order * 0.15, duration: 0.6, ease: "easeOut" }}
                >
                  <motion.span
                    className="text-white font-black text-2xl"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + order * 0.15, type: "spring" }}
                  >
                    {team.points}
                  </motion.span>
                </motion.div>
              </motion.div>
            </Link>
          );
        })}
      </div>

      {/* Cards for top teams */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {standings.slice(0, 3).map((team, i) => (
          <Link key={team.id} to={`/team/${team.id}`}>
            <motion.div
              className="glass-card p-6 text-center relative overflow-hidden hover-lift"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex justify-center mb-2">
                {i === 0 ? (
                  <Icon name="crown" className="text-[#FFD700]" size={32} />
                ) : (
                  <Icon name="medal" className={medalColors[i].color} size={28} />
                )}
              </div>
              <TeamBadge src={team.logo} alt={team.shortName} size={10} />
              <div className={`text-lg font-bold mt-1 ${medalColors[i].color}`}>
                {team.shortName}
              </div>
              <motion.div
                className="text-3xl font-black text-white mt-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.3 + i * 0.1 }}
              >
                {team.points}
              </motion.div>
              <div className="text-xs text-gray-500">نقطة</div>
              <div className="flex justify-center gap-3 mt-2 text-xs text-gray-400">
                <span className="text-win">ف: {team.won}</span>
                <span className="text-gray-400">ت: {team.drawn}</span>
                <span className="text-loss">خ: {team.lost}</span>
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Full table */}
      <motion.div
        className="glass-card overflow-x-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="grid grid-cols-[28px_1fr_32px_32px_32px_32px_32px_32px_36px] gap-0.5 px-3 py-3 border-b border-[rgba(212,175,55,0.12)] text-xs text-gray-500 font-bold uppercase tracking-wider">
          <span>#</span>
          <span>الفريق</span>
          <span className="text-center">ل</span>
          <span className="text-center">ف</span>
          <span className="text-center">ت</span>
          <span className="text-center">خ</span>
          <span className="text-center">له</span>
          <span className="text-center">ع</span>
          <span className="text-center">نقاط</span>
        </div>

        {standings.map((team, i) => (
          <Link key={team.id} to={`/team/${team.id}`}>
            <motion.div
              className="grid grid-cols-[28px_1fr_32px_32px_32px_32px_32px_32px_36px] gap-0.5 px-3 py-3 border-b border-[rgba(212,175,55,0.06)] items-center hover:bg-card-hover transition-colors cursor-pointer group hover:translate-x-1 duration-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.03 }}
            >
              <span className={`font-bold text-xs sm:text-sm ${i < 3 ? medalColors[i].color : "text-gray-400"}`}>
                {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
              </span>
              <div className="flex items-center gap-2">
                <TeamBadge src={team.logo} alt={team.shortName} size={6} />
                <span className="font-bold text-white text-xs group-hover:text-[#D4AF37] transition-colors truncate">
                  {team.shortName}
                </span>
              </div>
              <span className="text-center text-gray-300 text-xs">{team.played}</span>
              <span className="text-center text-win text-xs">{team.won}</span>
              <span className="text-center text-gray-400 text-xs">{team.drawn}</span>
              <span className="text-center text-loss text-xs">{team.lost}</span>
              <span className="text-center text-gray-300 text-xs">{team.goalsFor}</span>
              <span className="text-center text-gray-300 text-xs">{team.goalsAgainst}</span>
              <motion.span
                className="text-center font-black text-sm text-[#D4AF37]"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.6 + i * 0.03 }}
              >
                {team.points}
              </motion.span>
            </motion.div>
          </Link>
        ))}
      </motion.div>

      {/* Points bar chart */}
      <motion.div
        className="glass-card p-6 mt-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Icon name="trending-up" className="text-[#D4AF37]" size={20} />
          مخطط النقاط
        </h3>
        <div className="space-y-2">
          {standings.map((team, i) => (
            <div key={team.id} className="flex items-center gap-3">
              <span className="text-sm w-8 text-gray-400">{i + 1}</span>
              <span className="w-8 flex justify-center"><TeamBadge src={team.logo} alt={team.shortName} size={6} /></span>
              <AnimatedBar
                percentage={(team.points / maxPoints) * 100}
                color={team.color}
                className="flex-1"
              />
              <span className="text-sm font-bold text-white w-10 text-left">
                {team.points}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
