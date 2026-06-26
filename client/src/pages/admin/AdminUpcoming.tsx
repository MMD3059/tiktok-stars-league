import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "../../components/Icon";
import { api } from "../../api";
import type { Match, Team } from "../../types";
import TeamBadge from "../../components/TeamBadge";

export default function AdminUpcoming() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [homeTeamId, setHomeTeamId] = useState<number>(0);
  const [awayTeamId, setAwayTeamId] = useState<number>(0);
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("20:00");
  const [week, setWeek] = useState(1);
  const [editing, setEditing] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    Promise.all([api.getMatches(), api.getTeams()]).then(([m, t]) => {
      setMatches(m);
      setTeams(t);
      if (t.length >= 2) {
        setHomeTeamId(h => h || t[0].id);
        setAwayTeamId(h => h || t[1].id);
      }
    }).catch(() => {});
  }, []);

  const upcoming = matches.filter((m) => m.status === "scheduled");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!homeTeamId || !awayTeamId) { setMessage("اختر الفريقين"); setTimeout(() => setMessage(""), 3000); return; }
    if (homeTeamId === awayTeamId) { setMessage("اختر فريقين مختلفين"); setTimeout(() => setMessage(""), 3000); return; }
    const data = { homeTeamId, awayTeamId, date, time, week, status: "scheduled" };
    try {
      if (editing) {
        await api.updateMatch(editing, data);
        setMessage("تم تعديل المباراة!");
        setEditing(null);
      } else {
        await api.createMatch(data);
        setMessage("تم إضافة المباراة!");
      }
      api.getMatches().then(setMatches);
    } catch (e: any) {
      setMessage(e.message || "حدث خطأ");
    }
    setTimeout(() => setMessage(""), 3000);
  }

  function edit(match: Match) {
    setHomeTeamId(match.homeTeamId);
    setAwayTeamId(match.awayTeamId);
    setDate(match.date);
    setTime(match.time);
    setWeek(match.week);
    setEditing(match.id);
  }

  async function remove(id: number) {
    if (confirm("حذف المباراة؟")) {
      try {
        await api.deleteMatch(id);
        api.getMatches().then(setMatches);
        setMessage("تم حذف المباراة");
      } catch (e: any) {
        setMessage(e.message || "حدث خطأ");
      }
      setTimeout(() => setMessage(""), 3000);
    }
  }

  async function markPlayed(id: number) {
    try {
      await api.updateMatch(id, { status: "played", homeScore: 0, awayScore: 0 });
      api.getMatches().then(setMatches);
      setMessage("تم تحويل المباراة إلى منتهية");
    } catch (e: any) {
      setMessage(e.message || "حدث خطأ");
    }
    setTimeout(() => setMessage(""), 3000);
  }

  function reset() {
    if (teams.length >= 2) { setHomeTeamId(teams[0].id); setAwayTeamId(teams[1].id); }
    setDate(new Date().toISOString().split("T")[0]); setTime("20:00"); setWeek(1);
    setEditing(null);
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

      <motion.form
        onSubmit={handleSubmit}
        className="glass-card p-6 mb-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">
          {editing ? "تعديل مباراة قادمة" : "إضافة مباراة جديدة"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select value={homeTeamId} onChange={(e) => setHomeTeamId(Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]">
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={awayTeamId} onChange={(e) => setAwayTeamId(Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]">
            {teams.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <div>
            <div className="text-[10px] text-[#D4AF37] font-bold mb-1">
              {["الأحد","الإثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"][new Date(date + "T12:00:00").getDay()]}
            </div>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
              className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37] w-full" required />
          </div>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]" required />
          <input type="number" placeholder="رقم الجولة" value={week} onChange={(e) => setWeek(Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]" required />
        </div>
        <div className="flex gap-2">
          <motion.button type="submit" className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-xl"
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            {editing ? "حفظ التعديل" : "إضافة"}
          </motion.button>
          {editing && (
            <motion.button type="button" onClick={reset} className="px-4 py-2 bg-dark text-gray-400 rounded-xl border border-[rgba(212,175,55,0.15)]"
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              إلغاء
            </motion.button>
          )}
        </div>
      </motion.form>

      <h3 className="text-lg font-bold text-white mb-3">
        المباريات القادمة ({upcoming.length})
      </h3>
      <div className="space-y-2">
        {upcoming.map((match, i) => (
          <motion.div key={match.id} className="glass-card p-3 flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
            whileHover={{ x: 4 }}>
            <div className="flex items-center gap-3">
              <TeamBadge src={match.homeTeam.logo} alt={match.homeTeam.shortName} size={7} />
              <div>
                <div className="font-bold text-white text-sm">
                  {match.homeTeam.shortName} vs {match.awayTeam.shortName}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-2">
                  <Icon name="calendar-days" size={12} /> {match.date} · <Icon name="clock" size={12} /> {match.time} · ج{match.week}
                </div>
              </div>
              <TeamBadge src={match.awayTeam.logo} alt={match.awayTeam.shortName} size={7} />
            </div>
            <div className="flex gap-2">
              <motion.button onClick={() => edit(match)}
                className="px-3 py-1 text-xs bg-[rgba(212,175,55,0.1)] text-[#D4AF37] rounded-lg border border-[rgba(212,175,55,0.2)]"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                تعديل
              </motion.button>
              <motion.button onClick={() => markPlayed(match.id)}
                className="px-3 py-1 text-xs bg-green-500/10 text-green-400 rounded-lg border border-green-500/20 flex items-center gap-1"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Icon name="flag" size={12} /> منتهية
              </motion.button>
              <motion.button onClick={() => remove(match.id)}
                className="px-3 py-1 text-xs bg-red-500/10 text-red-400 rounded-lg border border-red-500/20"
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                حذف
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
