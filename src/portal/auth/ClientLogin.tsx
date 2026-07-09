import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, LayoutGrid, Sparkles, CreditCard, MessageSquare } from 'lucide-react';

export const ClientLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleGoogleLogin = () => {
    localStorage.setItem('portal_token', 'dummy-client-token');
    localStorage.setItem('portal_user', JSON.stringify({
      name: 'Bhanu Pratap Singh',
      email: 'bhanu.pratap@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      phone: '+91 97832 71934',
      pan: 'ABCDE1234F'
    }));
    navigate('/portal');
  };

  const features = [
    { icon: Shield, text: 'Secure Document Vault', desc: 'S3 Encrypted storage for financial statements & tax returns.' },
    { icon: LayoutGrid, text: 'Live Case Tracking', desc: 'Real-time stepper indicating progress of ITR or GST filing.' },
    { icon: Sparkles, text: 'AI Tax Insights', desc: 'Instant classification and comparison of AIS/TIS data.' },
    { icon: CreditCard, text: 'Payments & Invoicing', desc: 'Seamless fee settlements with custom dynamic receipts.' },
    { icon: MessageSquare, text: 'WhatsApp Sync', desc: 'Upload documents on WhatsApp or Portal; data stays mirrored.' }
  ];

  return (
    <div className="relative min-h-screen bg-[#050816] text-[#F8FAFC] font-sans flex items-center justify-center overflow-hidden p-6">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#F5B942]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#34D399]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-white rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-7 space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center space-x-2">
              <span className="bg-[#F5B942]/20 text-[#F5B942] border border-[#F5B942]/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center">
                <Sparkles size={12} className="mr-1.5 animate-pulse" /> AI Powered Platform
              </span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400 leading-tight">
              ARJUN
            </h1>
            <p className="text-xl text-gray-400 max-w-lg leading-relaxed">
              India's Intelligent Client Portal for Tax Filing, Invoicing, and CA Command Center integration.
            </p>
          </motion.div>

          <div className="space-y-6 max-w-xl">
            {features.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="flex space-x-4 items-start p-4 rounded-xl hover:bg-white/[0.02] border border-transparent hover:border-white/[0.04] transition-all group"
              >
                <div className="bg-[#F5B942]/10 border border-[#F5B942]/20 p-2.5 rounded-lg text-[#F5B942] group-hover:scale-110 transition-transform">
                  <item.icon size={20} />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white tracking-wide">{item.text}</h3>
                  <p className="text-sm text-gray-400 mt-1 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="w-full max-w-md bg-white/[0.03] backdrop-blur-[24px] border border-white/[0.08] p-8 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold font-cinzel text-white">Access Your Workspace</h2>
                <p className="text-sm text-gray-400">Login securely to view active files and communicate with your CA.</p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="space-y-4 py-4">
                <motion.button
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGoogleLogin}
                  className="w-full flex items-center justify-center space-x-3 bg-white text-black py-3 px-4 rounded-xl font-semibold shadow-xl hover:bg-gray-100 transition-all"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#EA4335"
                      d="M12 5.04c1.62 0 3.08.56 4.22 1.64l3.15-3.15C17.45 1.74 14.93 1 12 1 7.35 1 3.4 3.65 1.5 7.5l3.75 2.9C6.15 7.15 8.85 5.04 12 5.04z"
                    />
                    <path
                      fill="#4285F4"
                      d="M23.5 12.25c0-.82-.07-1.6-.21-2.35H12v4.45h6.45c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.73-4.95 3.73-8.55z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.25 14.65c-.25-.75-.4-1.55-.4-2.4s.15-1.65.4-2.4L1.5 6.95C.55 8.9 0 11.1 0 13.5s.55 4.6 1.5 6.55l3.75-2.9z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.03.69-2.35 1.1-3.96 1.1-3.15 0-5.85-2.11-6.8-5.06L1.5 16.15C3.4 20.35 7.35 23 12 23z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </motion.button>
              </div>
            </div>

            <div className="space-y-4 mt-8">
              <div className="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center"><Shield size={12} className="mr-1" /> End-to-End Encrypted</span>
                <span>Version 1.0.0</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
};
