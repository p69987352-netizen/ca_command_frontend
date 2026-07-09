import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FolderArchive, UploadCloud, Eye, Download, AlertCircle, 
  CheckCircle2, FileText, Trash2, Calendar
} from 'lucide-react';

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  status: 'uploaded' | 'missing';
  date?: string;
  url?: string;
}

export const ClientDocumentVault: React.FC = () => {
  const [selectedFY, setSelectedFY] = useState('FY 2025-26');
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [documents, setDocuments] = useState<DocumentItem[]>([
    { id: '1', name: 'Annual Information Statement (AIS)', type: 'PDF', status: 'uploaded', date: 'Yesterday', url: '#' },
    { id: '2', name: 'Taxpayer Information Summary (TIS)', type: 'PDF', status: 'uploaded', date: 'Yesterday', url: '#' },
    { id: '3', name: 'Form 26AS (Tax Credit Statement)', type: 'PDF', status: 'missing' },
    { id: '4', name: 'HDFC Bank Statement (Savings)', type: 'XLSX', status: 'uploaded', date: '2 days ago', url: '#' }
  ]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    simulateUpload();
  };

  const simulateUpload = () => {
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev === null) return 0;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setUploadProgress(null);
            // Add new document
            const newDoc: DocumentItem = {
              id: Date.now().toString(),
              name: 'PAN Card (Scanned Copy).pdf',
              type: 'PDF',
              status: 'uploaded',
              date: 'Just Now',
              url: '#'
            };
            setDocuments((prevDocs) => [newDoc, ...prevDocs]);
            alert("Document uploaded successfully! Case Ticket registered & WhatsApp confirmation message sent to Super Admins.");
          }, 500);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
          <FolderArchive className="mr-2 text-[#F5B942]" /> Document Vault
        </h1>
        <p className="text-sm text-gray-400 mt-1">Upload and manage secure tax documents mapped to your WhatsApp feed.</p>
      </div>

      {/* Fiscal Year Tabs */}
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Document List - Left Column */}
        <div className="lg:col-span-7 space-y-4">
          {documents.map((doc) => (
            <motion.div
              layout
              key={doc.id}
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
                  <h3 className="text-sm font-semibold text-white tracking-wide">{doc.name}</h3>
                  <span className="text-[10px] text-gray-500 font-mono mt-0.5 block">
                    {doc.status === 'uploaded' ? `Uploaded ${doc.date} • ${doc.type}` : 'Required Document • Missing'}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center space-x-2">
                {doc.status === 'uploaded' ? (
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
                    onClick={simulateUpload}
                    className="px-3 py-1.5 bg-[#EF4444]/10 border border-[#EF4444]/20 hover:bg-[#EF4444]/20 rounded-xl text-[#EF4444] transition-all text-xs font-bold uppercase tracking-wide"
                  >
                    Upload File
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Drag Drop Upload Zone - Right Column */}
        <div className="lg:col-span-5">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`h-72 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all relative ${
              isDragging 
                ? 'border-[#F5B942] bg-[#F5B942]/5' 
                : 'border-white/[0.08] hover:border-white/[0.15] bg-white/[0.01]'
            }`}
          >
            <AnimatePresence>
              {uploadProgress !== null ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 w-full max-w-xs text-center"
                >
                  <UploadCloud size={48} className="mx-auto text-[#F5B942] animate-bounce" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white">Uploading Document...</h3>
                    <p className="text-xs text-gray-500">{uploadProgress}% completed</p>
                  </div>
                  <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden border border-white/[0.06]">
                    <div className="h-full bg-[#F5B942]" style={{ width: `${uploadProgress}%` }} />
                  </div>
                </motion.div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-white/[0.02] border border-white/[0.08] rounded-xl flex items-center justify-center mx-auto text-gray-400">
                    <UploadCloud size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-semibold text-white">Drag & drop files here</h3>
                    <p className="text-xs text-gray-500">Supports PDF, JPEG, PNG, or Excel up to 25MB</p>
                  </div>
                  <button 
                    onClick={simulateUpload}
                    className="px-4 py-2 bg-white text-black text-xs font-bold uppercase rounded-xl shadow-lg hover:bg-gray-100 transition-all"
                  >
                    Browse Files
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

    </div>
  );
};
