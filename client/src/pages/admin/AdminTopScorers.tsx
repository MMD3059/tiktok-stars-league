import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "../../components/Icon";
import { api } from "../../api";
import type { Player } from "../../types";
import TeamBadge from "../../components/TeamBadge";

export default function AdminTopScorers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [editing, setEditing] = useState<number | null>(null);
  const [editGoals, setEditGoals] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.getPlayers().then(setPlayers);
  }, []);

  const scorers = players
    .filter((p) => !p.isSubstitute)
    .sort((a, b) => b.goalsScored - a.goalsScored);

  function startEdit(player: Player) {
    setEditing(player.id);
    setEditGoals(player.goalsScored);
  }

  async function saveGoals() {
    if (!editing) return;
    try {
      await api.updatePlayer(editing, { goalsScored: editGoals } as any);
      setMessage("تم تحديث الأهداف!");
      setEditing(null);
      api.getPlayers().then(setPlayers);
    } catch {
      setMessage("حدث خطأ");
    }
    setTimeout(() => setMessage(""), 3000);
  }

  return (
    <div>
      {message && (
        <motion.div
          className="glass-card p-3 mb-4 text-center text-green-400 border border-green-500/20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {message}
        </motion.div>
      )}

      <motion.h2
        className="text-xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        إدارة <span className="text-gold-gradient">الهدافين</span>
      </motion.h2>

      {editing && (
        <motion.div
          className="glass-card p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-bold text-white mb-4 text-center">
            تعديل الأهداف
          </h3>
          <div className="flex items-center justify-center gap-4">
            <input
              type="number"
              min="0"
              max="99"
              value={editGoals}
              onChange={(e) => setEditGoals(Number(e.target.value))}
              className="w-24 bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-3 text-white text-center text-2xl font-bold focus:outline-none focus:border-[#D4AF37]"
              autoFocus
            />
            <motion.button
              onClick={saveGoals}
              className="px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              حفظ
            </motion.button>
            <motion.button
              onClick={() => setEditing(null)}
              className="px-4 py-3 bg-dark text-gray-400 rounded-xl border border-[rgba(212,175,55,0.15)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إلغاء
            </motion.button>
          </div>
        </motion.div>
      )}

      <motion.div className="glass-card overflow-hidden" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="grid grid-cols-[40px_1fr_120px_120px_80px] gap-2 px-4 py-3 border-b border-[rgba(212,175,55,0.12)] text-xs text-gray-500 font-bold">
          <span>#</span>
          <span>اللاعب</span>
          <span>الفريق</span>
          <span>المركز</span>
          <span className="text-center">الأهداف</span>
        </div>

        {scorers.map((player, i) => (
          <motion.div
            key={player.id}
            className="grid grid-cols-[40px_1fr_120px_120px_80px] gap-2 px-4 py-3 border-b border-[rgba(212,175,55,0.06)] items-center hover:bg-card-hover transition-colors cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            whileHover={{ x: 4 }}
            onClick={() => startEdit(player)}
          >
            <span className={`font-bold text-lg ${i < 3 ? "text-[#D4AF37]" : "text-gray-400"}`}>
              {i < 3 ? (
                <Icon name="medal" size={20} className={i === 0 ? "text-[#FFD700]" : i === 1 ? "text-gray-300" : "text-amber-600"} />
              ) : (
                i + 1
              )}
            </span>
            <div className="flex items-center gap-2">
              <Icon name="trophy" size={16} className="text-[#D4AF37]" />
              <span className="font-bold text-white">
                {player.name}
                {player.isCaptain && (
                  <Icon name="star" size={12} className="text-[#D4AF37]" />
                )}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {player.team && <TeamBadge src={player.team.logo} alt={player.team.shortName} size={6} />}
              <span className="text-sm text-gray-400">{player.team?.shortName}</span>
            </div>
            <span className="text-sm text-gray-400">{player.position}</span>
            <span className="text-center font-black text-xl text-[#D4AF37]">{player.goalsScored}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
