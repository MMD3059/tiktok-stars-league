import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import Layout from "./components/Layout";
import PageTransition from "./components/PageTransition";
import { SkeletonTable } from "./components/Skeleton";
import { ThemeProvider } from "./contexts/ThemeContext";

const HomePage = lazy(() => import("./pages/HomePage"));
const TeamsPage = lazy(() => import("./pages/TeamsPage"));
const StandingsPage = lazy(() => import("./pages/StandingsPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const SchedulePage = lazy(() => import("./pages/SchedulePage"));
const TopScorersPage = lazy(() => import("./pages/TopScorersPage"));
const TransfersPage = lazy(() => import("./pages/TransfersPage"));
const QuestionsPage = lazy(() => import("./pages/QuestionsPage"));
const CommitteePage = lazy(() => import("./pages/CommitteePage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const HeadToHeadPage = lazy(() => import("./pages/HeadToHeadPage"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 50);
  }, [pathname]);
  return null;
}

if (typeof window !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

const LazyLoad = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={
    <div className="max-w-7xl mx-auto px-4 py-8">
      <SkeletonTable rows={8} cols={5} />
    </div>
  }>
    {children}
  </Suspense>
);

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Layout>
          <ScrollToTop />
          <PageTransition>
            <Routes>
              <Route path="/" element={<LazyLoad><HomePage /></LazyLoad>} />
              <Route path="/teams" element={<LazyLoad><TeamsPage /></LazyLoad>} />
              <Route path="/standings" element={<LazyLoad><StandingsPage /></LazyLoad>} />
              <Route path="/team/:id" element={<LazyLoad><TeamPage /></LazyLoad>} />
              <Route path="/schedule" element={<LazyLoad><SchedulePage /></LazyLoad>} />
              <Route path="/top-scorers" element={<LazyLoad><TopScorersPage /></LazyLoad>} />
              <Route path="/transfers" element={<LazyLoad><TransfersPage /></LazyLoad>} />
              <Route path="/questions" element={<LazyLoad><QuestionsPage /></LazyLoad>} />
              <Route path="/committee" element={<LazyLoad><CommitteePage /></LazyLoad>} />
              <Route path="/search" element={<LazyLoad><SearchPage /></LazyLoad>} />
              <Route path="/h2h/:team1/:team2" element={<LazyLoad><HeadToHeadPage /></LazyLoad>} />
              <Route path="/admin/login" element={<LazyLoad><AdminLogin /></LazyLoad>} />
              <Route path="/admin/*" element={<LazyLoad><AdminLayout /></LazyLoad>} />
            </Routes>
          </PageTransition>
        </Layout>
      </BrowserRouter>
    </ThemeProvider>
  );
}
