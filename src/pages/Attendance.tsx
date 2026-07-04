import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { Staff } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  staff: Staff;
  attendanceDate: string;
  status: string;
  checkInTime: string;
  photoUrl: string;
  locationLink: string;
}

export const Attendance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'calendar' | 'monthly'>('today');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // For calendar view
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  // For monthly view
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7)); // YYYY-MM

  useEffect(() => {
    fetchData();
  }, [activeTab, selectedDate, selectedMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const staff = await apiClient.getStaff();
      setStaffList(staff);

      if (activeTab === 'today') {
        const data = await apiClient.fetchTodayAttendance();
        setAttendanceData(data);
      } else if (activeTab === 'calendar') {
        const data = await apiClient.fetchAttendanceByDate(selectedDate);
        setAttendanceData(data);
      } else if (activeTab === 'monthly') {
        const [year, month] = selectedMonth.split('-');
        const data = await apiClient.fetchAttendanceByMonth(parseInt(year), parseInt(month));
        setAttendanceData(data);
      }
    } catch (error) {
      console.error('Failed to fetch attendance data', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTodayView = () => {
    const presentCount = attendanceData.filter(a => a.status === 'PRESENT').length;
    const absentCount = attendanceData.filter(a => a.status === 'ABSENT').length;
    const pendingStaff = staffList.filter(s => !attendanceData.some(a => a.staff.id === s.id));

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-saas-bgSecondary border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-saas-muted flex items-center">
                <CheckCircle2 className="w-4 h-4 mr-2 text-green-500" />
                Present
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{presentCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-saas-bgSecondary border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-saas-muted flex items-center">
                <XCircle className="w-4 h-4 mr-2 text-red-500" />
                Absent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{absentCount}</div>
            </CardContent>
          </Card>
          <Card className="bg-saas-bgSecondary border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-saas-muted flex items-center">
                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{pendingStaff.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="bg-saas-bgSecondary rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-saas-muted text-sm">
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Time</th>
                <th className="p-4 font-medium">Location</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(staff => {
                const record = attendanceData.find(a => a.staff.id === staff.id);
                return (
                  <tr key={staff.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4">
                      <div className="font-medium text-white">{staff.name}</div>
                      <div className="text-xs text-saas-muted">{staff.role}</div>
                    </td>
                    <td className="p-4">
                      {record ? (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          record.status === 'PRESENT' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {record.status}
                        </span>
                      ) : (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                          PENDING
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {record?.checkInTime ? new Date(record.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '-'}
                    </td>
                    <td className="p-4 text-sm">
                      {record?.locationLink ? (
                        <a href={record.locationLink} target="_blank" rel="noopener noreferrer" className="text-saas-primary hover:underline">
                          View Map
                        </a>
                      ) : '-'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    // Group attendance by staff
    const staffStats = staffList.map(staff => {
      const records = attendanceData.filter(a => a.staff.id === staff.id);
      const present = records.filter(a => a.status === 'PRESENT').length;
      const absent = records.filter(a => a.status === 'ABSENT').length;
      return { staff, present, absent, total: records.length };
    });

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4 mb-4">
          <label className="text-saas-muted font-medium">Select Month:</label>
          <input 
            type="month" 
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-saas-bgSecondary border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-saas-primary"
          />
        </div>

        <div className="bg-saas-bgSecondary rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-saas-muted text-sm">
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium text-center">Days Present</th>
                <th className="p-4 font-medium text-center">Days Absent</th>
                <th className="p-4 font-medium text-center">Total Marked</th>
              </tr>
            </thead>
            <tbody>
              {staffStats.map(({ staff, present, absent, total }) => (
                <tr key={staff.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="p-4">
                    <div className="font-medium text-white">{staff.name}</div>
                    <div className="text-xs text-saas-muted">{staff.role}</div>
                  </td>
                  <td className="p-4 text-center text-green-400 font-medium">{present}</td>
                  <td className="p-4 text-center text-red-400 font-medium">{absent}</td>
                  <td className="p-4 text-center text-gray-300">{total}</td>
                </tr>
              ))}
              {staffStats.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-saas-muted">No data available for this month.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-cinzel font-bold text-saas-text tracking-tight uppercase flex items-center">
            <CalendarIcon className="mr-3 text-saas-primary" size={32} />
            Staff Attendance
          </h1>
          <p className="text-saas-muted mt-2">Monitor daily and monthly staff attendance records.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 bg-saas-bgSecondary p-1 rounded-xl w-fit">
        <button
          onClick={() => setActiveTab('today')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'today' ? 'bg-saas-primary text-black shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          Today
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'calendar' ? 'bg-saas-primary text-black shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          Calendar
        </button>
        <button
          onClick={() => setActiveTab('monthly')}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'monthly' ? 'bg-saas-primary text-black shadow-lg' : 'text-gray-400 hover:text-white'
          }`}
        >
          Monthly Report
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saas-primary"></div>
        </div>
      ) : (
        <>
          {activeTab === 'today' && renderTodayView()}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 mb-4">
                <label className="text-saas-muted font-medium">Select Date:</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-saas-bgSecondary border border-white/10 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-saas-primary"
                />
              </div>
              {renderTodayView()}
            </div>
          )}
          {activeTab === 'monthly' && renderMonthlyView()}
        </>
      )}
    </div>
  );
};
