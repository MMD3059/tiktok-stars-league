import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Icon from "../../components/Icon";
import { api } from "../../api";
import type { Team } from "../../types";
import TeamBadge from "../../components/TeamBadge";

export default function AdminTeams() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");
  const [shortName, setShortName] = useState("");
  const [logo, setLogo] = useState("");
  const [color, setColor] = useState("#D4AF37");
  const [value, setValue] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Stats editing
  const [statsTeamId, setStatsTeamId] = useState<number | null>(null);
  const [sPoints, setSPoints] = useState("");
  const [sWon, setSWon] = useState("");
  const [sDrawn, setSDrawn] = useState("");
  const [sLost, setSLost] = useState("");
  const [sGF, setSGF] = useState("");
  const [sGA, setSGA] = useState("");

  useEffect(() => {
    api.getTeams().then((data) =>
      setTeams(
        [...data].sort((a, b) => (b.manualPoints ?? 0) - (a.manualPoints ?? 0))
      )
    );
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file);
      setLogo(url);
    } catch {
      alert("فشل رفع الصورة");
    }
    setUploading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    const data = { name, shortName, logo, color };
    if (value) (data as any).value = parseInt(value, 10);
    try {
      if (editing) {
        await api.updateTeam(editing, data);
      } else {
        await api.createTeam(data);
      }
      reset();
      const result = await api.getTeams();
      setTeams([...result].sort((a, b) => (b.manualPoints ?? 0) - (a.manualPoints ?? 0)));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function edit(team: Team) {
    setName(team.name);
    setShortName(team.shortName);
    setLogo(team.logo);
    setColor(team.color);
    setValue(team.value ? String(team.value) : "");
    setEditing(team.id);
  }

  async function remove(id: number) {
    if (confirm("حذف الفريق؟")) {
      await api.deleteTeam(id);
      api.getTeams().then((data) =>
        setTeams([...data].sort((a, b) => (b.manualPoints ?? 0) - (a.manualPoints ?? 0)))
      );
    }
  }

  async function handleDistribute(teamId: number) {
    if (!confirm("توزيع قيمة الفريق على اللاعبين (باستثناء الكابتن)؟")) return;
    try {
      const result = await api.distributeValue(teamId);
      alert(`تم التوزيع: ${result.share} لكل لاعب من ${result.count} لاعبين`);
    } catch {
      alert("فشل التوزيع");
    }
  }

  function openStats(team: Team) {
    setStatsTeamId(team.id);
    setSPoints(team.manualPoints?.toString() ?? "");
    setSWon(team.manualWon?.toString() ?? "");
    setSDrawn(team.manualDrawn?.toString() ?? "");
    setSLost(team.manualLost?.toString() ?? "");
    setSGF(team.manualGoalsFor?.toString() ?? "");
    setSGA(team.manualGoalsAgainst?.toString() ?? "");
  }

  async function saveStats() {
    if (statsTeamId == null) return;
    const data: Record<string, number | null> = {};
    const fields = [
      ["points", sPoints],
      ["won", sWon],
      ["drawn", sDrawn],
      ["lost", sLost],
      ["goalsFor", sGF],
      ["goalsAgainst", sGA],
    ] as const;
    for (const [key, val] of fields) {
      data[key] = val === "" ? null : Number(val);
    }
    await api.updateStanding(statsTeamId, data as any);
    setStatsTeamId(null);
    api.getTeams().then((data) =>
      setTeams([...data].sort((a, b) => (b.manualPoints ?? 0) - (a.manualPoints ?? 0)))
    );
  }

  function reset() {
    setName("");
    setShortName("");
    setLogo("");
    setColor("#D4AF37");
    setValue("");
    setEditing(null);
  }

  return (
    <div className="space-y-6">
      {/* Stats modal */}
      {statsTeamId != null && (
        <motion.div
          className="glass-card p-6 border border-[#D4AF37]/30"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 className="text-lg font-bold text-white mb-4 text-center">
            تعديل إحصائيات <span className="text-[#D4AF37]">{teams.find(t => t.id === statsTeamId)?.shortName}</span>
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-4">
            {[
              { label: "نقاط", val: sPoints, set: setSPoints },
              { label: "فوز", val: sWon, set: setSWon },
              { label: "تعادل", val: sDrawn, set: setSDrawn },
              { label: "خسارة", val: sLost, set: setSLost },
              { label: "له", val: sGF, set: setSGF },
              { label: "عليه", val: sGA, set: setSGA },
            ].map((f) => (
              <div key={f.label} className="text-center">
                <div className="text-xs text-gray-500 mb-1">{f.label}</div>
                <input
                  type="number"
                  value={f.val}
                  onChange={(e) => f.set(e.target.value)}
                  className="w-full bg-dark border border-[rgba(212,175,55,0.15)] rounded-lg px-2 py-2 text-white text-center font-bold focus:outline-none focus:border-[#D4AF37]"
                  placeholder="—"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-3">
            <motion.button
              onClick={saveStats}
              className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-xl"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              حفظ الإحصائيات
            </motion.button>
            <motion.button
              onClick={() => { setStatsTeamId(null); }}
              className="px-4 py-2 bg-dark text-gray-400 rounded-xl border border-[rgba(212,175,55,0.15)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إلغاء
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Team form */}
      <motion.form
        onSubmit={handleSubmit}
        className="glass-card p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-xl font-bold text-white mb-4">
          {editing ? "تعديل فريق" : "إضافة فريق"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="اسم الفريق"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
            required
          />
          <input
            placeholder="الاسم المختصر"
            value={shortName}
            onChange={(e) => setShortName(e.target.value)}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
            required
          />

          {/* Logo upload */}
          <div className="flex items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <input
              placeholder="رابط الشعار"
              value={logo}
              onChange={(e) => setLogo(e.target.value)}
              className="flex-1 bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
              required
            />
            <motion.button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="px-3 py-2 bg-[rgba(212,175,55,0.1)] text-[#D4AF37] rounded-xl border border-[rgba(212,175,55,0.2)] text-sm font-bold whitespace-nowrap disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {uploading ? "...جاري" : "رفع"}
            </motion.button>
            {logo && <TeamBadge src={logo} alt="معاينة" size={8} />}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-12 h-10 rounded-xl border border-[rgba(212,175,55,0.15)] cursor-pointer"
            />
            <span className="text-gray-400 text-sm">{color}</span>
          </div>
          <input
            placeholder="قيمة الفريق"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
        <div className="flex gap-2">
          <motion.button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-[#D4AF37] text-black font-bold rounded-xl disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {submitting ? "...جاري" : editing ? "حفظ" : "إضافة"}
          </motion.button>
          {editing && (
            <motion.button
              type="button"
              onClick={reset}
              className="px-4 py-2 bg-dark text-gray-400 rounded-xl border border-[rgba(212,175,55,0.15)]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              إلغاء
            </motion.button>
          )}
        </div>
      </motion.form>

      {/* Team list */}
      <div className="space-y-2">
        {teams.map((team, i) => (
          <motion.div
            key={team.id}
            className="glass-card p-4 flex items-center justify-between gap-2 flex-wrap"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.03 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-3">
              {team.logo?.startsWith("/") || team.logo?.startsWith("http") ? (
                <TeamBadge src={team.logo} alt={team.shortName} size={8} />
              ) : (
                <Icon name="shield" size={28} className="text-[#D4AF37]" />
              )}
              <div>
                <div className="font-bold text-white">{team.name}</div>
                <div className="text-xs text-gray-400">{team.shortName} · {team.players?.length || 0} لاعب</div>
                {team.manualPoints != null && (
                  <div className="text-[10px] text-[#D4AF37] mt-0.5">يدوي: {team.manualPoints}نقاط</div>
                )}
                {team.value != null && (
                  <div className="text-[10px] text-emerald-400 mt-0.5">قيمة: {team.value.toLocaleString()}</div>
                )}
              </div>
            </div>
            <div className="flex gap-1 sm:gap-2 flex-wrap justify-end">
              {team.value != null && (
                <motion.button
                  onClick={() => handleDistribute(team.id)}
                  className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-[rgba(16,185,129,0.1)] text-emerald-400 rounded-lg border border-emerald-500/20"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  توزيع
                </motion.button>
              )}
              <motion.button
                onClick={() => openStats(team)}
                className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-[rgba(59,130,246,0.1)] text-blue-400 rounded-lg border border-blue-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                إحصائيات
              </motion.button>
              <motion.button
                onClick={() => edit(team)}
                className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-[rgba(212,175,55,0.1)] text-[#D4AF37] rounded-lg border border-[rgba(212,175,55,0.2)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                تعديل
              </motion.button>
              <motion.button
                onClick={() => remove(team.id)}
                className="px-2 sm:px-3 py-1 text-[10px] sm:text-xs bg-red-500/10 text-red-400 rounded-lg border border-red-500/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                حذف
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
