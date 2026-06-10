import { useState, useEffect } from 'react';
import { Menu, X, Scroll } from 'lucide-react';

const navLinks = [
  { label: 'Why it matters', href: '#features' },
  { label: 'How it works',   href: '#how-it-works' },
  { label: 'Get involved',   href: '#get-involved' },
  { label: 'About us',       href: '#about' },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'glass border-b border-white/[0.06] shadow-2xl shadow-black/40'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:animate-glow transition-all duration-300">
            <Scroll size={15} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">
            Scrollin<span className="text-gradient">'</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="px-4 py-2 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#"
            className="text-sm text-slate-400 hover:text-white transition-colors duration-200 px-4 py-2"
          >
            Sign in
          </a>
          <a
            href="#"
            className="text-sm font-medium px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white hover:opacity-90 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-violet-900/40"
          >
            Join the movement
          </a>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="glass border-t border-white/[0.06] px-6 py-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-sm text-slate-400 hover:text-white rounded-lg hover:bg-white/[0.06] transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-4 pt-4 border-t border-white/[0.06] flex flex-col gap-2">
            <a href="#" className="px-4 py-3 text-sm text-slate-400 hover:text-white text-center rounded-lg hover:bg-white/[0.06] transition-all duration-200">
              Sign in
            </a>
            <a href="#" className="px-4 py-3 text-sm font-medium text-center rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white">
              Join the movement
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
