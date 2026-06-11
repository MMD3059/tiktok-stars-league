import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import PlayerCard, { getAllVariants, type CardVariant } from "../../components/PlayerCard";
import { api } from "../../api";
import type { Player } from "../../types";

const STORAGE_KEY = "preferred_card_variant";

const variantNames: Record<CardVariant, { name: string; desc: string }> = {
  fifa: { name: "FIFA Classic", desc: "نمط FIFA التقليدي مع تقييم وإحصائيات" },
  goldframe: { name: "Gold Frame", desc: "إطار ذهبي فخم مع صورة دائرية" },
  glass: { name: "Glass Premium", desc: "زجاج شفاف مع تأثير ضبابي فاخر" },
  vertical: { name: "Vertical Elegance", desc: "بطاقة عمودية أنيقة مع صورة في النصف العلوي" },
  holo: { name: "Holographic", desc: "هولوغرافيك مع لمعان متحرك ذهبي وحديث" },
};

export default function CardShowcase() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selected, setSelected] = useState<CardVariant>(() => {
    return (localStorage.getItem(STORAGE_KEY) as CardVariant) || "fifa";
  });

  useEffect(() => {
    api.getPlayers().then(setPlayers);
  }, []);

  function select(v: CardVariant) {
    setSelected(v);
    localStorage.setItem(STORAGE_KEY, v);
  }

  const variants = getAllVariants();
  const demo = players.slice(0, 5);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-black text-white mb-2">
          اختر <span className="text-gold-gradient">تصميم البطاقة</span>
        </h2>
        <p className="text-gray-400 text-sm">اختر التصميم اللي يعجبك، وهو رح يظهر في صفحة الفريق تلقائياً</p>
      </div>

      {/* Selected preview */}
      <motion.div
        className="glass-card p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-center gap-1 mb-4">
          <div className="h-px w-12" style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.2))" }} />
          <span className="text-xs text-gray-500 tracking-widest">التصميم المختار</span>
          <div className="h-px w-12" style={{ background: "linear-gradient(270deg, transparent, rgba(212,175,55,0.2))" }} />
        </div>
        <div className="text-2xl font-black text-white mb-1">{variantNames[selected].name}</div>
        <div className="text-sm text-gray-400 mb-6">{variantNames[selected].desc}</div>
        <div className="flex justify-center">
          {demo.length > 0 ? (
            <PlayerCard player={demo[0]} variant={selected} />
          ) : (
            <div className="w-[88px] h-[130px] rounded-xl bg-dark border border-[rgba(212,175,55,0.1)] flex items-center justify-center">
              <span className="text-gray-600 text-xs">أضف لاعبين</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* All variants grid */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {variants.map((v, i) => (
          <motion.button
            key={v}
            onClick={() => select(v)}
            className={`glass-card p-4 text-center cursor-pointer transition-all ${
              selected === v
                ? "border-[#D4AF37] ring-1 ring-[#D4AF37]"
                : "border-transparent hover:border-[rgba(212,175,55,0.2)]"
            }`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Selection indicator */}
            {selected === v && (
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#D4AF37] flex items-center justify-center">
                <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                  <path d="M1 4L3.5 6.5L9 1" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}

            {/* Card preview */}
            <div className="flex justify-center mb-3">
              {demo[i] ? (
                <div className="scale-[0.85] origin-top">
                  <PlayerCard player={demo[i]} variant={v} />
                </div>
              ) : (
                <div className="w-[76px] h-[110px] rounded-xl bg-dark border border-[rgba(212,175,55,0.08)] flex items-center justify-center">
                  <span className="text-gray-600 text-[10px]">—</span>
                </div>
              )}
            </div>

            <div className="text-sm font-bold text-white">{variantNames[v].name}</div>
            <div className="text-[10px] text-gray-500 mt-0.5">{variantNames[v].desc}</div>
          </motion.button>
        ))}
      </div>

      {/* How to apply */}
      <div className="glass-card p-4 text-center">
        <div className="text-xs text-gray-500">
          ✅ التصميم المختار (<span className="text-[#D4AF37] font-bold">{variantNames[selected].name}</span>) رح يظهر تلقائياً في صفحة الفريق
        </div>
      </div>
    </div>
  );
}
