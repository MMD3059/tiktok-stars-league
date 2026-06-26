import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "../../components/Icon";
import { api } from "../../api";
import type { Match } from "../../types";
import TeamBadge from "../../components/TeamBadge";

export default function AdminScores() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null);
  const [homeScore, setHomeScore] = useState<number | "">("");
  const [awayScore, setAwayScore] = useState<number | "">("");
  const [homeYellow, setHomeYellow] = useState<number | "">("");
  const [homeRed, setHomeRed] = useState<number | "">("");
  const [awayYellow, setAwayYellow] = useState<number | "">("");
  const [awayRed, setAwayRed] = useState<number | "">("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.getMatches().then(setMatches);
  }, []);

  const pending = matches.filter((m) => m.status === "scheduled");
  const played = matches.filter((m) => m.status === "played");

  async function handleSaveScore() {
    if (!selectedMatch || homeScore === "" || awayScore === "") return;
    setSaving(true);
    try {
      await api.updateMatch(selectedMatch, {
        homeScore: Number(homeScore),
        awayScore: Number(awayScore),
        homeYellowCards: Number(homeYellow || 0),
        homeRedCards: Number(homeRed || 0),
        awayYellowCards: Number(awayYellow || 0),
        awayRedCards: Number(awayRed || 0),
        status: "played",
      });
      setMessage("تم حفظ النتيجة!");
      setSelectedMatch(null);
      setHomeScore("");
      setAwayScore("");
      setHomeYellow(""); setHomeRed("");
      setAwayYellow(""); setAwayRed("");
      api.getMatches().then(setMatches);
    } catch {
      setMessage("حدث خطأ في الحفظ");
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }

  function selectMatch(match: Match) {
    setSelectedMatch(match.id);
    setHomeScore(match.homeScore ?? "");
    setAwayScore(match.awayScore ?? "");
    setHomeYellow(match.homeYellowCards ?? "");
    setHomeRed(match.homeRedCards ?? "");
    setAwayYellow(match.awayYellowCards ?? "");
    setAwayRed(match.awayRedCards ?? "");
  }

  return (
    <div>
      <motion.h2
        className="text-xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        إدخال <span className="text-gold-gradient">النتائج</span>
      </motion.h2>

      {message && (
        <motion.div
          className="glass-card p-3 mb-4 text-center text-green-400 border border-green-500/20"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {message}
        </motion.div>
      )}

      {selectedMatch && (() => {
        const match = matches.find((m) => m.id === selectedMatch);
        if (!match) return null;
        return (
          <motion.div
            className="glass-card p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-lg font-bold text-white text-center mb-4">
              <TeamBadge src={match.homeTeam.logo} alt={match.homeTeam.shortName} size={7} /> {match.homeTeam.shortName} vs {match.awayTeam.shortName} <TeamBadge src={match.awayTeam.logo} alt={match.awayTeam.shortName} size={7} />
            </h3>
            <p className="text-gray-500 text-sm text-center mb-4">
              {match.date} · {match.time}
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="text-center">
                <div className="mb-1"><TeamBadge src={match.homeTeam.logo} alt={match.homeTeam.shortName} size={9} /></div>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={homeScore}
                  onChange={(e) => setHomeScore(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-20 bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-3 py-2 text-white text-center text-2xl font-bold focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <span className="text-2xl text-gray-500">-</span>
              <div className="text-center">
                <div className="mb-1"><TeamBadge src={match.awayTeam.logo} alt={match.awayTeam.shortName} size={9} /></div>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={awayScore}
                  onChange={(e) => setAwayScore(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-20 bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-3 py-2 text-white text-center text-2xl font-bold focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-6 mb-6">
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">بطاقة صفراء</div>
                <input
                  type="number" min="0" max="10"
                  value={homeYellow}
                  onChange={(e) => setHomeYellow(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-14 bg-dark border border-[rgba(212,175,55,0.15)] rounded-lg px-2 py-1 text-[#D4AF37] text-center text-sm font-bold focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">بطاقة حمراء</div>
                <input
                  type="number" min="0" max="5"
                  value={homeRed}
                  onChange={(e) => setHomeRed(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-14 bg-dark border border-[rgba(212,175,55,0.15)] rounded-lg px-2 py-1 text-red-400 text-center text-sm font-bold focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="text-gray-500 text-lg font-bold">|</div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">بطاقة صفراء</div>
                <input
                  type="number" min="0" max="10"
                  value={awayYellow}
                  onChange={(e) => setAwayYellow(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-14 bg-dark border border-[rgba(212,175,55,0.15)] rounded-lg px-2 py-1 text-[#D4AF37] text-center text-sm font-bold focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-500 mb-1">بطاقة حمراء</div>
                <input
                  type="number" min="0" max="5"
                  value={awayRed}
                  onChange={(e) => setAwayRed(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-14 bg-dark border border-[rgba(212,175,55,0.15)] rounded-lg px-2 py-1 text-red-400 text-center text-sm font-bold focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <motion.button
                onClick={handleSaveScore}
                disabled={saving}
                className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-xl disabled:opacity-50"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {saving ? "جاري الحفظ..." : "حفظ النتيجة"}
              </motion.button>
              <motion.button
                onClick={() => { setSelectedMatch(null); setHomeScore(""); setAwayScore(""); setHomeYellow(""); setHomeRed(""); setAwayYellow(""); setAwayRed(""); }}
                className="px-4 py-2 bg-dark text-gray-400 rounded-xl border border-[rgba(212,175,55,0.15)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                إلغاء
              </motion.button>
            </div>
          </motion.div>
        );
      })()}

      <div className="mb-8">
        <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-gold-pulse" />
          المباريات القادمة ({pending.length})
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pending.map((match, i) => (
            <motion.div
              key={match.id}
              className="glass-card p-3 flex items-center justify-between cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ x: 4, borderColor: "rgba(212,175,55,0.3)" }}
              onClick={() => selectMatch(match)}
            >
              <div className="flex items-center gap-3">
                <TeamBadge src={match.homeTeam.logo} alt={match.homeTeam.shortName} size={7} />
                <div>
                  <div className="font-bold text-white text-sm">
                    {match.homeTeam.shortName} vs {match.awayTeam.shortName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {match.date} · {match.time}
                  </div>
                </div>
                <TeamBadge src={match.awayTeam.logo} alt={match.awayTeam.shortName} size={7} />
              </div>
              <div className="text-[#D4AF37] text-xs font-bold">أدخل النتيجة</div>
            </motion.div>
          ))}
          {pending.length === 0 && (
            <motion.div
              className="text-gray-500 text-center py-8 col-span-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              لا توجد مباريات قادمة
            </motion.div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-bold text-white mb-3">المباريات المنتهية ({played.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {played.map((match, i) => (
            <motion.div
              key={match.id}
              className="glass-card p-3 flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.02 }}
            >
              <div className="flex items-center gap-3">
                <TeamBadge src={match.homeTeam.logo} alt={match.homeTeam.shortName} size={7} />
                <div>
                  <div className="font-bold text-white text-sm">
                    {match.homeTeam.shortName} vs {match.awayTeam.shortName}
                  </div>
                  <div className="text-xs text-gray-500">
                    {match.date}
                  </div>
                </div>
                <TeamBadge src={match.awayTeam.logo} alt={match.awayTeam.shortName} size={7} />
              </div>
              <div className="font-bold text-lg">
                <span className="text-white">{match.homeScore}</span>
                <span className="text-gray-500 mx-1">-</span>
                <span className="text-white">{match.awayScore}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
