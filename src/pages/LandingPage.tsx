import { useState, useEffect, useRef } from 'react';
import {
  ArrowRight, Menu, X, Leaf, Heart, ShieldCheck,
  Users, BookOpen, Sparkles, ChevronDown, Check,
} from 'lucide-react';

// ─── Brand circle / blob decoration (matches the image's circles) ──────────
function PowderCircle({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-full bg-powder-200 pointer-events-none ${className}`}
      aria-hidden="true"
    />
  );
}

function FloralDivider() {
  return (
    <div className="flex items-center justify-center gap-3 py-2" aria-hidden="true">
      <div className="h-px flex-1 bg-powder-200" />
      <span className="text-base select-none">🌸</span>
      <div className="h-px flex-1 bg-powder-200" />
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Nav({ onEnter }: { onEnter: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-cream-100/95 backdrop-blur-md border-b-2 border-powder-200 shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-powder-600 flex items-center justify-center shadow-soft group-hover:bg-powder-700 transition-colors">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-extrabold text-choco-800 text-base tracking-tight">Scrollin'</span>
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {[
            ['Why it matters', '#why'],
            ['How it works',   '#how'],
            ['Who we are',     '#who'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="px-3.5 py-2 text-sm font-bold text-steel-600 hover:text-choco-700 rounded-xl hover:bg-powder-100 transition-all"
            >
              {label}
            </a>
          ))}
        </nav>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={onEnter}
            className="text-sm font-bold text-steel-600 hover:text-choco-700 px-3 py-1.5 transition-colors"
          >
            Sign in
          </button>
          <button
            onClick={onEnter}
            className="text-sm font-extrabold px-5 py-2.5 rounded-2xl bg-powder-600 text-white hover:bg-powder-700 transition-colors shadow-soft"
          >
            Get started — free
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-xl text-steel-600 hover:bg-powder-100 transition-all"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream-100 border-t-2 border-powder-200 px-6 py-4 flex flex-col gap-2">
          {[
            ['Why it matters', '#why'],
            ['How it works',   '#how'],
            ['Who we are',     '#who'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setOpen(false)}
              className="py-2.5 text-sm font-bold text-steel-600 border-b border-powder-200 last:border-0"
            >
              {label}
            </a>
          ))}
          <button
            onClick={onEnter}
            className="mt-2 w-full py-3 rounded-2xl bg-powder-600 text-white text-sm font-extrabold"
          >
            Get started — free
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Scroll-reveal ────────────────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          el.classList.remove('opacity-0', 'translate-y-5');
          el.classList.add('opacity-100', 'translate-y-0');
        }, delay);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`opacity-0 translate-y-5 transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-16 px-6 text-center relative overflow-hidden bg-cream-100">

      {/* Scattered powder-blue circles — exact vibe from the brand image */}
      <PowderCircle className="absolute top-16 left-8 w-24 h-24 opacity-70 animate-float" />
      <PowderCircle className="absolute top-10 right-12 w-16 h-16 opacity-60" />
      <PowderCircle className="absolute bottom-28 left-16 w-20 h-20 opacity-55 animate-float" style={{ animationDelay: '2s' } as React.CSSProperties} />
      <PowderCircle className="absolute bottom-20 right-8 w-28 h-28 opacity-50" />
      <PowderCircle className="absolute top-1/3 right-4 w-12 h-12 opacity-45" />
      <PowderCircle className="absolute top-2/3 left-4 w-10 h-10 opacity-40" />

      {/* Dot grid — exactly like the scattered dots in the brand image */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: 'radial-gradient(circle, #CCDDE8 2px, transparent 2px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Large center powder circle — replicates the hero circle from the image */}
      <div className="absolute w-[520px] h-[520px] rounded-full bg-powder-200 opacity-60 pointer-events-none" />

      {/* Botanical accents */}
      <span className="absolute top-28 left-20 text-2xl opacity-40 animate-sway select-none pointer-events-none" aria-hidden="true">🌿</span>
      <span className="absolute bottom-36 right-20 text-xl opacity-35 animate-float select-none pointer-events-none" aria-hidden="true">🌸</span>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Eyebrow — styled like the "Part 2" badge but gentler */}
        <div
          className="inline-flex items-center gap-2 bg-choco-600 text-white text-xs font-extrabold px-5 py-2 rounded-full mb-8 shadow-soft opacity-0 animate-fade-in"
          style={{ animationFillMode: 'forwards' }}
        >
          <Heart size={11} className="fill-white" />
          Student-led · nonprofit · free for all youth
        </div>

        {/* Headline — chocolate brown like "Meet More Judges!" */}
        <h1
          className="text-5xl md:text-7xl font-extrabold text-choco-800 leading-tight tracking-tight mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          Feel more like{' '}
          <em className="not-italic text-powder-300" style={{ color: '#8AAFC9' }}>yourself</em>
          {' '}online.
        </h1>

        {/* Sub — steel blue like body copy in image */}
        <p
          className="text-lg text-steel-500 leading-relaxed mb-10 opacity-0 animate-fade-up font-semibold"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          Scrollin' helps young people understand their social media and gaming habits — gently, honestly, and without judgment — so they can build a digital life that actually feels good.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          {/* Primary — "Judge Introductions" button style */}
          <button
            onClick={onEnter}
            className="group flex items-center gap-2 px-8 py-3.5 rounded-3xl bg-powder-600 text-white font-extrabold text-sm hover:bg-powder-700 active:scale-95 transition-all shadow-powder"
          >
            Start for free
            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a
            href="#how"
            className="px-8 py-3.5 rounded-3xl text-steel-600 text-sm font-extrabold hover:bg-powder-100 transition-colors border-2 border-powder-300"
          >
            See how it works
          </a>
        </div>

        <p
          className="mt-8 text-xs text-steel-400 font-bold opacity-0 animate-fade-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          No ads · no data selling · no screen-time surveillance · 100% free
        </p>
      </div>

      <a
        href="#why"
        className="absolute bottom-8 flex flex-col items-center gap-1.5 text-steel-400 hover:text-powder-600 transition-colors"
      >
        <span className="text-xs font-bold">Scroll to learn more</span>
        <ChevronDown size={16} className="animate-bounce" />
      </a>
    </section>
  );
}

