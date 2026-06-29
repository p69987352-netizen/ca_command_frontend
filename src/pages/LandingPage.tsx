import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Shield, Target, Zap, ChevronRight } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-saas-bg text-white relative overflow-hidden flex flex-col">
      {/* Background Animated Elements */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-saas-primary/10 blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-saas-bronze/10 blur-[150px] mix-blend-screen" />
        
        {/* Animated Particles Simulation */}
        <motion.div 
          animate={{ 
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-saas-text/20 via-transparent to-transparent bg-[length:100px_100px]"
        />
      </div>

      <header className="relative z-10 px-8 py-6 flex justify-between items-center border-b border-white/10 bg-saas-bgSecondary/30 backdrop-blur-xl shadow-lg">
        <div className="font-serif font-bold text-3xl tracking-widest bronze-gradient-text uppercase">
          Porwal CA <span className="text-white text-lg font-sans tracking-normal opacity-70">| Arjuna Command</span>
        </div>
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#intelligence" className="text-gray-300 hover:text-white transition-colors">Krishna Intelligence</a>
          <a href="#security" className="text-gray-300 hover:text-white transition-colors">Security</a>
        </nav>
      </header>

      <main className="flex-1 relative z-10 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center pt-20 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center px-6 py-2 rounded-full border border-saas-primary/40 bg-saas-primary/10 text-saas-primary text-sm font-medium mb-8 shadow-[0_0_20px_rgba(249,115,22,0.3)] backdrop-blur-sm"
        >
          <Zap size={16} className="mr-2" />
          धर्मेण करं गृह्णीयात् (Collect Taxes with Dharma)
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6 max-w-5xl leading-tight"
        >
          Where <span className="bronze-gradient-text">Arjuna's Focus</span> Meets <span className="bronze-gradient-text">Krishna's Intellect</span>.
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl font-light leading-relaxed"
        >
          "Karmanye Vadhikaraste Ma Phaleshu Kadachana."
          <br/>
          <span className="text-lg opacity-70 mt-4 block">
            Elevate your CA firm with an enterprise-grade platform that unifies compliance, strategy, and artificial intelligence into a singular, infallible interface.
          </span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Link 
            to="/dashboard"
            className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold text-white bronze-gradient-bg rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] uppercase tracking-wider shadow-2xl"
          >
            <span className="relative z-10 flex items-center">
              Blow the Shankha (Enter)
              <ChevronRight className="ml-3 group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 h-full w-full bg-white/20 scale-x-0 group-hover:scale-x-100 transform origin-left transition-transform duration-300 ease-out" />
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full text-left"
        >
          <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-white/10 hover:border-saas-primary/50 transition-all hover:-translate-y-2">
            <Target className="w-12 h-12 text-saas-primary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-3 text-white">Arjuna's Arrow</h3>
            <p className="text-gray-400 text-base leading-relaxed">Precision targeting of compliances. Manage notices, appeals, and GST filings with absolute clarity and unwavering focus.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-white/10 hover:border-saas-primary/50 transition-all hover:-translate-y-2">
            <Zap className="w-12 h-12 text-saas-primary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-3 text-white">Krishna Intelligence</h3>
            <p className="text-gray-400 text-base leading-relaxed">Divine foresight for tax planning. Predictive AI that identifies risks and formulates strategic responses instantly.</p>
          </div>
          <div className="p-8 rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] hover:bg-white/10 hover:border-saas-primary/50 transition-all hover:-translate-y-2">
            <Shield className="w-12 h-12 text-saas-primary mb-6" />
            <h3 className="text-2xl font-serif font-bold mb-3 text-white">Bhishma's Shield</h3>
            <p className="text-gray-400 text-base leading-relaxed">Unbreakable security and compliance locking. Enterprise-grade encryption protecting your most sensitive client data.</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
