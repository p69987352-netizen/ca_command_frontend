import React, { useState } from 'react';
import { Send, Phone } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { apiClient } from '../services/apiClient';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Communication: React.FC = () => {
  const { tickets } = useAppStore();
  const [ticketId, setTicketId] = useState('');
  const [recipient, setRecipient] = useState('');
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);

  // Active tickets to select from
  const activeTickets = tickets.filter(t => !['FINISHED', 'COMPLETED', 'TRASH'].includes(t.status));

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketId || !recipient || !note) return;
    
    setSending(true);
    try {
      await apiClient.sendAdminNote(ticketId, recipient, note);
      setNote('');
      alert(`Message sent via WhatsApp to ${recipient.toLowerCase()}`);
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-cinzel font-bold text-saas-text tracking-tight uppercase">Communication Center</h1>
        <p className="text-saas-muted mt-1 text-sm">Send WhatsApp messages and administrative notes.</p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Phone className="w-5 h-5 mr-2 text-saas-primary" /> Broadcast Message
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSend} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-saas-muted mb-1">Select Ticket / Client</label>
              <select 
                value={ticketId} onChange={e => setTicketId(e.target.value)}
                className="w-full bg-saas-bgSecondary border border-white/10 rounded-lg px-4 py-2 text-saas-text focus:outline-none focus:border-saas-primary transition-colors"
                required
              >
                <option value="">Select a ticket...</option>
                {activeTickets.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.client?.name} - {t.serviceType}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-saas-muted mb-1">Recipient</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 text-saas-text cursor-pointer">
                  <input type="radio" name="recipient" value="CLIENT" onChange={e => setRecipient(e.target.value)} required className="text-saas-primary bg-saas-bgSecondary border-white/10 focus:ring-saas-primary" />
                  <span>Client</span>
                </label>
                <label className="flex items-center space-x-2 text-saas-text cursor-pointer">
                  <input type="radio" name="recipient" value="STAFF" onChange={e => setRecipient(e.target.value)} required className="text-saas-primary bg-saas-bgSecondary border-white/10 focus:ring-saas-primary" />
                  <span>Assigned Staff</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-saas-muted mb-1">Message Content</label>
              <textarea 
                value={note} onChange={e => setNote(e.target.value)}
                rows={4}
                className="w-full bg-saas-bgSecondary border border-white/10 rounded-lg px-4 py-2 text-saas-text focus:outline-none focus:border-saas-primary transition-colors"
                placeholder="Type your message here..."
                required
              />
            </div>

            <Button type="submit" isLoading={sending} className="w-full">
              <Send className="w-4 h-4 mr-2" />
              {sending ? 'Sending...' : 'Send WhatsApp Message'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
