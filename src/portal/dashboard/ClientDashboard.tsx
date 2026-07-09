import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderArchive, AlertCircle, FileText, 
  Clock, ArrowUpRight, TrendingUp, Sparkles, CheckCircle2,
  X, UploadCloud, UserCheck, Calendar, ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CaseItem {
  id: string;
  title: string;
  recommended: string;
  status: 'PENDING' | 'ASSIGNED' | 'UNDER_REVIEW' | 'PAYMENT_PENDING' | 'COMPLETED';
  progress: number;
  ca: string;
  eta: string;
  completedFileUrl?: string;
}

export const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('Welcome');
  const [user, setUser] = useState<{ name: string; email: string; phone: string; pan: string; dob?: string; taxPassword?: string; city?: string } | null>(null);
  
  // Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  
  // Form details
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPan, setFormPan] = useState('');
  const [formDob, setFormDob] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [selectedService, setSelectedService] = useState('ITR Filing');

  // Specific doc upload states for Step 3
  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: { name: string; progress: number } }>({});

  const gitaQuotes = [
    "Perform your prescribed duty, for action is better than inaction.",
    "A person can rise through the efforts of one's own mind; or draw oneself down.",
    "Change is the law of the universe. You can be a millionaire, or a pauper in an instant.",
    "You have the right to work, but for the work's sake only. You have no right to the fruits of work."
  ];

  const [quote] = useState(() => gitaQuotes[Math.floor(Math.random() * gitaQuotes.length)]);

  // Case Tickets List state
  const [cases, setCases] = useState<CaseItem[]>([
    { 
      id: 'CASE-250701', 
      title: 'ITR Filing (FY 2025-26)', 
      recommended: 'ITR-2', 
      status: 'UNDER_REVIEW', 
      progress: 80, 
      ca: 'Rahul Sharma', 
      eta: 'Tomorrow' 
    },
    { 
      // Completed file
      id: 'CASE-240612', 
      title: 'GST Return (Q4 FY 2024-25)', 
      recommended: 'GSTR-1 & 3B', 
      status: 'COMPLETED', 
      progress: 100, 
      ca: 'Neha Gupta', 
      eta: 'Completed',
      completedFileUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    }
  ]);

  const metrics = [
    { title: 'Active Cases', value: cases.length.toString(), icon: FileText, color: 'text-[#F5B942]' },
    { title: 'Documents Uploaded', value: '18', icon: FolderArchive, color: 'text-[#34D399]' },
    { title: 'Pending Action', value: cases.filter(c => c.status !== 'COMPLETED').length.toString(), icon: AlertCircle, color: 'text-[#EF4444]' },
    { title: 'Estimated Refund', value: '₹14,500', icon: TrendingUp, color: 'text-[#34D399]' }
  ];

  useEffect(() => {
    const storedUser = localStorage.getItem('portal_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setFormName(parsed.name || '');
      setFormPhone(parsed.phone || '');
      setFormCity(parsed.city || 'Mumbai');
      setFormPan(parsed.pan || '');
      setFormDob(parsed.dob || '1995-08-15');
      setFormPassword(parsed.taxPassword || 'SecretPassword123');
    }

    const hrs = new Date().getHours();
    if (hrs < 12) setGreeting('Good Morning');
    else if (hrs < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const handleDocUploadSimulate = (docKey: string, fileName: string) => {
    setUploadedDocs(prev => ({
      ...prev,
      [docKey]: { name: fileName, progress: 10 }
    }));

    let progress = 10;
    const interval = setInterval(() => {
      progress += 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadedDocs(prev => ({
        ...prev,
        [docKey]: { name: fileName, progress }
      }));
    }, 150);
  };

  const handleWizardSubmit = () => {
    // Save updated profile info back to localStorage
    if (user) {
      const updatedUser = {
        ...user,
        dob: formDob,
        taxPassword: formPassword,
        city: formCity
      };
      localStorage.setItem('portal_user', JSON.stringify(updatedUser));
    }

    // Create a new Case / Ticket
    const newCaseId = `CASE-${Math.floor(100000 + Math.random() * 900000)}`;
    const newCaseItem: CaseItem = {
      id: newCaseId,
      title: `${selectedService} (${new Date().getFullYear()}-${(new Date().getFullYear()+1).toString().slice(2)})`,
      recommended: selectedService === 'ITR Filing' ? 'ITR-2' : 'GST Regular',
      status: 'PENDING',
      progress: 10,
      ca: 'CA Allocating...',
      eta: '3-4 Days'
    };

    setCases(prev => [newCaseItem, ...prev]);

    // Close and alert user
    setIsWizardOpen(false);
    setWizardStep(1);
    setUploadedDocs({});

    alert(
      `🚩 Jai Shree Ram!\n\nCase request registered successfully for ${selectedService}!\n\nWhatsApp Message sent to +919783271934: \n"Apki ticket ${newCaseId} ban gyi h hamare portal ke use ke liye. Thank you!\n\n📖 Gita Shlok: Perform your prescribed duty, for action is better than inaction."`
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 text-[#F8FAFC]">
      
      {/* Header and Welcome */}
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
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWizardOpen(true)}
            className="bg-[#F5B942] hover:bg-[#F5B942]/80 text-black px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center transition-all"
          >
            ➕ Request New Service
          </button>
          <div className="flex items-center text-xs font-semibold bg-white/[0.03] border border-white/[0.08] px-4 py-2.5 rounded-xl text-gray-400">
            Assessment Year: <span className="text-[#F5B942] ml-1.5 font-bold">AY 2026-27</span>
          </div>
        </div>
      </div>

      {/* Grid of Metrics and Tax Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Metric Cards */}
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

        {/* Tax Health Score Card */}
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

      {/* Cases List Overview (Completed vs Pending File Status) */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-white tracking-wide flex items-center">
          <Clock size={16} className="mr-2 text-[#F5B942]" /> Case Status & File Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cases.map((c) => (
            <div 
              key={c.id} 
              className="bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.12] p-6 rounded-2xl transition-all shadow-lg space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white tracking-wide">{c.title}</h3>
                  <span className="text-xs font-mono text-gray-500 mt-1 block">{c.id}</span>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                  c.status === 'COMPLETED' 
                    ? 'bg-[#34D399]/15 text-[#34D399]' 
                    : 'bg-[#F5B942]/15 text-[#F5B942]'
                }`}>
                  {c.status}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span>Processing Progress</span>
                  <span className="font-bold text-white">{c.progress}%</span>
                </div>
                <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${c.progress}%` }}
                    transition={{ duration: 1 }}
                    className={`h-full ${
                      c.status === 'COMPLETED' ? 'bg-[#34D399]' : 'bg-gradient-to-r from-[#F5B942] to-[#B45309]'
                    }`}
                  />
                </div>
              </div>

              {/* Action and CA Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-white/[0.06] text-xs">
                <div>
                  <span className="text-gray-500 block mb-1">Assigned CA</span>
                  <span className="font-medium text-white">{c.ca}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1">ETA</span>
                  <span className="font-medium text-white">{c.eta}</span>
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-end">
                  {c.status === 'COMPLETED' && c.completedFileUrl ? (
                    <a 
                      href={c.completedFileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-1 bg-[#34D399]/10 border border-[#34D399]/20 hover:bg-[#34D399]/20 py-2 px-3 rounded-xl font-bold uppercase tracking-wider transition-all text-[#34D399] text-[10px]"
                    >
                      Download Receipt
                    </a>
                  ) : (
                    <button 
                      onClick={() => navigate('/portal/documents')}
                      className="w-full flex items-center justify-center bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] py-2 px-3 rounded-xl font-semibold transition-all text-white text-[10px]"
                    >
                      Upload docs
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* SERVICE REQUEST WIZARD DIALOG */}
      <AnimatePresence>
        {isWizardOpen && (
          <div className="fixed inset-0 bg-[#050816]/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0B0F19] border border-white/[0.08] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 bg-white/[0.02] border-b border-white/[0.08] flex items-center justify-between">
                <h3 className="text-lg font-bold text-white tracking-wide">Request New Service</h3>
                <button 
                  onClick={() => { setIsWizardOpen(false); setWizardStep(1); }}
                  className="text-gray-400 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Wizard Steps indicator */}
              <div className="flex justify-around bg-white/[0.01] border-b border-white/[0.04] py-3 text-xs text-gray-500">
                <span className={wizardStep === 1 ? 'text-[#F5B942] font-bold' : ''}>1. Profile Details</span>
                <span className={wizardStep === 2 ? 'text-[#F5B942] font-bold' : ''}>2. Select Service</span>
                <span className={wizardStep === 3 ? 'text-[#F5B942] font-bold' : ''}>3. Upload Documents</span>
              </div>

              {/* Body */}
              <div className="p-6 space-y-6">
                
                {/* STEP 1: FILL DETAILS */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-500 block font-medium">Full Name</label>
                        <input 
                          type="text" 
                          value={formName} 
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#F5B942]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-500 block font-medium">Registered Phone</label>
                        <input 
                          type="text" 
                          value={formPhone} 
                          onChange={(e) => setFormPhone(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#F5B942]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-500 block font-medium">City</label>
                        <input 
                          type="text" 
                          value={formCity} 
                          onChange={(e) => setFormCity(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#F5B942]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-500 block font-medium">PAN Number</label>
                        <input 
                          type="text" 
                          value={formPan} 
                          onChange={(e) => setFormPan(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white font-mono uppercase focus:border-[#F5B942]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-500 block font-medium">Date of Birth (DOB)</label>
                        <input 
                          type="date" 
                          value={formDob} 
                          onChange={(e) => setFormDob(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#F5B942]/50 outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-gray-500 block font-medium">IT Portal Password</label>
                        <input 
                          type="password" 
                          value={formPassword} 
                          onChange={(e) => setFormPassword(e.target.value)}
                          className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:border-[#F5B942]/50 outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setWizardStep(2)}
                      className="w-full bg-[#F5B942] hover:bg-[#F5B942]/80 text-black py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
                    >
                      Next: Select Service
                    </button>
                  </div>
                )}

                {/* STEP 2: SELECT SERVICE */}
                {wizardStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs text-gray-500 block font-semibold uppercase tracking-wider">Choose Filing Service</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['ITR Filing', 'GST Return', 'Tax Notice Response', 'Other Custom Request'].map((s) => (
                          <button
                            key={s}
                            onClick={() => setSelectedService(s)}
                            className={`p-4 border rounded-xl text-left transition-all ${
                              selectedService === s 
                                ? 'bg-[#F5B942]/10 border-[#F5B942] text-[#F5B942]' 
                                : 'bg-white/[0.02] border-white/[0.08] text-gray-300 hover:bg-white/[0.04]'
                            }`}
                          >
                            <h4 className="text-sm font-semibold">{s}</h4>
                            <p className="text-[10px] text-gray-500 mt-1">Request custom registration ticket</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between gap-4 pt-4">
                      <button
                        onClick={() => setWizardStep(1)}
                        className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white py-2.5 rounded-xl text-xs font-bold uppercase"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => setWizardStep(3)}
                        className="flex-1 bg-[#F5B942] hover:bg-[#F5B942]/80 text-black py-2.5 rounded-xl text-xs font-bold uppercase"
                      >
                        Next: Upload Suggested Docs
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: UPLOAD SUGGESTED DOCUMENTS */}
                {wizardStep === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="p-3 bg-[#F5B942]/10 border border-[#F5B942]/20 rounded-xl">
                        <span className="text-xs text-[#F5B942] font-semibold">
                          Please upload these documents to begin <strong>{selectedService}</strong>:
                        </span>
                      </div>

                      {/* Explicit slot list */}
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                        {[
                          { key: 'ais', name: 'Annual Information Statement (AIS)' },
                          { key: 'tis', name: 'Taxpayer Information Summary (TIS)' },
                          { key: 'tds', name: 'Form 16 / TDS Certificate' },
                          { key: 'aadhaar', name: 'Aadhaar Card copy' },
                          { key: 'pan', name: 'PAN Card copy' },
                          { key: 'bank', name: 'Bank Statement of 1 Year (< 200KB)' }
                        ].map((doc) => (
                          <div key={doc.key} className="flex items-center justify-between bg-white/[0.02] border border-white/[0.08] p-3 rounded-xl text-xs">
                            <span className="text-gray-300">{doc.name}</span>
                            
                            <div>
                              {uploadedDocs[doc.key] ? (
                                <div className="flex items-center space-x-2 text-xs">
                                  {uploadedDocs[doc.key].progress < 100 ? (
                                    <span className="text-[#F5B942] font-mono font-bold animate-pulse">{uploadedDocs[doc.key].progress}%</span>
                                  ) : (
                                    <span className="text-[#34D399] font-bold flex items-center"><CheckCircle2 size={12} className="mr-1" /> Uploaded</span>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleDocUploadSimulate(doc.key, `${doc.key}_document.pdf`)}
                                  className="px-2.5 py-1.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] rounded-lg text-white font-bold uppercase tracking-wider text-[10px]"
                                >
                                  Upload
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between gap-4 pt-4">
                      <button
                        onClick={() => setWizardStep(2)}
                        className="flex-1 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white py-2.5 rounded-xl text-xs font-bold uppercase"
                      >
                        Back
                      </button>
                      <button
                        onClick={handleWizardSubmit}
                        className="flex-1 bg-[#F5B942] hover:bg-[#F5B942]/80 text-black py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider"
                      >
                        Submit Request
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
