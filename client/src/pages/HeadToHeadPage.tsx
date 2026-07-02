import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "../components/Icon";
import { api } from "../api";
import type { Team, Match } from "../types";
import TeamBadge from "../components/TeamBadge";

export default function HeadToHeadPage() {
  const { team1, team2 } = useParams();
  const [data, setData] = useState<{ matches: Match[]; stats: { played: number; t1Wins: number; t2Wins: number; draws: number; t1Goals: number; t2Goals: number } } | null>(null);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!team1 || !team2) return;
    const fallback = setTimeout(() => setLoading(false), 10000);
    Promise.all([
      api.getHeadToHead(Number(team1), Number(team2)),
      api.getTeams(),
    ]).then(([h, t]) => {
      setData(h);
      setTeams(t);
    }).catch(() => {});
  }, [team1, team2]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">جاري التحميل...</div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">البيانات غير متوفرة</div>
    );
  }

  const t1 = teams.find((t) => t.id === Number(team1));
  const t2 = teams.find((t) => t.id === Number(team2));
  const { stats } = data;
  const recent = [...data.matches].reverse().slice(0, 6);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <Link to="/standings" className="text-xs text-gray-500 hover:text-[#D4AF37] transition-colors inline-flex items-center gap-1">
          <Icon name="arrow-left" size={12} /> العودة للترتيب
        </Link>
      </motion.div>

      {/* Team vs Team header */}
      <motion.div
        className="flex items-center justify-center gap-6 mb-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-center">
          <Link to={`/team/${team1}`} className="hover-scale inline-block">
            <TeamBadge src={t1?.logo || ""} alt={t1?.shortName || ""} size={14} />
            <div className="text-lg font-bold text-white mt-2">{t1?.shortName}</div>
          </Link>
        </div>
        <div className="text-3xl font-black text-[#D4AF37]">VS</div>
        <div className="text-center">
          <Link to={`/team/${team2}`} className="hover-scale inline-block">
            <TeamBadge src={t2?.logo || ""} alt={t2?.shortName || ""} size={14} />
            <div className="text-lg font-bold text-white mt-2">{t2?.shortName}</div>
          </Link>
        </div>
      </motion.div>

      {/* Stats cards */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-black text-[#D4AF37]">{stats.played}</div>
          <div className="text-[10px] text-gray-500">مباراة</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-black text-win">{stats.t1Wins}</div>
          <div className="text-[10px] text-gray-500 truncate">فوز {t1?.shortName}</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-black text-gray-300">{stats.draws}</div>
          <div className="text-[10px] text-gray-500">تعادل</div>
        </div>
        <div className="glass-card p-4 text-center">
          <div className="text-2xl font-black text-loss">{stats.t2Wins}</div>
          <div className="text-[10px] text-gray-500 truncate">فوز {t2?.shortName}</div>
        </div>
        <div className="glass-card p-4 text-center col-span-2 md:col-span-1">
          <div className="text-sm font-bold text-white">
            {stats.t1Goals} - {stats.t2Goals}
          </div>
          <div className="text-[10px] text-gray-500">الأهداف</div>
        </div>
      </motion.div>

      {/* Recent matches */}
      <motion.div
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="px-4 py-3 border-b border-[rgba(212,175,55,0.08)]">
          <span className="text-xs font-bold text-[#D4AF37] tracking-widest">آخر المواجهات</span>
        </div>
        {recent.map((match, i) => {
          const isPlayed = match.status === "played";
          const isHome = match.homeTeamId === Number(team1);
          const t1Score = isHome ? match.homeScore : match.awayScore;
          const t2Score = isHome ? match.awayScore : match.homeScore;
          const t1Won = isPlayed && t1Score != null && t2Score != null && t1Score > t2Score;
          const draw = isPlayed && t1Score != null && t2Score != null && t1Score === t2Score;
          return (
            <div
              key={match.id}
              className="flex items-center gap-3 px-4 py-3 border-b border-[rgba(212,175,55,0.04)] hover:bg-white/[0.02] transition-colors"
            >
              <div className="flex-1 flex items-center gap-2 min-w-0">
                <TeamBadge src={match.homeTeam.logo} alt={match.homeTeam.shortName} size={5} />
                <span className={`text-xs font-bold truncate ${isHome ? "text-white" : "text-gray-400"}`}>
                  {match.homeTeam.shortName}
                </span>
              </div>
              <div className="text-center shrink-0">
                {isPlayed ? (
                  <span className={`text-sm font-black ${t1Won ? "text-win" : draw ? "text-gray-300" : "text-loss"}`}>
                    {t1Score}-{t2Score}
                  </span>
                ) : (
                  <span className="text-xs text-[#D4AF37]">{match.date}</span>
                )}
              </div>
              <div className="flex-1 flex items-center justify-end gap-2 min-w-0">
                <span className={`text-xs font-bold truncate ${!isHome ? "text-white" : "text-gray-400"}`}>
                  {match.awayTeam.shortName}
                </span>
                <TeamBadge src={match.awayTeam.logo} alt={match.awayTeam.shortName} size={5} />
              </div>
            </div>
          );
        })}
        {recent.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm">لا توجد مواجهات سابقة</div>
        )}
      </motion.div>
    </div>
  );
}
