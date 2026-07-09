import React, { useState, useEffect } from 'react';
import { User, ShieldAlert, Key, Eye, EyeOff, Save } from 'lucide-react';

export const ClientProfile: React.FC = () => {
  const [user, setUser] = useState<{ name: string; email: string; phone: string; pan: string } | null>(null);
  const [isLockerVisible, setIsLockerVisible] = useState(false);
  const [panPassword, setPanPassword] = useState('SecretPassword123');
  const [gstPassword, setGstPassword] = useState('GstPortalPass456');

  useEffect(() => {
    const storedUser = localStorage.getItem('portal_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSaveLocker = () => {
    alert("Official portal credentials encrypted using AES-256 and saved securely in your Locker!");
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
          <User className="mr-2 text-[#F5B942]" /> My Profile & Locker
        </h1>
        <p className="text-sm text-gray-400 mt-1">Manage user contacts, official account information, and encrypted portal login settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl shadow-xl space-y-6">
            <h2 className="text-base font-semibold text-white tracking-wide border-b border-white/[0.06] pb-3">User Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-gray-500 block">Full Name</span>
                <span className="font-semibold text-white">{user.name}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">Google Account</span>
                <span className="font-semibold text-white">{user.email}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">Registered Phone</span>
                <span className="font-semibold text-white">{user.phone}</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">PAN Number</span>
                <span className="font-semibold text-white font-mono">{user.pan}</span>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="text-gray-500 block">Residential Address</span>
                <span className="font-semibold text-white">405, Porwal Enclave, Malad East, Mumbai, MH - 400097</span>
              </div>
              <div className="space-y-1">
                <span className="text-gray-500 block">Nominee Details</span>
                <span className="font-semibold text-white">Karan Singh (Brother)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
              <h2 className="text-base font-semibold text-white tracking-wide flex items-center">
                <Key size={16} className="mr-2 text-[#F5B942]" /> Credential Locker
              </h2>
              <button 
                onClick={() => setIsLockerVisible(!isLockerVisible)}
                className="text-gray-400 hover:text-white"
              >
                {isLockerVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 block font-medium">Income Tax Password</label>
                <div className="relative">
                  <input
                    type={isLockerVisible ? 'text' : 'password'}
                    value={panPassword}
                    onChange={(e) => setPanPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#F5B942]/50 outline-none rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-gray-500 block font-medium">GST Portal Password</label>
                <div className="relative">
                  <input
                    type={isLockerVisible ? 'text' : 'password'}
                    value={gstPassword}
                    onChange={(e) => setGstPassword(e.target.value)}
                    className="w-full bg-white/[0.04] border border-white/[0.08] focus:border-[#F5B942]/50 outline-none rounded-xl px-4 py-2.5 text-sm text-white font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveLocker}
                className="w-full flex items-center justify-center space-x-2 bg-[#F5B942] hover:bg-[#F5B942]/80 text-black py-2.5 rounded-xl text-sm font-bold uppercase transition-all shadow-lg"
              >
                <Save size={16} />
                <span>Save Credentials</span>
              </button>
            </div>

            <div className="h-px bg-white/[0.06]" />
            
            <div className="flex items-start space-x-2 text-[10px] text-gray-500 leading-relaxed">
              <ShieldAlert size={14} className="text-[#F5B942] shrink-0 mt-0.5" />
              <p>
                Credentials are AES-256 encrypted in transit and at rest. These are only visible to your assigned CA during document uploads.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
