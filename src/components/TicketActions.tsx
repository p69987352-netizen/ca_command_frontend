import React, { useState } from 'react';
import { MoreHorizontal, IndianRupee, UserPlus, Check, Pen, ExternalLink } from 'lucide-react';
import { Ticket } from '../types';
import { useAppStore } from '../store/useAppStore';

interface Props {
  ticket: Ticket;
}

export const TicketActions: React.FC<Props> = ({ ticket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { approveTicket, assignTicket, deliverTicket, requestChanges } = useAppStore();
  const { staff } = useAppStore();

  const handleSetFee = async () => {
    const fee = prompt('Enter Fee Amount:');
    if (fee) {
      await approveTicket(ticket.id, Number(fee), 'Fee set via admin console');
      setIsOpen(false);
    }
  };

  const handleAssign = async () => {
    if (staff.length === 0) {
      alert('No staff members available. Add staff first.');
      return;
    }
    const staffOptions = staff.map(s => `${s.id} - ${s.name}`).join('\n');
    const staffId = prompt(`Enter Staff ID to assign:\n${staffOptions}`);
    if (staffId) {
      await assignTicket(ticket.id, staffId, 'NORMAL', 'Assigned from dashboard');
      setIsOpen(false);
    }
  };

  const handleDeliver = async () => {
    const msg = prompt('Enter delivery closing message:');
    if (msg) {
      await deliverTicket(ticket.id, msg);
      setIsOpen(false);
    }
  };

  const handleRequestChanges = async () => {
    const msg = prompt('Enter changes needed:');
    if (msg) {
      await requestChanges(ticket.id, msg);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-md transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-saas-card/90 backdrop-blur-xl border border-white/10 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-50 overflow-hidden">
          <div className="p-1">
            <button onClick={() => window.open(`/api/admin/tickets/${ticket.id}/download-pdf`)} className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg">
              <ExternalLink className="w-4 h-4 mr-2" /> View Report
            </button>
            
            {ticket.status === 'PENDING_ADMIN_APPROVAL' && (
              <button onClick={handleSetFee} className="flex items-center w-full px-3 py-2 text-sm text-yellow-400 hover:bg-yellow-500/10 rounded-lg">
                <IndianRupee className="w-4 h-4 mr-2" /> Set Fee
              </button>
            )}

            {(ticket.status === 'PAYMENT_RECEIVED' || ticket.status === 'IN_PROGRESS' || ticket.status === 'ASSIGNED_TO_STAFF') && (
              <button onClick={handleAssign} className="flex items-center w-full px-3 py-2 text-sm text-blue-400 hover:bg-blue-500/10 rounded-lg">
                <UserPlus className="w-4 h-4 mr-2" /> Assign Staff
              </button>
            )}

            {ticket.status === 'PENDING_ADMIN_QC' && (
              <>
                <button onClick={handleDeliver} className="flex items-center w-full px-3 py-2 text-sm text-green-400 hover:bg-green-500/10 rounded-lg">
                  <Check className="w-4 h-4 mr-2" /> Deliver Work
                </button>
                <button onClick={handleRequestChanges} className="flex items-center w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg">
                  <Pen className="w-4 h-4 mr-2" /> Request Changes
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
