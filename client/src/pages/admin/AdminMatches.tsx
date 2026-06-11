import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "../../components/Icon";
import { api } from "../../api";
import type { Match, Team } from "../../types";
import TeamBadge from "../../components/TeamBadge";

export default function AdminMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [homeTeamId, setHomeTeamId] = useState<number>(1);
  const [awayTeamId, setAwayTeamId] = useState<number>(2);
  const [homeScore, setHomeScore] = useState<number | "">("");
  const [awayScore, setAwayScore] = useState<number | "">("");
  const [homeYellow, setHomeYellow] = useState<number | "">("");
  const [homeRed, setHomeRed] = useState<number | "">("");
  const [awayYellow, setAwayYellow] = useState<number | "">("");
  const [awayRed, setAwayRed] = useState<number | "">("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [week, setWeek] = useState(1);
  const [status, setStatus] = useState("scheduled");
  const [editing, setEditing] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([api.getMatches(), api.getTeams()]).then(([m, t]) => {
      setMatches(m);
      setTeams(t);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const data = {
      homeTeamId,
      awayTeamId,
      homeScore: homeScore === "" ? null : homeScore,
      awayScore: awayScore === "" ? null : awayScore,
      homeYellowCards: Number(homeYellow || 0),
      homeRedCards: Number(homeRed || 0),
      awayYellowCards: Number(awayYellow || 0),
      awayRedCards: Number(awayRed || 0),
      date,
      time,
      week,
      status,
    };
    if (editing) {
      await api.updateMatch(editing, data);
    } else {
      await api.createMatch(data);
    }
    reset();
    api.getMatches().then(setMatches);
  }

  function edit(match: Match) {
    setHomeTeamId(match.homeTeamId);
    setAwayTeamId(match.awayTeamId);
    setHomeScore(match.homeScore ?? "");
    setAwayScore(match.awayScore ?? "");
    setHomeYellow(match.homeYellowCards ?? "");
    setHomeRed(match.homeRedCards ?? "");
    setAwayYellow(match.awayYellowCards ?? "");
    setAwayRed(match.awayRedCards ?? "");
    setDate(match.date);
    setTime(match.time);
    setWeek(match.week);
    setStatus(match.status);
    setEditing(match.id);
  }

  async function remove(id: number) {
    if (confirm("حذف المباراة؟")) {
      await api.deleteMatch(id);
      api.getMatches().then(setMatches);
    }
  }

  function reset() {
    setHomeTeamId(1); setAwayTeamId(2);
    setHomeScore(""); setAwayScore("");
    setHomeYellow(""); setHomeRed("");
    setAwayYellow(""); setAwayRed("");
    setDate(""); setTime(""); setWeek(1);
    setStatus("scheduled"); setEditing(null);
  }

  return (
    <div>
      <motion.form
        onSubmit={handleSubmit}
        className="glass-card p-6 mb-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">
          {editing ? "تعديل مباراة" : "إضافة مباراة"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select value={homeTeamId} onChange={(e) => setHomeTeamId(Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]">
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={awayTeamId} onChange={(e) => setAwayTeamId(Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]">
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <input type="number" placeholder="النتيجة أرض" value={homeScore} onChange={(e) => setHomeScore(e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]" />
          <input type="number" placeholder="النتيجة ضيوف" value={awayScore} onChange={(e) => setAwayScore(e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]" />
          <input type="number" placeholder="صفراء أرض" value={homeYellow} onChange={(e) => setHomeYellow(e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]" />
          <input type="number" placeholder="حمراء أرض" value={homeRed} onChange={(e) => setHomeRed(e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-red-400 focus:outline-none focus:border-[#D4AF37]" />
          <input type="number" placeholder="صفراء ضيوف" value={awayYellow} onChange={(e) => setAwayYellow(e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-[#D4AF37] focus:outline-none focus:border-[#D4AF37]" />
          <input type="number" placeholder="حمراء ضيوف" value={awayRed} onChange={(e) => setAwayRed(e.target.value === "" ? "" : Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-red-400 focus:outline-none focus:border-[#D4AF37]" />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]" />
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]" />
          <input type="number" placeholder="الجولة" value={week} onChange={(e) => setWeek(Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]" />
          <select value={status} onChange={(e) => setStatus(e.target.value)}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]">
            <option value="scheduled">مجدولة</option>
            <option value="played">منتهية</option>
          </select>
        </div>
        <div className="flex gap-2">
          <motion.button type="submit" className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-xl"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {editing ? "حفظ" : "إضافة"}
          </motion.button>
          {editing && (
            <motion.button type="button" onClick={reset} className="px-4 py-2 bg-dark text-gray-400 rounded-xl border border-[rgba(212,175,55,0.15)]"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              إلغاء
            </motion.button>
          )}
        </div>
      </motion.form>

      <div className="space-y-2">
        {matches.map((m, i) => (
          <motion.div key={m.id} className="glass-card p-3 flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }}
            whileHover={{ x: 4 }}>
            <div className="flex items-center gap-3">
              <TeamBadge src={m.homeTeam.logo} alt={m.homeTeam.shortName} size={6} />
              <div>
                <div className="font-bold text-white">{m.homeTeam.shortName} vs {m.awayTeam.shortName}</div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <Icon name="calendar-days" size={12} />
                  {m.date} · <Icon name="clock" size={12} /> {m.time} · ج{m.week}
                  {m.status === "played" && m.homeScore != null && ` · ${m.homeScore}-${m.awayScore}`}
                </div>
              </div>
              <TeamBadge src={m.awayTeam.logo} alt={m.awayTeam.shortName} size={6} />
            </div>
            <div className="flex gap-2">
              <motion.button onClick={() => edit(m)} className="px-3 py-1 text-xs bg-[rgba(212,175,55,0.1)] text-[#D4AF37] rounded-lg border border-[rgba(212,175,55,0.2)]"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>تعديل</motion.button>
              <motion.button onClick={() => remove(m.id)} className="px-3 py-1 text-xs bg-red-500/10 text-red-400 rounded-lg border border-red-500/20"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>حذف</motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
