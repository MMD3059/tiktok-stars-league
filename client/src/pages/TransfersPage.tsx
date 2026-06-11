import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "../components/Icon";
import { api } from "../api";
import type { Transfer } from "../types";
import { SkeletonTable } from "../components/Skeleton";

export default function TransfersPage() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTransfers().then((data) => {
      setTransfers(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SkeletonTable rows={8} cols={4} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.h1
        className="text-3xl md:text-4xl font-black text-white mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        سوق <span className="text-gold-gradient">الانتقالات</span>
      </motion.h1>

      <motion.div
        className="rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: "rgba(20,20,20,0.85)",
          border: "1px solid rgba(212,175,55,0.1)",
        }}
      >
        {/* Header */}
        <div
          className="grid grid-cols-[1fr_1fr_auto_1fr] gap-2 px-4 py-3 text-[10px] font-bold text-gray-500 uppercase tracking-wider"
          style={{ borderBottom: "1px solid rgba(212,175,55,0.08)" }}
        >
          <span>اللاعب</span>
          <span className="text-center">من</span>
          <span className="w-8" />
          <span className="text-center">إلى</span>
        </div>

        {transfers.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            <Icon name="arrow-left-right" className="mx-auto mb-3 text-[#D4AF37]" size={36} />
            <div className="text-xs">لا يوجد انتقالات حتى الآن</div>
          </div>
        )}

        {transfers.map((transfer, i) => (
          <motion.div
            key={transfer.id}
            className="grid grid-cols-[1fr_1fr_auto_1fr] gap-2 px-4 py-3.5 items-center transition-all duration-200 hover:bg-white/[0.02]"
            style={{
              borderBottom: i < transfers.length - 1 ? "1px solid rgba(212,175,55,0.04)" : "none",
            }}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span className="truncate">{transfer.playerName}</span>
            </div>

            <div className="text-center text-gray-400 text-xs truncate">{transfer.fromTeam}</div>

            <div className="w-8 flex justify-center">
              <motion.div
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>

            <div className="text-center text-gray-400 text-xs truncate">{transfer.toTeam}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
