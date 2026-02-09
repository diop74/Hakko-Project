import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  MessageSquare, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { authAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_sustainable-insights/artifacts/y08gbl8u_20251015_1623_Haako%20Logo%20Design_simple_compose_01k7mavmrke71vr0nt45t3fban.png";

const navItems = [
  { name: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
  { name: 'Articles', path: '/admin/articles', icon: FileText },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
];

export default function AdminLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      toast.success('Déconnexion réussie');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/login');
    }
  };

  const isActive = (path) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-50 flex items-center justify-between px-4">
        <Link to="/admin" className="flex items-center gap-2">
          <img src={LOGO_URL} alt="HAAKO" className="h-8 w-auto" />
          <span className="font-manrope font-bold text-slate-900">Admin</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 lg:h-20 flex items-center px-6 border-b border-slate-100">
            <Link to="/admin" className="flex items-center gap-3">
              <img src={LOGO_URL} alt="HAAKO" className="h-10 w-auto" />
              <div>
                <span className="font-manrope font-bold text-slate-900 block">HAAKO</span>
                <span className="text-xs text-slate-500">Administration</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-haako-50 text-haako-900'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                data-testid={`admin-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-dm-sans font-medium">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* User & Logout */}
          <div className="p-4 border-t border-slate-100">
            {user && (
              <div className="flex items-center gap-3 mb-4 px-2">
                {user.picture ? (
                  <img 
                    src={user.picture} 
                    alt={user.name} 
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-haako-100 flex items-center justify-center">
                    <span className="font-medium text-haako-900">
                      {user.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-dm-sans font-medium text-slate-900 truncate text-sm">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            )}
            <Button
              variant="outline"
              onClick={handleLogout}
              className="w-full justify-start gap-2 text-slate-600 hover:text-red-600 hover:border-red-200 hover:bg-red-50"
              data-testid="admin-logout"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>

          {/* Back to site */}
          <div className="p-4 border-t border-slate-100">
            <Link
              to="/"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-haako-900 transition-colors"
            >
              <ChevronRight className="h-4 w-4 rotate-180" />
              Retour au site
            </Link>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}
