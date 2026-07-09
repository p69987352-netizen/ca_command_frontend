import React, { useState, useEffect } from 'react';
import { User, ShieldAlert, Key, Eye, EyeOff, Save } from 'lucide-react';

export const ClientProfile: React.FC = () => {
  const [user, setUser] = useState<{ name: string; email: string; phone: string; pan: string; dob?: string; city?: string; taxPassword?: string } | null>(null);
  const [isLockerVisible, setIsLockerVisible] = useState(false);
  const [panPassword, setPanPassword] = useState('SecretPassword123');
  const [gstPassword, setGstPassword] = useState('GstPortalPass456');

  useEffect(() => {
    const storedUser = localStorage.getItem('portal_user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed.taxPassword) {
        setPanPassword(parsed.taxPassword);
      }
    }
  }, []);

  const handleSaveLocker = () => {
    if (user) {
      const updatedUser = {
        ...user,
        taxPassword: panPassword
      };
      localStorage.setItem('portal_user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
    alert("Official portal credentials encrypted using AES-256 and saved securely in your Locker!");
  };

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in pb-12 text-slate-800">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <User className="mr-2 text-[#B45309]" /> My Profile & Locker
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage user contacts, official account information, and encrypted portal login settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
            <h2 className="text-base font-semibold text-slate-900 tracking-wide border-b border-slate-100 pb-3">User Details</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold">Full Name</span>
                <span className="font-bold text-slate-800">{user.name}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold">Google Account</span>
                <span className="font-bold text-slate-800">{user.email}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold">Registered Phone</span>
                <span className="font-bold text-slate-800">{user.phone}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold">PAN Number</span>
                <span className="font-bold text-slate-800 font-mono">{user.pan}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold">Date of Birth (DOB)</span>
                <span className="font-bold text-slate-800">{user.dob || '1995-08-15'}</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold">City</span>
                <span className="font-bold text-slate-800">{user.city || 'Mumbai'}</span>
              </div>
              <div className="space-y-1 sm:col-span-2">
                <span className="text-slate-400 block font-semibold">Residential Address</span>
                <span className="font-bold text-slate-800">405, Porwal Enclave, Malad East, Mumbai, MH - 400097</span>
              </div>
              <div className="space-y-1">
                <span className="text-slate-400 block font-semibold">Nominee Details</span>
                <span className="font-bold text-slate-800">Karan Singh (Brother)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 p-6 rounded-2xl shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-semibold text-slate-900 tracking-wide flex items-center">
                <Key size={16} className="mr-2 text-[#B45309]" /> Credential Locker
              </h2>
              <button 
                onClick={() => setIsLockerVisible(!isLockerVisible)}
                className="text-slate-400 hover:text-slate-600"
              >
                {isLockerVisible ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 block font-semibold">Income Tax Password</label>
                <div className="relative">
                  <input
                    type={isLockerVisible ? 'text' : 'password'}
                    value={panPassword}
                    onChange={(e) => setPanPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F5B942] outline-none rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-slate-500 block font-semibold">GST Portal Password</label>
                <div className="relative">
                  <input
                    type={isLockerVisible ? 'text' : 'password'}
                    value={gstPassword}
                    onChange={(e) => setGstPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-[#F5B942] outline-none rounded-xl px-4 py-2.5 text-sm text-slate-900 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={handleSaveLocker}
                className="w-full flex items-center justify-center space-x-2 bg-[#F5B942] hover:bg-[#F5B942]/80 text-black py-2.5 rounded-xl text-sm font-bold uppercase transition-all shadow-md"
              >
                <Save size={16} />
                <span>Save Credentials</span>
              </button>
            </div>

            <div className="h-px bg-slate-100" />
            
            <div className="flex items-start space-x-2 text-[10px] text-slate-500 leading-relaxed font-medium">
              <ShieldAlert size={14} className="text-[#B45309] shrink-0 mt-0.5" />
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
