import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import Icon from "../../components/Icon";
import { api } from "../../api";
import type { Player, Team } from "../../types";

const positions = ["GK", "DEF", "LW", "RW", "MID", "SUB"];

export default function AdminPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [name, setName] = useState("");
  const [position, setPosition] = useState("GK");
  const [teamId, setTeamId] = useState<number>(1);
  const [imageUrl, setImageUrl] = useState("");
  const [goalsScored, setGoalsScored] = useState(0);
  const [price, setPrice] = useState("");
  const [isCaptain, setIsCaptain] = useState(false);
  const [isSubstitute, setIsSubstitute] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Promise.all([api.getPlayers(), api.getTeams()]).then(([p, t]) => {
      setPlayers(p);
      setTeams(t);
    });
  }, []);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadFile(file);
      setImageUrl(url);
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
    const data: any = { name, position, imageUrl: imageUrl || null, teamId, goalsScored, isCaptain, isSubstitute };
    if (price) data.price = parseInt(price, 10);
    try {
      if (editing) {
        await api.updatePlayer(editing, data);
      } else {
        await api.createPlayer(data);
      }
      reset();
      const [p] = await Promise.all([api.getPlayers()]);
      setPlayers(p);
    } catch (err: any) {
      alert("خطأ: " + (err.message || "فشل الحفظ"));
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  function edit(player: Player) {
    setName(player.name);
    setPosition(player.position);
    setTeamId(player.teamId);
    setImageUrl(player.imageUrl ?? "");
    setGoalsScored(player.goalsScored);
    setPrice(player.price ? String(player.price) : "");
    setIsCaptain(player.isCaptain);
    setIsSubstitute(player.isSubstitute);
    setEditing(player.id);
  }

  async function remove(id: number) {
    if (confirm("حذف اللاعب؟")) {
      await api.deletePlayer(id);
      api.getPlayers().then(setPlayers);
    }
  }

  function reset() {
    setName(""); setPosition("GK"); setTeamId(1);
    setImageUrl(""); setGoalsScored(0); setPrice(""); setIsCaptain(false); setIsSubstitute(false);
    setEditing(null);
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
          {editing ? "تعديل لاعب" : "إضافة لاعب"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="اسم اللاعب"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
            required
          />
          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
          >
            {positions.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <select
            value={teamId}
            onChange={(e) => setTeamId(Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
          >
            {teams.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Photo upload */}
          <div className="flex items-center gap-3 md:col-span-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={handleFile}
              className="hidden"
            />
            <input
              placeholder="رابط الصورة"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
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
            {imageUrl && (
              <img
                src={imageUrl}
                alt="معاينة"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37]/30"
              />
            )}
          </div>

          <input
            type="number"
            placeholder="الأهداف"
            value={goalsScored}
            onChange={(e) => setGoalsScored(Number(e.target.value))}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
          />
          <input
            type="number"
            placeholder="السعر"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
          />
          <label className="flex items-center gap-2 text-white">
            <input type="checkbox" checked={isCaptain} onChange={(e) => setIsCaptain(e.target.checked)} />
            قائد
          </label>
          <label className="flex items-center gap-2 text-white">
            <input type="checkbox" checked={isSubstitute} onChange={(e) => setIsSubstitute(e.target.checked)} />
            احتياط
          </label>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {players.map((p, i) => (
          <motion.div
            key={p.id}
            className="glass-card p-3 flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.02 }}
            whileHover={{ x: 4 }}
          >
            <div className="flex items-center gap-3">
              {p.imageUrl ? (
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37]/30"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-dark border-2 border-[rgba(212,175,55,0.15)] flex items-center justify-center">
                  <Icon name="trophy" size={16} className="text-[#D4AF37]" />
                </div>
              )}
              <div>
                <div className="font-bold text-white">
                  {p.name}
                  {p.isCaptain && (
                    <Icon name="star" size={12} className="text-[#D4AF37]" />
                  )}
                </div>
                <div className="text-xs text-gray-400">
                  {p.position} · {p.team?.shortName} · {p.goalsScored} هدف
                  {p.price != null && <> · <span className="text-emerald-400">{p.price.toLocaleString()}</span></>}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <motion.button
                onClick={() => edit(p)}
                className="px-3 py-1 text-xs bg-[rgba(212,175,55,0.1)] text-[#D4AF37] rounded-lg border border-[rgba(212,175,55,0.2)]"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                تعديل
              </motion.button>
              <motion.button
                onClick={() => remove(p.id)}
                className="px-3 py-1 text-xs bg-red-500/10 text-red-400 rounded-lg border border-red-500/20"
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
