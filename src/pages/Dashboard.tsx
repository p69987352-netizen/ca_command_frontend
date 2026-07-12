import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, FileWarning, Scale, IndianRupee, AlertTriangle, CheckCircle2, TrendingUp, CreditCard, BrainCircuit, Activity, Clock, Plus, Trash2, Check } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { apiClient } from '../services/apiClient';
import { StatCard } from '../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { tickets, staff, fetchData, isLoading, createTask, deleteTicket, deliverTicket } = useAppStore();
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'workload'>('overview');

  // Form states for manual task creation
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskClientName, setTaskClientName] = useState('');
  const [taskClientPhone, setTaskClientPhone] = useState('');
  const [taskServiceType, setTaskServiceType] = useState('ITR Filing');
  const [customTaskServiceType, setCustomTaskServiceType] = useState('');
  const [taskStaffId, setTaskStaffId] = useState('');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskDocs, setTaskDocs] = useState<{ id: string; name: string; file: File | null }[]>([]);
  const [isSubmittingTask, setIsSubmittingTask] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      await apiClient.generateAttendanceReport();
      alert('Daily report generated and sent to admins via WhatsApp!');
    } catch (e) {
      console.error(e);
      alert('Failed to generate report.');
    } finally {
      setGeneratingReport(false);
    }
  };

  useEffect(() => {
    fetchData();
    apiClient.fetchDashboardAnalytics().then(data => setAnalytics(data)).catch(console.error);
  }, [fetchData]);

  const handleCreateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalServiceType = taskServiceType === 'Other' ? customTaskServiceType : taskServiceType;
    if (!taskClientName || !taskClientPhone || !finalServiceType || !taskStaffId) {
      alert('Please fill in all required fields.');
      return;
    }
    setIsSubmittingTask(true);
    try {
      const validDocs = taskDocs.filter(d => d.file !== null);
      const filesToUpload = validDocs.map(d => d.file) as File[];
      const fileNamesToUpload = validDocs.map(d => d.name || 'Admin Document');

      await createTask({
        clientName: taskClientName,
        clientPhoneNumber: taskClientPhone,
        serviceType: finalServiceType,
        assignedStaffId: taskStaffId,
        notes: taskNotes,
        files: filesToUpload,
        fileNames: fileNamesToUpload
      });
      setIsTaskModalOpen(false);
      // Reset form
      setTaskClientName('');
      setTaskClientPhone('');
      setTaskServiceType('ITR Filing');
      setCustomTaskServiceType('');
      setTaskStaffId('');
      setTaskNotes('');
      setTaskDocs([]);
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to create task.');
    } finally {
      setIsSubmittingTask(false);
    }
  };

  // Derived metrics
  const activeCases = tickets.filter(t => !['FINISHED', 'COMPLETED'].includes(t.status)).length;
  const pendingPayments = tickets.filter(t => t.status === 'AWAITING_PAYMENT').length;
  
  // Row 1: Financials
  const financials = [
    { title: 'Revenue Collected', value: `₹${(analytics?.revenueCollected || 0).toLocaleString('en-IN')}`, icon: <IndianRupee className="w-5 h-5" />, trend: { value: 12, isPositive: true } },
    { title: 'Revenue Potential', value: `₹${((analytics?.revenueCollected || 0) * 1.5).toLocaleString('en-IN')}`, icon: <TrendingUp className="w-5 h-5" /> },
    { title: 'Active Cases', value: activeCases.toString(), icon: <Activity className="w-5 h-5" /> },
    { title: 'Pending Payments', value: pendingPayments.toString(), icon: <CreditCard className="w-5 h-5" /> },
  ];

  // Row 2: Ops
  const ops = [
    { title: 'Ready For Filing', value: analytics?.readyForFiling?.toString() || '0', icon: <CheckCircle2 className="w-5 h-5" /> },
    { title: 'Missing Documents', value: analytics?.pendingDocs?.toString() || '0', icon: <FileWarning className="w-5 h-5" /> },
    { title: 'High Risk Cases', value: analytics?.highRiskCases?.toString() || '0', icon: <AlertTriangle className="w-5 h-5" /> },
    { title: 'Repeat Customers', value: '45%', icon: <Users className="w-5 h-5" /> },
  ];

  const intelligenceInsights = tickets
    .filter(t => t.status !== 'FINISHED' && t.status !== 'COMPLETED')
    .slice(0, 5);

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-saas-text mb-4">Financial Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {financials.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-saas-text mb-4">Operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {ops.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-saas-primary" />
              <CardTitle>Arjun AI Intelligence</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Insight</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {intelligenceInsights.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-saas-muted py-8">
                      No active insights found.
                    </TableCell>
                  </TableRow>
                ) : (
                  intelligenceInsights.map(ticket => (
                    <TableRow 
                      key={ticket.id} 
                      className="cursor-pointer"
                      onClick={() => navigate(`/dashboard/clients/${ticket.client?.id}`)}
                    >
                      <TableCell className="font-medium">{ticket.client?.name || 'Unknown'}</TableCell>
                      <TableCell>{ticket.serviceType}</TableCell>
                      <TableCell>
                        <Badge variant={ticket.status === 'DOCUMENT_PENDING' ? 'warning' : 'default'}>
                          {ticket.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-saas-muted text-xs truncate max-w-[200px]">
                        {ticket.pendingDocumentSummary ? 'Documents uploaded recently' : 'Awaiting action'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-saas-muted" />
              <CardTitle>Recent Activity</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-saas-primary mt-1.5 shrink-0" />
                <div>
                  <p className="text-saas-text">New ITR Document uploaded by <span className="font-medium">Ravi Kumar</span></p>
                  <p className="text-saas-muted text-xs mt-0.5">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-saas-success mt-1.5 shrink-0" />
                <div>
                  <p className="text-saas-text">Payment received from <span className="font-medium">Sharma & Co.</span></p>
                  <p className="text-saas-muted text-xs mt-0.5">1 hour ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 text-sm">
                <div className="w-2 h-2 rounded-full bg-saas-warning mt-1.5 shrink-0" />
                <div>
                  <p className="text-saas-text">High Risk Flag: Missing Form 16 for <span className="font-medium">Neha Singh</span></p>
                  <p className="text-saas-muted text-xs mt-0.5">3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderWorkload = () => {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex justify-between items-center bg-saas-bgSecondary p-4 rounded-xl border border-white/5">
          <div>
            <h3 className="text-lg font-bold text-white">Staff Workload Status</h3>
            <p className="text-xs text-saas-muted mt-1">Detailed list of active tasks assigned per staff member.</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={handleGenerateReport} 
              disabled={generatingReport}
              className="bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 flex items-center disabled:opacity-50"
            >
              {generatingReport ? 'Generating...' : 'Generate Report'}
            </Button>
            <Button onClick={() => {
              if (staff.length > 0) {
                setTaskStaffId(staff[0].id);
              }
              setIsTaskModalOpen(true);
            }} className="bg-saas-primary text-black font-semibold hover:bg-saas-primary/80">
              <Plus className="w-4 h-4 mr-2" />
              Assign Manual Task
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staff.map(member => {
            const activeTasks = tickets.filter(t => 
              t.assignedStaff?.id === member.id && 
              !['FINISHED', 'COMPLETED', 'CALL_DONE', 'TRASH', 'FAILED'].includes(t.status)
            );

            return (
              <Card key={member.id} className="border-white/5 bg-saas-bgSecondary/50">
                <CardHeader className="border-b border-white/5 pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-base text-white font-bold">{member.name}</CardTitle>
                      <span className="text-xs text-saas-muted mt-0.5 block">{member.role || 'Staff'}</span>
                    </div>
                    <Badge variant={activeTasks.length > 3 ? 'destructive' : activeTasks.length > 0 ? 'warning' : 'success'}>
                      {activeTasks.length} Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 px-4 pb-4">
                  {activeTasks.length === 0 ? (
                    <div className="text-center py-6 text-saas-muted text-sm italic">
                      No active tasks assigned. 🚀
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {activeTasks.map(ticket => (
                        <div key={ticket.id} className="bg-white/5 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-all flex justify-between items-center">
                          <div className="space-y-1 pr-2 min-w-0">
                            <div className="flex items-center space-x-1.5">
                              <span className="text-xs font-bold text-saas-primary truncate">{ticket.caseId || 'CASE-ID'}</span>
                              <Badge variant="outline" className="text-[9px] px-1 py-0 border-white/10 text-saas-muted uppercase tracking-wider">
                                {ticket.status.replace(/_/g, ' ')}
                              </Badge>
                            </div>
                            <p className="text-xs text-white font-medium truncate">{ticket.serviceType}</p>
                            <p className="text-[10px] text-saas-muted truncate">Client: {ticket.client?.name || 'Unknown'}</p>
                          </div>
                          <div className="flex items-center space-x-1 shrink-0">
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to mark task ${ticket.caseId} as completed?`)) {
                                  await deliverTicket(ticket.id, 'Task marked as completed by Admin.');
                                }
                              }}
                              className="text-green-400 hover:text-green-300 p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                              title="Mark Task as Completed"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={async (e) => {
                                e.stopPropagation();
                                if (window.confirm(`Are you sure you want to delete task ${ticket.caseId}?`)) {
                                  await deleteTicket(ticket.id);
                                }
                              }}
                              className="text-red-400 hover:text-red-300 p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                              title="Delete Task"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-saas-text tracking-tight">
            Firm Overview
          </h1>
          <p className="text-saas-muted mt-2 text-sm">Real-time metrics and AI intelligence across your practice.</p>
        </div>

        {/* Tab Buttons */}
        <div className="flex space-x-2 bg-saas-bgSecondary p-1 rounded-xl w-fit border border-white/5">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'overview' ? 'bg-saas-primary text-black font-semibold shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('workload')}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'workload' ? 'bg-saas-primary text-black font-semibold shadow-lg' : 'text-gray-400 hover:text-white'
            }`}
          >
            Staff Workload
          </button>
        </div>
      </div>

      {activeTab === 'overview' ? renderOverview() : renderWorkload()}

      {/* Task Creation Modal */}
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Assign Manual Task to Staff"
        size="md"
      >
        <form onSubmit={handleCreateTaskSubmit} className="space-y-6 text-saas-text">
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">Client Full Name</label>
              <input
                type="text"
                placeholder="Enter client's name"
                value={taskClientName}
                onChange={(e) => setTaskClientName(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">Client WhatsApp Number</label>
              <input
                type="text"
                placeholder="e.g. 919876543210"
                value={taskClientPhone}
                onChange={(e) => setTaskClientPhone(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">Service Type / Task Description</label>
              <select
                value={taskServiceType}
                onChange={(e) => setTaskServiceType(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm"
              >
                <option value="ITR Filing">ITR Filing</option>
                <option value="GST Services">GST Services</option>
                <option value="Tax Notice / Appeal">Tax Notice / Appeal</option>
                <option value="Tax Advisory">Tax Advisory</option>
                <option value="Audit Remaining">Audit Remaining</option>
                <option value="Tax Audit Pending">Tax Audit Pending</option>
                <option value="Loan Filing Trip">Loan Filing Trip</option>
                <option value="Other">Other (Manual Type)...</option>
              </select>
            </div>

            {taskServiceType === 'Other' && (
              <div>
                <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">Enter Custom Service / Task Name</label>
                <input
                  type="text"
                  placeholder="e.g. Audit Remaining, Loan Filing Trip"
                  value={customTaskServiceType}
                  onChange={(e) => setCustomTaskServiceType(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">Assign To Staff Member</label>
              <select
                value={taskStaffId}
                onChange={(e) => setTaskStaffId(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm"
                required
              >
                {staff.map(member => (
                  <option key={member.id} value={member.id}>{member.name} ({member.role || 'Staff'})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider mb-2">Notes / Additional Details (Optional)</label>
              <textarea
                placeholder="Enter special instructions or notes for the staff member"
                value={taskNotes}
                onChange={(e) => setTaskNotes(e.target.value)}
                className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-saas-primary text-sm h-24 resize-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-saas-muted uppercase tracking-wider">Attach Documents (Optional)</label>
                <button
                  type="button"
                  onClick={() => setTaskDocs(prev => [...prev, { id: Date.now().toString(), name: '', file: null }])}
                  className="text-xs font-semibold bg-saas-primary/20 text-saas-primary hover:bg-saas-primary/30 px-2 py-1 rounded transition-colors flex items-center"
                >
                  <Plus size={12} className="mr-1" /> Add Document Row
                </button>
              </div>

              {taskDocs.length === 0 ? (
                <div className="text-xs text-saas-muted italic py-3 text-center bg-black/10 rounded-xl border border-dashed border-white/5">
                  No documents attached. Click "Add Document Row" to attach files.
                </div>
              ) : (
                <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                  {taskDocs.map((doc, idx) => (
                    <div key={doc.id} className="bg-white/5 p-3 rounded-xl border border-white/5 space-y-2 relative">
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          placeholder="Document Name (e.g. Form 16, PAN)"
                          value={doc.name}
                          onChange={(e) => {
                            const val = e.target.value;
                            setTaskDocs(prev => prev.map(d => d.id === doc.id ? { ...d, name: val } : d));
                          }}
                          className="flex-1 bg-black/40 border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-saas-primary text-xs"
                          required={doc.file !== null}
                        />
                        <button
                          type="button"
                          onClick={() => setTaskDocs(prev => prev.filter(d => d.id !== doc.id))}
                          className="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 rounded hover:bg-white/5 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                      <input
                        type="file"
                        onChange={(e) => {
                          const fileObj = e.target.files ? e.target.files[0] : null;
                          setTaskDocs(prev => prev.map(d => d.id === doc.id ? { ...d, file: fileObj } : d));
                        }}
                        className="w-full text-xs text-saas-muted file:mr-3 file:py-1 file:px-2 file:rounded file:border-0 file:text-[10px] file:font-semibold file:bg-white/10 file:text-white hover:file:bg-white/15"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsTaskModalOpen(false)}
              disabled={isSubmittingTask}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmittingTask}
              className="bg-saas-primary hover:bg-saas-primary/95 text-black font-bold"
            >
              {isSubmittingTask ? 'Assigning...' : 'Assign & Notify'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
