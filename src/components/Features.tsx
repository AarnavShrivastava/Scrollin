import { useEffect, useRef } from 'react';
import { Heart, ShieldCheck, Users, BookOpen, Sparkles, AlertTriangle } from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'Habit Mapping',
    description: 'Visualize your digital habits. See which online behaviors feed into others — and find the patterns worth changing.',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-500',
    tag: 'Core',
    emoji: '🗺️',
  },
  {
    icon: AlertTriangle,
    title: 'Trigger Awareness',
    description: 'Identify the emotional triggers that pull you toward doom-scrolling or compulsive gaming before they take hold.',
    bg: 'bg-cream-100',
    border: 'border-cream-300',
    iconColor: 'text-charcoal-600',
    tag: 'Insight',
    emoji: '🔍',
  },
  {
    icon: Heart,
    title: 'Wellbeing Check-ins',
    description: 'Short, science-backed check-ins surface how your screen time is affecting sleep, mood, and focus — without judgment.',
    bg: 'bg-pink-50',
    border: 'border-pink-200',
    iconColor: 'text-pink-500',
    tag: 'Wellness',
    emoji: '💗',
  },
  {
    icon: Users,
    title: 'Peer Support',
    description: 'Connect with others working through the same challenges. Student facilitators run safe, moderated group spaces every week.',
    bg: 'bg-sage-50',
    border: 'border-sage-200',
    iconColor: 'text-sage-600',
    tag: 'Community',
    emoji: '🤝',
  },
  {
    icon: BookOpen,
    title: 'Resource Library',
    description: 'Curated guides, worksheets, and videos on digital wellness — written for teenagers, by teenagers, reviewed by counselors.',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    iconColor: 'text-blue-500',
    tag: 'Learning',
    emoji: '📚',
  },
  {
    icon: ShieldCheck,
    title: 'Safe by Design',
    description: "No ads. No data selling. No dark patterns. Scrollin' is a nonprofit — your privacy and wellbeing are the only metrics that matter.",
    bg: 'bg-sage-50',
    border: 'border-sage-200',
    iconColor: 'text-sage-600',
    tag: 'Trust',
    emoji: '🛡️',
  },
];

function FeatureCard({
  title, description, bg, border, tag, emoji, index,
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
          el.classList.remove('opacity-0', 'translate-y-5');
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
      className={`card card-hover rounded-3xl p-6 flex flex-col gap-4 opacity-0 translate-y-5 transition-all duration-700 ease-out cursor-default ${bg} border ${border}`}
    >
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-2xl ${bg} border ${border} flex items-center justify-center text-2xl`}>
          {emoji}
        </div>
        <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full bg-white border ${border} text-charcoal-500`}>
          {tag}
        </span>
      </div>

      <div>
        <h3 className="text-navy-800 font-extrabold text-base mb-2">{title}</h3>
        <p className="text-charcoal-600 text-sm leading-relaxed font-medium">{description}</p>
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
    <section id="features" className="relative py-24 px-6 overflow-hidden bg-cream-100">
      <div className="relative max-w-5xl mx-auto">
        <div
          ref={headingRef}
          className="text-center mb-14 opacity-0 translate-y-5 transition-all duration-700 ease-out"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-pink-200 rounded-full px-4 py-2 mb-6">
            <Heart size={12} className="text-pink-400 fill-pink-300" />
            <span className="text-xs font-bold text-charcoal-500">Why it matters</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-navy-800 tracking-tight mb-4">
            Tools built for{' '}
            <span className="text-blue-500">real young people.</span>
          </h2>
          <p className="text-charcoal-600 text-lg max-w-2xl mx-auto leading-relaxed font-medium">
            Not a lecture. Not a screen-time timer. A genuine, peer-tested toolkit for understanding your relationship with technology.
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
