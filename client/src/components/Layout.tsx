import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ShieldLogo from "./ShieldLogo";
import StadiumBackground from "./StadiumBackground";
import Icon from "./Icon";
import { useState, useEffect } from "react";


const navLinks = [
  { to: "/", label: "الرئيسية" },
  { to: "/teams", label: "الفرق" },
  { to: "/standings", label: "الترتيب" },
  { to: "/top-scorers", label: "الهدافين" },
  { to: "/schedule", label: "المباريات" },
  { to: "/questions", label: "الفئات" },
  { to: "/committee", label: "اللجنة" },
  { to: "/transfers", label: "الانتقالات" },
];

const tickerMessages = [
  "🏆 دوري نجوم تيك توك — 10 فرق تتنافس على اللقب",
  "⚽ جوائز $900 — بطل الدوري $500, هداف $100, تصفيات $100, سوبر $200",
  "🔥 كل مباراة 20 سؤال",
  "⭐ انطلاق البطولة 1 يوليو 2026",
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Admin pages: isolated shell — no navbar/ticker/footer, but same visual theme
  if (location.pathname.startsWith("/admin")) {
    return (
      <div className="min-h-screen" dir="rtl">
        <StadiumBackground />
        <div className="relative z-10">{children}</div>
      </div>
    );
  }

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen relative" dir="rtl">
      <StadiumBackground />

      {/* Ticker */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-deep/80 backdrop-blur-sm border-b border-[rgba(212,175,55,0.06)] py-1.5 overflow-hidden" style={{ willChange: "transform" }}>
        <div className="ticker-wrap">
          <div className="ticker-text text-[11px] md:text-xs text-[#D4AF37]/70 font-medium tracking-wider">
            {tickerMessages.join("   ")}   {" "}
            {tickerMessages.join("   ")}   {" "}
          </div>
        </div>
      </div>

      {/* Navbar */}
      <motion.nav
        style={{ willChange: "transform" }}
        className={`fixed top-[38px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-deep/95 backdrop-blur-md border-b border-[rgba(212,175,55,0.12)]"
            : "bg-gradient-to-b from-black/60 to-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="hover-scale">
              <div className="rounded-full">
                <ShieldLogo size={32} src="/logo.png" />
              </div>
            </div>
            <span className="text-xl font-bold tracking-wide">
              <span className="text-white">دوري نجوم </span>
              <span className="text-gold-gradient">تيك توك</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to} className={`relative px-3 py-2 rounded-lg text-sm font-bold transition-colors ${
                  isActive
                    ? "text-[#D4AF37]"
                    : "text-gray-400 hover:text-[#D4AF37]"
                } hover-scale`}>
                  {link.label}
                  {isActive && (
                    <div
                      className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                      style={{ background: "linear-gradient(90deg, #D4AF37, #FFD700, #D4AF37)" }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Search */}
          <Link to="/search" className="p-2 text-gray-400 hover:text-[#D4AF37] transition-colors">
            <Icon name="search" size={18} />
          </Link>

          {/* Mobile nav toggle */}
          <MobileNav currentPath={location.pathname} />
        </div>
      </motion.nav>

      {/* Content */}
      <main className="relative z-10 pt-[112px]">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[rgba(212,175,55,0.1)] mt-20">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <ShieldLogo size={24} src="/logo.png" />
            <span className="text-gold-gradient text-lg font-bold">
              دوري نجوم تيك توك
            </span>
          </div>
          <p className="text-gray-500 text-sm">
            جميع الحقوق محفوظة © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
}

function MobileNav({ currentPath }: { currentPath: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-gray-400 p-2 hover:text-[#D4AF37] transition-colors"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {open ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {open && (
        <motion.div
          className="fixed top-16 left-0 right-0 bg-deep/98 backdrop-blur-xl border-b border-[rgba(212,175,55,0.12)] shadow-2xl"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="p-4 space-y-1">
            {[
              { to: "/", label: "الرئيسية" },
              { to: "/teams", label: "الفرق" },
              { to: "/standings", label: "الترتيب" },
              { to: "/top-scorers", label: "الهدافين" },
              { to: "/schedule", label: "المباريات" },
              { to: "/questions", label: "الفئات" },
              { to: "/committee", label: "اللجنة" },
              { to: "/transfers", label: "الانتقالات" },
              { to: "/search", label: "بحث" },
            ].map((link) => {
              const isActive = currentPath === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-[rgba(212,175,55,0.1)] text-[#D4AF37]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
