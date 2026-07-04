import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/useAppStore';
import { apiClient } from '../services/apiClient';
import { Button } from './ui/Button';

interface ReassignTaskModalProps {
  ticketId: string;
  currentStaffId?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReassignTaskModal: React.FC<ReassignTaskModalProps> = ({ ticketId, currentStaffId, onClose, onSuccess }) => {
  const { staff, fetchData } = useAppStore();
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleReassign = async () => {
    if (!selectedStaff) return;
    setIsSubmitting(true);
    try {
      await apiClient.reassignTicket(ticketId, selectedStaff, notes);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert('Failed to reassign task');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-saas-bgSecondary border border-white/10 rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-black/20">
          <h2 className="text-xl font-semibold text-saas-text">Reassign Task</h2>
          <button onClick={onClose} className="text-saas-muted hover:text-white">&times;</button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-saas-muted mb-2">Select Staff</label>
            <select 
              value={selectedStaff}
              onChange={(e) => setSelectedStaff(e.target.value)}
              className="w-full bg-saas-bgSecondary border border-white/10 rounded-lg px-4 py-2 text-saas-text focus:outline-none focus:border-saas-primary"
            >
              <option value="">Select a staff member</option>
              {staff.filter(s => s.isActive && s.id !== currentStaffId).map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-saas-muted mb-2">Reassignment Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full h-24 bg-saas-bgSecondary border border-white/10 rounded-lg px-4 py-2 text-saas-text focus:outline-none focus:border-saas-primary resize-none"
              placeholder="Reason for reassignment..."
            />
          </div>
        </div>
        
        <div className="p-4 border-t border-white/10 bg-black/40 flex justify-end space-x-3">
          <Button onClick={onClose} variant="secondary">Cancel</Button>
          <Button onClick={handleReassign} disabled={!selectedStaff || isSubmitting}>
            {isSubmitting ? 'Reassigning...' : 'Confirm Reassign'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
