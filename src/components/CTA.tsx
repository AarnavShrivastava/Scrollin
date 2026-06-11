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
    <section className="py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <div
          ref={ref}
          className="relative rounded-4xl overflow-hidden opacity-0 scale-95 transition-all duration-700 ease-out bg-blue-500 p-12 text-center shadow-lifted"
        >
          {/* Blob decorations */}
          <svg viewBox="0 0 200 200" className="absolute -top-12 -left-12 w-48 h-48 text-blue-400 opacity-50 pointer-events-none" aria-hidden="true">
            <path fill="currentColor" d="M44.3,-58.4C56.9,-50.6,66.5,-37.2,70.5,-22.3C74.5,-7.4,73,8.9,66.3,22.5C59.6,36.1,47.7,47,34.4,54.5C21.1,62,6.4,66.2,-8.2,65.3C-22.8,64.3,-37.3,58.1,-48.5,48.1C-59.7,38.1,-67.6,24.2,-69.3,9.6C-71,-5,-66.6,-20.3,-58.4,-33.4C-50.2,-46.5,-38.2,-57.3,-24.8,-63.9C-11.4,-70.5,3.4,-72.9,17.3,-70.1C31.2,-67.2,31.7,-66.2,44.3,-58.4Z" transform="translate(100 100)" />
          </svg>
          <svg viewBox="0 0 200 200" className="absolute -bottom-12 -right-12 w-48 h-48 text-blue-600 opacity-40 pointer-events-none" aria-hidden="true">
            <path fill="currentColor" d="M44.3,-58.4C56.9,-50.6,66.5,-37.2,70.5,-22.3C74.5,-7.4,73,8.9,66.3,22.5C59.6,36.1,47.7,47,34.4,54.5C21.1,62,6.4,66.2,-8.2,65.3C-22.8,64.3,-37.3,58.1,-48.5,48.1C-59.7,38.1,-67.6,24.2,-69.3,9.6C-71,-5,-66.6,-20.3,-58.4,-33.4C-50.2,-46.5,-38.2,-57.3,-24.8,-63.9C-11.4,-70.5,3.4,-72.9,17.3,-70.1C31.2,-67.2,31.7,-66.2,44.3,-58.4Z" transform="translate(100 100)" />
          </svg>

          <span className="absolute top-6 right-8 text-2xl opacity-40 select-none pointer-events-none" aria-hidden="true">🌸</span>
          <span className="absolute bottom-6 left-8 text-xl opacity-40 select-none pointer-events-none" aria-hidden="true">🌿</span>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-2 mb-8">
              <Heart size={12} className="text-pink-200 fill-pink-200" />
              <span className="text-xs font-bold text-white">Free for every young person, always</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
              Your feed doesn't have to control you.
            </h2>

            <p className="text-blue-100 text-lg max-w-xl mx-auto mb-10 leading-relaxed font-medium">
              Join 3,200+ young people who've started mapping their habits and building a digital life that actually works for them.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="#"
                className="group flex items-center gap-2 px-8 py-4 rounded-3xl bg-white text-navy-800 font-extrabold text-base hover:bg-cream-100 hover:scale-[1.02] active:scale-95 transition-all shadow-soft"
              >
                Start your journey — free
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-8 py-4 rounded-3xl bg-white/15 text-white font-bold text-base hover:bg-white/25 active:scale-95 transition-all"
              >
                Bring Scrollin' to my school
              </a>
            </div>

            <p className="text-blue-200 text-sm mt-8 font-bold">
              No ads &nbsp;·&nbsp; No data selling &nbsp;·&nbsp; No shame &nbsp;·&nbsp; Student-run nonprofit
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
