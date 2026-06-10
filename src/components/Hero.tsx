import { ArrowRight, Play, Scroll, Circle } from 'lucide-react';
import { useEffect, useRef } from 'react';

// Floating habit nodes — represent the kinds of patterns Scrollin' helps young
// people recognize and reroute.
function FloatingNode({
  x, y, label, color, delay, status,
}: {
  x: string; y: string; label: string; color: string; delay: string;
  status: 'done' | 'active' | 'pending';
}) {
  const statusColors = { done: 'bg-emerald-500', active: 'bg-violet-500', pending: 'bg-slate-600' };
  return (
    <div
      className="absolute glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl animate-float opacity-0 animate-fade-in"
      style={{
        left: x, top: y,
        animationDelay: delay,
        animationFillMode: 'forwards',
        animationDuration: '6s, 0.8s',
        animationName: 'float, fadeIn',
      }}
    >
      <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]} shadow-lg`} />
      <span className="text-xs font-medium text-white whitespace-nowrap">{label}</span>
      <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: color }}>
        <Scroll size={10} className="text-white" />
      </div>
    </div>
  );
}

export default function Hero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);

    const particles: { x: number; y: number; vx: number; vy: number; r: number; a: number }[] = [];
    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.5 + 0.3, a: Math.random() * 0.5 + 0.1,
      });
    }

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;  if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(192, 132, 252, ${p.a})`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(168, 85, 247, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Background orbs */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-violet-700/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-pink-700/10 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-purple-900/5 blur-[140px] pointer-events-none" />

      {/* Floating habit nodes */}
      <div className="absolute inset-0 pointer-events-none hidden lg:block">
        <FloatingNode x="7%"  y="22%" label="Doom-scrolling loop"   color="rgba(168,85,247,0.8)"  delay="0s"    status="done"    />
        <FloatingNode x="74%" y="14%" label="Gaming all night"       color="rgba(236,72,153,0.8)"  delay="0.4s"  status="active"  />
        <FloatingNode x="81%" y="58%" label="Screen-free morning"    color="rgba(6,182,212,0.8)"   delay="0.8s"  status="pending" />
        <FloatingNode x="5%"  y="63%" label="Healthy boundary set"   color="rgba(16,185,129,0.8)"  delay="1.2s"  status="done"    />
        <FloatingNode x="59%" y="77%" label="IRL connection made"    color="rgba(168,85,247,0.8)"  delay="1.6s"  status="active"  />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center">

        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 opacity-0 animate-fade-up"
          style={{ animationFillMode: 'forwards' }}
        >
          <Circle size={6} className="fill-emerald-400 text-emerald-400 animate-pulse" />
          <span className="text-xs font-medium text-slate-300">Student-led nonprofit · free for every young person</span>
          <ArrowRight size={12} className="text-slate-500" />
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] mb-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}
        >
          Reclaim your feed.
          <br className="hidden sm:block" />
          <span className="text-gradient">Own your time.</span>
        </h1>

        {/* Subheading */}
        <p
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
        >
          Scrollin' is a student-led nonprofit that helps young people map their online habits, understand what drives unhealthy patterns, and build real strategies for a healthier digital life.
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}
        >
          <a
            href="#"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold text-base hover:opacity-95 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-xl shadow-violet-900/40 glow-purple"
          >
            Start your journey — free
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
          </a>
          <a
            href="#"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl glass text-white font-medium text-base hover:bg-white/[0.08] active:scale-95 transition-all duration-200"
          >
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors duration-200">
              <Play size={10} className="text-white fill-white ml-0.5" />
            </div>
            Watch our story
          </a>
        </div>

        {/* Social proof */}
        <div
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 opacity-0 animate-fade-up"
          style={{ animationDelay: '0.45s', animationFillMode: 'forwards' }}
        >
          <div className="flex -space-x-3">
            {['bg-violet-500', 'bg-pink-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-amber-500'].map((color, i) => (
              <div
                key={i}
                className={`w-9 h-9 rounded-full ${color} border-2 border-dark-900 flex items-center justify-center text-xs font-semibold text-white`}
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <div className="text-left">
            <div className="text-white font-semibold text-sm">3,200+ youth served so far</div>
            <div className="text-slate-500 text-xs">across 40+ schools and community programs</div>
          </div>
          <div className="hidden sm:block w-px h-10 bg-white/10" />
          <div className="text-slate-400 text-sm">
            100% free &nbsp;·&nbsp; Student-run &nbsp;·&nbsp; No ads, ever
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060612] to-transparent pointer-events-none" />
    </section>
  );
}
