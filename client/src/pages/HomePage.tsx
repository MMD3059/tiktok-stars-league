import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "../components/Icon";
import { api } from "../api";
import ShieldLogo from "../components/ShieldLogo";
import TiltCard from "../components/TiltCard";
import GoldDivider from "../components/GoldDivider";
import FlipCountdown from "../components/FlipCountdown";
import TeamBadge from "../components/TeamBadge";
import type { Team, Standing } from "../types";

const categories = [
  { name: "لاعب", icon: "⚽", desc: "أسئلة عن اللاعبين" },
  { name: "مدرب", icon: "👤", desc: "أسئلة عن المدربين" },
  { name: "ملعب", icon: "🏟️", desc: "أسئلة عن الملاعب" },
  { name: "مزاد", icon: "🔨", desc: "أسئلة المزاد" },
  { name: "فرق", icon: "🏆", desc: "أسئلة عن الأندية" },
  { name: "منتخبات", icon: "🌍", desc: "أسئلة عن المنتخبات" },
  { name: "دوريات", icon: "📊", desc: "أسئلة عن الدوريات" },
  { name: "كؤوس", icon: "🏅", desc: "أسئلة عن الكؤوس" },
  { name: "المزيد", icon: "❓", desc: "أسئلة متنوعة" },
];

const rewards = [
  { title: "هداف الدوري", reward: "100$", condition: "أعلى نقاط مسجلة للفريق", icon: "zap" },
  { title: "بطل الدوري", reward: "500$", condition: "أعلى مجموع نقاط", icon: "crown" },
  { title: "بطل التصفيات", reward: "100$", condition: "المراكز 2-5", icon: "medal" },
  { title: "السوبر", reward: "200$", condition: "البطل vs بطل التصفيات", icon: "sparkles" },
];

const rules = [
  { icon: "users", title: "عدد الفرق", desc: "10 فرق تتنافس في دوري المعرفة الكروية" },
  { icon: "help-circle", title: "عدد الأسئلة", desc: "20 سؤالاً لكل مباراة" },
  { icon: "timer", title: "وقت الإجابة", desc: "10 ثوانٍ للإجابة" },
  { icon: "repeat", title: "الدوران", desc: "دورتان ذهاباً وإياباً — 12 مباراة لكل فريق" },
  { icon: "star", title: "النقاط", desc: "الفوز = 3 / التعادل = 1 / الخسارة = 0" },
  { icon: "x-circle", title: "الغياب", desc: "الفريق المتغيب يخسر 3-0" },
];

const iconMap: Record<string, string> = {
  "⚽": "cat-player",
  "👤": "cat-coach",
  "🏟️": "cat-stadium",
  "🔨": "cat-auction",
  "🏆": "cat-teams",
  "🌍": "cat-national",
  "📊": "cat-leagues",
  "🏅": "cat-cups",
  "❓": "cat-more",
};

