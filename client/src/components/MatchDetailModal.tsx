import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Icon from "./Icon";
import TeamBadge from "./TeamBadge";
import { api } from "../api";
import type { Match, MatchEvent } from "../types";

interface Props {
  match: Match | null;
  onClose: () => void;
}

export default function MatchDetailModal({ match, onClose }: Props) {
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!match) return;
    setLoading(true);
    api.getMatchEvents(match.id)
      .then(setEvents)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [match?.id]);

  useEffect(() => {
    if (!match) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [match, onClose]);

  if (!match) return null;

  const homeGoals = events.filter(e => e.type === "goal" && e.teamId === match.homeTeamId);
  const awayGoals = events.filter(e => e.type === "goal" && e.teamId === match.awayTeamId);
  const homeYellows = events.filter(e => e.type === "yellow_card" && e.teamId === match.homeTeamId);
  const awayYellows = events.filter(e => e.type === "yellow_card" && e.teamId === match.awayTeamId);
  const homeReds = events.filter(e => e.type === "red_card" && e.teamId === match.homeTeamId);
  const awayReds = events.filter(e => e.type === "red_card" && e.teamId === match.awayTeamId);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          className="relative w-full max-w-md rounded-2xl overflow-hidden"
          style={{
            background: "rgba(15,15,15,0.97)",
            border: "1px solid rgba(212,175,55,0.2)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-3">
              <TeamBadge src={match.homeTeam.logo} alt={match.homeTeam.shortName} size={9} />
              <span className="text-lg font-black text-white">{match.homeScore} - {match.awayScore}</span>
              <TeamBadge src={match.awayTeam.logo} alt={match.awayTeam.shortName} size={9} />
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
              <Icon name="ban" size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[60vh] overflow-y-auto">
            {loading ? (
              <div className="text-center text-gray-400 py-8">جاري التحميل...</div>
            ) : events.length === 0 ? (
              <div className="text-center text-gray-500 py-8">لا توجد أحداث مسجلة</div>
            ) : (
              <div className="space-y-4">
                {/* Home team events */}
                <div>
                  <h4 className="text-xs text-gray-400 mb-2 font-bold">{match.homeTeam.shortName}</h4>
                  <div className="space-y-1.5">
                    {homeGoals.map(ev => (
                      <div key={ev.id} className="flex items-center gap-2 text-sm">
                        <Icon name="football" size={14} />
                        <span className="text-white font-medium">{ev.playerName}</span>
                        <span className="text-[10px] text-gray-500">⚽</span>
                      </div>
                    ))}
                    {homeYellows.map(ev => (
                      <div key={ev.id} className="flex items-center gap-2 text-sm">
                        <Icon name="target" size={14} />
                        <span className="text-white font-medium">{ev.playerName}</span>
                        <span className="text-[10px] text-yellow-400">🟨</span>
                      </div>
                    ))}
                    {homeReds.map(ev => (
                      <div key={ev.id} className="flex items-center gap-2 text-sm">
                        <Icon name="target" size={14} />
                        <span className="text-white font-medium">{ev.playerName}</span>
                        <span className="text-[10px] text-red-500">🟥</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Away team events */}
                <div>
                  <h4 className="text-xs text-gray-400 mb-2 font-bold">{match.awayTeam.shortName}</h4>
                  <div className="space-y-1.5">
                    {awayGoals.map(ev => (
                      <div key={ev.id} className="flex items-center gap-2 text-sm">
                        <Icon name="football" size={14} />
                        <span className="text-white font-medium">{ev.playerName}</span>
                        <span className="text-[10px] text-gray-500">⚽</span>
                      </div>
                    ))}
                    {awayYellows.map(ev => (
                      <div key={ev.id} className="flex items-center gap-2 text-sm">
                        <Icon name="target" size={14} />
                        <span className="text-white font-medium">{ev.playerName}</span>
                        <span className="text-[10px] text-yellow-400">🟨</span>
                      </div>
                    ))}
                    {awayReds.map(ev => (
                      <div key={ev.id} className="flex items-center gap-2 text-sm">
                        <Icon name="target" size={14} />
                        <span className="text-white font-medium">{ev.playerName}</span>
                        <span className="text-[10px] text-red-500">🟥</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
