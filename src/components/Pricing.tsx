import { useEffect, useRef } from 'react';
import { Check, Heart } from 'lucide-react';

// Scrollin' is a nonprofit — "pricing" is really about how schools, districts,
// and sponsors can partner with us to fund free access for youth.
const tiers = [
  {
    name: 'Youth',
    price: 'Free',
    period: 'always',
    description: 'For any young person who wants to build a healthier relationship with their screen.',
    cta: 'Get started free',
    ctaStyle: 'glass hover:bg-white/[0.08] text-white',
    highlighted: false,
    features: [
      'Full habit mapping canvas',
      'Weekly wellbeing check-ins',
      'Personal strategy builder',
      'Access to resource library',
      'Community peer groups',
      'Anonymous — no real name required',
    ],
  },
  {
    name: 'School',
    price: '$0',
    period: 'per student',
    description: 'Partner with us to bring Scrollin\' into your classrooms and counseling programs.',
    cta: 'Partner with us',
    ctaStyle: 'bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-95 shadow-xl shadow-violet-900/40 glow-purple',
    highlighted: true,
    features: [
      'Everything in Youth',
      'Counselor dashboard',
      'Group session facilitation tools',
      'Anonymized aggregate insights',
      'Curriculum integration guides',
      'Staff training workshop',
      'Dedicated program coordinator',
      'Co-branded rollout support',
    ],
  },
  {
    name: 'Sponsor',
    price: 'Donate',
    period: 'any amount',
    description: 'Help fund free access for youth who need it most. All donations go directly to program delivery.',
    cta: 'Become a sponsor',
    ctaStyle: 'glass hover:bg-white/[0.08] text-white',
    highlighted: false,
    features: [
      'Public sponsor recognition',
      'Impact report each quarter',
      'Named scholarship for students',
      'Early access to new programs',
      'Tax-deductible 501(c)(3) receipt',
      'Optional advisory seat',
    ],
  },
];

function TierCard({ tier, index }: { tier: (typeof tiers)[number]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${index * 100}ms`;
          el.classList.add('opacity-100', 'translate-y-0');
          el.classList.remove('opacity-0', 'translate-y-8');
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [index]);

  return (
    <div
      ref={ref}
      className={`relative glass rounded-2xl p-8 flex flex-col gap-6 opacity-0 translate-y-8 transition-all duration-700 ease-out ${
        tier.highlighted
          ? 'border border-violet-500/40 scale-[1.03] shadow-2xl shadow-violet-900/30'
          : 'hover:border-white/10'
      }`}
    >
      {tier.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg shadow-violet-900/40">
            <Heart size={10} className="fill-white" />
            Most requested
          </div>
        </div>
      )}

      <div>
        <h3 className="text-white font-bold text-xl mb-1">{tier.name}</h3>
        <p className="text-slate-500 text-sm">{tier.description}</p>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-5xl font-bold text-white tabular-nums">{tier.price}</span>
        <span className="text-slate-500 text-sm mb-2">/ {tier.period}</span>
      </div>

      <a
        href="#"
        className={`text-center px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-95 ${tier.ctaStyle}`}
      >
        {tier.cta}
      </a>

      <ul className="flex flex-col gap-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm text-slate-300">
            <Check size={15} className="text-violet-400 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Pricing() {
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
    <section id="get-involved" className="relative py-32 overflow-hidden">
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-violet-900/8 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          ref={headingRef}
          className="text-center mb-12 opacity-0 translate-y-6 transition-all duration-700 ease-out"
        >
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6">
            <Heart size={12} className="text-pink-400" />
            <span className="text-xs font-medium text-slate-400">Get involved</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">
            Free for youth.{' '}
            <span className="text-gradient">Powered by community.</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Scrollin' is funded entirely by school partnerships and individual sponsors — so every young person can access it at zero cost, forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {tiers.map((tier, i) => (
            <TierCard key={tier.name} tier={tier} index={i} />
          ))}
        </div>

        <p className="text-center text-slate-600 text-sm mt-8">
          Scrollin' is a registered 501(c)(3) nonprofit. All school partnerships are free for students. Sponsor funds go directly to program delivery.
        </p>
      </div>
    </section>
  );
}
