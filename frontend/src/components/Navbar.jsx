import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_sustainable-insights/artifacts/y08gbl8u_20251015_1623_Haako%20Logo%20Design_simple_compose_01k7mavmrke71vr0nt45t3fban.png";

const navLinks = [
  { name: 'Accueil', path: '/' },
  { name: 'À propos', path: '/about' },
  { 
    name: 'Solutions', 
    path: '/solutions',
    children: [
      { name: 'Recherche & Analyse', path: '/solutions/recherche-analyse' },
      { name: 'Communication Stratégique', path: '/solutions/communication-strategique' },
    ]
  },
  { name: 'Blog', path: '/blog' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm' 
          : 'bg-white/70 backdrop-blur-sm'
      }`}
    >
      <nav className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3"
            data-testid="logo-link"
          >
            <img 
              src={LOGO_URL} 
              alt="HAAKO" 
              className="h-14 md:h-16 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              link.children ? (
                <DropdownMenu key={link.name}>
                  <DropdownMenuTrigger 
                    className={`flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors rounded-lg
                      ${isActive(link.path) 
                        ? 'text-haako-900 bg-haako-50' 
                        : 'text-slate-700 hover:text-haako-900 hover:bg-slate-50'
                      }`}
                    data-testid={`nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {link.name}
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56">
                    {link.children.map((child) => (
                      <DropdownMenuItem key={child.path} asChild>
                        <Link 
                          to={child.path}
                          className="w-full cursor-pointer"
                          data-testid={`nav-dropdown-${child.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-2 text-sm font-medium transition-colors rounded-lg
                    ${isActive(link.path) 
                      ? 'text-haako-900 bg-haako-50' 
                      : 'text-slate-700 hover:text-haako-900 hover:bg-slate-50'
                    }`}
                  data-testid={`nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {link.name}
                </Link>
              )
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center rounded-lg bg-haako-900 px-6 py-2.5 text-sm font-medium text-white transition-all hover:bg-haako-800 focus:outline-none focus:ring-2 focus:ring-haako-900 focus:ring-offset-2"
              data-testid="nav-cta-contact"
            >
              Nous contacter
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            aria-label="Toggle menu"
            data-testid="mobile-menu-toggle"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-slate-100"
            >
              <div className="py-4 space-y-1">
                {navLinks.map((link) => (
                  link.children ? (
                    <div key={link.name} className="space-y-1">
                      <div className="px-4 py-2 text-sm font-semibold text-slate-500 uppercase tracking-wide">
                        {link.name}
                      </div>
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          to={child.path}
                          className={`block pl-8 pr-4 py-2 text-sm font-medium transition-colors
                            ${isActive(child.path) 
                              ? 'text-haako-900 bg-haako-50' 
                              : 'text-slate-700 hover:text-haako-900 hover:bg-slate-50'
                            }`}
                          data-testid={`mobile-nav-${child.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`block px-4 py-2 text-sm font-medium transition-colors
                        ${isActive(link.path) 
                          ? 'text-haako-900 bg-haako-50' 
                          : 'text-slate-700 hover:text-haako-900 hover:bg-slate-50'
                        }`}
                      data-testid={`mobile-nav-${link.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      {link.name}
                    </Link>
                  )
                ))}
                <div className="pt-4 px-4">
                  <Link
                    to="/contact"
                    className="block w-full text-center rounded-lg bg-haako-900 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-haako-800"
                    data-testid="mobile-nav-cta"
                  >
                    Nous contacter
                  </Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
