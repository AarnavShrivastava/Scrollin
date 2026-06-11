import { useState, useEffect } from 'react';
import { Menu, X, Leaf } from 'lucide-react';

const navLinks = [
  { label: 'Why it matters', href: '#features'    },
  { label: 'How it works',   href: '#how-it-works' },
  { label: 'Get involved',   href: '#get-involved' },
  { label: 'About us',       href: '#about'        },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-cream-100/95 backdrop-blur-md border-b-2 border-powder-200 shadow-soft' : 'bg-transparent'}`}>
      <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-2xl bg-powder-600 flex items-center justify-center shadow-soft group-hover:bg-powder-700 transition-colors">
            <Leaf size={16} className="text-white" />
          </div>
          <span className="font-extrabold text-choco-800 text-base tracking-tight">Scrollin'</span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <li key={link.label}>
              <a href={link.href} className="px-3.5 py-2 text-sm font-bold text-steel-600 hover:text-choco-700 rounded-xl hover:bg-powder-100 transition-all">{link.label}</a>
            </li>
          ))}
        </ul>

        <div className="hidden md:flex items-center gap-3">
          <a href="#" className="text-sm font-bold text-steel-600 hover:text-choco-700 transition-colors px-3 py-1.5">Sign in</a>
          <a href="#" className="text-sm font-extrabold px-5 py-2.5 rounded-2xl bg-powder-600 text-white hover:bg-powder-700 transition-colors shadow-soft">Get started — free</a>
        </div>

        <button className="md:hidden p-2 rounded-xl text-steel-600 hover:bg-powder-100 transition-all" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${menuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-cream-100 border-t-2 border-powder-200 px-6 py-4 flex flex-col gap-1">
          {navLinks.map(link => (
            <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-sm font-bold text-steel-600 hover:text-choco-700 rounded-xl hover:bg-powder-100 transition-all">{link.label}</a>
          ))}
          <div className="mt-4 pt-4 border-t border-powder-200 flex flex-col gap-2">
            <a href="#" className="px-4 py-3 text-sm font-bold text-steel-600 text-center rounded-xl hover:bg-powder-100 transition-all">Sign in</a>
            <a href="#" className="px-4 py-3 text-sm font-extrabold text-center rounded-2xl bg-powder-600 text-white hover:bg-powder-700 transition-colors">Get started — free</a>
          </div>
        </div>
      </div>
    </header>
  );
}
