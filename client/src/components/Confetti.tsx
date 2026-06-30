import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#D4AF37", "#FFD700", "#FF6B6B", "#48BB78", "#63B3ED", "#D53F8C"];
const PIECES = 30;

interface Piece {
  id: number;
  color: string;
  x: number;
  rotation: number;
  scale: number;
}

export default function Confetti({ trigger }: { trigger: boolean }) {
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!trigger) return;
    const arr: Piece[] = Array.from({ length: PIECES }, (_, i) => ({
      id: i,
      color: COLORS[i % COLORS.length],
      x: (Math.random() - 0.5) * 300,
      rotation: Math.random() * 720 - 360,
      scale: 0.5 + Math.random() * 0.8,
    }));
    setPieces(arr);
    const t = setTimeout(() => setPieces([]), 2000);
    return () => clearTimeout(t);
  }, [trigger]);

  return (
    <AnimatePresence>
      {pieces.map((p) => (
        <motion.div
          key={p.id}
          className="pointer-events-none fixed top-1/2 left-1/2 z-50"
          initial={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 0 }}
          animate={{
            opacity: 0,
            x: p.x,
            y: 400 + Math.random() * 200,
            rotate: p.rotation,
            scale: p.scale,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 + Math.random() * 0.5, ease: "easeOut" }}
          style={{ width: 8, height: 8, borderRadius: "50%", background: p.color }}
        />
      ))}
    </AnimatePresence>
  );
}
