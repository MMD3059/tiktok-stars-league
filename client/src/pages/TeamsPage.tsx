import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "../components/Icon";
import { api } from "../api";
import type { Team } from "../types";
import TeamBadge from "../components/TeamBadge";
import TiltCard from "../components/TiltCard";

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTeams().then((data) => {
      setTeams(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl md:text-4xl font-black text-white mb-2 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        فرق <span className="text-gold-gradient">البطولة</span>
      </motion.h1>
      <motion.p
        className="text-gray-500 text-center mb-10 max-w-xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        اضغط على أي فريق لمشاهدة التشكيلة والإحصائيات
      </motion.p>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="glass-card p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-dark mx-auto mb-3 skeleton-shimmer" />
              <div className="h-4 w-20 bg-dark mx-auto rounded skeleton-shimmer" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {teams.map((team, i) => (
            <Link key={team.id} to={`/team/${team.id}`}>
              <TiltCard>
                <motion.div
                  className="glass-card p-6 text-center cursor-pointer hover-lift"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="mb-3 flex justify-center">
                    <TeamBadge src={team.logo} alt={team.shortName} size={16} />
                  </div>
                  <div className="font-bold text-white text-sm mb-1 truncate">{team.name || team.shortName}</div>
                  <div className="flex items-center justify-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Icon name="users" size={12} />
                      {team.players?.length || 0}
                    </span>
                  </div>
                </motion.div>
              </TiltCard>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
