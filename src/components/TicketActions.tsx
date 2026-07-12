import React, { useState } from 'react';
import { MoreHorizontal, IndianRupee, UserPlus, Check, Pen, ExternalLink, Trash2 } from 'lucide-react';
import { Ticket } from '../types';
import { useAppStore } from '../store/useAppStore';
import { Modal } from './ui/Modal';

interface Props {
  ticket: Ticket;
}

export const TicketActions: React.FC<Props> = ({ ticket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const { approveTicket, assignTicket, deliverTicket, requestChanges, deleteTicket } = useAppStore();
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
    <>
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
              <button 
                onClick={() => {
                  setIsReportOpen(true);
                  setIsOpen(false);
                }} 
                className="flex items-center w-full px-3 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 rounded-lg"
              >
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

              <button 
                onClick={async () => {
                  if (window.confirm("Are you sure you want to delete this ticket? This action cannot be undone.")) {
                    await deleteTicket(ticket.id);
                    setIsOpen(false);
                  }
                }} 
                className="flex items-center w-full px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg border-t border-white/5 mt-1"
              >
                <Trash2 className="w-4 h-4 mr-2" /> Delete Ticket
              </button>
            </div>
          </div>
        )}
      </div>

      <Modal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        title={`Task Assignment & Status Report`}
        size="md"
      >
        <div className="space-y-4 text-saas-text">
          <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="block text-xs font-semibold text-saas-muted uppercase tracking-wider mb-1">Case / Ticket ID</span>
              <span className="text-sm font-semibold text-white">{ticket.caseId || ticket.id}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-saas-muted uppercase tracking-wider mb-1">Status</span>
              <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                ticket.status === 'CALL_DONE' || ticket.status === 'FINISHED' || ticket.status === 'COMPLETED'
                  ? 'bg-green-500/10 text-green-400' 
                  : ticket.status === 'CALL_PENDING' || ticket.status === 'PENDING_ADMIN_QC' 
                  ? 'bg-yellow-500/10 text-yellow-400' 
                  : 'bg-blue-500/10 text-blue-400'
              }`}>
                {ticket.status.replace(/_/g, ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-b border-white/10 pb-4">
            <div>
              <span className="block text-xs font-semibold text-saas-muted uppercase tracking-wider mb-1">Service Type</span>
              <span className="text-sm font-medium">{ticket.serviceType || 'N/A'}</span>
            </div>
            <div>
              <span className="block text-xs font-semibold text-saas-muted uppercase tracking-wider mb-1">Priority</span>
              <span className="text-sm font-medium uppercase">{ticket.priority || 'NORMAL'}</span>
            </div>
          </div>

          <div className="border-b border-white/10 pb-4">
            <span className="block text-xs font-semibold text-saas-muted uppercase tracking-wider mb-1">Assigned Staff</span>
            {ticket.assignedStaff ? (
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 mt-1">
                <p className="font-semibold text-white">{ticket.assignedStaff.name}</p>
                <p className="text-xs text-saas-muted mt-0.5">Role: {ticket.assignedStaff.role || 'Staff'}</p>
                {ticket.assignedStaff.phoneNumber && <p className="text-xs text-saas-muted">Phone: {ticket.assignedStaff.phoneNumber}</p>}
              </div>
            ) : (
              <span className="text-red-400 italic text-sm">Not Assigned</span>
            )}
          </div>

          <div className="border-b border-white/10 pb-4">
            <span className="block text-xs font-semibold text-saas-muted uppercase tracking-wider mb-1">Client Details</span>
            {ticket.client ? (
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 mt-1">
                <p className="font-semibold text-white">{ticket.client.name}</p>
                {ticket.client.phoneNumber && <p className="text-xs text-saas-muted">WhatsApp: {ticket.client.phoneNumber}</p>}
                {ticket.client.city && <p className="text-xs text-saas-muted">City: {ticket.client.city}</p>}
              </div>
            ) : (
              <span className="text-saas-muted italic text-sm">N/A</span>
            )}
          </div>

          <div className="border-b border-white/10 pb-4">
            <span className="block text-xs font-semibold text-saas-muted uppercase tracking-wider mb-1">Admin Notes / Task Description</span>
            <p className="text-sm mt-1 bg-white/5 p-3 rounded-xl border border-white/10 text-gray-300 leading-relaxed whitespace-pre-wrap">
              {ticket.adminNotes || 'No notes or description provided.'}
            </p>
          </div>

          <div>
            <span className="block text-xs font-semibold text-saas-muted uppercase tracking-wider mb-1">Staff Work Submission / Notes</span>
            <p className="text-sm mt-1 bg-white/5 p-3 rounded-xl border border-white/10 text-gray-300 leading-relaxed whitespace-pre-wrap">
              {ticket.staffUpdate || 'No updates submitted by staff yet.'}
            </p>
          </div>

          {(ticket.aisPdfPath || ticket.staffSubmittedDocument) && (
            <div className="pt-2">
              <button
                onClick={() => window.open(`/api/admin/tickets/${ticket.id}/download-pdf`)}
                className="w-full flex items-center justify-center bg-saas-primary hover:bg-saas-primary/95 text-white font-semibold py-2.5 px-4 rounded-xl transition-all shadow-[0_4px_20px_rgba(235,94,40,0.2)] text-sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" /> View Submitted Document / Proof
              </button>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};
