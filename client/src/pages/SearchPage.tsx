import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "../components/Icon";
import { api } from "../api";
import type { Team, Player } from "../types";
import TeamBadge from "../components/TeamBadge";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getTeams(), api.getPlayers()]).then(([t, p]) => {
      setTeams(t);
      setPlayers(p);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return { teams: [] as Team[], players: [] as Player[] };
    const q = query.trim().toLowerCase();
    return {
      teams: teams.filter((t) => t.name.toLowerCase().includes(q) || t.shortName.toLowerCase().includes(q)),
      players: players.filter((p) => p.name.toLowerCase().includes(q)),
    };
  }, [query, teams, players]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen">
      <motion.h1
        className="text-3xl md:text-4xl font-black text-white mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Icon name="search" className="inline mr-2 text-[#D4AF37]" size={28} />
        بحث
      </motion.h1>

      <motion.div
        className="max-w-xl mx-auto mb-10"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن فريق أو لاعب..."
          className="w-full bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-5 py-4 text-white text-lg placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-colors"
        />
      </motion.div>

      {query.trim() && (
        <motion.div
          className="space-y-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {results.teams.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-[#D4AF37] mb-4 tracking-widest">الفرق ({results.teams.length})</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {results.teams.map((team) => (
                  <Link key={team.id} to={`/team/${team.id}`}>
                    <div className="glass-card p-4 flex items-center gap-3 hover-lift-sm cursor-pointer">
                      <TeamBadge src={team.logo} alt={team.shortName} size={8} />
                      <span className="text-sm font-bold text-white truncate">{team.shortName}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.players.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-[#D4AF37] mb-4 tracking-widest">اللاعبين ({results.players.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {results.players.map((player) => (
                  <Link key={player.id} to={`/team/${player.teamId}`}>
                    <div className="glass-card p-4 flex items-center gap-3 hover-lift-sm cursor-pointer">
                      <div className="w-9 h-9 rounded-full overflow-hidden bg-dark flex items-center justify-center text-xs font-bold text-gray-500 shrink-0 border border-[rgba(212,175,55,0.1)]">
                        {player.imageUrl ? (
                          <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
                        ) : (
                          player.name.charAt(0)
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-bold text-white truncate">{player.name}</div>
                        <div className="text-[10px] text-gray-500">{player.position} · {player.team?.shortName}</div>
                      </div>
                      <span className="text-xs text-[#D4AF37] font-bold">{player.goalsScored}⚽</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {results.teams.length === 0 && results.players.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <Icon name="search" className="mx-auto mb-3" size={36} />
              لا توجد نتائج لـ "{query}"
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
