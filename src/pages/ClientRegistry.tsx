import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, Download, Plus, MapPin, IndianRupee, Trash2, PlusCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { TicketActions } from '../components/TicketActions';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { apiClient } from '../services/apiClient';

export const ClientRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { tickets, fetchData, isLoading } = useAppStore();

  // Form states for manual client creation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('');
  const [pan, setPan] = useState('');
  const [dob, setDob] = useState('');
  const [itPassword, setItPassword] = useState('');
  const [serviceType, setServiceType] = useState('ITR Filing');
  const [documents, setDocuments] = useState<{ id: string; docName: string; customName: string; file: File | null }[]>([
    { id: '1', docName: 'PAN Card', customName: '', file: null }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddDocumentRow = () => {
    setDocuments([...documents, { id: Date.now().toString(), docName: '', customName: '', file: null }]);
  };

  const handleRemoveDocumentRow = (id: string) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const handleDocFieldChange = (id: string, field: 'docName' | 'customName' | 'file', value: any) => {
    setDocuments(documents.map(doc => {
      if (doc.id === id) {
        return { ...doc, [field]: value };
      }
      return doc;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phoneNumber || !city || !pan || !dob || !itPassword || !serviceType) {
      setErrorMsg('Please fill in all client details.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('phoneNumber', phoneNumber);
      formData.append('city', city);
      formData.append('pan', pan);
      formData.append('dob', dob);
      formData.append('itPassword', itPassword);
      formData.append('serviceType', serviceType);

      documents.forEach(doc => {
        if (doc.file) {
          const finalName = doc.docName === 'Other' ? doc.customName : doc.docName;
          formData.append('docNames', finalName || 'Document');
          formData.append('files', doc.file);
        }
      });

      await apiClient.createClientWithDocuments(formData);
      setIsModalOpen(false);
      
      // Reset form
      setName('');
      setPhoneNumber('');
      setCity('');
      setPan('');
      setDob('');
      setItPassword('');
      setServiceType('ITR Filing');
      setDocuments([{ id: '1', docName: 'PAN Card', customName: '', file: null }]);
      
      // Refresh list
      fetchData();
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e.response?.data?.message || 'Failed to create client and upload documents.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const clientName = ticket.client?.name || '';
    const pan = ticket.client?.id || ''; 
    const phone = ticket.client?.phoneNumber || '';
    const search = searchTerm.toLowerCase();
    
    return clientName.toLowerCase().includes(search) || 
           pan.toLowerCase().includes(search) || 
           phone.toLowerCase().includes(search);
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-saas-text tracking-tight">Client Registry</h1>
          <p className="text-saas-muted mt-1 text-sm">Manage and monitor all firm clients.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-4 border-b border-white/10">
          <div className="relative max-w-full sm:max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saas-muted" />
            <input 
              type="text" 
              placeholder="Search by name, phone, or PAN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-saas-bgSecondary border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-saas-text focus:outline-none focus:border-saas-primary transition-colors"
            />
          </div>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-saas-muted">Loading clients...</div>
          ) : (
            <div className="overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client Details</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Financials</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map(ticket => (
                    <TableRow key={ticket.id} className="cursor-pointer" onClick={() => navigate(`/dashboard/clients/${ticket.client?.id}`)}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-saas-text">{ticket.client?.name || 'Unknown'}</span>
                          <div className="flex items-center text-xs text-saas-muted mt-1 space-x-2">
                            <span>{ticket.client?.phoneNumber}</span>
                            {ticket.client?.city && (
                              <>
                                <span>•</span>
                                <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {ticket.client.city}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{ticket.serviceType || 'ITR Filing'}</span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={['FINISHED', 'COMPLETED'].includes(ticket.status) ? 'success' : 'warning'}>
                          {ticket.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-saas-text flex items-center">
                            <IndianRupee className="w-3 h-3 mr-1 text-saas-muted" /> 
                            {ticket.quotedFee || '-'}
                          </span>
                          {ticket.paymentStatus === 'PAID' && (
                            <span className="text-xs text-saas-success font-medium">Paid</span>
                          )}
                          {ticket.paymentStatus !== 'PAID' && ticket.status === 'FEE_APPROVED' && (
                            <span className="text-xs text-saas-warning font-medium">Link Sent</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                        <TicketActions ticket={ticket} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Client & Upload Documents"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6 text-saas-text">
          {errorMsg && (
            <div className="bg-red-500/20 border border-red-500/30 text-red-400 p-3.5 rounded-xl text-sm font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                placeholder="Enter client name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">WhatsApp Phone Number (with country code)</label>
              <input
                type="text"
                placeholder="e.g. 919876543210"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">City</label>
              <input
                type="text"
                placeholder="Enter city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">PAN Number</label>
              <input
                type="text"
                placeholder="ABCDE1234F"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm uppercase"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">Date of Birth</label>
              <input
                type="text"
                placeholder="DD/MM/YYYY"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">IT Portal Password</label>
              <input
                type="text"
                placeholder="Enter portal password"
                value={itPassword}
                onChange={(e) => setItPassword(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">Service Type</label>
              <select
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm"
              >
                <option value="ITR Filing" className="bg-saas-bgSecondary">ITR Filing</option>
                <option value="GST Services" className="bg-saas-bgSecondary">GST Services</option>
                <option value="Tax Notice / Appeal" className="bg-saas-bgSecondary">Tax Notice / Appeal</option>
                <option value="Tax Advisory" className="bg-saas-bgSecondary">Tax Advisory</option>
              </select>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Client Documents</h4>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddDocumentRow}
                className="border-saas-primary/30 text-saas-primary hover:bg-saas-primary/15"
              >
                <PlusCircle className="w-4 h-4 mr-1.5" />
                Add Document
              </Button>
            </div>

            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div key={doc.id} className="flex flex-col md:flex-row items-stretch md:items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                  <div className="flex-1">
                    <select
                      value={doc.docName}
                      onChange={(e) => handleDocFieldChange(doc.id, 'docName', e.target.value)}
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-saas-primary text-sm"
                    >
                      <option value="" disabled>Select Document Type...</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="AIS/TIS Report">AIS/TIS Report</option>
                      <option value="TDS Certificate">TDS Certificate</option>
                      <option value="Bank Statement">Bank Statement</option>
                      <option value="Form 16">Form 16</option>
                      <option value="Other">Other (Custom Name)</option>
                    </select>
                  </div>

                  {doc.docName === 'Other' && (
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Type Document Name"
                        value={doc.customName}
                        onChange={(e) => handleDocFieldChange(doc.id, 'customName', e.target.value)}
                        className="w-full bg-black/30 border border-white/10 rounded-lg p-2.5 text-white focus:outline-none focus:border-saas-primary text-sm"
                        required
                      />
                    </div>
                  )}

                  <div className="flex-1 flex items-center space-x-2">
                    <input
                      type="file"
                      onChange={(e) => handleDocFieldChange(doc.id, 'file', e.target.files?.[0] || null)}
                      className="text-xs text-saas-muted file:bg-white/10 file:border-none file:text-white file:px-3 file:py-2 file:rounded-lg file:mr-3 file:cursor-pointer hover:file:bg-white/15"
                      required
                    />
                    {documents.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveDocumentRow(doc.id)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-white/5 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-saas-primary hover:bg-saas-primary/95 text-white font-bold"
            >
              {isSubmitting ? 'Creating...' : 'Create Client & Ticket'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
