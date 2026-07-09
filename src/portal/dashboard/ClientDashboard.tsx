import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FolderArchive, AlertCircle, FileText, 
  Clock, ArrowUpRight, TrendingUp, Sparkles
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ClientDashboard: React.FC = () => {
  const [greeting, setGreeting] = useState('Welcome');
  const [user, setUser] = useState<{ name: string } | null>(null);

  const gitaQuotes = [
    "Perform your prescribed duty, for action is better than inaction.",
    "A person can rise through the efforts of one's own mind; or draw oneself down.",
    "Change is the law of the universe. You can be a millionaire, or a pauper in an instant.",
    "You have the right to work, but for the work's sake only. You have no right to the fruits of work."
  ];

  const [quote] = useState(() => gitaQuotes[Math.floor(Math.random() * gitaQuotes.length)]);

  useEffect(() => {
    const storedUser = localStorage.getItem('portal_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting('Good Morning');
    else if (hrs < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const metrics = [
    { title: 'Active Cases', value: '2', icon: FileText, color: 'text-[#F5B942]' },
    { title: 'Documents Uploaded', value: '18', icon: FolderArchive, color: 'text-[#34D399]' },
    { title: 'Pending Action', value: '1', icon: AlertCircle, color: 'text-[#EF4444]' },
    { title: 'Estimated Refund', value: '₹14,500', icon: TrendingUp, color: 'text-[#34D399]' }
  ];

  const timeline = [
    { label: 'PAN Uploaded', status: 'success', time: 'Yesterday' },
    { label: 'AIS Uploaded', status: 'success', time: 'Yesterday' },
    { label: 'AI Review Completed', status: 'success', time: 'Today' },
    { label: 'CA Assigned', status: 'success', time: 'Today' },
    { label: 'Payment Pending', status: 'pending', time: 'Awaiting Settlement' }
  ];

  const activeCase = {
    title: 'ITR Filing',
    id: 'CASE-250701',
    progress: 80,
    recommended: 'ITR-2',
    ca: 'Rahul Sharma',
    eta: 'Tomorrow'
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-[#34D399]/10 text-[#34D399] border border-[#34D399]/20 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase flex items-center">
              🚩 Jai Shree Ram
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {greeting}, {user?.name || 'Client'}
          </h1>
          <p className="text-sm text-gray-400 italic">
            📖 "{quote}"
          </p>
        </div>
        <div className="flex items-center text-xs font-semibold bg-white/[0.03] border border-white/[0.08] px-4 py-2 rounded-xl text-gray-400">
          Current Assessment Year: <span className="text-[#F5B942] ml-1.5 font-bold">AY 2026-27</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {metrics.map((card, idx) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.12] p-6 rounded-2xl transition-all shadow-lg flex items-center justify-between"
              >
                <div className="space-y-2">
                  <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{card.title}</span>
                  <h3 className="text-2xl font-bold text-white">{card.value}</h3>
                </div>
                <div className={`p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl ${card.color}`}>
                  <Icon size={24} />
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.03] border border-white/[0.08] p-6 rounded-2xl shadow-xl flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Tax Health Score</span>
                <span className="text-xs bg-[#34D399]/15 text-[#34D399] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">Excellent</span>
              </div>
              
              <div className="flex items-center justify-center py-6">
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke="#34D399" strokeWidth="6" fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * 94) / 100}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-bold text-white font-cinzel">94</span>
                    <span className="text-xs text-gray-500">/100</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-white/[0.06] pt-4 text-xs">
              <div className="flex items-center text-gray-300">
                <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full mr-2" />
                <span>Documents Complete</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full mr-2" />
                <span>No Tax Notices Out</span>
              </div>
              <div className="flex items-center text-gray-300">
                <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full mr-2" />
                <span>AIS & TIS Matched</span>
              </div>
              <div className="flex items-center text-gray-500">
                <span className="w-1.5 h-1.5 bg-[#F5B942] rounded-full mr-2" />
                <span>Form 16 Upload Pending</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-lg font-semibold text-white tracking-wide flex items-center">
            <Clock size={16} className="mr-2 text-[#F5B942]" /> Active Case Tracker
          </h2>
          <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl shadow-lg space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-bold text-white tracking-wide">{activeCase.title}</h3>
                <span className="text-xs font-mono text-gray-500 mt-1 block">{activeCase.id}</span>
              </div>
              <span className="text-xs bg-[#F5B942]/15 text-[#F5B942] border border-[#F5B942]/20 px-2.5 py-1 rounded-full font-bold">
                {activeCase.recommended} Recommended
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Filing Progress</span>
                <span className="font-bold text-white">{activeCase.progress}%</span>
              </div>
              <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${activeCase.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-[#F5B942] to-[#B45309]" 
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-white/[0.06] text-xs">
              <div>
                <span className="text-gray-500 block mb-1">Assigned CA</span>
                <div className="flex items-center space-x-1.5">
                  <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
                    RS
                  </div>
                  <span className="font-medium text-white">{activeCase.ca}</span>
                </div>
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Expected Completion</span>
                <span className="font-semibold text-white flex items-center">
                  <Clock size={12} className="mr-1 text-[#34D399]" /> {activeCase.eta}
                </span>
              </div>
              <div className="col-span-2 sm:col-span-1 flex items-end">
                <Link
                  to="/portal/ai"
                  className="w-full flex items-center justify-center space-x-1 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] py-2 px-3 rounded-xl font-semibold transition-all text-white text-[11px]"
                >
                  <span>View Details</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-lg font-semibold text-white tracking-wide flex items-center">
            <TrendingUp size={16} className="mr-2 text-[#34D399]" /> Activity Flow
          </h2>
          <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl shadow-lg space-y-6">
            <div className="relative pl-6 space-y-6 border-l border-white/[0.06]">
              {timeline.map((act, idx) => (
                <div key={idx} className="relative">
                  <span className={`absolute left-[-31px] top-1.5 w-2.5 h-2.5 rounded-full ring-4 ring-[#050816] ${
                    act.status === 'success' ? 'bg-[#34D399]' : 'bg-[#F5B942]'
                  }`} />
                  
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-white">{act.label}</h4>
                    <span className="text-[10px] text-gray-500 block">{act.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
