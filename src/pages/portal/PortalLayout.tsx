import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, FolderArchive, Sparkles, CreditCard, Bell, 
  User, LogOut, Menu, X, MessageSquare, Send, Award, FileText
} from 'lucide-react';
import { FloatingArjun } from './FloatingArjun';

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
    <div className="min-h-screen bg-[#050816] text-[#F8FAFC] font-sans flex flex-col md:flex-row overflow-x-hidden pb-16 md:pb-0">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white/[0.02] border-r border-white/[0.08] backdrop-blur-md p-6 justify-between shrink-0">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3 py-2">
            <div className="bg-[#F5B942]/10 border border-[#F5B942]/30 p-2 rounded-lg text-[#F5B942]">
              <Sparkles size={20} className="animate-pulse" />
            </div>
            <span className="text-xl font-bold font-cinzel tracking-widest text-white">ARJUN</span>
          </div>

          {/* Navigation Links */}
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

        {/* User profile footer */}
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
      <header className="md:hidden flex items-center justify-between bg-white/[0.02] border-b border-white/[0.08] backdrop-blur-md px-6 py-4 relative z-20">
        <div className="flex items-center space-x-3">
          <div className="bg-[#F5B942]/10 border border-[#F5B942]/30 p-1.5 rounded-lg text-[#F5B942]">
            <Sparkles size={16} />
          </div>
          <span className="text-lg font-bold font-cinzel tracking-widest text-white">ARJUN</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-gray-400 hover:text-white"
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
            className="md:hidden absolute top-[65px] left-0 w-full bg-[#050816]/95 border-b border-white/[0.08] backdrop-blur-lg z-30 p-6 space-y-6 shadow-2xl"
          >
            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center space-x-3 p-3 rounded-xl hover:bg-white/5 text-gray-300 hover:text-white"
                  >
                    <Icon size={18} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="h-px bg-white/[0.08]" />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img src={user.avatar} alt="avatar" className="w-8 h-8 rounded-full" />
                <div>
                  <h4 className="text-sm font-semibold text-white">{user.name}</h4>
                  <p className="text-xs text-gray-500">{user.email}</p>
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
        <header className="hidden md:flex items-center justify-between border-b border-white/[0.08] px-8 py-4 backdrop-blur-md">
          <div className="text-sm text-gray-400">
            Arjun CA Command Client Portal
          </div>
          <div className="flex items-center space-x-6">
            {/* Header Notifications Icon */}
            <Link to="/portal/notifications" className="relative p-2 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] rounded-xl text-gray-400 hover:text-white transition-all">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#EF4444] border-2 border-[#050816] rounded-full" />
            </Link>
            
            {/* Google Avatar Indicator */}
            <div className="flex items-center space-x-3 pl-4 border-l border-white/[0.08]">
              <img src={user.avatar} alt="Google Avatar" className="w-8 h-8 rounded-full border border-white/20" />
              <span className="text-sm font-medium text-white">{user.name.split(' ')[0]}</span>
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

      {/* Floating ChatGPT Assistant */}
      <FloatingArjun />

      {/* Mobile Bottom Navigation (Banking App Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#050816]/90 backdrop-blur-lg border-t border-white/[0.08] flex justify-around py-3 z-30">
        <Link to="/portal" className={`flex flex-col items-center space-y-1 ${isActive('/portal') && location.pathname === '/portal' ? 'text-[#F5B942]' : 'text-gray-500'}`}>
          <LayoutDashboard size={20} />
          <span className="text-[10px]">Home</span>
        </Link>
        <Link to="/portal/documents" className={`flex flex-col items-center space-y-1 ${isActive('/portal/documents') ? 'text-[#F5B942]' : 'text-gray-500'}`}>
          <FolderArchive size={20} />
          <span className="text-[10px]">Vault</span>
        </Link>
        <Link to="/portal/ai" className={`flex flex-col items-center space-y-1 ${isActive('/portal/ai') ? 'text-[#F5B942]' : 'text-gray-500'}`}>
          <Sparkles size={20} />
          <span className="text-[10px]">Insights</span>
        </Link>
        <Link to="/portal/payments" className={`flex flex-col items-center space-y-1 ${isActive('/portal/payments') ? 'text-[#F5B942]' : 'text-gray-500'}`}>
          <CreditCard size={20} />
          <span className="text-[10px]">Pay</span>
        </Link>
        <Link to="/portal/profile" className={`flex flex-col items-center space-y-1 ${isActive('/portal/profile') ? 'text-[#F5B942]' : 'text-gray-500'}`}>
          <User size={20} />
          <span className="text-[10px]">Profile</span>
        </Link>
      </nav>

    </div>
  );
};
