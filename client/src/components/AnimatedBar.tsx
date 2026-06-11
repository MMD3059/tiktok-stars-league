import { motion } from "framer-motion";

interface Props {
  percentage: number;
  color?: string;
  className?: string;
}

export default function AnimatedBar({ percentage, color = "#D4AF37", className = "" }: Props) {
  return (
    <div className={`h-2 rounded-full bg-[#1A1A1A] overflow-hidden ${className}`}>      <motion.div
        className="h-full rounded-full"
        style={{ backgroundColor: color }}
        initial={{ width: "0%" }}
        whileInView={{ width: `${Math.min(percentage, 100)}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </div>
  );
}
