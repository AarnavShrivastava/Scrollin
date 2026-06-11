import { ArrowRight, Leaf, Heart } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16 bg-cream-100">
      {/* Blob decorations */}
      <svg viewBox="0 0 200 200" className="absolute -top-20 -left-32 w-80 h-80 text-blue-100 opacity-70 pointer-events-none" aria-hidden="true">
        <path fill="currentColor" d="M44.3,-58.4C56.9,-50.6,66.5,-37.2,70.5,-22.3C74.5,-7.4,73,8.9,66.3,22.5C59.6,36.1,47.7,47,34.4,54.5C21.1,62,6.4,66.2,-8.2,65.3C-22.8,64.3,-37.3,58.1,-48.5,48.1C-59.7,38.1,-67.6,24.2,-69.3,9.6C-71,-5,-66.6,-20.3,-58.4,-33.4C-50.2,-46.5,-38.2,-57.3,-24.8,-63.9C-11.4,-70.5,3.4,-72.9,17.3,-70.1C31.2,-67.2,31.7,-66.2,44.3,-58.4Z" transform="translate(100 100)" />
      </svg>
      <svg viewBox="0 0 200 200" className="absolute -bottom-24 -right-24 w-96 h-96 text-pink-100 opacity-60 pointer-events-none" aria-hidden="true">
        <path fill="currentColor" d="M44.3,-58.4C56.9,-50.6,66.5,-37.2,70.5,-22.3C74.5,-7.4,73,8.9,66.3,22.5C59.6,36.1,47.7,47,34.4,54.5C21.1,62,6.4,66.2,-8.2,65.3C-22.8,64.3,-37.3,58.1,-48.5,48.1C-59.7,38.1,-67.6,24.2,-69.3,9.6C-71,-5,-66.6,-20.3,-58.4,-33.4C-50.2,-46.5,-38.2,-57.3,-24.8,-63.9C-11.4,-70.5,3.4,-72.9,17.3,-70.1C31.2,-67.2,31.7,-66.2,44.3,-58.4Z" transform="translate(100 100)" />
      </svg>

      {/* Dot grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-25"
        style={{ backgroundImage: 'radial-gradient(circle, #92BAE0 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      {/* Botanical floats */}
      <span className="absolute top-24 left-16 text-3xl opacity-40 animate-float select-none pointer-events-none" aria-hidden="true">🌿</span>
      <span className="absolute top-32 right-20 text-2xl opacity-35 animate-sway select-none pointer-events-none" aria-hidden="true">🌸</span>
      <span className="absolute bottom-32 left-24 text-2xl opacity-35 animate-float select-none pointer-events-none" style={{ animationDelay: '2s' }} aria-hidden="true">🍃</span>
      <span className="absolute bottom-40 right-16 text-3xl opacity-30 animate-sway select-none pointer-events-none" style={{ animationDelay: '1s' }} aria-hidden="true">✿</span>

      {/* Main content */}
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 bg-white border border-blue-200 text-blue-600 text-xs font-bold px-5 py-2 rounded-full mb-8 shadow-soft opacity-0 animate-fade-in"
          style={{ animationFillMode: 'forwards' }}
        >
          <Heart size={12} className="text-pink-400 fill-pink-300" />
          Student-led · nonprofit · free for every young person
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-navy-800 leading-tight mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          Feel more like{' '}
          <em className="not-italic text-blue-500">yourself</em>
          {' '}online.
        </h1>

        {/* Subheading */}
        <p
          className="text-lg md:text-xl text-charcoal-600 max-w-xl mx-auto leading-relaxed mb-10 opacity-0 animate-fade-up font-medium"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          Scrollin' is a student-led nonprofit that helps young people understand their social media and gaming habits — and build a healthier digital life.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <a
            href="#"
            className="group flex items-center gap-2 px-8 py-4 rounded-3xl bg-blue-500 text-white font-bold text-base hover:bg-blue-600 active:scale-95 transition-all shadow-soft"
          >
            Start for free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="#how-it-works"
            className="group flex items-center gap-2 px-8 py-4 rounded-3xl text-charcoal-700 font-bold text-base hover:bg-cream-200 transition-all border border-cream-300"
          >
            See how it works
          </a>
        </div>

        {/* Social proof */}
        <div
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}
        >
          <div className="flex -space-x-3">
            {['bg-blue-400', 'bg-pink-400', 'bg-sage-400', 'bg-cream-400', 'bg-blue-300'].map((color, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-full ${color} border-2 border-cream-100 flex items-center justify-center text-xs font-bold text-white`}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className="text-left">
            <div className="text-navy-800 font-bold text-sm">3,200+ youth served so far</div>
            <div className="text-charcoal-500 text-xs font-semibold">across 40+ schools and community programs</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-cream-300" />
          <div className="text-charcoal-500 text-sm font-semibold">
            100% free &nbsp;·&nbsp; Student-run &nbsp;·&nbsp; No ads, ever
          </div>
        </div>
      </div>
    </section>
  );
}
