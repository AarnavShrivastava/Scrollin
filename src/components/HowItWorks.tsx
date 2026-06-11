import { useEffect, useRef } from 'react';

const steps = [
  {
    number: '01',
    title: 'Reflect on your habits',
    description:
      "Answer a short, judgment-free check-in about how you've been spending time online. No app tracking, no screen-time surveillance — just honest self-reflection guided by thoughtful prompts.",
    emoji: '🌱',
    bg: 'bg-blue-50',
    border: 'border-blue-300',
    accent: 'border-blue-200',
  },
  {
    number: '02',
    title: 'Map the connections',
    description:
      'Use our interactive habit graph to draw the links between your online behaviors and how they affect your sleep, mood, and real-world relationships.',
    emoji: '🔍',
    bg: 'bg-pink-50',
    border: 'border-pink-300',
    accent: 'border-pink-200',
  },
  {
    number: '03',
    title: 'Build your strategy',
    description:
      'Choose from evidence-based micro-habits and peer-tested strategies. Set small, achievable goals — not cold turkey bans — and track what actually moves the needle.',
    emoji: '✏️',
    bg: 'bg-sage-50',
    border: 'border-sage-300',
    accent: 'border-sage-200',
  },
  {
    number: '04',
    title: 'Grow with your community',
    description:
      "Share progress with a trusted peer group, join weekly facilitated sessions, and celebrate wins together. Lasting change is social — Scrollin' gives you the people to do it with.",
    emoji: '🌻',
    bg: 'bg-cream-100',
    border: 'border-cream-400',
    accent: 'border-cream-300',
  },
];

function StepCard({
  number, title, description, emoji, bg, border, accent, index, isLast,
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
          el.classList.remove('opacity-0', '-translate-x-6');
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
        <div className={`w-12 h-12 rounded-2xl ${bg} border-2 ${border} flex items-center justify-center flex-shrink-0 z-10 text-xl`}>
          {emoji}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 mt-2 bg-cream-300 min-h-[40px]" />
        )}
      </div>

      <div
        ref={ref}
        className={`card rounded-2xl p-5 mb-6 border ${accent} flex-1 opacity-0 -translate-x-6 transition-all duration-700 ease-out`}
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="text-xs font-extrabold text-charcoal-400 tabular-nums">{number}</span>
          <h3 className="text-navy-800 font-extrabold text-base">{title}</h3>
        </div>
        <p className="text-charcoal-600 text-sm leading-relaxed font-medium">{description}</p>
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
          el.classList.remove('opacity-0', 'translate-y-5');
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="relative py-24 px-6 overflow-hidden bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* Left: heading — sticky */}
          <div
            ref={headingRef}
            className="lg:sticky lg:top-32 opacity-0 translate-y-5 transition-all duration-700 ease-out"
          >
            <div className="inline-flex items-center gap-2 bg-cream-100 border border-cream-300 rounded-full px-4 py-2 mb-6">
              <span className="text-xs font-bold text-charcoal-500">How it works</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-navy-800 tracking-tight mb-6 leading-tight">
              From scrolling on autopilot{' '}
              <span className="text-blue-500">to scrolling with intention.</span>
            </h2>
            <p className="text-charcoal-600 text-lg leading-relaxed mb-8 font-medium">
              Scrollin' doesn't shame you for being online. We help you understand your habits and choose something better — one small step at a time.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 active:scale-95 transition-all shadow-soft"
            >
              Try it — totally free 🌱
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
