import { motion } from "framer-motion";

interface Props {
  size?: number;
  className?: string;
}

export default function SpinningStarball({ size = 80, className = "" }: Props) {
  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" width={size} height={size}>
          <defs>
            <radialGradient id="ballGradGold" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="#D4AF37" />
              <stop offset="100%" stopColor="#B8860B" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="45" fill="url(#ballGradGold)" />
          <polygon
            points="50,15 56,38 80,38 60,52 67,75 50,60 33,75 40,52 20,38 44,38"
            fill="#0B0B0B"
            opacity={0.8}
          />
          <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(212,175,55,0.3)" strokeWidth="1" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        <svg viewBox="0 0 100 100" width={size * 1.3} height={size * 1.3}>
          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(212, 175, 55, 0.15)" strokeWidth="0.5" strokeDasharray="4 4" />
        </svg>
      </motion.div>
    </div>
  );
}
