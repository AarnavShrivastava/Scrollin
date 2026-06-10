import { useEffect, useRef } from 'react';
import { Map, AlertTriangle, Heart, Users, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: Map,
    title: 'Habit Mapping',
    description:
      'Visualize your digital habits as an interactive graph. See which online behaviors feed into others — and find the patterns worth changing.',
    color: 'from-violet-600 to-purple-700',
    glow: 'rgba(124,58,237,0.25)',
    tag: 'Core',
  },
  {
    icon: AlertTriangle,
    title: 'Trigger Awareness',
    description:
      'Identify the emotional and situational triggers that pull you toward doom-scrolling or compulsive gaming before they take hold.',
    color: 'from-amber-500 to-orange-600',
    glow: 'rgba(245,158,11,0.25)',
    tag: 'Insight',
  },
  {
    icon: Heart,
    title: 'Wellbeing Check-ins',
    description:
      'Short, science-backed check-ins surface how your screen time is affecting sleep, mood, and focus — without judgment.',
    color: 'from-pink-500 to-rose-600',
    glow: 'rgba(236,72,153,0.25)',
    tag: 'Wellness',
  },
  {
    icon: Users,
    title: 'Peer Support Network',
    description:
      'Connect with others working through the same challenges. Student facilitators run safe, moderated group spaces every week.',
    color: 'from-blue-600 to-cyan-600',
    glow: 'rgba(37,99,235,0.25)',
    tag: 'Community',
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description:
      'Curated guides, worksheets, and videos on digital wellness — written for teenagers, by teenagers, reviewed by counselors.',
    color: 'from-emerald-500 to-teal-600',
    glow: 'rgba(16,185,129,0.25)',
    tag: 'Learning',
  },
  {
    icon: ShieldCheck,
    title: 'Safe by Design',
    description:
      'No ads. No data selling. No dark patterns. Scrollin\' is a nonprofit — your privacy and wellbeing are the only metrics that matter.',
    color: 'from-slate-600 to-slate-700',
    glow: 'rgba(100,116,139,0.25)',
    tag: 'Trust',
  },
];

function FeatureCard({
  icon: Icon, title, description, color, glow, tag, index,
}: (typeof features)[number] & { index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${index * 80}ms`;
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-6');
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className="glass glass-hover rounded-2xl p-6 flex flex-col gap-4 opacity-0 translate-y-6 transition-all duration-700 ease-out cursor-default group"
      style={{ boxShadow: `0 0 0 0 ${glow}` }}
    >
      <div className="flex items-start justify-between">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
          style={{ boxShadow: `0 8px 24px ${glow}` }}
        >
          <Icon size={22} className="text-white" />
        </div>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 bg-white/[0.05] px-2.5 py-1 rounded-full border border-white/[0.06]">
          {tag}
        </span>
      </div>

      <div>
        <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-gradient transition-all duration-300">
          {title}
        </h3>
        <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
      </div>

      <div className="mt-auto flex items-center gap-1 text-xs font-medium text-slate-500 group-hover:text-violet-400 transition-colors duration-200">
        Learn more <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform duration-200" />
      </div>
    </div>
  );
}

export default function Features() {
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
    <section id="features" className="relative py-32 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full bg-violet-900/10 blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div
          ref={headingRef}
          className="text-center mb-16 opacity-0 translate-y-6 transition-all duration-700 ease-out"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <Heart size={12} className="text-pink-400 fill-pink-400" />
            <span className="text-xs font-medium text-slate-400">Why it matters</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Tools built for{' '}
            <span className="text-gradient">real young people.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Not a lecture. Not a screen-time timer. A genuine, peer-tested toolkit for understanding your relationship with technology and building a healthier one.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => (
            <FeatureCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
