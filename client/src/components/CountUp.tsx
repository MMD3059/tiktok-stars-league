import { motion } from "framer-motion";

interface Props {
  to: number;
  duration?: number;
  className?: string;
}

export default function CountUp({ to, duration = 1.5, className = "" }: Props) {
  return (
    <motion.span
      className={className}
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3 }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        {to}
      </motion.span>
    </motion.span>
  );
}
