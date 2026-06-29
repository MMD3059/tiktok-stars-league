import { useState } from "react";
import { motion } from "framer-motion";
import Icon from "../../components/Icon";
import { api } from "../../api";

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg("");
    setErr("");
    if (newPassword !== confirm) {
      setErr("كلمة المرور الجديدة غير متطابقة");
      return;
    }
    if (newPassword.length < 4) {
      setErr("كلمة المرور يجب أن تكون 4 أحرف على الأقل");
      return;
    }
    try {
      await api.changePassword(currentPassword, newPassword);
      setMsg("تم تغيير كلمة المرور بنجاح");
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
    } catch (e: any) {
      setErr(e.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <motion.h1
        className="text-2xl font-black text-white mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Icon name="shield" className="inline ml-2 text-[#D4AF37]" size={24} />
        تغيير كلمة المرور
      </motion.h1>

      <motion.form
        onSubmit={handleSubmit}
        className="glass-card p-6 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <label className="block text-xs text-gray-500 mb-1">كلمة المرور الحالية</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">كلمة المرور الجديدة</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-500 mb-1">تأكيد كلمة المرور الجديدة</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full bg-dark border border-[rgba(212,175,55,0.15)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {err && <div className="text-xs text-red-400 text-center">{err}</div>}
        {msg && <div className="text-xs text-win text-center">{msg}</div>}

        <motion.button
          type="submit"
          className="w-full px-6 py-3 bg-[#D4AF37] text-black font-bold rounded-xl"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          تغيير كلمة المرور
        </motion.button>
      </motion.form>
    </div>
  );
}
