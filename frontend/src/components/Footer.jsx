import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, Linkedin, Twitter } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_sustainable-insights/artifacts/y08gbl8u_20251015_1623_Haako%20Logo%20Design_simple_compose_01k7mavmrke71vr0nt45t3fban.png";

const footerLinks = {
  navigation: [
    { name: 'Accueil', path: '/' },
    { name: 'À propos', path: '/about' },
    { name: 'Solutions', path: '/solutions' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ],
  solutions: [
    { name: 'Recherche & Analyse', path: '/solutions/recherche-analyse' },
    { name: 'Communication Stratégique', path: '/solutions/communication-strategique' },
  ],
  themes: [
    { name: 'Énergie', path: '/blog?theme=energie' },
    { name: 'Transition Énergétique', path: '/blog?theme=transition' },
    { name: 'Développement Durable', path: '/blog?theme=developpement' },
    { name: 'Mauritanie', path: '/blog?theme=mauritanie' },
    { name: 'Afrique', path: '/blog?theme=afrique' },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white" data-testid="footer">
      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-6 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img 
                src={LOGO_URL} 
                alt="HAAKO" 
                className="h-12 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              Intelligence stratégique pour l'énergie, le climat et le développement durable en Afrique. 
              Transformer les données complexes en analyses claires et actionnables.
            </p>
            <div className="space-y-3">
              <a 
                href="mailto:abdoulayediop9@hotmail.com" 
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <Mail className="h-4 w-4" />
                abdoulayediop9@hotmail.com
              </a>
              <a 
                href="tel:+22249146332" 
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors text-sm"
              >
                <Phone className="h-4 w-4" />
                +222 49 14 63 32
              </a>
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <MapPin className="h-4 w-4" />
                Nouakchott, Mauritanie
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-manrope font-semibold text-sm uppercase tracking-wider mb-4 text-slate-300">
              Navigation
            </h4>
            <ul className="space-y-3">
              {footerLinks.navigation.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-manrope font-semibold text-sm uppercase tracking-wider mb-4 text-slate-300">
              Solutions
            </h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Themes */}
          <div>
            <h4 className="font-manrope font-semibold text-sm uppercase tracking-wider mb-4 text-slate-300">
              Thématiques
            </h4>
            <ul className="space-y-3">
              {footerLinks.themes.map((link) => (
                <li key={link.path}>
                  <Link 
                    to={link.path}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 text-sm">
              © {currentYear} HAAKO. Tous droits réservés.
            </p>
            <div className="flex items-center gap-4">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