export default function HomePage() {
  const [standings, setStandings] = useState<Standing[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getStandings(), api.getTeams()]).then(([s, t]) => {
      setStandings(s);
      setTeams(t);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const top3 = standings.slice(0, 3);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative">

      {/* ====== HERO SECTION ====== */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 60%)",
          }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.12, 0.05] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative z-10 text-center px-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", stiffness: 80 }}
            className="mb-8 flex justify-center"
          >
            <div className="pulse-ring rounded-full">
              <ShieldLogo size={200} src="/logo.png" />
            </div>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-black mb-4 tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-white">دوري نجوم </span>
            <span className="text-gold-gradient">تيك توك</span>
          </motion.h1>

          <motion.p
            className="text-gray-400 text-lg md:text-xl mb-2 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            دوري المعرفة الكروية — 10 فرق، 20 سؤالاً، منافسة لا تنتهي
          </motion.p>

          <motion.p
            className="text-[#D4AF37] text-sm mb-6 font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            برعاية Hayder CR7
          </motion.p>

          {/* Countdown */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            <p className="text-gray-500 text-xs mb-3">العد التنازلي للانطلاق</p>
            <FlipCountdown target="2026-07-01T00:00:00" />
          </motion.div>

          <motion.div
            className="flex gap-4 justify-center flex-wrap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Link to="/standings">
              <span className="inline-block btn-gold text-lg hover-glow">
                شاهد الترتيب
              </span>
            </Link>
            <Link to="/schedule">
              <span className="inline-block btn-gold-outline text-lg hover-glow-outline">
                جدول المباريات
              </span>
            </Link>
          </motion.div>
        </div>
      </section>

      <GoldDivider className="mb-4" />

      {/* ====== QUICK STATS ====== */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "فرق", value: "10", icon: "trophy" },
            { label: "لاعب", value: "60", icon: "users" },
            { label: "مباراة", value: "90", icon: "calendar-days" },
            { label: "جولة", value: "18", icon: "repeat" },
          ].map((stat, i) => {
            return (
              <motion.div
                key={stat.label}
                className="glass-card p-6 text-center hover-lift-sm"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-center mb-2">
                  <Icon name={stat.icon} className="text-[#D4AF37]" size={32} />
                </div>
                <div className="text-3xl lg:text-4xl font-black text-[#D4AF37]">{stat.value}</div>
                <div className="text-gray-400 text-sm lg:text-base">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ====== TOP 3 PODIUM ====== */}
      {!loading && top3.length >= 3 && (
        <section className="max-w-7xl mx-auto px-4 py-20">
          <motion.h2
            className="text-3xl font-bold text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-white">منصة </span>
            <span className="text-gold-gradient">التتويج</span>
          </motion.h2>

          <div className="flex items-end justify-center gap-1 sm:gap-4">
            {/* 2nd */}
            <motion.div
              className="glass-card p-2 sm:p-6 text-center w-20 sm:w-36 md:w-48 hover-lift"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex justify-center mb-2">
                <Icon name="medal" className="text-gray-300" size={32} />
              </div>
              <TeamBadge src={top3[1].logo} alt={top3[1].shortName} size={10} />
              <div className="text-sm text-gray-400 mt-1">الوصيف</div>
              <div className="font-bold text-white text-xs sm:text-sm truncate max-w-full">{top3[1].shortName}</div>
              <motion.div
                className="text-xl sm:text-2xl font-black text-[#D4AF37] mt-2 score-flip"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
              >
                <span className="score-flip-inner">{top3[1].points}</span>
              </motion.div>
              <div className="text-xs text-gray-500">نقطة</div>
            </motion.div>

            {/* 1st */}
            <motion.div
              className="glass-card p-3 sm:p-8 text-center w-28 sm:w-40 md:w-56 -mt-8 hover-lift"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              style={{ borderColor: "rgba(212, 175, 55, 0.3)" }}
            >
              <div className="flex justify-center mb-2">
                <Icon name="crown" className="text-[#FFD700]" size={36} />
              </div>
              <div className="text-base sm:text-lg font-bold text-gold-gradient mb-1">البطل</div>
              <TeamBadge src={top3[0].logo} alt={top3[0].shortName} size={12} />
              <div className="font-bold text-white text-sm sm:text-lg mt-1 truncate max-w-full">{top3[0].shortName}</div>
              <motion.div
                className="text-2xl sm:text-4xl font-black text-gold-gradient mt-2 score-flip"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
              >
                <span className="score-flip-inner">{top3[0].points}</span>
              </motion.div>
              <div className="text-xs text-gray-500">نقطة</div>
            </motion.div>

            {/* 3rd */}
            <motion.div
              className="glass-card p-2 sm:p-6 text-center w-20 sm:w-36 md:w-48 hover-lift"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex justify-center mb-2">
                <Icon name="medal" className="text-amber-600" size={32} />
              </div>
              <TeamBadge src={top3[2].logo} alt={top3[2].shortName} size={10} />
              <div className="text-sm text-amber-600 mt-1">الثالث</div>
              <div className="font-bold text-white text-xs sm:text-sm truncate max-w-full">{top3[2].shortName}</div>
              <motion.div
                className="text-xl sm:text-2xl font-black text-amber-600 mt-2 score-flip"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
              >
                <span className="score-flip-inner">{top3[2].points}</span>
              </motion.div>
              <div className="text-xs text-gray-500">نقطة</div>
            </motion.div>
          </div>
        </section>
      )}

      <GoldDivider className="mb-4" />

      {/* ====== ALL TEAMS GRID ====== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-white">فرق </span>
          <span className="text-gold-gradient">البطولة</span>
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-5 gap-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {teams.map((team) => (
            <Link key={team.id} to={`/team/${team.id}`}>
              <TiltCard>
                <motion.div
                  className="glass-card p-4 text-center cursor-pointer hover-lift"
                  variants={itemVariants}
                >
                  <div className="mb-2 flex justify-center">
                    <TeamBadge src={team.logo} alt={team.shortName} size={12} />
                  </div>
                  <div className="font-bold text-white text-sm lg:text-base">{team.shortName}</div>
                </motion.div>
              </TiltCard>
            </Link>
          ))}
        </motion.div>
      </section>

      {/* ====== 3D ROTATING TROPHY CARD ====== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-white">الكأس </span>
          <span className="text-gold-gradient">الأغلى</span>
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          من سيرفع الكأس في نهاية الموسم؟
        </motion.p>

        <div className="flex justify-center">
          <TiltCard>
            <motion.div
              className="glass-card p-10 text-center hover-glow"
              style={{ width: 280, borderColor: "rgba(212,175,55,0.2)" }}
              initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, type: "spring", stiffness: 60 }}
            >
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Icon name="trophy" size={80} className="text-[#D4AF37] mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl lg:text-2xl font-black text-gold-gradient mb-2">كأس البطولة</h3>
              <p className="text-gray-500 text-sm lg:text-base mb-4">500$</p>
              <div className="text-[10px] text-gray-600 tracking-widest uppercase">
                نجوم تيك توك
              </div>
            </motion.div>
          </TiltCard>
        </div>
      </section>

      <GoldDivider className="mb-4" />

      {/* ====== REWARDS SECTION ====== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-white">الجوائز </span>
          <span className="text-gold-gradient">والمكافآت</span>
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          جوائز قيمة لأفضل الفرق واللاعبين في البطولة
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewards.map((item, i) => {
            return (
              <motion.div
                key={item.title}
                className="glass-card p-6 text-center relative overflow-hidden hover-lift"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="flex justify-center mb-3">
                  <Icon name={item.icon} className="text-[#D4AF37]" size={40} />
                </div>
                <h3 className="text-xl lg:text-2xl font-bold text-white mb-1">{item.title}</h3>
                <div className="text-3xl lg:text-4xl font-black text-gold-gradient mb-2">{item.reward}</div>
                <div className="text-xs lg:text-sm text-gray-500">{item.condition}</div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <GoldDivider className="mb-4" />

      {/* ====== RULES SECTION ====== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-white">قوانين </span>
          <span className="text-gold-gradient">البطولة</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rules.map((rule, i) => {
            return (
              <motion.div
                key={rule.title}
                className="glass-card p-5 flex items-start gap-4 hover-shift"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="mt-1">
                  <Icon name={rule.icon} className="text-[#D4AF37]" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-white mb-1 lg:text-lg">{rule.title}</h4>
                  <p className="text-sm lg:text-base text-gray-400">{rule.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      <GoldDivider className="mb-4" />

      {/* ====== QUESTIONS CATEGORIES ====== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-white">فئات </span>
          <span className="text-gold-gradient">الأسئلة</span>
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          20 سؤالاً في كل مباراة من 9 فئات متنوعة
        </motion.p>

        <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
          {categories.map((cat, i) => {
            return (
              <Link key={cat.name} to="/questions">
                <motion.div
                  className="glass-card p-2 sm:p-4 text-center cursor-pointer hover-lift"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.03 }}
                >
                  <div className="flex justify-center mb-1">
                    <Icon name={iconMap[cat.icon] || "help-circle"} className="text-[#D4AF37]" size={20} />
                  </div>
                  <div className="text-[10px] sm:text-xs font-bold text-white truncate">{cat.name}</div>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </section>

      <GoldDivider className="mb-4" />

      {/* ====== COMMITTEE SECTION ====== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.h2
          className="text-3xl font-bold text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="text-white">اللجنة </span>
          <span className="text-gold-gradient">والحكام</span>
        </motion.h2>
        <motion.p
          className="text-gray-500 text-center mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          لجنة تنظيم ولجنة تحكيم لإدارة البطولة
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/committee">
            <motion.div
              className="glass-card p-8 text-center hover-lift"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <Icon name="clipboard-list" className="text-[#D4AF37]" size={48} />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">اللجنة التنظيمية</h3>
              <p className="text-sm lg:text-base text-gray-400">
                تسجيل الفرق — جدولة المباريات — الترتيب — الجوائز — مواعيد المباريات
              </p>
            </motion.div>
          </Link>
          <Link to="/committee">
            <motion.div
              className="glass-card p-8 text-center hover-lift"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">
                <Icon name="swords" className="text-[#D4AF37]" size={48} />
              </div>
              <h3 className="text-xl lg:text-2xl font-bold text-white mb-2">لجنة التحكيم</h3>
              <p className="text-sm lg:text-base text-gray-400">
                إدارة المباريات — القرارات النهائية — فض النزاعات
              </p>
            </motion.div>
          </Link>
        </div>
      </section>

      <GoldDivider className="mb-4" />

      {/* ====== CTA ====== */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <motion.div
          className="glass-card p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ borderColor: "rgba(212, 175, 55, 0.2)" }}
        >
          <div className="pulse-ring rounded-full mb-4 inline-flex">
            <ShieldLogo size={60} src="/logo.png" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">انطلق الموسم!</h2>
          <p className="text-gray-400 mb-6 max-w-lg mx-auto">
            انطلاق البطولة: 1 يوليو 2026 — استعدوا للمنافسة
          </p>
          <Link to="/standings">
            <span className="inline-block btn-gold text-lg hover-glow">
              تابع الترتيب الآن
            </span>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
