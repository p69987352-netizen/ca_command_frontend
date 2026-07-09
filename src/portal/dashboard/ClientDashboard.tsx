import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderArchive, AlertCircle, FileText, 
  Clock, ArrowUpRight, TrendingUp, Sparkles, CheckCircle2,
  X, UploadCloud
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
  
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPan, setFormPan] = useState('');
  const [formDob, setFormDob] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [selectedService, setSelectedService] = useState('ITR Filing');

  const [uploadedDocs, setUploadedDocs] = useState<{ [key: string]: { name: string; progress: number } }>({});

  const gitaQuotes = [
    "Perform your prescribed duty, for action is better than inaction.",
    "A person can rise through the efforts of one's own mind; or draw oneself down.",
    "Change is the law of the universe. You can be a millionaire, or a pauper in an instant.",
    "You have the right to work, but for the work's sake only. You have no right to the fruits of work."
  ];

  const [quote] = useState(() => gitaQuotes[Math.floor(Math.random() * gitaQuotes.length)]);

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
    { title: 'Active Cases', value: cases.length.toString(), icon: FileText, color: 'text-[#B45309] bg-[#F5B942]/10 border border-[#F5B942]/20' },
    { title: 'Documents Uploaded', value: '18', icon: FolderArchive, color: 'text-[#22C55E] bg-[#34D399]/10 border border-[#34D399]/20' },
    { title: 'Pending Action', value: cases.filter(c => c.status !== 'COMPLETED').length.toString(), icon: AlertCircle, color: 'text-[#EF4444] bg-[#EF4444]/10 border border-[#EF4444]/20' },
    { title: 'Estimated Refund', value: '₹14,500', icon: TrendingUp, color: 'text-[#22C55E] bg-[#34D399]/10 border border-[#34D399]/20' }
  ];

  const timeline = [
    { label: 'PAN Uploaded', status: 'success', time: 'Yesterday' },
    { label: 'AIS Uploaded', status: 'success', time: 'Yesterday' },
    { label: 'AI Review Completed', status: 'success', time: 'Today' },
    { label: 'CA Assigned', status: 'success', time: 'Today' },
    { label: 'Payment Pending', status: 'pending', time: 'Awaiting Settlement' }
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
    if (user) {
      const updatedUser = {
        ...user,
        dob: formDob,
        taxPassword: formPassword,
        city: formCity
      };
      localStorage.setItem('portal_user', JSON.stringify(updatedUser));
    }

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
    setIsWizardOpen(false);
    setWizardStep(1);
    setUploadedDocs({});

    alert(
      `🚩 Jai Shree Ram!\n\nCase request registered successfully for ${selectedService}!\n\nWhatsApp Message sent to +919783271934: \n"Apki ticket ${newCaseId} ban gyi h hamare portal ke use ke liye. Thank you!\n\n📖 Gita Shlok: Perform your prescribed duty, for action is better than inaction."`
    );
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 text-slate-800">
      
      {/* Header and Welcome */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="bg-[#34D399]/20 text-[#166534] border border-[#34D399]/30 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase flex items-center">
              🚩 Jai Shree Ram
            </span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            {greeting}, {user?.name || 'Client'}
          </h1>
          <p className="text-sm text-slate-500 italic">
            📖 "{quote}"
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWizardOpen(true)}
            className="bg-[#F5B942] hover:bg-[#F5B942]/80 text-black px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md flex items-center transition-all"
          >
            ➕ Request New Service
          </button>
          <div className="flex items-center text-xs font-semibold bg-white border border-slate-200 px-4 py-2.5 rounded-xl text-slate-500">
            Assessment Year: <span className="text-[#B45309] ml-1.5 font-bold">AY 2026-27</span>
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
                className="bg-white border border-slate-200/80 p-6 rounded-2xl hover:border-slate-300 transition-all shadow-sm flex items-center justify-between"
              >
                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{card.title}</span>
                  <h3 className="text-2xl font-bold text-slate-900">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${card.color}`}>
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
            className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm flex flex-col justify-between h-full"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Tax Health Score</span>
                <span className="text-xs bg-[#34D399]/20 text-[#166534] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide">Excellent</span>
              </div>
              
              <div className="flex items-center justify-center py-6">
                <div className="relative flex items-center justify-center">
                  <svg className="w-24 h-24 transform -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="rgba(15,23,42,0.05)" strokeWidth="6" fill="transparent" />
                    <circle cx="48" cy="48" r="40" stroke="#34D399" strokeWidth="6" fill="transparent"
                      strokeDasharray={251.2}
                      strokeDashoffset={251.2 - (251.2 * 94) / 100}
                    />
                  </svg>
                  <div className="absolute text-center">
                    <span className="text-2xl font-bold text-slate-950 font-cinzel">94</span>
                    <span className="text-xs text-slate-500">/100</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 border-t border-slate-100 pt-4 text-xs">
              <div className="flex items-center text-slate-600">
                <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full mr-2" />
                <span>Documents Complete</span>
              </div>
              <div className="flex items-center text-slate-600">
                <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full mr-2" />
                <span>No Tax Notices Out</span>
              </div>
              <div className="flex items-center text-slate-600">
                <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full mr-2" />
                <span>AIS & TIS Matched</span>
              </div>
              <div className="flex items-center text-slate-400">
                <span className="w-1.5 h-1.5 bg-[#F5B942] rounded-full mr-2" />
                <span>Form 16 Upload Pending</span>
              </div>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Cases List Overview */}
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900 tracking-wide flex items-center">
          <Clock size={16} className="mr-2 text-[#B45309]" /> Case Status & File Overview
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {cases.map((c) => (
            <div 
              key={c.id} 
              className="bg-white border border-slate-200/80 p-6 rounded-2xl hover:border-slate-300 transition-all shadow-sm space-y-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-wide">{c.title}</h3>
                  <span className="text-xs font-mono text-slate-500 mt-1 block">{c.id}</span>
                </div>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                  c.status === 'COMPLETED' 
                    ? 'bg-[#34D399]/20 text-[#166534]' 
                    : 'bg-[#F5B942]/20 text-[#B45309]'
                }`}>
                  {c.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>Processing Progress</span>
                  <span className="font-bold text-slate-900">{c.progress}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200/60">
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

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-4 border-t border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block mb-1">Assigned CA</span>
                  <span className="font-semibold text-slate-800">{c.ca}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-1">ETA</span>
                  <span className="font-semibold text-slate-800">{c.eta}</span>
                </div>
                <div className="col-span-2 sm:col-span-1 flex items-end">
                  {c.status === 'COMPLETED' && c.completedFileUrl ? (
                    <a 
                      href={c.completedFileUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center space-x-1 bg-[#34D399]/10 border border-[#34D399]/20 hover:bg-[#34D399]/20 py-2 px-3 rounded-xl font-bold uppercase tracking-wider transition-all text-[#166534] text-[10px]"
                    >
                      Download Receipt
                    </a>
                  ) : (
                    <button 
                      onClick={() => navigate('/portal/documents')}
                      className="w-full flex items-center justify-center bg-slate-50 border border-slate-200 hover:bg-slate-100 py-2 px-3 rounded-xl font-semibold transition-all text-slate-800 text-[10px]"
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
          <div className="fixed inset-0 bg-[#050816]/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900 tracking-wide">Request New Service</h3>
                <button 
                  onClick={() => { setIsWizardOpen(false); setWizardStep(1); }}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex justify-around bg-slate-50/50 border-b border-slate-100 py-3 text-xs text-slate-500 font-medium">
                <span className={wizardStep === 1 ? 'text-[#B45309] font-bold' : ''}>1. Profile Details</span>
                <span className={wizardStep === 2 ? 'text-[#B45309] font-bold' : ''}>2. Select Service</span>
                <span className={wizardStep === 3 ? 'text-[#B45309] font-bold' : ''}>3. Upload Documents</span>
              </div>

              <div className="p-6 space-y-6">
                
                {/* STEP 1: FILL DETAILS */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-500 block font-semibold">Full Name</label>
                        <input 
                          type="text" 
                          value={formName} 
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-[#F5B942] outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-500 block font-semibold">Registered Phone</label>
                        <input 
                          type="text" 
                          value={formPhone} 
                          onChange={(e) => setFormPhone(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-[#F5B942] outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-500 block font-semibold">City</label>
                        <input 
                          type="text" 
                          value={formCity} 
                          onChange={(e) => setFormCity(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-[#F5B942] outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-500 block font-semibold">PAN Number</label>
                        <input 
                          type="text" 
                          value={formPan} 
                          onChange={(e) => setFormPan(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono uppercase focus:bg-white focus:border-[#F5B942] outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-500 block font-semibold">Date of Birth (DOB)</label>
                        <input 
                          type="date" 
                          value={formDob} 
                          onChange={(e) => setFormDob(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-[#F5B942] outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-500 block font-semibold">IT Portal Password</label>
                        <input 
                          type="password" 
                          value={formPassword} 
                          onChange={(e) => setFormPassword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:bg-white focus:border-[#F5B942] outline-none"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => setWizardStep(2)}
                      className="w-full bg-[#F5B942] hover:bg-[#F5B942]/80 text-black py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md transition-all"
                    >
                      Next: Select Service
                    </button>
                  </div>
                )}

                {/* STEP 2: SELECT SERVICE */}
                {wizardStep === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <label className="text-xs text-slate-500 block font-bold uppercase tracking-wider">Choose Filing Service</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['ITR Filing', 'GST Return', 'Tax Notice Response', 'Other Custom Request'].map((s) => (
                          <button
                            key={s}
                            onClick={() => setSelectedService(s)}
                            className={`p-4 border rounded-xl text-left transition-all ${
                              selectedService === s 
                                ? 'bg-[#F5B942]/10 border-[#F5B942] text-[#B45309] font-bold' 
                                : 'bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <h4 className="text-sm font-semibold">{s}</h4>
                            <p className="text-[10px] text-slate-500 mt-1">Request custom registration ticket</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between gap-4 pt-4">
                      <button
                        onClick={() => setWizardStep(1)}
                        className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold uppercase"
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
                        <span className="text-xs text-[#B45309] font-semibold">
                          Please upload these documents to begin <strong>{selectedService}</strong>:
                        </span>
                      </div>

                      <div className="space-y-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
                        {[
                          { key: 'ais', name: 'Annual Information Statement (AIS)' },
                          { key: 'tis', name: 'Taxpayer Information Summary (TIS)' },
                          { key: 'tds', name: 'Form 16 / TDS Certificate' },
                          { key: 'aadhaar', name: 'Aadhaar Card copy' },
                          { key: 'pan', name: 'PAN Card copy' },
                          { key: 'bank', name: 'Bank Statement of 1 Year (< 200KB)' }
                        ].map((doc) => (
                          <div key={doc.key} className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3 rounded-xl text-xs">
                            <span className="text-slate-700 font-medium">{doc.name}</span>
                            
                            <div>
                              {uploadedDocs[doc.key] ? (
                                <div className="flex items-center space-x-2 text-xs">
                                  {uploadedDocs[doc.key].progress < 100 ? (
                                    <span className="text-[#B45309] font-mono font-bold animate-pulse">{uploadedDocs[doc.key].progress}%</span>
                                  ) : (
                                    <span className="text-[#34D399] font-bold flex items-center"><CheckCircle2 size={12} className="mr-1" /> Uploaded</span>
                                  )}
                                </div>
                              ) : (
                                <button
                                  onClick={() => handleDocUploadSimulate(doc.key, `${doc.key}_document.pdf`)}
                                  className="px-2.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-bold uppercase tracking-wider text-[10px]"
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
                        className="flex-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold uppercase"
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
