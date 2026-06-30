import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, FileText, IndianRupee, Sparkles, CheckCircle2, ShieldCheck, FileSearch, Edit2, Info, User } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { Card, CardContent } from '../components/ui/Card';
import { Tabs } from '../components/ui/Tabs';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';

export const ClientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tis');
  const [isEditingPricing, setIsEditingPricing] = useState(false);
  const [overrideFee, setOverrideFee] = useState("");
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [requestedDoc, setRequestedDoc] = useState("Bank Statement");
  const [customDoc, setCustomDoc] = useState("");
  const [staffList, setStaffList] = useState<any[]>([]);
  const [selectedStaff, setSelectedStaff] = useState("");
  const [assignmentPriority, setAssignmentPriority] = useState("HIGH");
  const [assignmentNotes, setAssignmentNotes] = useState("");
  const [assignmentDeadline, setAssignmentDeadline] = useState("");
  const [assignmentLanguage, setAssignmentLanguage] = useState("Hindi");
  const [assignmentExpectedDuration, setAssignmentExpectedDuration] = useState("");
  const [assignmentCategory, setAssignmentCategory] = useState("Standard");
  const [assignmentUrgency, setAssignmentUrgency] = useState("Normal");
  const [assignmentRemarks, setAssignmentRemarks] = useState("");

  useEffect(() => {
    if (id) {
      apiClient.fetchClientSummary(id).then(data => {
        setSummary(data);
        const isItr = data.serviceType?.toLowerCase().includes('itr') ?? false;
        
        if (!isItr && activeTab === 'tis') {
            setActiveTab('documents');
        }
        
        if (data.feeQuoted) {
          setOverrideFee(data.feeQuoted.toString());
        } else if (!isItr) {
          setOverrideFee("2000");
        }
        
        if (!isItr && !assignmentNotes) {
            setAssignmentNotes(`Call krna hai ${data.serviceType} ke liye`);
        }
        
        setLoading(false);
      }).catch(e => {
        console.error("Failed to fetch client summary", e);
        setLoading(false);
      });
      apiClient.fetchStaff().then(data => setStaffList(data)).catch(e => console.error(e));
    }
  }, [id]);

  if (loading) {
    return <div className="text-saas-text p-8 animate-pulse">Loading client details...</div>;
  }

  if (!summary) {
    return <div className="text-saas-text p-8">Client not found.</div>;
  }

  const handleApproveTicket = async (fee: number, reason: string = "") => {
    if (!summary?.latestTicketId) {
        alert("No active ticket found for this client.");
        return;
    }
    try {
        await apiClient.approveTicket(summary.latestTicketId, fee, reason);
        alert("Payment link sent successfully via WhatsApp!");
        const data = await apiClient.fetchClientSummary(id!);
        setSummary(data);
        setIsEditingPricing(false);
    } catch (error) {
        console.error("Failed to approve ticket", error);
        alert("Failed to send payment link. Check console for details.");
    }
  };

  const handleManualPaymentApprove = async () => {
    if (!summary?.latestTicketId) return;
    try {
        if (summary.status === 'PENDING_ADMIN_APPROVAL') {
           await apiClient.approveTicket(summary.latestTicketId, Number(overrideFee) || (summary.feeQuoted || 4449), "Manual Payment Bypass");
        }
        await apiClient.verifyPayment(summary.latestTicketId);
        alert("Payment marked as PAID manually!");
        const data = await apiClient.fetchClientSummary(id!);
        setSummary(data);
    } catch (error) {
        console.error("Failed to mark payment as paid", error);
        alert("Failed to mark payment as paid. Check console.");
    }
  };

  const handleAssignWork = async () => {
    if (!summary?.latestTicketId) return;
    if (!selectedStaff) {
        alert("Please select a staff member first.");
        return;
    }
    try {
        const payload = {
            priority: assignmentPriority,
            notes: assignmentNotes,
            deadline: assignmentDeadline,
            language: assignmentLanguage,
            expectedDuration: assignmentExpectedDuration,
            category: assignmentCategory,
            urgency: assignmentUrgency,
            remarks: assignmentRemarks
        };
        await apiClient.assignTicket(summary.latestTicketId, selectedStaff, payload);
        alert("Ticket assigned successfully!");
        const data = await apiClient.fetchClientSummary(id!);
        setSummary(data);
    } catch (e) {
        console.error("Failed to assign ticket", e);
        alert("Failed to assign ticket.");
    }
  };

  const isItr = summary.serviceType?.toLowerCase().includes('itr') ?? false;

  const tabOptions = [
    { label: 'Documents', value: 'documents', icon: <FileText className="w-4 h-4" /> },
    ...(isItr ? [
      { label: 'TIS Data', value: 'tis', icon: <FileText className="w-4 h-4" /> },
      { label: 'TDS Data', value: 'tds', icon: <FileSearch className="w-4 h-4" /> }
    ] : []),
    { label: 'Payments', value: 'payments', icon: <IndianRupee className="w-4 h-4" /> },
    { label: 'Assign Work', value: 'assign', icon: <User className="w-4 h-4" /> },
    { label: 'History', value: 'history', icon: <Info className="w-4 h-4" /> },
  ];

  const handleRequestDocument = () => {
    const docToRequest = requestedDoc === "Other" ? customDoc.trim() : requestedDoc;
    if (!docToRequest) return;
    alert(`WhatsApp reminder sent to client requesting: ${docToRequest}`);
    if (requestedDoc !== "Other") {
       setRequestedDoc("");
    }
    setCustomDoc("");
  };

  const readinessScore = summary.readinessScore || 0;
  const isReady = readinessScore >= 90;

  const ex = summary.extractedData || {};
  let rawJsonObj: any = {};
  try {
      if (ex.rawJson) rawJsonObj = JSON.parse(ex.rawJson);
  } catch (e) {
      console.error("Failed to parse rawJson", e);
  }
  
  const deductors = rawJsonObj.deductors || [];
  const tisRows = rawJsonObj.tisRows || [];

  const formatInr = (val: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);
  const itrForm = ex.suggestedItr || "ITR-2";
  const feeQuoted = summary.feeQuoted || (!isItr ? 2000 : 4449);
  
  const aiAnalysis = summary.aiAnalysis || {};

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Premium Hero Section */}
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.2)] flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-6">
          <button onClick={() => navigate(-1)} className="p-3 bg-white/5 hover:bg-white/10 rounded-full transition-colors text-saas-text border border-white/10">
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div>
            <div className="flex items-center space-x-4 mb-2">
              <h1 className="text-3xl font-bold font-serif text-white tracking-wide uppercase">{summary.clientProfile.name}</h1>
              {isItr ? (
                <>
                  <div className="flex items-center bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 text-sm font-semibold">
                    <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                    {isReady ? 'Ready For Review' : 'Missing Documents'}
                  </div>
                  <Badge className="bg-saas-primary/20 text-saas-primary border-saas-primary/30">{itrForm}</Badge>
                </>
              ) : (
                <div className="flex items-center bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 text-sm font-semibold">
                  {summary.serviceType}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-4 text-sm text-saas-muted font-medium">
              {isItr && <><span className="flex items-center"><Sparkles className="w-4 h-4 mr-1 text-saas-primary" /> Confidence {ex.riskScore === 'Low' ? '98%' : '85%'}</span><span>•</span></>}
              <span>FY {ex.financialYear || '2024-25'}</span>
              <span>•</span>
              <span>Last Updated: Just now</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 gap-6">
        
        <div className="space-y-6">
          <Tabs tabs={tabOptions} defaultValue={activeTab} onValueChange={setActiveTab} />

          <Card className="min-h-[500px]">
            <CardContent className="p-6">
              
              {/* TAB 0: DOCUMENTS */}
              {activeTab === 'documents' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Document Center</h3>
                      <p className="text-saas-muted">View uploaded documents or request missing ones via WhatsApp.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-6 mb-6">
                    <h4 className="text-lg font-bold text-white mb-4">Request Additional Documents</h4>
                    <div className="flex items-center space-x-4">
                      <select 
                        value={requestedDoc} 
                        onChange={(e) => setRequestedDoc(e.target.value)}
                        className="bg-black/30 border border-white/20 text-white p-3 rounded-xl flex-1 outline-none"
                      >
                        <option value="" disabled>Select Document...</option>
                        <option value="Bank Statement">Bank Statement (Last 1 Year)</option>
                        <option value="PAN Card">PAN Card</option>
                        <option value="Aadhaar Card">Aadhaar Card</option>
                        <option value="Form 16">Form 16</option>
                        <option value="Capital Gains Statement">Capital Gains Statement</option>
                        <option value="Other">Other (Type manually...)</option>
                      </select>
                      {requestedDoc === 'Other' && (
                        <input
                          type="text"
                          value={customDoc}
                          onChange={(e) => setCustomDoc(e.target.value)}
                          placeholder="Type document name..."
                          className="bg-black/30 border border-white/20 text-white p-3 rounded-xl flex-1 outline-none"
                          autoFocus
                        />
                      )}
                      <Button onClick={handleRequestDocument} className="bg-saas-primary hover:bg-saas-primary/90 text-white px-6 py-3">
                        Send WhatsApp Reminder
                      </Button>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden p-6">
                    <h4 className="text-lg font-bold text-white mb-4">Uploaded Documents</h4>
                    {summary?.receivedDocuments && summary.receivedDocuments.length > 0 ? (
                      <div className="space-y-3">
                        {summary.receivedDocuments.map((doc: any, idx: number) => (
                           <div key={idx} className="flex justify-between items-center bg-black/20 p-4 rounded-xl border border-white/5">
                             <span className="text-white font-medium">{doc.name}</span>
                             {doc.url ? (
                               <a href={doc.url} target="_blank" rel="noreferrer" className="text-saas-primary hover:underline text-sm font-bold flex items-center">
                                 View Document <ArrowLeft className="w-4 h-4 ml-1 rotate-135" />
                               </a>
                             ) : (
                               <span className="text-saas-muted text-sm italic">No Link</span>
                             )}
                           </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-saas-muted text-center py-4">No documents uploaded yet.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 1: TIS */}
              {activeTab === 'tis' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Taxpayer Information Summary (TIS)</h3>
                      <p className="text-saas-muted">Exact extraction from portal PDF without any recalculations.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-black/20">
                          <TableHead className="font-bold text-white w-16">Sr</TableHead>
                          <TableHead className="font-bold text-white">Category</TableHead>
                          <TableHead className="font-bold text-white text-right">Processed (₹)</TableHead>
                          <TableHead className="font-bold text-white text-right">Accepted (₹)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tisRows.length > 0 ? tisRows.map((row: any, idx: number) => (
                           <TableRow key={idx}>
                             <TableCell className="font-medium text-white">{row.srNo || idx + 1}</TableCell>
                             <TableCell>{row.category}</TableCell>
                             <TableCell className="text-right text-saas-muted">{formatInr(row.processedValue)}</TableCell>
                             <TableCell className="text-right font-semibold text-white">{formatInr(row.acceptedValue)}</TableCell>
                           </TableRow>
                        )) : (
                           <TableRow>
                             <TableCell colSpan={4} className="text-center py-8 text-saas-muted">No TIS data extracted</TableCell>
                           </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* TAB 2: TDS */}
              {activeTab === 'tds' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Form 26AS (TDS/TCS)</h3>
                      <p className="text-saas-muted">Exact extraction from Part A/A1 of Form 26AS.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-black/20">
                          <TableHead className="font-bold text-white w-16">Sr</TableHead>
                          <TableHead className="font-bold text-white">Deductor Name</TableHead>
                          <TableHead className="font-bold text-white">Section</TableHead>
                          <TableHead className="font-bold text-white text-right">Amount Paid (₹)</TableHead>
                          <TableHead className="font-bold text-white text-right">TDS (₹)</TableHead>
                          <TableHead className="font-bold text-white text-right">Deposited (₹)</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {deductors.length > 0 ? deductors.map((row: any, idx: number) => (
                           <TableRow key={idx}>
                             <TableCell className="font-medium text-white">{idx + 1}</TableCell>
                             <TableCell>{row.name || row.deductorName}</TableCell>
                             <TableCell>{row.section || "-"}</TableCell>
                             <TableCell className="text-right text-saas-muted">{formatInr(row.amountPaid)}</TableCell>
                             <TableCell className="text-right text-saas-danger font-semibold">{formatInr(row.tdsDeducted)}</TableCell>
                             <TableCell className="text-right text-saas-success font-semibold">{formatInr(row.tdsDeposited)}</TableCell>
                           </TableRow>
                        )) : (
                           <TableRow>
                             <TableCell colSpan={6} className="text-center py-8 text-saas-muted">No 26AS data extracted</TableCell>
                           </TableRow>
                        )}
                        {deductors.length > 0 && (
                           <TableRow className="bg-black/40">
                             <TableCell colSpan={3} className="font-bold text-white">TOTAL TDS</TableCell>
                             <TableCell className="text-right font-bold text-white">{formatInr(deductors.reduce((acc: number, cur: any) => acc + (cur.amountPaid || 0), 0))}</TableCell>
                             <TableCell className="text-right font-bold text-saas-primary">{formatInr(deductors.reduce((acc: number, cur: any) => acc + (cur.tdsDeducted || 0), 0))}</TableCell>
                             <TableCell className="text-right font-bold text-saas-primary">{formatInr(deductors.reduce((acc: number, cur: any) => acc + (cur.tdsDeposited || 0), 0))}</TableCell>
                           </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

              {/* TAB 3: PAYMENTS */}
              {activeTab === 'payments' && (
                <div className="space-y-8 animate-in fade-in">
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Payment Setup Box */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-6">Payment Configuration</h3>
                      <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-saas-primary/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                        
                        <h4 className="text-sm text-saas-muted uppercase tracking-wider mb-4">Fee Breakdown</h4>
                        
                        <div className="space-y-4 mb-8">
                          <div className="flex justify-between items-center text-saas-text">
                            <span>Base Fee ({itrForm})</span>
                            <span className="font-medium text-white">{formatInr(feeQuoted)}</span>
                          </div>
                          
                          {isEditingPricing ? (
                             <div className="flex items-center space-x-3 bg-black/20 p-3 rounded-xl border border-saas-primary/20">
                                <IndianRupee className="w-5 h-5 text-saas-muted" />
                                <input 
                                  type="number" 
                                  className="bg-transparent border-none outline-none text-white font-bold flex-1"
                                  value={overrideFee}
                                  onChange={(e) => setOverrideFee(e.target.value)}
                                  autoFocus
                                />
                                <Button size="sm" onClick={() => setIsEditingPricing(false)} className="bg-white/10 hover:bg-white/20 text-white">Save</Button>
                             </div>
                          ) : (
                             <div className="flex justify-between items-center text-xl font-bold text-white group-hover:bg-white/5 p-3 -mx-3 rounded-xl transition-colors">
                               <span>Final Suggested Fee</span>
                               <div className="flex items-center">
                                  <span className="text-saas-primary mr-3">{formatInr(Number(overrideFee) || feeQuoted)}</span>
                                  <button onClick={() => setIsEditingPricing(true)} className="p-2 bg-white/5 hover:bg-saas-primary/20 rounded-full transition-colors text-saas-muted hover:text-saas-primary">
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                               </div>
                             </div>
                          )}
                        </div>

                        <div className="space-y-3">
                          <Button 
                            onClick={() => handleApproveTicket(Number(overrideFee) || feeQuoted)} 
                            className="w-full bg-saas-primary hover:bg-saas-primary/90 text-white py-6 text-lg shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:shadow-[0_0_30px_rgba(249,115,22,0.5)]"
                          >
                            Approve & Send Link for {formatInr(Number(overrideFee) || feeQuoted)}
                          </Button>
                          <Button 
                            onClick={handleManualPaymentApprove} 
                            className="w-full bg-transparent border border-saas-primary/30 hover:bg-saas-primary/10 text-white py-6 text-lg transition-all"
                          >
                            Verify & Mark as Paid
                          </Button>
                        </div>
                        
                        {summary?.paymentProofUrl && (
                           <div className="mt-6 pt-6 border-t border-white/10">
                             <h4 className="text-sm text-saas-muted uppercase tracking-wider mb-4">Payment Proof Received</h4>
                             {summary.paymentProofUrl.startsWith('TEXT: ') ? (
                                <div className="p-4 bg-black/20 rounded-xl text-white">
                                  {summary.paymentProofUrl.replace('TEXT: ', '')}
                                </div>
                             ) : (
                                <a href={summary.paymentProofUrl} target="_blank" rel="noreferrer" className="block relative group/img rounded-xl overflow-hidden border border-white/10">
                                  <img src={summary.paymentProofUrl} alt="Payment Proof" className="w-full h-48 object-cover opacity-80 group-hover/img:opacity-100 transition-opacity" />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity">
                                    <span className="text-white font-bold flex items-center">View Full Image</span>
                                  </div>
                                </a>
                             )}
                           </div>
                        )}
                      </div>
                    </div>

                    {/* AI Reasoning Box */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-6">{isItr ? "AI Reasoning Engine" : "Service Context"}</h3>
                      <div className="bg-saas-primary/5 border border-saas-primary/20 p-6 rounded-2xl relative h-full">
                        <div className="flex items-center space-x-3 mb-4">
                           <div className="p-2 bg-saas-primary/20 rounded-lg">
                             <Sparkles className="w-6 h-6 text-saas-primary" />
                           </div>
                           <h4 className="text-lg font-bold text-white">
                              {isItr ? `Why ${itrForm}?` : `About ${summary.serviceType}`}
                           </h4>
                        </div>
                        
                        <div className="prose prose-invert prose-sm">
                           {isItr ? (
                               aiAnalysis.riskSummary ? (
                                  <p className="text-saas-text leading-relaxed">{aiAnalysis.riskSummary}</p>
                               ) : (
                                  <ul className="space-y-3 mt-4">
                                     {rawJsonObj?.income?.totalCapitalGains > 0 && (
                                       <li className="flex items-start text-saas-text">
                                          <CheckCircle2 className="w-5 h-5 text-saas-primary mr-3 shrink-0 mt-0.5" />
                                          <span>Capital Gain of <strong>{formatInr(rawJsonObj.income.totalCapitalGains)}</strong> detected, which mandates {itrForm}.</span>
                                       </li>
                                     )}
                                     {rawJsonObj?.income?.dividend > 0 && (
                                       <li className="flex items-start text-saas-text">
                                          <CheckCircle2 className="w-5 h-5 text-saas-primary mr-3 shrink-0 mt-0.5" />
                                          <span>Dividend Income reported.</span>
                                       </li>
                                     )}
                                     <li className="flex items-start text-saas-text">
                                        <CheckCircle2 className="w-5 h-5 text-saas-primary mr-3 shrink-0 mt-0.5" />
                                        <span>Interest Income across savings & deposits analyzed.</span>
                                     </li>
                                     <li className="flex items-start text-saas-text">
                                        <CheckCircle2 className="w-5 h-5 text-saas-primary mr-3 shrink-0 mt-0.5" />
                                        <span>No Business or Professional Income detected.</span>
                                     </li>
                                  </ul>
                               )
                           ) : (
                               <p className="text-saas-text leading-relaxed">
                                 This is a {summary.serviceType} request. Standard processing logic applies. Please ensure all required communication is handled via the configured workflow.
                               </p>
                           )}
                        </div>
                        
                        {isItr && (
                            <div className="mt-8 flex items-center p-3 bg-white/5 rounded-xl border border-white/10 text-sm text-saas-muted">
                               <Info className="w-4 h-4 mr-2 text-blue-400" />
                               Engine has verified AIS & TIS cross-matches.
                            </div>
                        )}
                      </div>
                    </div>
                  </div>

                </div>
              )}
              
              {/* TAB 4: ASSIGN WORK */}
              {activeTab === 'assign' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Staff Assignment</h3>
                      <p className="text-saas-muted">Assign this ticket to a team member for processing.</p>
                    </div>
                  </div>

                  <div className="bg-white/5 border border-white/10 p-6 rounded-2xl relative overflow-hidden">
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm text-saas-muted uppercase tracking-wider mb-2">Select Staff</label>
                        <select 
                          value={selectedStaff} 
                          onChange={(e) => setSelectedStaff(e.target.value)}
                          className="w-full bg-black/30 border border-white/20 text-white p-3 rounded-xl outline-none"
                        >
                          <option value="" disabled>Select a staff member...</option>
                          {staffList.map((staff: any) => (
                             <option key={staff.id} value={staff.id}>{staff.name} ({staff.phoneNumber})</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-saas-muted uppercase tracking-wider mb-2">Priority Level</label>
                          <select 
                            value={assignmentPriority} 
                            onChange={(e) => setAssignmentPriority(e.target.value)}
                            className="w-full bg-black/30 border border-white/20 text-white p-3 rounded-xl outline-none"
                          >
                            <option value="HIGH">High Priority</option>
                            <option value="MEDIUM">Medium Priority</option>
                            <option value="LOW">Low Priority</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-saas-muted uppercase tracking-wider mb-2">Deadline</label>
                          <input 
                            type="text" 
                            value={assignmentDeadline}
                            onChange={(e) => setAssignmentDeadline(e.target.value)}
                            placeholder="e.g. Tomorrow 5 PM"
                            className="w-full bg-black/30 border border-white/20 text-white p-3 rounded-xl outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-saas-muted uppercase tracking-wider mb-2">Language</label>
                          <input 
                            type="text" 
                            value={assignmentLanguage}
                            onChange={(e) => setAssignmentLanguage(e.target.value)}
                            placeholder="e.g. Hindi/English"
                            className="w-full bg-black/30 border border-white/20 text-white p-3 rounded-xl outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-saas-muted uppercase tracking-wider mb-2">Expected Duration</label>
                          <input 
                            type="text" 
                            value={assignmentExpectedDuration}
                            onChange={(e) => setAssignmentExpectedDuration(e.target.value)}
                            placeholder="e.g. 2 Hours"
                            className="w-full bg-black/30 border border-white/20 text-white p-3 rounded-xl outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-saas-muted uppercase tracking-wider mb-2">Internal Notes / Instructions</label>
                        <textarea 
                          value={assignmentNotes} 
                          onChange={(e) => setAssignmentNotes(e.target.value)}
                          placeholder="e.g. Please verify capital gains manually..."
                          className="w-full bg-black/30 border border-white/20 text-white p-3 rounded-xl outline-none min-h-[100px]"
                        ></textarea>
                      </div>

                      <Button 
                        onClick={handleAssignWork} 
                        className="w-full bg-saas-primary hover:bg-saas-primary/90 text-white py-4 text-lg shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all"
                      >
                        Assign Ticket
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: HISTORY */}
              {activeTab === 'history' && (
                <div className="space-y-6 animate-in fade-in">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Past Service History</h3>
                      <p className="text-saas-muted">Review previous and ongoing tickets for this client.</p>
                    </div>
                  </div>
                  
                  <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/10 hover:bg-transparent">
                          <TableHead className="text-saas-muted">Date</TableHead>
                          <TableHead className="text-saas-muted">Service Type</TableHead>
                          <TableHead className="text-saas-muted">Status</TableHead>
                          <TableHead className="text-saas-muted">Assigned To</TableHead>
                          <TableHead className="text-saas-muted text-right">Fee Quoted</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {summary?.previousTickets && summary.previousTickets.length > 0 ? (
                          summary.previousTickets.map((ticket: any) => (
                            <TableRow key={ticket.id} className="border-white/5 hover:bg-white/5 transition-colors">
                              <TableCell className="font-medium text-white">{ticket.createdAt || 'N/A'}</TableCell>
                              <TableCell className="text-saas-text font-medium">{ticket.serviceType}</TableCell>
                              <TableCell>
                                <Badge variant="outline" className="border-saas-primary/30 text-saas-primary bg-saas-primary/10">
                                  {ticket.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-saas-text">{ticket.assignedStaffName || 'Unassigned'}</TableCell>
                              <TableCell className="text-right text-white font-bold">{ticket.fee ? formatInr(ticket.fee) : '-'}</TableCell>
                            </TableRow>
                          ))
                        ) : (
                           <TableRow className="border-none hover:bg-transparent">
                             <TableCell colSpan={5} className="text-center text-saas-muted py-8">
                               No history found for this client.
                             </TableCell>
                           </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
