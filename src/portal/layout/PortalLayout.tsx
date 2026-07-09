import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FolderArchive, Sparkles, CreditCard, Bell, 
  User, LogOut, Menu, X
} from 'lucide-react';
import { FloatingArjun } from '../chat/FloatingArjun';

interface PortalLayoutProps {
  children?: React.ReactNode;
}

export const PortalLayout: React.FC<PortalLayoutProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string; avatar: string; phone: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('portal_user');
    if (!storedUser) {
      navigate('/portal/login');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const navigation = [
    { name: 'Dashboard', path: '/portal', icon: LayoutDashboard },
    { name: 'Document Vault', path: '/portal/documents', icon: FolderArchive },
    { name: 'AI Tax Insights', path: '/portal/ai', icon: Sparkles },
    { name: 'Payments', path: '/portal/payments', icon: CreditCard },
    { name: 'Notifications', path: '/portal/notifications', icon: Bell },
    { name: 'Profile', path: '/portal/profile', icon: User }
  ];

  const handleLogout = () => {
    localStorage.removeItem('portal_token');
    localStorage.removeItem('portal_user');
    navigate('/portal/login');
  };

  const isActive = (path: string) => {
    if (path === '/portal') {
      return location.pathname === '/portal';
    }
    return location.pathname.startsWith(path);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col md:flex-row overflow-x-hidden pb-16 md:pb-0">
      
      {/* Sidebar - Desktop (Retaining premium dark contrast for executive feel) */}
      <aside className="hidden md:flex flex-col w-64 bg-[#0B0F19] border-r border-slate-800 p-6 justify-between shrink-0 text-[#F8FAFC]">
        <div className="space-y-8">
          <div className="flex items-center space-x-3 py-2">
            <div className="bg-[#F5B942]/10 border border-[#F5B942]/30 p-2 rounded-lg text-[#F5B942]">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <span className="text-xl font-bold font-cinzel tracking-widest text-white">ARJUN</span>
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                    active 
                      ? 'bg-white/[0.05] text-[#F5B942] border border-white/[0.08]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.01]'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-[#F5B942]' : 'text-gray-400 group-hover:text-white'} />
                  <span>{item.name}</span>
                  {active && (
                    <motion.div 
                      layoutId="active-nav-indicator" 
                      className="absolute right-3 w-1.5 h-1.5 bg-[#F5B942] rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-white/[0.08]">
          <div className="flex items-center space-x-3">
            <img src={user.avatar} alt="avatar" className="w-10 h-10 rounded-full border border-white/20" />
            <div className="truncate">
              <h4 className="text-sm font-semibold text-white truncate">{user.name}</h4>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 bg-white/[0.02] border border-white/[0.08] hover:bg-[#EF4444]/10 hover:border-[#EF4444]/20 hover:text-[#EF4444] py-2 rounded-xl text-xs font-semibold transition-all"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Header - Mobile */}
      <header className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-6 py-4 relative z-20">
        <div className="flex items-center space-x-3">
          <div className="bg-[#F5B942]/10 border border-[#F5B942]/30 p-1.5 rounded-lg text-[#B45309]">
            <Sparkles size={16} />
          </div>
          <span className="text-lg font-bold font-cinzel tracking-widest text-slate-800">ARJUN</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-slate-500 hover:text-slate-800"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden absolute top-[65px] left-0 w-full bg-white border-b border-slate-200 z-30 p-6 space-y-6 shadow-xl"
          >
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-slate-50 text-slate-600 hover:text-slate-900 font-medium"
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="h-px bg-slate-100" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                <div>
                  <h4 className="text-sm font-semibold text-slate-800">{user.name}</h4>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl text-[#EF4444]"
              >
                <LogOut size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0 relative">
        {/* Desktop Header */}
        <header className="hidden md:flex items-center justify-between border-b border-slate-200 px-8 py-4 bg-white shadow-sm">
          <div className="text-sm text-slate-500 font-medium">
            Arjun CA Command Client Portal
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/portal/notifications" className="relative p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-800 transition-all">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#EF4444] rounded-full" />
            </Link>
            
            <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
              <img src={user.avatar} alt="Google Avatar" className="w-8 h-8 rounded-full border border-slate-200" />
              <span className="text-sm font-semibold text-slate-800">{user.name.split(' ')[0]}</span>
            </div>
          </div>
        </header>

        {/* Content Render Outlet */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <FloatingArjun />

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-slate-200 flex justify-around py-3 z-30 shadow-[0_-4px_12px_rgba(0,0,0,0.04)]">
        <Link to="/portal" className={`flex flex-col items-center space-y-1 ${isActive('/portal') && location.pathname === '/portal' ? 'text-[#F5B942]' : 'text-slate-400'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link to="/portal/documents" className={`flex flex-col items-center space-y-1 ${isActive('/portal/documents') ? 'text-[#F5B942]' : 'text-slate-400'}`}>
          <FolderArchive size={20} />
          <span className="text-[10px] font-medium">Vault</span>
        </Link>
        <Link to="/portal/ai" className={`flex flex-col items-center space-y-1 ${isActive('/portal/ai') ? 'text-[#F5B942]' : 'text-slate-400'}`}>
          <Sparkles size={20} />
          <span className="text-[10px] font-medium">Insights</span>
        </Link>
        <Link to="/portal/payments" className={`flex flex-col items-center space-y-1 ${isActive('/portal/payments') ? 'text-[#F5B942]' : 'text-slate-400'}`}>
          <CreditCard size={20} />
          <span className="text-[10px] font-medium">Pay</span>
        </Link>
        <Link to="/portal/profile" className={`flex flex-col items-center space-y-1 ${isActive('/portal/profile') ? 'text-[#F5B942]' : 'text-slate-400'}`}>
          <User size={20} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </nav>

    </div>
  );
};
