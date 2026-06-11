import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "../../components/Icon";
import { api } from "../../api";
import type { Transfer, Team, Player } from "../../types";
import SearchSelect, { type SelectOption } from "../../components/SearchSelect";

export default function AdminTransfers() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  const [selectedPlayer, setSelectedPlayer] = useState<SelectOption | null>(null);
  const [fromClub, setFromClub] = useState<SelectOption | null>(null);
  const [toClub, setToClub] = useState<SelectOption | null>(null);
  const [transferDate, setTransferDate] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    const [t, p, teamsData] = await Promise.all([
      api.getTransfers(),
      api.getPlayers(),
      api.getTeams(),
    ]);
    setTransfers(t);
    setPlayers(p);
    setTeams(teamsData);
  };

  useEffect(() => { load(); }, []);

  const handlePlayerSelect = (opt: SelectOption) => {
    setSelectedPlayer(opt);
    const player = players.find((p) => p.id === opt.id);
    if (player?.team) {
      setFromClub({
        id: player.team.id,
        name: player.team.name,
        imageUrl: player.team.logo,
      });
    }
  };

  async function handleSubmit() {
    if (!selectedPlayer || !fromClub || !toClub || !transferDate) return;
    setSubmitting(true);
    try {
      await api.createTransfer({
        playerName: selectedPlayer.name,
        fromTeam: fromClub.name,
        toTeam: toClub.name,
        transferDate,
      });
      const updated = await api.getTransfers();
      setTransfers(updated);
      setSelectedPlayer(null);
      setFromClub(null);
      setToClub(null);
      setTransferDate("");
    } catch { /* ignore */ }
    setSubmitting(false);
  }

  async function remove(id: number) {
    if (confirm("حذف الانتقال؟")) {
      await api.deleteTransfer(id);
      api.getTransfers().then(setTransfers);
    }
  }

  const playerOptions: SelectOption[] = players.map((p) => ({
    id: p.id,
    name: p.name,
    subtitle: p.team?.name || "",
    imageUrl: p.imageUrl,
  }));

  const clubOptions: SelectOption[] = teams.map((t) => ({
    id: t.id,
    name: t.name,
    imageUrl: t.logo,
  }));

  return (
    <div>
      <motion.div
        className="rounded-2xl p-4 md:p-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "rgba(20,20,20,0.85)",
          border: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Icon name="arrow-left-right" size={14} className="text-[#D4AF37]" />
          <span className="text-xs font-bold text-white">إضافة انتقال جديد</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <SearchSelect
              label="اللاعب"
              options={playerOptions}
              value={selectedPlayer}
              onChange={handlePlayerSelect}
              placeholder="اختر لاعباً..."
              icon={<Icon name="user" size={14} className="text-[#D4AF37]" />}
            />
          </div>
          <div>
            <SearchSelect
              label="من نادي"
              options={clubOptions}
              value={fromClub}
              onChange={setFromClub}
              placeholder="اختر نادياً..."
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 22s4-6 4-10a4 4 0 00-8 0c0 4 4 10 4 10z" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
              }
            />
          </div>
          <div>
            <SearchSelect
              label="إلى نادي"
              options={clubOptions}
              value={toClub}
              onChange={setToClub}
              placeholder="اختر نادياً..."
              icon={
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 22s4-6 4-10a4 4 0 00-8 0c0 4 4 10 4 10z" />
                  <circle cx="12" cy="10" r="2" />
                </svg>
              }
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
              التاريخ
            </label>
            <input
              type="date"
              value={transferDate}
              onChange={(e) => setTransferDate(e.target.value)}
              className="w-full bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
          </div>
          <motion.button
            onClick={handleSubmit}
            disabled={!selectedPlayer || !fromClub || !toClub || !transferDate || submitting}
            className="w-full py-2.5 rounded-xl text-sm font-bold transition-all duration-200 disabled:opacity-40"
            style={{
              background: "linear-gradient(135deg, #D4AF37, #FFD700)",
              color: "#0B0B0B",
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
          >
            {submitting ? "جاري الإضافة..." : "إضافة انتقال"}
          </motion.button>
        </div>
      </motion.div>

      <div className="space-y-2">
        {transfers.map((t, i) => (
          <motion.div
            key={t.id}
            className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 hover:bg-white/[0.02]"
            style={{
              background: "rgba(20,20,20,0.85)",
              border: "1px solid rgba(212,175,55,0.1)",
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <div>
                <div className="font-bold text-white text-sm">{t.playerName}</div>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <span>{t.fromTeam}</span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" className="mx-1">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                  <span>{t.toTeam}</span>
                  <span className="mx-1">·</span>
                  <span>{t.transferDate}</span>
                </div>
              </div>
            </div>
            <motion.button
              onClick={() => remove(t.id)}
              className="px-3 py-1 text-xs font-bold rounded-lg transition-all"
              style={{
                background: "rgba(239,68,68,0.1)",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              حذف
            </motion.button>
          </motion.div>
        ))}

        {transfers.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Icon name="arrow-left-right" className="mx-auto mb-3 text-[#D4AF37]" size={36} />
            <div className="text-xs">لا يوجد انتقالات حتى الآن</div>
          </div>
        )}
      </div>
    </div>
  );
}