// ─── Why section ──────────────────────────────────────────────────────────────
const stats = [
  { value: '7h 22m', label: 'average daily screen time for teens in the US', src: 'Common Sense Media', emoji: '📱' },
  { value: '45%',    label: 'of teens say they feel overwhelmed by social media', src: 'Pew Research', emoji: '😔' },
  { value: '1 in 3', label: 'young people report social media makes them feel worse about themselves', src: 'APA', emoji: '💙' },
];

function Why() {
  return (
    <section id="why" className="py-24 px-6 bg-white relative overflow-hidden">
      {/* Powder circle decoration */}
      <PowderCircle className="absolute -right-20 -top-10 w-64 h-64 opacity-40" />

      <div className="relative max-w-4xl mx-auto">
        <Reveal>
          <p className="section-label mb-3">Why it matters</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-choco-800 leading-snug mb-5 max-w-xl">
            The internet wasn't designed with your wellbeing in mind.
          </h2>
          <p className="text-steel-500 leading-relaxed max-w-2xl mb-12 font-semibold">
            Platforms are built to keep you scrolling. Games are designed to keep you playing. That's not a character flaw — it's engineering. Scrollin' helps you see those patterns clearly, then choose what to do about them.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {stats.map((s, i) => (
            <Reveal key={s.value} delay={i * 80}>
              {/* Powder blue filled cards — like the big circle in the image */}
              <div className="card-powder p-6 text-center rounded-3xl card-hover">
                <span className="text-4xl mb-3 block">{s.emoji}</span>
                <p className="text-3xl font-extrabold text-choco-800 mb-2">{s.value}</p>
                <p className="text-steel-600 text-sm leading-relaxed mb-3 font-semibold">{s.label}</p>
                <p className="text-xs text-steel-400 font-bold">Source: {s.src}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
  { title: 'Understand your patterns', body: 'Reflect on how you use social media and games. See which habits help you feel connected and rested — and which leave you drained.', emoji: '✨', bg: 'bg-powder-100', border: 'border-powder-300' },
  { title: 'Check in with yourself',   body: 'Quick, honest mood and energy check-ins help you notice how your online time is affecting how you feel day to day.', emoji: '💗', bg: 'bg-cream-100', border: 'border-powder-200' },
  { title: 'Reflect and journal',      body: "A private space to write, think, and process. Guided prompts make it easy even when you're not sure what you're feeling.", emoji: '📖', bg: 'bg-powder-100', border: 'border-powder-300' },
  { title: 'Connect with peers',       body: 'Talk with others working through the same things. Weekly facilitated groups run by trained student volunteers — safe, judgment-free.', emoji: '🤝', bg: 'bg-cream-100', border: 'border-powder-200' },
  { title: 'Built to be trusted',      body: "No ads. No tracking. No data selling. Scrollin' is a nonprofit — your privacy isn't a trade-off, it's a foundation.", emoji: '🛡️', bg: 'bg-powder-100', border: 'border-powder-300' },
  { title: 'Evidence-based tools',     body: 'Everything here is grounded in research, reviewed by counselors, and written for teenagers — not at them.', emoji: '🔬', bg: 'bg-cream-100', border: 'border-powder-200' },
];

function Features() {
  return (
    <section className="py-24 px-6 bg-cream-100 relative overflow-hidden">
      <PowderCircle className="absolute -left-16 bottom-4 w-48 h-48 opacity-45" />

      <div className="relative max-w-4xl mx-auto">
        <Reveal>
          <p className="section-label mb-3">What Scrollin' offers</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-choco-800 leading-snug mb-12 max-w-xl">
            Tools that meet you where you are.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className={`card card-hover p-6 h-full flex flex-col gap-3 ${f.bg} border-2 ${f.border}`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-powder-200`}>
                  {f.emoji}
                </div>
                <h3 className="font-extrabold text-choco-800 text-base">{f.title}</h3>
                <p className="text-steel-500 text-sm leading-relaxed font-semibold">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── How it works ─────────────────────────────────────────────────────────────
const steps = [
  { n: '1', title: 'Reflect honestly',    body: "Answer a few gentle questions about your week online. No judgment — just you and your thoughts.", emoji: '🌱' },
  { n: '2', title: 'See the patterns',    body: "Your dashboard shows how screen time connects to mood and energy, helping you spot what you wouldn't notice otherwise.", emoji: '🔍' },
  { n: '3', title: 'Try something small', body: "Choose one micro-habit from our library. Not a cold-turkey ban — just a small, manageable shift.", emoji: '✏️' },
  { n: '4', title: 'Grow with support',   body: "Share progress in a peer group, come back to journal, and build a practice that lasts.", emoji: '🌻' },
];

function HowItWorks() {
  return (
    <section id="how" className="py-24 px-6 bg-white relative overflow-hidden">
      <PowderCircle className="absolute -right-12 top-12 w-40 h-40 opacity-45" />

      <div className="relative max-w-4xl mx-auto">
        <Reveal>
          <p className="section-label mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-choco-800 leading-snug mb-12 max-w-xl">
            Simple steps. Real change.
          </h2>
        </Reveal>

        <div className="flex flex-col gap-0">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="flex gap-6 pb-8 last:pb-0 relative">
                {i < steps.length - 1 && (
                  <div className="absolute left-5 top-12 w-0.5 h-full bg-powder-200" />
                )}
                {/* Step bubble — powder blue like circles in image */}
                <div className="w-11 h-11 rounded-full bg-powder-200 border-2 border-powder-300 flex items-center justify-center flex-shrink-0 z-10 text-xl">
                  {s.emoji}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-extrabold text-choco-800 mb-1.5">{s.title}</h3>
                  <p className="text-steel-500 text-sm leading-relaxed font-semibold">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Who we are ───────────────────────────────────────────────────────────────
function WhoWeAre({ onEnter }: { onEnter: () => void }) {
  return (
    <section id="who" className="py-24 px-6 bg-cream-100 relative overflow-hidden">
      <PowderCircle className="absolute -left-16 bottom-0 w-56 h-56 opacity-40" />

      <div className="relative max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="section-label mb-3">About us</p>
            <h2 className="text-3xl md:text-4xl font-extrabold text-choco-800 leading-snug mb-5">
              Made by students, for students.
            </h2>
            <p className="text-steel-500 leading-relaxed mb-4 font-semibold">
              Scrollin' started as a high school project. We noticed that the adults talking about teen screen time often weren't the ones living it — so we built something different.
            </p>
            <p className="text-steel-500 leading-relaxed mb-8 font-semibold">
              We're a registered nonprofit run by student volunteers, advised by school counselors and researchers. Everything we build, we use ourselves.
            </p>
            <button
              onClick={onEnter}
              className="inline-flex items-center gap-2 px-7 py-3 rounded-3xl bg-powder-600 text-white text-sm font-extrabold hover:bg-powder-700 transition-colors shadow-soft"
            >
              Join 3,200+ young people
              <ArrowRight size={14} />
            </button>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: '3,200+',    l: 'youth served',         emoji: '👥' },
                { v: '40+',       l: 'school programs',      emoji: '🏫' },
                { v: '12',        l: 'peer facilitators',    emoji: '🌟' },
                { v: '501(c)(3)', l: 'registered nonprofit', emoji: '💙' },
              ].map(s => (
                <div key={s.l} className="card-powder p-5 text-center rounded-3xl card-hover">
                  <span className="text-2xl mb-1 block">{s.emoji}</span>
                  <p className="text-2xl font-extrabold text-choco-800 mb-1">{s.v}</p>
                  <p className="text-xs text-steel-500 font-bold">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Get involved ─────────────────────────────────────────────────────────────
const tiers = [
  {
    name: 'Youth', price: 'Free', period: 'always',
    description: 'For any young person who wants to build a healthier relationship with their screen.',
    cta: 'Get started free', highlighted: false,
    cardBg: 'bg-cream-100', cardBorder: 'border-powder-200',
    btnStyle: 'bg-powder-200 text-choco-700 hover:bg-powder-300 border-2 border-powder-300 font-extrabold',
    features: ['Full habit mapping', 'Weekly wellbeing check-ins', 'Personal strategy builder', 'Access to resource library', 'Community peer groups', 'Anonymous — no real name required'],
  },
  {
    name: 'School', price: '$0', period: 'per student',
    description: "Partner with us to bring Scrollin' into your classrooms and counseling programs.",
    cta: 'Partner with us', highlighted: true,
    cardBg: 'bg-powder-200', cardBorder: 'border-powder-400',
    btnStyle: 'bg-powder-600 text-white hover:bg-powder-700 shadow-powder font-extrabold',
    features: ['Everything in Youth', 'Counselor dashboard', 'Group session tools', 'Anonymized aggregate insights', 'Curriculum integration guides', 'Staff training workshop', 'Dedicated program coordinator'],
  },
  {
    name: 'Sponsor', price: 'Donate', period: 'any amount',
    description: 'Help fund free access for youth who need it most.',
    cta: 'Become a sponsor', highlighted: false,
    cardBg: 'bg-cream-100', cardBorder: 'border-powder-200',
    btnStyle: 'bg-choco-600 text-white hover:bg-choco-700 border-2 border-choco-700 font-extrabold',
    features: ['Public sponsor recognition', 'Impact report each quarter', 'Named scholarship', 'Early program access', 'Tax-deductible receipt', 'Optional advisory seat'],
  },
];

function GetInvolved({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="py-24 px-6 bg-white relative overflow-hidden">
      <PowderCircle className="absolute -right-16 -bottom-8 w-56 h-56 opacity-35" />

      <div className="relative max-w-4xl mx-auto">
        <Reveal className="text-center mb-12">
          <p className="section-label mb-3">Get involved</p>
          <h2 className="text-3xl md:text-4xl font-extrabold text-choco-800 leading-snug mb-4">
            Free for youth. Powered by community.
          </h2>
          <p className="text-steel-500 max-w-xl mx-auto font-semibold">
            Scrollin' is funded entirely by school partnerships and individual sponsors — so every young person can access it at zero cost, forever.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 80}>
              <div className={`card p-6 flex flex-col gap-5 h-full rounded-3xl border-2 ${tier.cardBg} ${tier.cardBorder} ${tier.highlighted ? 'ring-2 ring-powder-400 shadow-lifted scale-[1.03]' : 'card-hover'}`}>
                {tier.highlighted && (
                  <div className="text-center">
                    <span className="inline-flex items-center gap-1.5 bg-choco-600 text-white text-xs font-extrabold px-4 py-1.5 rounded-full shadow-soft">
                      <Heart size={10} className="fill-white" /> Most requested
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-extrabold text-choco-800 text-lg mb-1">{tier.name}</h3>
                  <p className="text-steel-500 text-sm font-semibold">{tier.description}</p>
                </div>
                <div className="flex items-end gap-1.5">
                  <span className="text-4xl font-extrabold text-choco-800">{tier.price}</span>
                  <span className="text-steel-400 text-sm mb-1.5 font-bold">/ {tier.period}</span>
                </div>
                <button
                  onClick={tier.name === 'Youth' ? onEnter : undefined}
                  className={`w-full py-3 rounded-2xl text-sm transition-all ${tier.btnStyle}`}
                >
                  {tier.cta}
                </button>
                <ul className="flex flex-col gap-2.5 mt-auto">
                  {tier.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-steel-600 font-semibold">
                      <Check size={14} className="text-sage-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ─────────────────────────────────────────────────────────────────
function BottomCTA({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="py-20 px-6 bg-cream-100 relative overflow-hidden">
      <div className="max-w-2xl mx-auto">
        <Reveal>
          {/* Big powder circle — replicates the hero circle style from brand image */}
          <div className="relative rounded-5xl overflow-hidden bg-powder-200 p-12 text-center shadow-lifted">
            {/* Smaller circles inside — like the brand image composition */}
            <PowderCircle className="absolute -top-8 -right-8 w-32 h-32 bg-powder-300 opacity-50" />
            <PowderCircle className="absolute -bottom-8 -left-8 w-40 h-40 bg-powder-300 opacity-40" />

            <span className="absolute top-6 right-10 text-xl opacity-40 select-none pointer-events-none" aria-hidden="true">🌸</span>
            <span className="absolute bottom-6 left-10 text-lg opacity-40 select-none pointer-events-none" aria-hidden="true">🌿</span>

            <div className="relative z-10">
              {/* "Part 2" badge style for the eyebrow */}
              <div className="inline-flex items-center gap-2 bg-choco-600 text-white text-xs font-extrabold px-5 py-2 rounded-full mb-6 shadow-soft">
                <Heart size={11} className="fill-white" />
                Free for every young person, always
              </div>

              {/* Heading — deep chocolate like "Meet More Judges!" */}
              <h2 className="text-3xl md:text-4xl font-extrabold text-choco-800 leading-snug mb-4">
                You don't have to figure this out alone.
              </h2>
              <p className="text-steel-600 leading-relaxed mb-8 font-semibold">
                Scrollin' is free, private, and made by people who've been there too. Come as you are.
              </p>

              {/* Primary button — "Judge Introductions" pill style */}
              <button
                onClick={onEnter}
                className="inline-flex items-center gap-2 px-9 py-4 rounded-3xl bg-powder-600 text-white font-extrabold text-sm hover:bg-powder-700 active:scale-95 transition-all shadow-powder"
              >
                Get started — it's free
                <ArrowRight size={14} />
              </button>
              <p className="text-steel-500 text-xs mt-4 font-bold">
                No account required to explore · No credit card ever
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-10 px-6 bg-powder-200 border-t-2 border-powder-300">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-2xl bg-powder-600 flex items-center justify-center">
            <Leaf size={14} className="text-white" />
          </div>
          <span className="font-extrabold text-choco-800 text-sm">Scrollin'</span>
          <span className="text-steel-500 text-xs ml-2 font-bold">· 501(c)(3) nonprofit</span>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {['Privacy policy', 'Safe messaging', 'Accessibility', 'Volunteer', 'Contact'].map(l => (
            <a key={l} href="#" className="text-xs text-steel-500 hover:text-choco-700 transition-colors font-bold">{l}</a>
          ))}
        </nav>
        <p className="text-xs text-steel-400 font-bold">
          © {new Date().getFullYear()} Scrollin'. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

// ─── Page assembly ────────────────────────────────────────────────────────────
export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="bg-cream-100 text-choco-800">
      <Nav onEnter={onEnter} />
      <Hero onEnter={onEnter} />
      <FloralDivider />
      <Why />
      <FloralDivider />
      <Features />
      <FloralDivider />
      <HowItWorks />
      <FloralDivider />
      <WhoWeAre onEnter={onEnter} />
      <FloralDivider />
      <GetInvolved onEnter={onEnter} />
      <BottomCTA onEnter={onEnter} />
      <Footer />
    </div>
  );
}
