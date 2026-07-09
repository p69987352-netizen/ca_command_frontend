import React from 'react';
import { Bell, Info, ShieldAlert, Sparkles } from 'lucide-react';

export const ClientNotifications: React.FC = () => {
  const notifications = [
    { 
      id: '1', 
      title: 'CA Uploaded Assessment Report', 
      desc: 'Your designated accountant Rahul Sharma has uploaded the verified calculation worksheet for capital gains.', 
      time: 'Today, 11:30 AM', 
      unread: true, 
      type: 'info' 
    },
    { 
      id: '2', 
      title: 'Form 16 Document Needed', 
      desc: 'Please submit your employer Form 16 in the Document Vault to complete the Salary Income calculations.', 
      time: 'Yesterday, 04:15 PM', 
      unread: true, 
      type: 'action' 
    },
    { 
      id: '3', 
      title: 'Refund Processed', 
      desc: 'Assessment filed successfully. The Income Tax Department has approved a refund amount of ₹14,500.', 
      time: '2 days ago', 
      unread: false, 
      type: 'success' 
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
          <Bell className="mr-2 text-[#F5B942]" /> Notifications
        </h1>
        <p className="text-sm text-gray-400 mt-1">Stay updated with instant actions requested by your CA or Arjun AI.</p>
      </div>

      {/* Gmail-like list wrapper */}
      <div className="bg-white/[0.02] border border-white/[0.08] rounded-2xl overflow-hidden shadow-xl divide-y divide-white/[0.04]">
        {notifications.map((item) => (
          <div 
            key={item.id} 
            className={`p-6 flex items-start space-x-4 transition-all hover:bg-white/[0.01] ${
              item.unread ? 'bg-white/[0.01]' : ''
            }`}
          >
            {/* Status dot */}
            <div className="pt-1 shrink-0">
              <span className={`w-2.5 h-2.5 rounded-full block ${
                item.unread ? 'bg-[#F5B942]' : 'bg-transparent'
              }`} />
            </div>

            {/* Content info */}
            <div className="flex-1 space-y-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <h3 className={`text-sm tracking-wide ${item.unread ? 'font-bold text-white' : 'text-gray-300'}`}>
                  {item.title}
                </h3>
                <span className="text-[10px] text-gray-500 font-mono shrink-0">{item.time}</span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed max-w-3xl">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
