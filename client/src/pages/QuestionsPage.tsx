import { motion } from "framer-motion";
import Icon from "../components/Icon";
import ShieldLogo from "../components/ShieldLogo";

const categories = [
  { name: "لاعب", icon: "cat-player", desc: "أسئلة عن اللاعبين — تاريخهم، إنجازاتهم، أرقامهم القياسية", color: "#D4AF37" },
  { name: "مدرب", icon: "cat-coach", desc: "أسئلة عن المدربين — مسيرتهم، بطولاتهم، فلسفتهم", color: "#C0A030" },
  { name: "ملعب", icon: "cat-stadium", desc: "أسئلة عن الملاعب — سعتها، مواقعها، تاريخها", color: "#B8962C" },
  { name: "مزاد", icon: "cat-auction", desc: "أسئلة المزاد — إجابة سريعة في 10 ثوانٍ", color: "#A08020" },
  { name: "فرق", icon: "cat-teams", desc: "أسئلة عن الأندية — تاريخها، تشكيلاتها، بطولاتها", color: "#D4AF37" },
  { name: "منتخبات", icon: "cat-national", desc: "أسئلة عن المنتخبات — كأس العالم، البطولات القارية", color: "#C0A030" },
  { name: "دوريات", icon: "cat-leagues", desc: "أسئلة عن الدوريات — أبطالها، ترتيبها، إحصائياتها", color: "#B8962C" },
  { name: "كؤوس", icon: "cat-cups", desc: "أسئلة عن الكؤوس — نهائيات، ألقاب، مفاجآت", color: "#A08020" },
  { name: "المزيد", icon: "cat-more", desc: "أسئلة متنوعة من عالم كرة القدم", color: "#D4AF37" },
];

export default function QuestionsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex justify-center mb-4">
          <ShieldLogo size={60} src="/logo.png" />
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          <span className="text-white">فئات </span>
          <span className="text-gold-gradient">الأسئلة</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          كل مباراة تتكون من 20 سؤالاً من 9 فئات مختلفة — استراحة بعد السؤال العاشر
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => {
          return (
            <motion.div
              key={cat.name}
              className="glass-card p-6 text-center hover-lift"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <motion.div
                className="flex justify-center mb-4"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.2 }}
              >
                <Icon name={cat.icon} size={40} className="text-[#D4AF37]" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">{cat.name}</h3>
              <p className="text-sm text-gray-400">{cat.desc}</p>
              <div className="mt-4 flex justify-center gap-1">
                {Array.from({ length: 3 }).map((_, j) => (
                  <motion.div
                    key={j}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color, opacity: 0.3 + j * 0.3 }}
                    animate={{ opacity: [0.3 + j * 0.3, 0.8, 0.3 + j * 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: j * 0.3 }}
                  />
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="glass-card p-8 mt-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-white mb-4">نظام المباراة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          <div className="p-4">
            <div className="text-3xl font-black text-gold-gradient mb-1">20</div>
            <div className="text-sm text-gray-400">سؤالاً لكل مباراة</div>
          </div>
          <div className="p-4 border-x border-[rgba(212,175,55,0.1)]">
            <div className="text-3xl font-black text-gold-gradient mb-1">10</div>
            <div className="text-sm text-gray-400">استراحة بعد السؤال</div>
          </div>
          <div className="p-4">
            <div className="text-3xl font-black text-gold-gradient mb-1">10s</div>
            <div className="text-sm text-gray-400">وقت الإجابة للمزاد</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
