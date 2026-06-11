interface Props {
  size?: number;
  className?: string;
  showWreath?: boolean;
  src?: string;
}

export default function ShieldLogo({ size = 80, className = "", showWreath = true, src }: Props) {
  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size, willChange: "transform" }}
    >
      {/* Outer glow — z-0 */}
      <div
        className="absolute z-0 inset-0 rounded-full animate-gold-pulse"
        style={{ filter: "blur(10px)", opacity: src ? 0.5 : 1 }}
      />

      {/* Wreath glow + ring — z-0 underneath logo */}
      {showWreath && (
        <>
          <div
            className="absolute z-0 animate-spin-slower"
            style={{ width: size * 1.35, height: size * 1.35, opacity: 0.35, filter: "blur(6px)" }}
          >
            <svg viewBox="0 0 120 120" width={size * 1.35} height={size * 1.35}>
              <path d="M10 60 Q10 30 30 15 Q25 35 20 55 Q18 65 25 75 Q20 85 30 95" fill="none" stroke="#FFD700" strokeWidth="4"/>
              <path d="M110 60 Q110 30 90 15 Q95 35 100 55 Q102 65 95 75 Q100 85 90 95" fill="none" stroke="#FFD700" strokeWidth="4"/>
            </svg>
          </div>
          <div className="absolute z-0 animate-spin-slower" style={{ width: size * 1.35, height: size * 1.35 }}>
            <svg viewBox="0 0 120 120" width={size * 1.35} height={size * 1.35} style={{ filter: "drop-shadow(0 0 4px rgba(212,175,55,0.5))" }}>
              <defs>
                <linearGradient id="wreathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.6"/>
                  <stop offset="50%" stopColor="#FFD700" stopOpacity="1"/>
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.6"/>
                </linearGradient>
              </defs>
              <path d="M10 60 Q10 30 30 15 Q25 35 20 55 Q18 65 25 75 Q20 85 30 95" fill="none" stroke="url(#wreathGrad)" strokeWidth="3.5" strokeLinecap="round"/>
              <path d="M10 60 Q10 25 35 10 Q30 30 22 50 Q18 65 28 80 Q22 90 35 100" fill="none" stroke="url(#wreathGrad)" strokeWidth="2" opacity="0.6" strokeLinecap="round"/>
              <path d="M110 60 Q110 30 90 15 Q95 35 100 55 Q102 65 95 75 Q100 85 90 95" fill="none" stroke="url(#wreathGrad)" strokeWidth="3.5" strokeLinecap="round"/>
              <path d="M110 60 Q110 25 85 10 Q90 30 98 50 Q102 65 92 80 Q98 90 85 100" fill="none" stroke="url(#wreathGrad)" strokeWidth="2" opacity="0.6" strokeLinecap="round"/>
            </svg>
          </div>
        </>
      )}

      {/* Shine overlay — z-10 */}
      <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-10 shine-overlay" />

      {/* Logo Image or SVG Shield — z-[2] above wreath */}
      {src ? (
        <img
          src={src}
          alt="شعار دوري نجوم تيك توك"
          className="object-contain rounded-full relative z-[2] shadow-[0_0_20px_rgba(212,175,55,0.15)]"
          style={{ width: size, height: size }}
          loading="lazy"
        />
      ) : (
        <svg viewBox="0 0 100 100" width={size} height={size} className="relative z-[2] drop-shadow-[0_0_8px_rgba(212,175,55,0.3)]">
          <defs>
            <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#1A1A1A"/>
              <stop offset="100%" stopColor="#0B0B0B"/>
            </linearGradient>
            <linearGradient id="goldTrim" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D4AF37"/>
              <stop offset="50%" stopColor="#FFD700"/>
              <stop offset="100%" stopColor="#B8860B"/>
            </linearGradient>
            <radialGradient id="ballShine" cx="35%" cy="35%">
              <stop offset="0%" stopColor="#ffffff"/>
              <stop offset="100%" stopColor="#e0e0e0"/>
            </radialGradient>
          </defs>
          <path d="M50 5 L90 18 L90 52 Q90 78 50 95 Q10 78 10 52 L10 18 Z" fill="url(#shieldGrad)" stroke="url(#goldTrim)" strokeWidth="3"/>
          <path d="M50 12 L84 23 L84 50 Q84 73 50 88 Q16 73 16 50 L16 23 Z" fill="none" stroke="rgba(212, 175, 55, 0.2)" strokeWidth="1"/>
          <circle cx="50" cy="48" r="18" fill="url(#ballShine)"/>
          <path d="M32 48 Q41 36 50 40 Q59 36 68 48 Q59 60 50 56 Q41 60 32 48Z" fill="#0B0B0B"/>
          <path d="M32 48 Q41 56 50 52 Q59 56 68 48" fill="none" stroke="#333" strokeWidth="0.5"/>
          <path d="M41 34 L50 40 L59 34" stroke="#0B0B0B" strokeWidth="1.5" fill="none"/>
          <path d="M41 62 L50 56 L59 62" stroke="#0B0B0B" strokeWidth="1.5" fill="none"/>
          <line x1="32" y1="48" x2="68" y2="48" stroke="#0B0B0B" strokeWidth="1.5"/>
          <text x="27" y="28" font-size="10" fill="#FFD700" font-weight="bold">★</text>
          <text x="43" y="22" font-size="14" fill="#FFD700" font-weight="bold">★</text>
          <text x="60" y="28" font-size="10" fill="#FFD700" font-weight="bold">★</text>
        </svg>
      )}

      {/* Thin gold ring border — z-[1] between wreath and logo */}
      {src && (
        <div
          className="absolute z-[1] rounded-full pointer-events-none"
          style={{
            width: size, height: size,
            border: `${Math.max(1.5, size * 0.035)}px solid rgba(212,175,55,0.4)`,
            boxShadow: "inset 0 0 15px rgba(212,175,55,0.12)",
          }}
        />
      )}
    </div>
  );
}
