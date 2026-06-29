import React from 'react';
import { motion } from 'framer-motion';
import { Clock, FileText, CheckCircle2, AlertTriangle, MessageSquare } from 'lucide-react';

interface ActivityLog {
  id: string;
  eventType: string;
  message: string;
  createdAt: string;
}

interface ActivityTimelineProps {
  logs?: ActivityLog[];
}

export const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ logs = [] }) => {
  if (logs.length === 0) {
    return <div className="text-gray-400 p-4 text-center">No recent activity.</div>;
  }

  const getIcon = (type: string) => {
    switch (type) {
      case 'UPLOAD': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'AI_ANALYSIS_START': return <Clock className="w-4 h-4 text-purple-400" />;
      case 'RISK_SCORE': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {logs.map((log, index) => (
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          key={log.id} 
          className="relative pl-8"
        >
          {/* Vertical Line */}
          {index !== logs.length - 1 && (
            <div className="absolute left-3 top-6 bottom-[-24px] w-0.5 bg-saas-primary/20" />
          )}
          
          {/* Icon */}
          <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-saas-card border border-saas-primary/40 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(249,115,22,0.2)]">
            {getIcon(log.eventType)}
          </div>
          
          {/* Content */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 hover:border-saas-primary/50 transition-colors shadow-[0_4px_15px_rgba(0,0,0,0.1)]">
            <div className="flex justify-between items-start">
              <span className="text-sm font-semibold text-white">{log.message}</span>
              <span className="text-xs text-saas-muted whitespace-nowrap ml-4">
                {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className="text-xs text-saas-primary mt-1 uppercase tracking-wider font-semibold">{log.eventType}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
