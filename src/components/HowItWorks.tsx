import { useEffect, useRef } from 'react';
import { ScanSearch, GitBranch, Lightbulb, TrendingUp } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ScanSearch,
    title: 'Reflect on your habits',
    description:
      'Answer a short, judgment-free check-in about how you\'ve been spending time online. No app tracking, no screen-time surveillance — just honest self-reflection guided by thoughtful prompts.',
    color: 'from-violet-600 to-purple-700',
    accent: 'border-violet-500/30',
  },
  {
    number: '02',
    icon: GitBranch,
    title: 'Map the connections',
    description:
      'Use our interactive habit graph to draw the links between your online behaviors and how they affect your sleep, mood, and real-world relationships. Seeing the web makes the patterns hard to ignore.',
    color: 'from-pink-600 to-rose-600',
    accent: 'border-pink-500/30',
  },
  {
    number: '03',
    icon: Lightbulb,
    title: 'Build your strategy',
    description:
      'Choose from a library of evidence-based micro-habits and peer-tested strategies. Set small, achievable goals — not cold turkey bans — and track what actually moves the needle for you.',
    color: 'from-amber-500 to-orange-600',
    accent: 'border-amber-500/30',
  },
  {
    number: '04',
    icon: TrendingUp,
    title: 'Grow with your community',
    description:
      'Share progress with a trusted peer group, join weekly facilitated sessions, and celebrate wins together. Lasting change is social — Scrollin\' gives you the people to do it with.',
    color: 'from-emerald-500 to-teal-600',
    accent: 'border-emerald-500/30',
  },
];

function StepCard({
  number, icon: Icon, title, description, color, accent, index, isLast,
}: (typeof steps)[number] & { index: number; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${index * 100}ms`;
          el.classList.add('opacity-100', 'translate-x-0');
          el.classList.remove('opacity-0', '-translate-x-8');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div className="relative flex gap-6">
      <div className="flex flex-col items-center">
        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg flex-shrink-0 z-10`}>
          <Icon size={20} className="text-white" />
        </div>
        {!isLast && (
          <div className="w-px flex-1 mt-2 bg-gradient-to-b from-white/10 to-transparent min-h-[40px]" />
        )}
      </div>

      <div
        ref={ref}
        className={`glass rounded-2xl p-6 mb-6 border ${accent} flex-1 opacity-0 -translate-x-8 transition-all duration-700 ease-out`}
      >
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold text-slate-600 tabular-nums">{number}</span>
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-6');
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="relative py-32 overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-pink-900/8 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Left: heading — sticky */}
          <div
            ref={headingRef}
            className="lg:sticky lg:top-32 opacity-0 translate-y-6 transition-all duration-700 ease-out"
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
              <span className="text-xs font-medium text-slate-400">How it works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6 leading-tight">
              From scrolling on autopilot{' '}
              <span className="text-gradient">to scrolling with intention.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Scrollin' doesn't shame you for being online. We help you understand your habits, find what's working against you, and choose something better — one small step at a time.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-medium text-sm hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-violet-900/40"
            >
              Try it — totally free
            </a>
          </div>

          {/* Right: steps */}
          <div>
            {steps.map((step, i) => (
              <StepCard key={step.number} {...step} index={i} isLast={i === steps.length - 1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
