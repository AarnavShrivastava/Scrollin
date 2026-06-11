import { useState, useEffect, useRef } from 'react';
import { ArrowRight, Menu, X, Scroll, Heart, ShieldCheck, Users, BookOpen, Sparkles, ChevronDown } from 'lucide-react';

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
    <header className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${scrolled ? 'bg-bark-900/95 backdrop-blur-md border-b border-bark-800 shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl bg-calm-600 flex items-center justify-center">
            <Scroll size={14} className="text-white" />
          </div>
          <span className="font-display font-semibold text-white text-base tracking-tight">Scrollin'</span>
        </a>

        <nav className="hidden md:flex items-center gap-1">
          {[['Why it matters','#why'],['How it works','#how'],['Who we are','#who']].map(([label, href]) => (
            <a key={label} href={href} className="px-3 py-1.5 text-sm text-sand-300 hover:text-white rounded-lg hover:bg-bark-800/70 transition-all">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button onClick={onEnter} className="text-sm text-sand-300 hover:text-white px-3 py-1.5 transition-colors">Sign in</button>
          <button onClick={onEnter} className="text-sm font-medium px-4 py-2 rounded-xl bg-calm-600 text-white hover:bg-calm-500 transition-colors shadow-sm">
            Get started — free
          </button>
        </div>

        <button className="md:hidden p-2 rounded-lg text-sand-300 hover:bg-bark-800 transition-all" onClick={() => setOpen(!open)} aria-label="Toggle menu">
          {open ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-bark-900 border-t border-bark-800 px-6 py-4 flex flex-col gap-2">
          {[['Why it matters','#why'],['How it works','#how'],['Who we are','#who']].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)} className="py-2.5 text-sm text-sand-300 border-b border-bark-800 last:border-0">
              {label}
            </a>
          ))}
          <button onClick={onEnter} className="mt-2 w-full py-3 rounded-xl bg-calm-600 text-white text-sm font-medium">
            Get started — free
          </button>
        </div>
      )}
    </header>
  );
}

// ─── Fade-in on scroll helper ─────────────────────────────────────────────────
function Reveal({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => {
          el.classList.remove('opacity-0', 'translate-y-4');
          el.classList.add('opacity-100', 'translate-y-0');
        }, delay);
        obs.disconnect();
      }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return (
    <div ref={ref} className={`opacity-0 translate-y-4 transition-all duration-700 ease-out ${className}`}>
      {children}
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-16 px-6 text-center relative overflow-hidden bg-bark-900">
      {/* Atmospheric background glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[350px] rounded-full bg-calm-800/25 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-bark-700/50 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/4 left-1/5 w-[250px] h-[250px] rounded-full bg-calm-900/30 blur-[80px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 bg-bark-800 border border-bark-700 text-sand-300 text-xs font-medium px-4 py-2 rounded-full mb-8 opacity-0 animate-fade-in"
          style={{ animationFillMode: 'forwards' }}
        >
          <Heart size={12} className="text-calm-400" />
          Student-led · nonprofit · free for all youth
        </div>

        {/* Headline */}
        <h1
          className="text-4xl md:text-6xl font-display font-bold text-white leading-tight tracking-tight mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          Feel more like{' '}
          <em className="not-italic text-calm-400">yourself</em>
          {' '}online.
        </h1>

        {/* Sub */}
        <p
          className="text-lg text-sand-400 leading-relaxed mb-10 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          Scrollin' helps young people understand their social media and gaming habits — gently, honestly, and without judgment — so they can build a digital life that actually feels good.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <button
            onClick={onEnter}
            className="group flex items-center gap-2 px-7 py-3.5 rounded-2xl bg-calm-600 text-white font-medium text-sm hover:bg-calm-500 active:scale-95 transition-all shadow-lg shadow-calm-900/40"
          >
            Start for free
            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <a href="#how" className="px-7 py-3.5 rounded-2xl text-sand-300 text-sm font-medium border border-bark-700 hover:bg-bark-800 hover:text-white transition-all">
            See how it works
          </a>
        </div>

        {/* Trust line */}
        <p
          className="mt-8 text-xs text-sand-600 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
        >
          No ads · no data selling · no screen-time surveillance · 100% free
        </p>
      </div>

      {/* Scroll cue */}
      <a href="#why" className="absolute bottom-8 flex flex-col items-center gap-1 text-sand-600 hover:text-sand-400 transition-colors">
        <span className="text-xs">Scroll to learn more</span>
        <ChevronDown size={16} className="animate-bounce" />
      </a>
    </section>
  );
}

