import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { apiClient } from '../services/apiClient';
import { useAppStore } from '../store/useAppStore';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';

export const StaffDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { staff } = useAppStore();
  
  const [loading, setLoading] = useState(true);
  const [staffInfo, setStaffInfo] = useState<any>(null);
  const [performance, setPerformance] = useState<any>(null);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [assignedTickets, setAssignedTickets] = useState<any[]>([]);

  useEffect(() => {
    const fetchStaffData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [perfData, attData, staffTickets] = await Promise.all([
          apiClient.getStaffPerformance(id),
          apiClient.getStaffAttendance(id),
          apiClient.getStaffTickets(id)
        ]);
        setPerformance(perfData);
        setAttendance(attData);
        setAssignedTickets(staffTickets);
        
        // Find staff info from store or perfData
        const sInfo = staff.find(s => s.id === id);
        setStaffInfo(sInfo || { name: perfData.staffName, id: perfData.staffId });
      } catch (error) {
        console.error("Error fetching staff details:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStaffData();
  }, [id, staff]);

  if (loading) {
    return <div className="p-8 text-center text-saas-muted animate-pulse">Loading staff profile...</div>;
  }

  if (!staffInfo) {
    return <div className="p-8 text-center text-saas-danger">Staff not found.</div>;
  }

  // Active vs Completed Tickets
  const activeTickets = assignedTickets.filter(t => ['ASSIGNED_TO_STAFF', 'PENDING_ADMIN_QC'].includes(t.status));
  const completedTickets = assignedTickets.filter(t => !['ASSIGNED_TO_STAFF', 'PENDING_ADMIN_QC'].includes(t.status));

  // Workload Capacity Logic (Unique Feature)
  // Assuming 10 active tickets is 100% capacity (Overloaded)
  const MAX_CAPACITY = 10;
  const capacityPercent = Math.min(100, Math.round((activeTickets.length / MAX_CAPACITY) * 100));
  
  let capacityColor = "bg-saas-success";
  let capacityText = "Available";
  if (capacityPercent >= 80) {
    capacityColor = "bg-saas-danger";
    capacityText = "Overloaded";
  } else if (capacityPercent >= 50) {
    capacityColor = "bg-saas-warning";
    capacityText = "Optimal";
  }

  // Group Attendance by Month
  const attendanceByMonth: Record<string, any[]> = {};
  attendance.forEach(record => {
    const date = new Date(record.attendanceDate);
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!attendanceByMonth[monthYear]) attendanceByMonth[monthYear] = [];
    attendanceByMonth[monthYear].push(record);
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-12">
      <button 
        onClick={() => navigate('/dashboard/staff')}
        className="flex items-center text-saas-muted hover:text-white transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back to Directory
      </button>

      {/* Header Profile & Workload */}
      <div className="bg-saas-bgSecondary border border-white/10 p-6 rounded-xl shadow-lg relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-white/5"></div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-saas-primary/20 rounded-full flex items-center justify-center border border-saas-primary/50 mr-4">
              <User className="w-8 h-8 text-saas-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-cinzel font-bold text-saas-text tracking-tight uppercase">{staffInfo.name}</h1>
              <p className="text-saas-muted font-mono">{staffInfo.phoneNumber || 'Staff Member'}</p>
            </div>
          </div>
          
          <div className="bg-black/30 p-4 rounded-lg border border-white/5 w-full md:w-64">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-saas-muted uppercase tracking-wider font-semibold">Workload Capacity</span>
              <span className={`text-xs font-bold ${capacityPercent >= 80 ? 'text-saas-danger' : capacityPercent >= 50 ? 'text-saas-warning' : 'text-saas-success'}`}>
                {capacityText}
              </span>
            </div>
            <div className="w-full bg-black/50 rounded-full h-2.5 overflow-hidden border border-white/5">
              <div className={`h-2.5 rounded-full ${capacityColor} transition-all duration-1000`} style={{ width: `${capacityPercent}%` }}></div>
            </div>
            <div className="text-right mt-1 text-xs text-saas-muted">{activeTickets.length} / {MAX_CAPACITY} Active Files</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-black/20 border-white/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-saas-warning">{activeTickets.length}</div>
            <div className="text-xs text-saas-muted uppercase tracking-wider mt-1">Pending Files</div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 border-white/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-saas-primary">{completedTickets.length}</div>
            <div className="text-xs text-saas-muted uppercase tracking-wider mt-1">Completed Files</div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 border-white/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-saas-success">{performance?.daysPresent || 0}</div>
            <div className="text-xs text-saas-muted uppercase tracking-wider mt-1">Days Present</div>
          </CardContent>
        </Card>
        <Card className="bg-black/20 border-white/5">
          <CardContent className="p-4 text-center">
            <div className="text-3xl font-bold text-saas-danger">{performance?.daysAbsent || 0}</div>
            <div className="text-xs text-saas-muted uppercase tracking-wider mt-1">Days Absent</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Assigned & Completed Files */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-white/10">
              <CardTitle className="flex items-center text-saas-warning">
                <Clock className="w-5 h-5 mr-2" /> Currently Assigned ({activeTickets.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {activeTickets.length === 0 ? (
                <div className="p-6 text-center text-saas-muted">No active files assigned.</div>
              ) : (
                <div className="divide-y divide-white/5">
                  {activeTickets.map(ticket => (
                    <div key={ticket.id} className="p-4 hover:bg-white/[0.02] transition-colors cursor-pointer" onClick={() => navigate(`/dashboard/clients/${ticket.client?.id}`)}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <span className="font-mono text-xs text-saas-primary bg-saas-primary/10 px-2 py-1 rounded border border-saas-primary/20 mr-2">{ticket.caseId}</span>
                          <span className="font-medium text-saas-text">{ticket.serviceType}</span>
                        </div>
                        <span className="text-xs text-saas-warning bg-saas-warning/10 px-2 py-1 rounded-full">{ticket.status.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="text-sm text-saas-muted mb-2">Client: {ticket.client?.name || ticket.client?.phoneNumber}</div>
                      <div className="w-full bg-black/40 rounded-full h-1.5 mb-1">
                        <div className="bg-saas-primary h-1.5 rounded-full" style={{ width: `${ticket.progressPercent || 0}%` }}></div>
                      </div>
                      <div className="text-xs text-right text-saas-muted">{ticket.progressPercent || 0}% Progress</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3 border-b border-white/10">
              <CardTitle className="flex items-center text-saas-primary">
                <CheckCircle2 className="w-5 h-5 mr-2" /> Recently Completed ({completedTickets.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {completedTickets.length === 0 ? (
                <div className="p-6 text-center text-saas-muted">No completed files yet.</div>
              ) : (
                <div className="divide-y divide-white/5 max-h-[400px] overflow-y-auto">
                  {completedTickets.slice(0, 10).map(ticket => (
                    <div key={ticket.id} className="p-4 opacity-75 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => navigate(`/dashboard/clients/${ticket.client?.id}`)}>
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className="font-mono text-xs text-saas-muted mr-2">{ticket.caseId}</span>
                          <span className="font-medium text-saas-text">{ticket.serviceType}</span>
                        </div>
                        <span className="text-xs text-saas-success bg-saas-success/10 px-2 py-1 rounded-full">{ticket.status.replace(/_/g, ' ')}</span>
                      </div>
                      <div className="text-sm text-saas-muted">Client: {ticket.client?.name || ticket.client?.phoneNumber}</div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Month-wise Attendance */}
        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader className="pb-3 border-b border-white/10 bg-black/20">
              <CardTitle className="flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-saas-primary" /> Attendance Log
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 max-h-[800px] overflow-y-auto">
              {Object.keys(attendanceByMonth).length === 0 ? (
                <div className="p-6 text-center text-saas-muted">No attendance records found.</div>
              ) : (
                Object.keys(attendanceByMonth).map(month => (
                  <div key={month} className="border-b border-white/5 last:border-0">
                    <div className="bg-black/40 px-4 py-2 text-xs font-semibold text-saas-muted uppercase tracking-wider sticky top-0 backdrop-blur-md">
                      {month}
                    </div>
                    <div className="divide-y divide-white/5">
                      {attendanceByMonth[month].map(record => (
                        <div key={record.id} className="p-4 flex justify-between items-center hover:bg-white/[0.02]">
                          <div className="flex items-center">
                            <div className={`w-2.5 h-2.5 rounded-full mr-3 ${record.status === 'PRESENT' ? 'bg-saas-success shadow-[0_0_8px_rgba(16,185,129,0.5)]' : record.status === 'ABSENT' ? 'bg-saas-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-saas-warning'}`}></div>
                            <div>
                              <div className="text-saas-text text-sm">{new Date(record.attendanceDate).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' })}</div>
                              {record.reason && <div className="text-xs text-saas-muted mt-0.5">{record.reason}</div>}
                            </div>
                          </div>
                          {record.photoUrl && (
                            <a href={record.photoUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors">
                              View Photo
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
