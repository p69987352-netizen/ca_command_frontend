import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MoreHorizontal, Download, Plus, MapPin, IndianRupee } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { TicketActions } from '../components/TicketActions';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export const ClientRegistry: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const { tickets, fetchData, isLoading } = useAppStore();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Client
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4 border-b border-white/10">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-saas-muted" />
            <input 
              type="text" 
              placeholder="Search by name, phone, or PAN..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-saas-bgSecondary border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-saas-text focus:outline-none focus:border-saas-primary transition-colors"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-saas-muted">Loading clients...</div>
          ) : (
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};
