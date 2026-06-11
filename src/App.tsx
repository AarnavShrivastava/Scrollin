import { useState } from "react";
import { Scroll, LayoutDashboard, BookOpen, ChevronLeft } from "lucide-react";
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import ReflectionPage from "./pages/ReflectionPage";
import { isOnboardingDone } from "./store/userStore";

type Page = "landing" | "onboarding" | "app";

// ─── Determine the initial page synchronously from localStorage ──────────────
// We read localStorage once at module load so there's no flash of the wrong page.
function getInitialPage(): Page {
  // If the user is already in the app (they clicked a nav link that set page=app),
  // we restore that. Otherwise start at landing.
  return "landing";
}

// ─── App shell (post-onboarding authenticated view) ──────────────────────────
function AppShell({ onExit }: { onExit: () => void }) {
  const [page, setPage] = useState<"dashboard" | "reflection">("dashboard");

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col">
      {/* Top nav */}
      <nav className="bg-white border-b border-sand-200 px-6 h-14 flex items-center justify-between sticky top-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-calm-600 flex items-center justify-center">
            <Scroll size={13} className="text-white" />
          </div>
          <span className="font-semibold text-sand-900 text-sm tracking-tight">
            Scrollin'
          </span>
        </div>

        {/* Nav tabs */}
        <div className="flex items-center gap-1">
          <NavTab
            icon={<LayoutDashboard size={15} />}
            label="Dashboard"
            active={page === "dashboard"}
            onClick={() => setPage("dashboard")}
          />
          <NavTab
            icon={<BookOpen size={15} />}
            label="Reflect"
            active={page === "reflection"}
            onClick={() => setPage("reflection")}
          />
        </div>

        {/* Exit back to landing */}
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs text-sand-500 hover:text-sand-800 transition-colors px-3 py-2 rounded-lg hover:bg-sand-100"
          aria-label="Return to home"
        >
          <ChevronLeft size={13} />
          <span className="hidden sm:inline">Home</span>
        </button>
      </nav>

      {/* Page content */}
      <main className="flex-1">
        {page === "dashboard" && <DashboardPage />}
        {page === "reflection" && <ReflectionPage />}
      </main>
    </div>
  );
}

function NavTab({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm transition-all ${
        active
          ? "bg-calm-50 text-calm-700 font-medium border border-calm-200"
          : "text-sand-500 hover:text-sand-800 hover:bg-sand-100"
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage);

  // Called when the user clicks "Get started" on the landing page.
  // Checks localStorage — returning users skip onboarding entirely.
  const handleEnterApp = () => {
    if (isOnboardingDone()) {
      setPage("app");
    } else {
      setPage("onboarding");
    }
  };

  if (page === "landing") {
    return <LandingPage onEnter={handleEnterApp} />;
  }

  if (page === "onboarding") {
    return <OnboardingPage onComplete={() => setPage("app")} />;
  }

  // page === 'app'
  return <AppShell onExit={() => setPage("landing")} />;
}
