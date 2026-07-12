import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { Staff } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, MapPin, Check, AlertTriangle, Globe, HelpCircle, Bell, Send } from 'lucide-react';

interface AttendanceRecord {
  id: string;
  staff: Staff;
  attendanceDate: string;
  status: string;
  createdAt: string;
  createdAtIso?: string;
  photoUrl: string;
  locationLink: string;
  exitPhotoUrl?: string;
  exitTime?: string;
  exitTimeIso?: string;
  exitLocationLink?: string;
  isVerifiedEntry?: boolean;
  isVerifiedExit?: boolean;
}

const formatWallClockTime = (timeStr: string | undefined): string => {
  if (!timeStr) return '-';
  try {
    if (timeStr.includes('T')) {
      const timePart = timeStr.split('T')[1];
      const [hoursStr, minutesStr] = timePart.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 === 0 ? 12 : hours % 12;
      const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
      return `${displayHours.toString().padStart(2, '0')}:${displayMinutes} ${ampm}`;
    }
    return new Date(timeStr).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (e) {
    return '-';
  }
};

const isLateCheckIn = (timeStr: string | undefined): boolean => {
  if (!timeStr) return false;
  try {
    if (timeStr.includes('T')) {
      const timePart = timeStr.split('T')[1];
      const [hoursStr, minutesStr] = timePart.split(':');
      const hours = parseInt(hoursStr, 10);
      const minutes = parseInt(minutesStr, 10);
      return hours > 10 || (hours === 10 && minutes > 30);
    }
  } catch (e) {}
  return false;
};

export const Attendance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'calendar' | 'monthly'>('today');
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputLocationLink, setInputLocationLink] = useState('');
  const [inputExitLocationLink, setInputExitLocationLink] = useState('');
  const [modalTab, setModalTab] = useState<'entry' | 'exit'>('entry');
  const [updatingLocation, setUpdatingLocation] = useState(false);
  
  const [selectedStaffIds, setSelectedStaffIds] = useState<string[]>([]);
  const [sendingReminders, setSendingReminders] = useState(false);
  
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

  const openLocationModal = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setInputLocationLink(record.locationLink || '');
    setInputExitLocationLink(record.exitLocationLink || '');
    setModalTab(record.exitTime ? 'exit' : 'entry');
    setIsModalOpen(true);
  };

  const saveLocation = async () => {
    if (!selectedRecord) return;
    setUpdatingLocation(true);
    try {
      await apiClient.updateAttendanceLocation(selectedRecord.id, {
        locationLink: inputLocationLink,
        exitLocationLink: inputExitLocationLink,
      });
      fetchData();
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
      alert('Failed to update location');
    } finally {
      setUpdatingLocation(false);
    }
  };

  const getCoordinates = (link: string) => {
    if (!link) return null;
    try {
      let coordsPart = null;
      if (link.includes('q=')) {
        const match = link.match(/q=([^&]+)/);
        coordsPart = match ? match[1] : null;
      } else if (link.includes('maps?q=')) {
        const start = link.indexOf('maps?q=') + 7;
        const end = link.indexOf('&', start);
        coordsPart = end === -1 ? link.substring(start) : link.substring(start, end);
      } else if (/^-?\d+(\.\d+)?,\\s*-?\\d+(\.\d+)?$/.test(link.trim())) {
        coordsPart = link.trim();
      }
      return coordsPart;
    } catch (e) {
      return null;
    }
  };

  const triggerManualReminders = async (ids?: string[]) => {
    setSendingReminders(true);
    try {
      await apiClient.sendAttendanceReminders(ids);
      alert('Attendance reminders sent successfully!');
      if (ids) {
        setSelectedStaffIds(prev => prev.filter(pId => !ids.includes(pId)));
      } else {
        setSelectedStaffIds([]);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to send reminders.');
    } finally {
      setSendingReminders(false);
    }
  };

  const toggleSelectStaff = (id: string) => {
    setSelectedStaffIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAllPending = (pendingStaffIds: string[]) => {
    if (selectedStaffIds.length === pendingStaffIds.length) {
      setSelectedStaffIds([]);
    } else {
      setSelectedStaffIds(pendingStaffIds);
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

        {selectedStaffIds.length > 0 && (
          <div className="flex items-center justify-between bg-saas-primary/10 border border-saas-primary/20 rounded-xl p-4 animate-fade-in mb-4">
            <span className="text-sm font-semibold text-saas-primary">
              {selectedStaffIds.length} staff member(s) selected for reminders
            </span>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setSelectedStaffIds([])}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-white/5 hover:bg-white/10 text-white transition-colors"
              >
                Clear Selection
              </button>
              <button
                type="button"
                onClick={() => triggerManualReminders(selectedStaffIds)}
                disabled={sendingReminders}
                className="px-3 py-1.5 rounded text-xs font-semibold bg-saas-primary text-black hover:bg-saas-primary/80 transition-colors flex items-center disabled:opacity-50"
              >
                <Bell size={12} className="mr-1.5" />
                Send Selected Reminders
              </button>
            </div>
          </div>
        )}

        <div className="bg-saas-bgSecondary rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-saas-muted text-sm">
                <th className="p-4 w-12 text-center">
                  <input 
                    type="checkbox"
                    className="rounded bg-black/40 border-white/10 text-saas-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    checked={pendingStaff.length > 0 && selectedStaffIds.length === pendingStaff.length}
                    onChange={() => toggleSelectAllPending(pendingStaff.map(s => s.id))}
                  />
                </th>
                <th className="p-4 font-medium">Employee</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Time (In/Out)</th>
                <th className="p-4 font-medium">Details (In/Out)</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(staff => {
                const record = attendanceData.find(a => a.staff.id === staff.id);
                const isPending = !record;
                return (
                  <tr key={staff.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-4 w-12 text-center">
                      {isPending ? (
                        <input 
                          type="checkbox"
                          className="rounded bg-black/40 border-white/10 text-saas-primary focus:ring-0 focus:ring-offset-0 cursor-pointer"
                          checked={selectedStaffIds.includes(staff.id)}
                          onChange={() => toggleSelectStaff(staff.id)}
                        />
                      ) : (
                        <span className="text-green-500 text-xs font-bold font-mono">✓</span>
                      )}
                    </td>
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
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400">
                            PENDING
                          </span>
                          <button
                            type="button"
                            onClick={() => triggerManualReminders([staff.id])}
                            disabled={sendingReminders}
                            className="p-1 rounded bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 transition-colors"
                            title="Send Personal Reminder via WhatsApp"
                          >
                            <Bell size={12} />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="p-4 text-sm text-gray-300">
                      {record ? (
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-gray-500 w-8">IN:</span>
                            {record.createdAt ? (
                              <>
                                <span>{formatWallClockTime(record.createdAtIso || record.createdAt)}</span>
                                {isLateCheckIn(record.createdAtIso || record.createdAt) && (
                                  <span className="text-[10px] text-red-400 font-bold ml-1.5">
                                    ⚠️ LATE
                                  </span>
                                )}
                              </>
                            ) : '-'}
                          </div>
                          {record.status === 'PRESENT' && (
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-gray-500 w-8">OUT:</span>
                              {record.exitTime ? (
                                <span>{formatWallClockTime(record.exitTimeIso || record.exitTime)}</span>
                              ) : (
                                <span className="text-xs text-gray-500 italic">Not Yet</span>
                              )}
                            </div>
                          )}
                        </div>
                      ) : '-'}
                    </td>
                    <td className="p-4 text-sm">
                      {record ? (
                        <div className="space-y-1.5">
                          <div className="flex items-center space-x-2 text-xs">
                            <span className="text-[10px] text-gray-500 w-8">IN:</span>
                            {record.locationLink ? (
                              <button
                                onClick={() => openLocationModal(record)}
                                className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                                  record.isVerifiedEntry 
                                    ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20' 
                                    : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20'
                                }`}
                                title={record.isVerifiedEntry ? "Verified: At CA Office" : "Outside Office Boundary"}
                              >
                                <MapPin size={10} className="mr-0.5" />
                                {record.isVerifiedEntry ? 'Verified' : 'Flagged'}
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setSelectedRecord(record);
                                  setInputLocationLink('');
                                  setInputExitLocationLink(record.exitLocationLink || '');
                                  setModalTab('entry');
                                  setIsModalOpen(true);
                                }}
                                className="flex items-center text-[10px] text-gray-500 hover:text-gray-300 font-medium px-1 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/5"
                              >
                                <MapPin size={10} className="mr-0.5" />
                                + Map
                              </button>
                            )}
                            {record.photoUrl ? (
                              <a href={record.photoUrl} target="_blank" rel="noopener noreferrer" className="text-saas-primary hover:underline ml-1">
                                Selfie
                              </a>
                            ) : null}
                          </div>
                          {record.status === 'PRESENT' && (
                            <div className="flex items-center space-x-2 text-xs">
                              <span className="text-[10px] text-gray-500 w-8">OUT:</span>
                              {record.exitLocationLink ? (
                                <button
                                  onClick={() => openLocationModal(record)}
                                  className={`flex items-center space-x-1 px-1.5 py-0.5 rounded text-[11px] font-medium transition-colors ${
                                    record.isVerifiedExit 
                                      ? 'bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20' 
                                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 hover:bg-yellow-500/20'
                                  }`}
                                  title={record.isVerifiedExit ? "Verified: At CA Office" : "Outside Office Boundary"}
                                >
                                  <MapPin size={10} className="mr-0.5" />
                                  {record.isVerifiedExit ? 'Verified' : 'Flagged'}
                                </button>
                              ) : (
                                <button
                                  onClick={() => {
                                    setSelectedRecord(record);
                                    setInputLocationLink(record.locationLink || '');
                                    setInputExitLocationLink('');
                                    setModalTab('exit');
                                    setIsModalOpen(true);
                                  }}
                                  className="flex items-center text-[10px] text-gray-500 hover:text-gray-300 font-medium px-1 py-0.5 rounded bg-white/5 hover:bg-white/10 border border-white/5"
                                >
                                  <MapPin size={10} className="mr-0.5" />
                                  + Map
                                </button>
                              )}
                              {record.exitPhotoUrl ? (
                                <a href={record.exitPhotoUrl} target="_blank" rel="noopener noreferrer" className="text-saas-primary hover:underline ml-1">
                                  Selfie
                                </a>
                              ) : null}
                            </div>
                          )}
                        </div>
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
        <div className="flex items-center space-x-3">
          <button
            onClick={async () => {
              if (window.confirm("Do you want to send the daily attendance report to the Super Admins?")) {
                try {
                  await apiClient.generateAttendanceReport();
                  alert("Attendance report generated & sent to Super Admin WhatsApp successfully!");
                } catch (e) {
                  alert("Failed to generate report.");
                }
              }
            }}
            className="bg-saas-primary text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-saas-primary/80 transition-all flex items-center shadow-lg"
          >
            📊 Generate Report
          </button>
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

      {/* Location Modal */}
      {isModalOpen && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-saas-bgSecondary border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in text-white">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
              <div>
                <h2 className="text-xl font-bold font-cinzel text-saas-primary uppercase tracking-wide">
                  Location & Map Details
                </h2>
                <p className="text-xs text-saas-muted mt-0.5">
                  Employee: {selectedRecord.staff.name} | Date: {selectedRecord.attendanceDate}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Tab Selector */}
              <div className="flex space-x-2 bg-black/20 p-1 rounded-lg w-fit border border-white/5">
                <button
                  type="button"
                  onClick={() => setModalTab('entry')}
                  className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${
                    modalTab === 'entry' ? 'bg-saas-primary text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Entry Check-in Map
                </button>
                {selectedRecord.exitTime && (
                  <button
                    type="button"
                    onClick={() => setModalTab('exit')}
                    className={`px-4 py-1.5 rounded text-xs font-semibold transition-all ${
                      modalTab === 'exit' ? 'bg-saas-primary text-black' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    Exit Check-out Map
                  </button>
                )}
              </div>

              {/* Tab Content */}
              {modalTab === 'entry' ? (
                <div className="space-y-4">
                  {/* Verification Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-saas-muted font-medium">Verification Status:</span>
                    {selectedRecord.locationLink ? (
                      selectedRecord.isVerifiedEntry ? (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/20">
                          <Check size={12} className="mr-1" /> Verified (At Office)
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">
                          <AlertTriangle size={12} className="mr-1" /> Flagged (Outside Office)
                        </span>
                      )
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/20">
                        No Location Link Logged
                      </span>
                    )}
                  </div>

                  {/* Map Iframe */}
                  {selectedRecord.locationLink && getCoordinates(selectedRecord.locationLink) ? (
                    <div className="w-full h-[280px] rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        title="Entry Location Map"
                        src={`https://maps.google.com/maps?q=${getCoordinates(selectedRecord.locationLink)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      ></iframe>
                    </div>
                  ) : (
                    <div className="w-full h-[280px] rounded-xl border border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center text-center p-6 text-saas-muted">
                      <Globe size={32} className="mb-2 text-gray-600" />
                      <p className="text-sm">No GPS coordinates available to render map preview.</p>
                      <p className="text-xs text-gray-500 mt-1">Please enter a valid Google Maps link or coordinates below.</p>
                    </div>
                  )}

                  {/* Edit Link Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-saas-muted uppercase tracking-wider block">
                      Edit/Paste Check-in Location Link or Coordinates
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. https://www.google.com/maps?q=26.4734,74.6426 or 26.4734,74.6426"
                        value={inputLocationLink}
                        onChange={(e) => setInputLocationLink(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-saas-primary text-white"
                      />
                      {selectedRecord.locationLink && (
                        <a
                          href={selectedRecord.locationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-white/10 transition-colors flex items-center text-saas-primary"
                        >
                          Open External
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Verification Badge */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-saas-muted font-medium">Verification Status:</span>
                    {selectedRecord.exitLocationLink ? (
                      selectedRecord.isVerifiedExit ? (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/20">
                          <Check size={12} className="mr-1" /> Verified (At Office)
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/20">
                          <AlertTriangle size={12} className="mr-1" /> Flagged (Outside Office)
                        </span>
                      )
                    ) : (
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/20">
                        No Location Link Logged
                      </span>
                    )}
                  </div>

                  {/* Map Iframe */}
                  {selectedRecord.exitLocationLink && getCoordinates(selectedRecord.exitLocationLink) ? (
                    <div className="w-full h-[280px] rounded-xl overflow-hidden border border-white/10 bg-black/40 relative">
                      <iframe
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        scrolling="no"
                        marginHeight={0}
                        marginWidth={0}
                        title="Exit Location Map"
                        src={`https://maps.google.com/maps?q=${getCoordinates(selectedRecord.exitLocationLink)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                      ></iframe>
                    </div>
                  ) : (
                    <div className="w-full h-[280px] rounded-xl border border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center text-center p-6 text-saas-muted">
                      <Globe size={32} className="mb-2 text-gray-600" />
                      <p className="text-sm">No GPS coordinates available to render map preview.</p>
                      <p className="text-xs text-gray-500 mt-1">Please enter a valid Google Maps link or coordinates below.</p>
                    </div>
                  )}

                  {/* Edit Link Input */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-saas-muted uppercase tracking-wider block">
                      Edit/Paste Check-out Location Link or Coordinates
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. https://www.google.com/maps?q=26.4734,74.6426 or 26.4734,74.6426"
                        value={inputExitLocationLink}
                        onChange={(e) => setInputExitLocationLink(e.target.value)}
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-saas-primary text-white"
                      />
                      {selectedRecord.exitLocationLink && (
                        <a
                          href={selectedRecord.exitLocationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold hover:bg-white/10 transition-colors flex items-center text-saas-primary"
                        >
                          Open External
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-white/10 flex justify-end space-x-3 bg-white/5">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={saveLocation}
                disabled={updatingLocation}
                className="bg-saas-primary text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-saas-primary/80 transition-colors flex items-center disabled:opacity-50"
              >
                {updatingLocation && (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                Save Location
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
