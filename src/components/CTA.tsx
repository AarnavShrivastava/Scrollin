import { useEffect, useRef } from 'react';
import { ArrowRight, Heart } from 'lucide-react';

export default function CTA() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('opacity-100', 'scale-100');
          el.classList.remove('opacity-0', 'scale-95');
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div
          ref={ref}
          className="relative rounded-3xl overflow-hidden opacity-0 scale-95 transition-all duration-700 ease-out"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-violet-900/80 via-pink-900/50 to-purple-900/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-pink-600/20 blur-3xl" />

          {/* Grid pattern overlay */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />

          {/* Content */}
          <div className="relative z-10 text-center px-8 py-20">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
              <Heart size={12} className="text-pink-300 fill-pink-300" />
              <span className="text-xs font-medium text-slate-300">Free for every young person, always</span>
            </div>

            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6 leading-tight">
              Your feed doesn't have
              <br />
              <span className="text-gradient">to control you.</span>
            </h2>

            <p className="text-slate-300 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Join 3,200+ young people who've started mapping their habits, understanding their triggers, and building a digital life that actually works for them.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#"
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-900 font-semibold text-base hover:bg-slate-100 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-xl"
              >
                Start your journey — free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl glass text-white font-medium text-base hover:bg-white/[0.1] active:scale-95 transition-all duration-200"
              >
                Bring Scrollin' to my school
              </a>
            </div>

            <p className="text-slate-500 text-sm mt-8">
              No ads &nbsp;·&nbsp; No data selling &nbsp;·&nbsp; No shame &nbsp;·&nbsp; Student-run nonprofit
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