// ─── Why section ──────────────────────────────────────────────────────────────
const stats = [
  { value: '7h 22m', label: 'average daily screen time for teens in the US', src: 'Common Sense Media' },
  { value: '45%',    label: 'of teens say they feel overwhelmed by social media', src: 'Pew Research' },
  { value: '1 in 3', label: 'young people report that social media makes them feel worse about themselves', src: 'APA' },
];

function Why() {
  return (
    <section id="why" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-calm-600 mb-3">Why it matters</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-sand-900 leading-snug mb-6 max-w-xl">
            The internet wasn't designed with your wellbeing in mind.
          </h2>
          <p className="text-sand-600 leading-relaxed max-w-2xl mb-12">
            Platforms are built to keep you scrolling. Games are designed to keep you playing. That's not a character flaw — it's engineering. Scrollin' helps you see those patterns clearly, then choose what to do about them.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {stats.map((s, i) => (
            <Reveal key={s.value} delay={i * 80}>
              <div className="card p-6">
                <p className="text-3xl font-semibold text-calm-600 mb-2">{s.value}</p>
                <p className="text-sand-700 text-sm leading-relaxed mb-3">{s.label}</p>
                <p className="text-xs text-sand-400">Source: {s.src}</p>
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
  {
    icon: Sparkles,
    title: 'Understand your patterns',
    body: 'Reflect on how you use social media and games. See which habits are helping you feel connected and rested — and which ones leave you drained.',
    color: 'bg-calm-50 text-calm-600 border-calm-200',
  },
  {
    icon: Heart,
    title: 'Check in with yourself',
    body: 'Quick, honest mood and energy check-ins help you notice how your online time is actually affecting how you feel day to day.',
    color: 'bg-blush-50 text-blush-600 border-blush-200',
  },
  {
    icon: BookOpen,
    title: 'Reflect and journal',
    body: 'A private space to write, think, and process. Guided prompts make it easy even when you\'re not sure what you\'re feeling.',
    color: 'bg-sage-50 text-sage-600 border-sage-200',
  },
  {
    icon: Users,
    title: 'Connect with peers',
    body: 'Talk with others working through the same things. Weekly facilitated groups run by trained student volunteers — safe, judgment-free.',
    color: 'bg-amber-50 text-amber-600 border-amber-200',
  },
  {
    icon: ShieldCheck,
    title: 'Built to be trusted',
    body: 'No ads. No tracking. No data selling. Scrollin\' is a nonprofit — your privacy isn\'t a trade-off, it\'s a foundation.',
    color: 'bg-calm-50 text-calm-600 border-calm-200',
  },
  {
    icon: BookOpen,
    title: 'Evidence-based tools',
    body: 'Everything here is grounded in research, reviewed by counselors, and written for teenagers — not at them.',
    color: 'bg-sage-50 text-sage-600 border-sage-200',
  },
];

function Features() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-calm-600 mb-3">What Scrollin' offers</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-sand-900 leading-snug mb-12 max-w-xl">
            Tools that meet you where you are.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 60}>
              <div className="card card-hover p-6 h-full flex flex-col gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${f.color} flex-shrink-0`}>
                  <f.icon size={18} />
                </div>
                <h3 className="font-semibold text-sand-900 text-base">{f.title}</h3>
                <p className="text-sand-600 text-sm leading-relaxed">{f.body}</p>
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
  { n: '1', title: 'Reflect honestly', body: 'Answer a few gentle questions about your week online. No judgment — just you and your thoughts.' },
  { n: '2', title: 'See the patterns', body: 'Your dashboard shows how screen time connects to mood and energy, helping you spot what you wouldn\'t notice otherwise.' },
  { n: '3', title: 'Try something small', body: 'Choose one micro-habit from our library. Not a cold-turkey ban — just a small, manageable shift.' },
  { n: '4', title: 'Grow with support', body: 'Share progress in a peer group, come back to journal, and build a practice that lasts.' },
];

