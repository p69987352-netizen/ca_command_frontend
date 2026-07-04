import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, UserPlus, Users, CalendarDays } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { apiClient } from '../services/apiClient';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/Table';
import { Button } from '../components/ui/Button';

export const StaffManagement: React.FC = () => {
  const { staff, fetchData, isLoading } = useAppStore();
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [activeTab, setActiveTab] = useState<'directory' | 'attendance'>('directory');
  
  const [todayAttendance, setTodayAttendance] = useState<any[]>([]);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (activeTab === 'attendance') {
      const fetchAttendance = async () => {
        setLoadingAttendance(true);
        try {
          const data = await apiClient.getTodayAttendance();
          setTodayAttendance(data);
        } catch (error) {
          console.error("Failed to fetch today's attendance", error);
        } finally {
          setLoadingAttendance(false);
        }
      };
      fetchAttendance();
    }
  }, [activeTab]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    try {
      await apiClient.addStaff(name, phone);
      setName('');
      setPhone('');
      fetchData();
    } catch (err) {
      console.error(err);
      alert('Failed to add staff');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this staff member?')) {
      try {
        await apiClient.removeStaff(id);
        fetchData();
      } catch (err) {
        console.error(err);
        alert('Failed to delete staff');
      }
    }
  };

  const handleSendReminders = async () => {
    try {
      await apiClient.sendAttendanceReminders();
      alert('Attendance reminders dispatched successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to send reminders.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-saas-text tracking-tight uppercase">Staff Management</h1>
          <p className="text-saas-muted mt-1 text-sm">Manage firm employees, assign files, and track attendance.</p>
        </div>
        <Button onClick={handleSendReminders} variant="secondary" className="flex items-center">
          <span className="mr-2">🔔</span> Send Attendance Reminders
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-white/10 pb-px">
        <button
          onClick={() => setActiveTab('directory')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'directory' 
              ? 'border-saas-primary text-saas-primary' 
              : 'border-transparent text-saas-muted hover:text-saas-text hover:border-white/20'
          }`}
        >
          <div className="flex items-center">
            <Users className="w-4 h-4 mr-2" />
            Staff Directory
          </div>
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'attendance' 
              ? 'border-saas-primary text-saas-primary' 
              : 'border-transparent text-saas-muted hover:text-saas-text hover:border-white/20'
          }`}
        >
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2" />
            Today's Attendance
          </div>
        </button>
      </div>

      {/* Tab Content: Directory */}
      {activeTab === 'directory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
          <Card className="lg:col-span-1 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="w-5 h-5 mr-2 text-saas-primary" /> Add Staff Member
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddStaff} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-saas-muted mb-1">Name</label>
                  <input 
                    type="text" 
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full bg-saas-bgSecondary border border-white/10 rounded-lg px-4 py-2 text-saas-text focus:outline-none focus:border-saas-primary transition-colors"
                    placeholder="e.g. Ramesh Kumar"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-saas-muted mb-1">WhatsApp Number</label>
                  <input 
                    type="text" 
                    value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full bg-saas-bgSecondary border border-white/10 rounded-lg px-4 py-2 text-saas-text focus:outline-none focus:border-saas-primary transition-colors"
                    placeholder="e.g. 919876543210"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Add to Roster
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="w-5 h-5 mr-2 text-saas-primary" /> Active Staff Roster
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 text-center text-saas-muted">Loading staff data...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Staff Name</TableHead>
                      <TableHead>WhatsApp Number</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staff.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-saas-muted py-8">
                          No staff members found. Add your first team member!
                        </TableCell>
                      </TableRow>
                    ) : (
                      staff.map(s => (
                        <TableRow key={s.id}>
                          <TableCell>
                            <button onClick={() => navigate(`/dashboard/staff/${s.id}`)} className="font-medium text-saas-text hover:text-saas-primary hover:underline">
                              {s.name}
                            </button>
                          </TableCell>
                          <TableCell>
                            <span className="text-saas-muted font-mono text-sm">{s.phoneNumber}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className={`w-2 h-2 rounded-full mr-2 ${s.isActive ? 'bg-saas-success' : 'bg-saas-danger'}`}></div>
                              <span className="text-sm text-saas-text">{s.isActive ? 'Active' : 'Inactive'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => handleDelete(s.id)} className="text-saas-danger hover:text-saas-danger hover:bg-saas-danger/10">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tab Content: Global Attendance */}
      {activeTab === 'attendance' && (
        <Card className="animate-in fade-in">
          <CardHeader>
            <CardTitle className="flex items-center text-saas-text">
              <CalendarDays className="w-5 h-5 mr-2 text-saas-primary" /> Today's Attendance ({new Date().toLocaleDateString()})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loadingAttendance ? (
              <div className="p-8 text-center text-saas-muted animate-pulse">Loading today's attendance records...</div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Staff Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead className="text-right">Photo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {staff.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-saas-muted py-8">
                        No staff members found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    staff.map(s => {
                      const record = todayAttendance.find(a => a.staff.id === s.id);
                      let statusText = "PENDING";
                      let statusColor = "text-saas-warning";
                      let dotColor = "bg-saas-warning shadow-[0_0_8px_rgba(245,158,11,0.5)]";

                      if (record) {
                        if (record.status === 'PRESENT') {
                          statusText = "PRESENT";
                          statusColor = "text-saas-success";
                          dotColor = "bg-saas-success shadow-[0_0_8px_rgba(16,185,129,0.5)]";
                        } else if (record.status === 'ABSENT') {
                          statusText = "ABSENT";
                          statusColor = "text-saas-danger";
                          dotColor = "bg-saas-danger shadow-[0_0_8px_rgba(239,68,68,0.5)]";
                        }
                      }

                      return (
                        <TableRow key={s.id}>
                          <TableCell>
                            <button onClick={() => navigate(`/dashboard/staff/${s.id}`)} className="font-medium text-saas-text hover:text-saas-primary hover:underline">
                              {s.name}
                            </button>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className={`w-2.5 h-2.5 rounded-full mr-2 ${dotColor}`}></div>
                              <span className={`text-sm font-bold ${statusColor}`}>{statusText}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-saas-muted text-sm font-mono">
                            {record ? new Date(record.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}
                          </TableCell>
                          <TableCell className="text-saas-muted text-sm">
                            {record?.reason || '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {record?.photoUrl ? (
                              <a href={record.photoUrl} target="_blank" rel="noopener noreferrer" className="text-xs bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded transition-colors inline-block">
                                View
                              </a>
                            ) : (
                              <span className="text-saas-muted text-xs">-</span>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
