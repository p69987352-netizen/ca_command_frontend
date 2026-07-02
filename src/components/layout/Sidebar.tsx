import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Scale, 
  BellRing, 
  FileSearch, 
  Files, 
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const navItems = [
  { name: 'Command Center', icon: LayoutDashboard, path: '/dashboard' },
  { name: 'Client Registry', icon: Users, path: '/dashboard/clients' },
  { name: 'Manage Staff', icon: Users, path: '/dashboard/staff' },
  { name: 'QC Review', icon: Scale, path: '/dashboard/qc' },
  { name: 'Messages', icon: BellRing, path: '/dashboard/messages' },
  { name: 'Documents', icon: Files, path: '/dashboard/documents' },
  { name: 'Settings', icon: Settings, path: '/dashboard/settings' }
];

interface SidebarProps {
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const location = useLocation();

  return (
    <motion.aside
      initial={{ width: 280 }}
      animate={{ width: isExpanded ? 280 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className={`h-screen bg-saas-bgSecondary/95 md:bg-saas-bgSecondary/30 backdrop-blur-3xl border-r border-white/10 flex flex-col fixed md:relative inset-y-0 left-0 z-30 shrink-0 shadow-2xl shadow-black transition-transform duration-300 md:transform-none ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-between p-6">
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="font-serif font-bold text-3xl bronze-gradient-text tracking-widest truncate uppercase"
            >
              C\A
            </motion.div>
          )}
        </AnimatePresence>
        
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 rounded-full hover:bg-white/10 transition-colors text-saas-primary shrink-0"
        >
          {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2 overflow-y-auto hide-scrollbar">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/');
          const Icon = item.icon;

          return item.external ? (
            <a
              key={item.name}
              href={item.path}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileOpen?.(false)}
              className="flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group text-gray-400 hover:text-saas-primary hover:bg-white/5 hover:shadow-lg"
            >
              <Icon 
                size={22} 
                className="text-gray-400 group-hover:text-saas-primary transition-colors duration-200 shrink-0" 
              />
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </a>
          ) : (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setIsMobileOpen?.(false)}
              className={`flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-saas-primary/10 border-l-2 border-saas-primary text-saas-primary shadow-[inset_0_0_20px_rgba(249,115,22,0.1)]' 
                  : 'text-gray-400 hover:text-saas-primary hover:bg-white/5 hover:shadow-lg'
              }`}
            >
              <Icon 
                size={22} 
                className={`${isActive ? 'text-saas-primary' : 'text-gray-400 group-hover:text-saas-primary'} transition-colors duration-200 shrink-0`} 
              />
              <AnimatePresence mode="wait">
                {isExpanded && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="font-medium whitespace-nowrap"
                  >
                    {item.name}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </div>
      
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center space-x-3 px-2 py-2">
          <div className="w-10 h-10 rounded-full bronze-gradient-bg flex items-center justify-center text-saas-bg font-bold shrink-0 shadow-[0_0_15px_rgba(249,115,22,0.4)] border border-white/20">
            A
          </div>
          <AnimatePresence mode="wait">
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-saas-primary truncate">admin@porwalca.com</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.aside>
  );
};
