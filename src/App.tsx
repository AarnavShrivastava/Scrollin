import { useState } from 'react';
import { LayoutDashboard, BookOpen, ChevronLeft, Leaf } from 'lucide-react';
import LandingPage    from './pages/LandingPage';
import OnboardingPage from './pages/OnboardingPage';
import DashboardPage  from './pages/DashboardPage';
import ReflectionPage from './pages/ReflectionPage';
import { isOnboardingDone } from './store/userStore';

type Page = 'landing' | 'onboarding' | 'app';

function getInitialPage(): Page {
  return 'landing';
}

// ─── App shell ────────────────────────────────────────────────────────────────
function AppShell({ onExit }: { onExit: () => void }) {
  const [page, setPage] = useState<'dashboard' | 'reflection'>('dashboard');

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col">
      {/* Top nav */}
      <nav className="bg-white border-b-2 border-powder-200 px-6 h-14 flex items-center justify-between sticky top-0 z-30 shadow-soft">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-powder-600 flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="font-extrabold text-choco-800 text-sm tracking-tight">Scrollin'</span>
        </div>

        {/* Nav tabs */}
        <div className="flex items-center gap-1.5">
          <NavTab
            icon={<LayoutDashboard size={15} />}
            label="Dashboard"
            active={page === 'dashboard'}
            onClick={() => setPage('dashboard')}
          />
          <NavTab
            icon={<BookOpen size={15} />}
            label="Reflect"
            active={page === 'reflection'}
            onClick={() => setPage('reflection')}
          />
        </div>

        {/* Exit */}
        <button
          onClick={onExit}
          className="flex items-center gap-1.5 text-xs text-steel-500 hover:text-choco-700 transition-colors px-3 py-2 rounded-xl hover:bg-cream-200"
          aria-label="Return to home"
        >
          <ChevronLeft size={13} />
          <span className="hidden sm:inline font-semibold">Home</span>
        </button>
      </nav>

      <main className="flex-1">
        {page === 'dashboard'  && <DashboardPage />}
        {page === 'reflection' && <ReflectionPage />}
      </main>
    </div>
  );
}

function NavTab({
  icon, label, active, onClick,
}: {
  icon: React.ReactNode; label: string; active: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold transition-all ${
        active
          ? 'bg-powder-200 text-powder-700 border-2 border-powder-300'
          : 'text-steel-500 hover:text-choco-700 hover:bg-cream-200'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>(getInitialPage);

  const handleEnterApp = () => {
    if (isOnboardingDone()) {
      setPage('app');
    } else {
      setPage('onboarding');
    }
  };

  if (page === 'landing')    return <LandingPage onEnter={handleEnterApp} />;
  if (page === 'onboarding') return <OnboardingPage onComplete={() => setPage('app')} />;
  return <AppShell onExit={() => setPage('landing')} />;
}
