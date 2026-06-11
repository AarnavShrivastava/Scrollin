import { useEffect, useRef } from 'react';
import { Check, Heart } from 'lucide-react';

const tiers = [
  {
    name: 'Youth',
    price: 'Free',
    period: 'always',
    description: 'For any young person who wants to build a healthier relationship with their screen.',
    cta: 'Get started free',
    highlighted: false,
    cardBg: 'bg-cream-50',
    cardBorder: 'border-cream-300',
    btnStyle: 'bg-cream-200 text-navy-700 hover:bg-cream-300 border border-cream-400 font-bold',
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
    description: "Partner with us to bring Scrollin' into your classrooms and counseling programs.",
    cta: 'Partner with us',
    highlighted: true,
    cardBg: 'bg-blue-50',
    cardBorder: 'border-blue-300',
    btnStyle: 'bg-blue-500 text-white hover:bg-blue-600 shadow-soft font-bold',
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
    description: 'Help fund free access for youth who need it most.',
    cta: 'Become a sponsor',
    highlighted: false,
    cardBg: 'bg-pink-50',
    cardBorder: 'border-pink-200',
    btnStyle: 'bg-pink-100 text-pink-700 hover:bg-pink-200 border border-pink-300 font-bold',
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
          el.classList.remove('opacity-0', 'translate-y-6');
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
      className={`relative card rounded-3xl p-8 flex flex-col gap-5 opacity-0 translate-y-6 transition-all duration-700 ease-out ${tier.cardBg} border ${tier.cardBorder} ${
        tier.highlighted ? 'ring-2 ring-blue-400 shadow-lifted scale-[1.03]' : 'card-hover'
      }`}
    >
      {tier.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-1.5 bg-blue-500 text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-soft">
            <Heart size={10} className="fill-white" />
            Most requested
          </div>
        </div>
      )}

      <div>
        <h3 className="text-navy-800 font-extrabold text-xl mb-1">{tier.name}</h3>
        <p className="text-charcoal-500 text-sm font-medium">{tier.description}</p>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-5xl font-extrabold text-navy-800 tabular-nums">{tier.price}</span>
        <span className="text-charcoal-400 text-sm mb-2 font-semibold">/ {tier.period}</span>
      </div>

      <a
        href="#"
        className={`text-center px-6 py-3.5 rounded-2xl text-sm transition-all hover:scale-[1.02] active:scale-95 ${tier.btnStyle}`}
      >
        {tier.cta}
      </a>

      <ul className="flex flex-col gap-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex items-center gap-3 text-sm text-charcoal-700 font-medium">
            <Check size={15} className="text-sage-500 flex-shrink-0" />
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
    <section id="get-involved" className="relative py-24 px-6 overflow-hidden bg-cream-100">
      <div className="max-w-5xl mx-auto">
        <div
          ref={headingRef}
          className="text-center mb-12 opacity-0 translate-y-5 transition-all duration-700 ease-out"
        >
          <div className="inline-flex items-center gap-2 bg-white border border-pink-200 rounded-full px-4 py-2 mb-6">
            <Heart size={12} className="text-pink-400" />
            <span className="text-xs font-bold text-charcoal-500">Get involved</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-navy-800 tracking-tight mb-4">
            Free for youth.{' '}
            <span className="text-blue-500">Powered by community.</span>
          </h2>
          <p className="text-charcoal-600 text-lg max-w-xl mx-auto font-medium">
            Scrollin' is funded entirely by school partnerships and individual sponsors — so every young person can access it at zero cost, forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {tiers.map((tier, i) => (
            <TierCard key={tier.name} tier={tier} index={i} />
          ))}
        </div>

        <p className="text-center text-charcoal-500 text-sm mt-8 font-semibold">
          🌿 Scrollin' is a registered 501(c)(3) nonprofit. All school partnerships are free for students.
        </p>
      </div>
    </section>
  );
}
