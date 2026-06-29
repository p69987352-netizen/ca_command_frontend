import React from 'react';
import { Search, Bell, SearchCode } from 'lucide-react';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  return (
    <header className="h-20 bg-saas-bg/30 backdrop-blur-2xl border-b border-white/10 flex items-center justify-between px-8 z-10 sticky top-0 shadow-sm">
      
      {/* Search Bar */}
      <div className="flex items-center bg-white/5 rounded-full px-4 py-2 w-96 border border-white/10 focus-within:border-saas-primary/50 focus-within:bg-white/10 focus-within:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all duration-300">
        <Search className="text-gray-400 w-5 h-5 mr-3" />
        <input 
          type="text" 
          placeholder="Global Search (Clients, Notices, PAN...)" 
          className="bg-transparent border-none outline-none text-white placeholder-gray-500 w-full text-sm"
        />
        <div className="flex items-center space-x-1 ml-2 text-xs text-gray-500 border border-white/10 rounded px-1.5 py-0.5 bg-black/20">
          <span>Ctrl</span>
          <span>K</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        
        {/* Notifications */}
        <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-6 h-6" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-saas-primary rounded-full border-2 border-saas-bg shadow-[0_0_10px_rgba(249,115,22,0.5)]"></span>
        </button>

      </div>
    </header>
  );
};
