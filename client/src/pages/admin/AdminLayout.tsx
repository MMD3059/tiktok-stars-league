import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import AdminTeams from "./AdminTeams";
import AdminPlayers from "./AdminPlayers";
import AdminMatches from "./AdminMatches";
import AdminTransfers from "./AdminTransfers";
import AdminScores from "./AdminScores";
import AdminUpcoming from "./AdminUpcoming";
import AdminTopScorers from "./AdminTopScorers";
import CardShowcase from "./CardShowcase";
import AdminSettings from "./AdminSettings";

const adminLinks = [
  { to: "/admin", label: "الفرق", end: true },
  { to: "/admin/players", label: "اللاعبين" },
  { to: "/admin/top-scorers", label: "الهدافين" },
  { to: "/admin/matches", label: "جميع المباريات" },
  { to: "/admin/scores", label: "إدخال النتائج" },
  { to: "/admin/upcoming", label: "المباريات القادمة" },
  { to: "/admin/transfers", label: "الانتقالات" },
  { to: "/admin/cards", label: "تصميم البطاقات" },
  { to: "/admin/settings", label: "الإعدادات" },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      navigate("/admin/login");
    } else {
      setAuthed(true);
    }
    setChecking(false);
  }, []);

  function logout() {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    navigate("/admin/login");
  }

  if (checking) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center text-gray-500">
        جاري التحقق...
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8" dir="rtl">
      <div className="flex items-center justify-between mb-6">
        <motion.h1
          className="text-3xl md:text-4xl font-black text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          لوحة <span className="text-gold-gradient">الإدارة</span>
        </motion.h1>
        <motion.button
          onClick={logout}
          className="px-4 py-2 text-sm bg-red-500/10 text-red-400 rounded-xl border border-red-500/20"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          تسجيل خروج
        </motion.button>
      </div>

      <div className="flex justify-center gap-2 mb-8 flex-wrap">
        {adminLinks.map((link) => {
          const isActive = link.end
            ? location.pathname === "/admin"
            : location.pathname === link.to;
          return (
            <Link key={link.to} to={link.to}>
              <motion.span
                className={`inline-block px-4 py-2 rounded-xl font-bold text-sm transition-colors ${
                  isActive
                    ? "bg-[#D4AF37] text-black"
                    : "bg-dark text-gray-400 border border-[rgba(212,175,55,0.15)] hover:text-white"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {link.label}
              </motion.span>
            </Link>
          );
        })}
      </div>

      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Routes>
          <Route index element={<AdminTeams />} />
          <Route path="players" element={<AdminPlayers />} />
          <Route path="top-scorers" element={<AdminTopScorers />} />
          <Route path="matches" element={<AdminMatches />} />
          <Route path="scores" element={<AdminScores />} />
          <Route path="upcoming" element={<AdminUpcoming />} />
          <Route path="transfers" element={<AdminTransfers />} />
          <Route path="cards" element={<CardShowcase />} />
          <Route path="settings" element={<AdminSettings />} />
        </Routes>
      </motion.div>
    </div>
  );
}