function HowItWorks() {
  return (
    <section id="how" className="py-24 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <Reveal>
          <p className="text-xs font-semibold uppercase tracking-widest text-calm-600 mb-3">How it works</p>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-sand-900 leading-snug mb-12 max-w-xl">
            Simple steps. Real change.
          </h2>
        </Reveal>

        <div className="flex flex-col gap-0">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="flex gap-6 pb-8 last:pb-0 relative">
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="absolute left-5 top-10 w-px h-full bg-sand-200" />
                )}
                <div className="w-10 h-10 rounded-full bg-calm-600 text-white flex items-center justify-center text-sm font-semibold flex-shrink-0 z-10">
                  {s.n}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-semibold text-sand-900 mb-1.5">{s.title}</h3>
                  <p className="text-sand-600 text-sm leading-relaxed">{s.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Who we are ──────────────────────────────────────────────────────────────
function WhoWeAre({ onEnter }: { onEnter: () => void }) {
  return (
    <section id="who" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-widest text-calm-600 mb-3">About us</p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-sand-900 leading-snug mb-5">
              Made by students, for students.
            </h2>
            <p className="text-sand-600 leading-relaxed mb-4">
              Scrollin' started as a high school project. We noticed that the adults talking about teen screen time often weren't the ones living it — so we built something different.
            </p>
            <p className="text-sand-600 leading-relaxed mb-8">
              We're a registered nonprofit run by student volunteers, advised by school counselors and researchers. Everything we build, we use ourselves.
            </p>
            <button
              onClick={onEnter}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-calm-600 text-white text-sm font-medium hover:bg-calm-700 transition-colors"
            >
              Join 3,200+ young people
              <ArrowRight size={14} />
            </button>
          </Reveal>

          <Reveal delay={120}>
            <div className="grid grid-cols-2 gap-4">
              {[
                { v: '3,200+', l: 'youth served'        },
                { v: '40+',    l: 'school programs'     },
                { v: '12',     l: 'peer facilitators'   },
                { v: '501(c)(3)', l: 'registered nonprofit' },
              ].map(s => (
                <div key={s.l} className="card p-5">
                  <p className="text-2xl font-semibold text-calm-600 mb-1">{s.v}</p>
                  <p className="text-xs text-sand-500">{s.l}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ────────────────────────────────────────────────────────────────
function BottomCTA({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="py-20 px-6 bg-bark-900 relative overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full bg-calm-800/20 blur-[100px] pointer-events-none" />
      <div className="max-w-2xl mx-auto text-center relative">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-snug mb-4">
            You don't have to figure this out alone.
          </h2>
          <p className="text-sand-400 leading-relaxed mb-8">
            Scrollin' is free, private, and made by people who've been there too. Come as you are.
          </p>
          <button
            onClick={onEnter}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-calm-600 text-white font-semibold text-sm hover:bg-calm-500 active:scale-95 transition-all shadow-lg shadow-calm-900/50"
          >
            Get started — it's free
            <ArrowRight size={14} />
          </button>
          <p className="text-sand-600 text-xs mt-4">No account required to explore · No credit card ever</p>
        </Reveal>
      </div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="py-10 px-6 bg-bark-900 border-t border-bark-800">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-calm-600 flex items-center justify-center">
            <Scroll size={13} className="text-white" />
          </div>
          <span className="font-display font-semibold text-white text-sm">Scrollin'</span>
          <span className="text-sand-600 text-xs ml-2">· 501(c)(3) nonprofit</span>
        </div>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          {['Privacy policy','Safe messaging','Accessibility','Volunteer','Contact'].map(l => (
            <a key={l} href="#" className="text-xs text-sand-500 hover:text-white transition-colors">{l}</a>
          ))}
        </nav>
        <p className="text-xs text-sand-600">© {new Date().getFullYear()} Scrollin'. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─── Page assembly ────────────────────────────────────────────────────────────
export default function LandingPage({ onEnter }: { onEnter: () => void }) {
  return (
    <div className="bg-sand-50 text-sand-900">
      <Nav onEnter={onEnter} />
      <Hero onEnter={onEnter} />
      <Why />
      <Features />
      <HowItWorks />
      <WhoWeAre onEnter={onEnter} />
      <BottomCTA onEnter={onEnter} />
      <Footer />
    </div>
  );
}
