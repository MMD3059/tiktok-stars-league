import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown): State {
    const err = error instanceof Error ? error : new Error(String(error));
    return { hasError: true, error: err };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
    document.title = "Hayder League — تحت الصيانة";
    try {
      fetch("/api/debug-error", {
        method: "POST",
        body: JSON.stringify({ message: error.message, stack: error.stack, componentStack: errorInfo.componentStack }),
      });
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] p-4 relative overflow-hidden" dir="rtl">
          {/* Shimmer line top */}
          <div className="absolute top-0 inset-x-0 h-0.5" style={{
            background: "linear-gradient(90deg, transparent, #D4AF37, #FFD700, #D4AF37, transparent)",
            backgroundSize: "200% 100%",
            animation: "shine 3s ease-in-out infinite",
          }} />

          {/* Gold dust circles */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-[#D4AF37] opacity-[0.02] blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full bg-[#D4AF37] opacity-[0.03] blur-3xl" />

          <div className="relative z-10 max-w-md w-full text-center">
            {/* Animated gear icon */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <svg className="w-24 h-24 animate-spin-slow" viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3">
              تحت <span className="text-gold-gradient">الصيانة</span>
            </h1>

            {/* Gold divider */}
            <div className="w-16 h-0.5 bg-[#D4AF37] mx-auto mb-4 rounded-full" />

            <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8">
              نقوم حاليًا بتحديث وتحسين المنصة. سنعود قريبًا بإذن الله!
            </p>

            {/* Pulsing status */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-live-pulse" />
              <span className="text-xs text-gray-500">قيد الصيانة حاليًا</span>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-[#D4AF37] text-[#0B0B0B] font-bold rounded-xl hover:bg-[#FFD700] transition-all duration-200 hover:scale-105 active:scale-95"
            >
              إعادة المحاولة
            </button>

            {/* Hidden error details */}
            <details className="mt-8 text-center">
              <summary className="text-[10px] text-gray-600 cursor-pointer hover:text-gray-500 transition-colors">
                تفاصيل تقنية
              </summary>
              <pre className="mt-2 text-[10px] text-gray-700 whitespace-pre-wrap max-h-40 overflow-y-auto text-left">
                {this.state.error?.message}
              </pre>
            </details>

            {/* Footer */}
            <div className="mt-12 text-[10px] text-gray-700">Hayder League © 2026</div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
