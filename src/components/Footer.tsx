import { Scroll, Github, Twitter, Instagram } from 'lucide-react';

const footerLinks = {
  Program:   ['How it works', 'Habit mapping', 'Peer groups', 'Resource library', 'Wellbeing check-ins'],
  Schools:   ['Partner with us', 'Counselor tools', 'Curriculum guides', 'Staff training', 'Request a demo'],
  Nonprofit: ['Our mission', 'Team', 'Volunteer', 'Press kit', 'Annual report'],
  Legal:     ['Privacy policy', 'Terms of use', 'Safe messaging', 'Accessibility'],
};

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.06] pt-16 pb-10 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">

          {/* Brand */}
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center shadow-lg">
                <Scroll size={15} className="text-white" />
              </div>
              <span className="text-white font-semibold text-lg tracking-tight">
                Scrollin<span className="text-gradient">'</span>
              </span>
            </a>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs mb-6">
              A student-led nonprofit helping young people navigate unhealthy social media and gaming habits — and build a healthier digital life.
            </p>
            <div className="flex items-center gap-3">
              {[
                { Icon: Github,    href: '#', label: 'GitHub'    },
                { Icon: Twitter,   href: '#', label: 'Twitter'   },
                { Icon: Instagram, href: '#', label: 'Instagram' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 glass rounded-xl flex items-center justify-center text-slate-500 hover:text-white hover:bg-white/[0.08] transition-all duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white text-sm font-semibold mb-4">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-500 hover:text-slate-300 text-sm transition-colors duration-200">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.06]">
          <p className="text-slate-600 text-sm">
            © {new Date().getFullYear()} Scrollin', Inc. — a registered 501(c)(3) nonprofit. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-600 text-sm">All programs running</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
