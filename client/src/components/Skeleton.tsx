import { motion } from "framer-motion";

const shimmer = {
  animate: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: { repeat: Infinity, duration: 1.5, ease: "linear" },
  },
};

interface SkeletonLineProps {
  className?: string;
  width?: string;
}

export function SkeletonLine({ className = "", width = "100%" }: SkeletonLineProps) {
  return (
    <motion.div
      className={`skeleton-shimmer rounded ${className}`}
      style={{ width, height: 20 }}
      variants={shimmer}
      animate="animate"
    />
  );
}

interface SkeletonTableProps {
  rows?: number;
  cols?: number;
}

export function SkeletonTable({ rows = 10, cols = 6 }: SkeletonTableProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-3">
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonLine
              key={j}
              className="flex-1"
              width={j === 0 ? "40px" : j === 1 ? "60%" : j === cols - 1 ? "50px" : "80px"}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center gap-3">
        <SkeletonLine width="40px" className="shrink-0" />
        <SkeletonLine width="60%" />
      </div>
      <SkeletonLine width="80%" />
      <SkeletonLine width="40%" />
    </div>
  );
}
