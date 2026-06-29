import React from 'react';
import { motion } from 'framer-motion';
import { Check, Pen, ExternalLink } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';

export const QCReview: React.FC = () => {
  const { tickets, deliverTicket, requestChanges, getStaffDocumentUrl } = useAppStore();
  const qcTickets = tickets.filter(t => t.status === 'PENDING_ADMIN_QC');
  const [loadingFileId, setLoadingFileId] = React.useState<string | null>(null);

  const handleDeliver = async (id: string) => {
    const msg = prompt('Enter delivery message for client:');
    if (msg) {
      await deliverTicket(id, msg);
    }
  };

  const handleChanges = async (id: string) => {
    const msg = prompt('Enter required changes for staff:');
    if (msg) {
      await requestChanges(id, msg);
    }
  };

  const handleViewFile = async (id: string) => {
    setLoadingFileId(id);
    try {
      const url = await getStaffDocumentUrl(id);
      if (url) {
        window.open(url, '_blank');
      } else {
        alert('No file available for this ticket.');
      }
    } catch (e) {
      alert('Failed to load file.');
    } finally {
      setLoadingFileId(null);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-cinzel font-bold text-saas-text tracking-tight uppercase">QC Review (Pariksha)</h1>
        <p className="text-saas-muted mt-1 text-sm">Review final work before delivering to the client.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Files Pending QC Review</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client & Service</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qcTickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-saas-muted py-8">
                    No files currently waiting for QC.
                  </TableCell>
                </TableRow>
              ) : (
                qcTickets.map(t => (
                  <TableRow key={t.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium text-saas-text">{t.client?.name}</span>
                        <span className="text-xs text-saas-muted">{t.serviceType}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{t.assignedStaff?.name || 'Unassigned'}</span>
                    </TableCell>
                    <TableCell className="text-saas-muted max-w-xs truncate">
                      {t.notes || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewFile(t.id)} disabled={loadingFileId === t.id}>
                          <ExternalLink className="w-4 h-4 mr-2" /> {loadingFileId === t.id ? 'Loading...' : 'View File'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleChanges(t.id)}>
                          <Pen className="w-4 h-4 mr-2" /> Request Changes
                        </Button>
                        <Button size="sm" onClick={() => handleDeliver(t.id)}>
                          <Check className="w-4 h-4 mr-2" /> Approve & Deliver
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
