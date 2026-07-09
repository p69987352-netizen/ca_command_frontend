import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderArchive, UploadCloud, Eye, Download, 
  FileText, CheckCircle2, ShieldCheck
} from 'lucide-react';

interface DocumentItem {
  key: string;
  name: string;
  type: string;
  status: 'uploaded' | 'missing';
  date?: string;
  url?: string;
  limit?: string;
}

export const ClientDocumentVault: React.FC = () => {
  const [selectedFY, setSelectedFY] = useState('FY 2025-26');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { key: 'ais', name: 'Annual Information Statement (AIS)', type: 'PDF', status: 'uploaded', date: 'Yesterday', url: '#' },
    { key: 'tis', name: 'Taxpayer Information Summary (TIS)', type: 'PDF', status: 'uploaded', date: 'Yesterday', url: '#' },
    { key: 'tds', name: 'Form 16 / TDS Certificate', type: 'PDF', status: 'missing' },
    { key: 'aadhaar', name: 'Aadhaar Card copy', type: 'PDF', status: 'missing' },
    { key: 'pan', name: 'PAN Card copy', type: 'PDF', status: 'missing' },
    { key: 'bank', name: 'Bank Statement of 1 Year', type: 'PDF / EXCEL', status: 'missing', limit: 'under 200 kb' }
  ]);

  const simulateUpload = (key: string) => {
    setUploadProgress(prev => ({ ...prev, [key]: 10 }));
    let progress = 10;
    const interval = setInterval(() => {
      progress += 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress(prev => {
            const copy = { ...prev };
            delete copy[key];
            return copy;
          });
          setDocuments(prevDocs => 
            prevDocs.map(doc => 
              doc.key === key 
                ? { ...doc, status: 'uploaded', date: 'Just Now', url: '#' }
                : doc
            )
          );
          alert("Document uploaded successfully! Case Ticket registered & WhatsApp confirmation message sent to Super Admins.");
        }, 500);
      }
      setUploadProgress(prev => ({ ...prev, [key]: progress }));
    }, 150);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 text-[#F8FAFC]">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
          <FolderArchive className="mr-2 text-[#F5B942]" /> Document Vault
        </h1>
        <p className="text-sm text-gray-400 mt-1">Upload and manage secure tax documents mapped to your WhatsApp feed.</p>
      </div>

      <div className="flex space-x-2 bg-white/[0.02] border border-white/[0.08] p-1 rounded-xl w-fit">
        {['FY 2024-25', 'FY 2025-26', 'FY 2026-27'].map((fy) => (
          <button
            key={fy}
            onClick={() => setSelectedFY(fy)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              selectedFY === fy ? 'bg-[#F5B942] text-black shadow-lg font-bold' : 'text-gray-400 hover:text-white'
            }`}
          >
            {fy}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Upload Slots List */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-base font-semibold text-white tracking-wide">Required File Upload Slots</h2>
          {documents.map((doc) => (
            <motion.div
              layout
              key={doc.key}
              className="bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.12] p-5 rounded-2xl transition-all shadow-md flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2.5 rounded-xl border ${
                  doc.status === 'uploaded' 
                    ? 'bg-[#34D399]/5 border-[#34D399]/20 text-[#34D399]' 
                    : 'bg-[#EF4444]/5 border-[#EF4444]/20 text-[#EF4444]'
                }`}>
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white tracking-wide">
                    {doc.name} 
                    {doc.limit && <span className="text-[10px] text-[#F5B942] ml-2 font-mono">({doc.limit})</span>}
                  </h3>
                  <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
                    {doc.status === 'uploaded' ? `Uploaded ${doc.date} • ${doc.type}` : 'Required Document • Missing'}
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {uploadProgress[doc.key] !== undefined ? (
                  <span className="text-xs text-[#F5B942] font-mono font-bold animate-pulse">Uploading {uploadProgress[doc.key]}%</span>
                ) : doc.status === 'uploaded' ? (
                  <>
                    <button className="p-2 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] rounded-xl text-gray-400 hover:text-white transition-all text-xs flex items-center">
                      <Eye size={14} className="mr-1.5" /> Preview
                    </button>
                    <button className="p-2 bg-[#34D399]/10 border border-[#34D399]/20 hover:bg-[#34D399]/20 rounded-xl text-[#34D399] transition-all">
                      <Download size={14} />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => simulateUpload(doc.key)}
                    className="px-3 py-1.5 bg-[#EF4444]/10 border border-[#EF4444]/20 hover:bg-[#EF4444]/20 rounded-xl text-[#EF4444] transition-all text-xs font-bold uppercase tracking-wide"
                  >
                    Upload File
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Info Zone */}
        <div className="lg:col-span-4">
          <div className="bg-white/[0.02] border border-white/[0.08] p-6 rounded-2xl shadow-lg space-y-4">
            <h3 className="text-sm font-semibold text-white tracking-wide">Document Sync Details</h3>
            <div className="flex items-start space-x-3 text-xs text-gray-400">
              <ShieldCheck size={16} className="text-[#34D399] shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                All files uploaded here automatically sync with your WhatsApp ARJUN chatbot thread and notify our CA desk.
              </p>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
