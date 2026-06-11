import { Leaf, Github, Twitter, Instagram } from 'lucide-react';

const footerLinks = {
  Program:   ['How it works', 'Habit mapping', 'Peer groups', 'Resource library', 'Wellbeing check-ins'],
  Schools:   ['Partner with us', 'Counselor tools', 'Curriculum guides', 'Staff training', 'Request a demo'],
  Nonprofit: ['Our mission', 'Team', 'Volunteer', 'Press kit', 'Annual report'],
  Legal:     ['Privacy policy', 'Terms of use', 'Safe messaging', 'Accessibility'],
};

export default function Footer() {
  return (
    <footer className="border-t-2 border-powder-300 bg-powder-200 pt-16 pb-10 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-16">
          <div className="col-span-2">
            <a href="#" className="flex items-center gap-2.5 mb-4 group w-fit">
              <div className="w-9 h-9 rounded-2xl bg-powder-600 flex items-center justify-center shadow-soft group-hover:bg-powder-700 transition-colors">
                <Leaf size={16} className="text-white" />
              </div>
              <span className="font-extrabold text-choco-800 text-base tracking-tight">Scrollin'</span>
            </a>
            <p className="text-steel-600 text-sm leading-relaxed max-w-xs mb-6 font-semibold">
              A student-led nonprofit helping young people navigate unhealthy social media and gaming habits — and build a healthier digital life.
            </p>
            <div className="flex items-center gap-3">
              {[{ Icon: Github, href: '#', label: 'GitHub' }, { Icon: Twitter, href: '#', label: 'Twitter' }, { Icon: Instagram, href: '#', label: 'Instagram' }].map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-9 h-9 bg-white border-2 border-powder-300 rounded-xl flex items-center justify-center text-steel-500 hover:text-choco-700 hover:border-powder-500 transition-all">
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-choco-800 text-sm font-extrabold mb-4">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link}><a href="#" className="text-steel-600 hover:text-choco-700 text-sm transition-colors font-semibold">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-powder-300">
          <p className="text-steel-500 text-sm font-bold">© {new Date().getFullYear()} Scrollin', Inc. — a registered 501(c)(3) nonprofit. All rights reserved.</p>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-sage-500 animate-pulse" />
            <span className="text-steel-500 text-sm font-bold">All programs running 🌿</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
