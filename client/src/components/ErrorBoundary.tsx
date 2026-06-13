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
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      const err = this.state.error;
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B] p-8" dir="rtl">
          <div className="max-w-lg w-full bg-[rgba(212,175,55,0.05)] border border-[rgba(212,175,55,0.15)] rounded-2xl p-8 text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-[#D4AF37] mb-4">حدث خطأ في التطبيق</h1>
            <p className="text-red-400 mb-2 font-mono text-sm break-all">
              {err?.message || String(err) || "خطأ غير معروف"}
            </p>
            {err?.stack && (
              <details className="mt-4 text-left">
                <summary className="text-[#D4AF37] cursor-pointer text-sm mb-2">تفاصيل أكثر</summary>
                <pre className="text-xs text-gray-500 whitespace-pre-wrap max-h-60 overflow-y-auto">{err.stack}</pre>
              </details>
            )}
            <button
              onClick={() => window.location.reload()}
              className="mt-6 px-6 py-3 bg-[#D4AF37] text-[#0B0B0B] font-bold rounded-xl hover:bg-[#FFD700] transition-colors"
            >
              إعادة تحميل الصفحة
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
