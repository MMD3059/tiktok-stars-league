import { motion } from "framer-motion";
import Icon from "../components/Icon";
import ShieldLogo from "../components/ShieldLogo";

const committeeData = [
  {
    title: "اللجنة التنظيمية",
    icon: "clipboard-list",
    responsibilities: [
      "تسجيل الفرق وتأكيد المشاركة",
      "جدولة المباريات وتحديد المواعيد",
      "متابعة الترتيب وجدول النقاط",
      "توزيع الجوائز على الفائزين",
      "تحديد مواعيد المباريات والتأجيلات",
    ],
    color: "#D4AF37",
  },
  {
    title: "لجنة التحكيم",
    icon: "swords",
    responsibilities: [
      "إدارة المباريات ومراقبة الأسئلة",
      "إصدار القرارات النهائية في النزاعات",
      "فض النزاعات بين الفرق واللاعبين",
      "تطبيق نظام البطاقات الصفراء والحمراء",
      "البت في الطعون والاحتجاجات",
    ],
    color: "#C0A030",
  },
];

const rules = [
  {
    title: "نظام النقاط",
    icon: "shield",
    items: [
      "الفوز = 3 نقاط",
      "التعادل = 1 نقطة",
      "الخسارة = 0 نقاط",
    ],
  },
  {
    title: "نظام البطاقات",
    icon: "alert-triangle",
    items: [
      "بطاقة صفراء = إنذار",
      "بطاقتان صفراوان = إيقاف مباراة",
      "بطاقة حمراء = طرد + إيقاف مباراة",
    ],
  },
  {
    title: "الانتقالات",
    icon: "arrow-left-right",
    items: [
      "يجب أن يكون اللاعب مسجلاً",
      "يتم تسجيل الانتقال من قبل اللجنة",
    ],
  },
  {
    title: "قائد الفريق",
    icon: "user-check",
    items: [
      "الشخص الوحيد المخاطب مع اللجنة",
      "مسؤول عن إدارة الفريق",
      "مسؤول عن الانتقالات",
      "مسؤول عن انضباط اللاعبين",
    ],
  },
];

export default function CommitteePage() {
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
          <span className="text-white">اللجنة </span>
          <span className="text-gold-gradient">والحكام</span>
        </h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          لجنة تنظيم ولجنة تحكيم مسؤولتان عن إدارة البطولة وضمان سيرها بنظام
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {committeeData.map((committee, i) => {
          return (
            <motion.div
              key={committee.title}
              className="glass-card p-8 hover-lift-sm"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex items-center gap-4 mb-6">
                <Icon name={committee.icon} size={40} className="text-[#D4AF37]" />
                <h2 className="text-2xl font-bold text-white">{committee.title}</h2>
              </div>
              <ul className="space-y-3">
                {committee.responsibilities.map((r, j) => (
                  <motion.li
                    key={j}
                    className="flex items-center gap-3 text-gray-300"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 + j * 0.05 }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ backgroundColor: committee.color }}
                    />
                    {r}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>

      <motion.h2
        className="text-2xl font-bold text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-white">قوانين </span>
        <span className="text-gold-gradient">البطولة</span>
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {rules.map((rule, i) => {
          return (
            <motion.div
              key={rule.title}
              className="glass-card p-6 hover-lift-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon name={rule.icon} size={24} className="text-[#D4AF37]" />
                <h3 className="font-bold text-white text-lg">{rule.title}</h3>
              </div>
              <ul className="space-y-2">
                {rule.items.map((item, j) => (
                  <li key={j} className="text-sm text-gray-400 flex items-center gap-2">
                    <span className="text-[#D4AF37]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
