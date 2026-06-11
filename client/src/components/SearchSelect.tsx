import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SelectOption {
  id: number;
  name: string;
  subtitle?: string;
  imageUrl?: string | null;
}

interface Props {
  options: SelectOption[];
  value: SelectOption | null;
  onChange: (opt: SelectOption) => void;
  placeholder?: string;
  label?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export default function SearchSelect({ options, value, onChange, placeholder = "اختر...", label, icon, disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter((o) =>
    o.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (opt: SelectOption) => {
    onChange(opt);
    setOpen(false);
    setSearch("");
  };

  return (
    <div ref={ref} className="relative" dir="rtl">
      {label && (
        <label className="block text-[10px] font-bold text-gray-500 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={() => { if (!disabled) setOpen(!open); }}
        className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
          disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
        style={{
          background: value ? "rgba(212,175,55,0.06)" : "rgba(255,255,255,0.03)",
          border: open
            ? "1px solid rgba(212,175,55,0.3)"
            : "1px solid rgba(212,175,55,0.1)",
          color: value ? "#fff" : "rgba(255,255,255,0.3)",
        }}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {value ? (
          <span className="flex items-center gap-2 truncate">
            {value.imageUrl && (
              <img
                src={value.imageUrl}
                alt=""
                className="w-5 h-5 rounded-full object-cover shrink-0"
              />
            )}
            <span className="truncate">{value.name}</span>
            {value.subtitle && (
              <span className="text-[9px] text-gray-500 shrink-0">{value.subtitle}</span>
            )}
          </span>
        ) : (
          <span className="truncate">{placeholder}</span>
        )}
        <svg
          className={`shrink-0 mr-auto transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{ color: "rgba(212,175,55,0.5)" }}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-1 rounded-xl overflow-hidden"
            style={{
              background: "rgba(25,25,25,0.98)",
              border: "1px solid rgba(212,175,55,0.15)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Search */}
            <div className="p-2 border-b" style={{ borderColor: "rgba(212,175,55,0.06)" }}>
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="بحث..."
                className="w-full bg-dark rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 outline-none"
                style={{ border: "1px solid rgba(212,175,55,0.08)" }}
              />
            </div>

            {/* Options */}
            <div className="max-h-48 overflow-y-auto py-1">
              {filtered.map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm font-bold text-right transition-colors hover:bg-white/[0.04]"
                  style={{
                    color: value?.id === opt.id ? "#D4AF37" : "#e2e8f0",
                  }}
                >
                  {opt.imageUrl && (
                    <img
                      src={opt.imageUrl}
                      alt=""
                      className="w-6 h-6 rounded-full object-cover shrink-0"
                    />
                  )}
                  <span className="truncate">{opt.name}</span>
                  {opt.subtitle && (
                    <span className="text-[9px] text-gray-500 mr-auto shrink-0">
                      {opt.subtitle}
                    </span>
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="text-center py-4 text-[11px] text-gray-500">
                  لا توجد نتائج
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
