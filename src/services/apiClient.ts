import axios from 'axios';
import { Ticket, Staff } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://ca-api.legalfactory.in/api',
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
});

export const apiClient = {
  // Tickets
  fetchTickets: async (): Promise<Ticket[]> => {
    const response = await api.get('/admin/tickets/all');
    return response.data;
  },

  // Dashboard Analytics
  fetchDashboardAnalytics: async () => {
    const response = await api.get('/dashboard/analytics');
    return response.data;
  },
  
  // Clients
  fetchClientSummary: async (clientId: string) => {
    const response = await api.get(`/clients/${clientId}/summary`);
    return response.data;
  },
  createClientWithDocuments: async (formData: FormData) => {
    const response = await api.post('/admin/clients/create-with-documents', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  fetchPricingAnalysis: async (ticketId: string) => {
    try {
        const response = await api.get(`/pricing/ticket/${ticketId}`);
        return response.data;
    } catch (e) {
        return null;
    }
  },
  approveTicket: async (ticketId: string, feeAmount: number, adminNotes: string) => {
    const response = await api.post(`/admin/tickets/${ticketId}/approve`, { feeAmount, adminNotes });
    return response.data;
  },
  sendReminder: async (ticketId: string) => {
    const response = await api.post(`/admin/tickets/${ticketId}/remind`);
    return response.data;
  },
  sendCustomReminder: async (ticketId: string, message: string) => {
    const response = await api.post(`/admin/tickets/${ticketId}/remind`, message, {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  },
  assignTicket: async (ticketId: string, staffId: string, payload: any) => {
    const response = await api.post(`/admin/tickets/${ticketId}/assign/${staffId}`, payload);
    return response.data;
  },
  verifyPayment: async (ticketId: string) => {
    const response = await api.post(`/payments/${ticketId}/verify`);
    return response.data;
  },
  rejectPayment: async (ticketId: string) => {
    const response = await api.post(`/payments/${ticketId}/reject`);
    return response.data;
  },
  submitQc: async (ticketId: string, documentUrl: string) => {
    const response = await api.post(`/admin/tickets/${ticketId}/submit-qc`, documentUrl, {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  },
  deliverTicket: async (ticketId: string, closingMessage: string) => {
    const response = await api.post(`/admin/tickets/${ticketId}/deliver`, closingMessage || '', {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  },
  getStaffDocumentUrl: async (ticketId: string): Promise<string> => {
    const response = await api.get(`/admin/tickets/${ticketId}/file-url`);
    return response.data.url;
  },
  requestStaffChanges: async (ticketId: string, changeRequest: string) => {
    const response = await api.post(`/admin/tickets/${ticketId}/request-changes`, changeRequest, {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  },
  sendAdminNote: async (ticketId: string, recipient: string, note: string) => {
    const response = await api.post(`/admin/tickets/${ticketId}/note`, { recipient, note });
    return response.data;
  },
  reassignTicket: async (ticketId: string, staffId: string, notes: string) => {
    const response = await api.post(`/admin/tickets/${ticketId}/reassign/${staffId}`, notes || 'Please review and resubmit corrected work.', {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  },
  requestCredentials: async (ticketId: string, label: string) => {
    const response = await api.post(`/admin/tickets/${ticketId}/request-credentials`, label || 'IT Portal Login ID & Password', {
      headers: { 'Content-Type': 'text/plain' },
    });
    return response.data;
  },

  // Staff
  fetchStaff: async (): Promise<Staff[]> => {
    const response = await api.get('/admin/staff');
    return response.data;
  },
  addStaff: async (name: string, phoneNumber: string) => {
    const response = await api.post('/admin/staff', { name, phoneNumber });
    return response.data;
  },
  removeStaff: async (staffId: string) => {
    const response = await api.delete(`/admin/staff/${staffId}`);
    return response.data;
  },
  // Staff & Attendance
  getStaff: async (): Promise<Staff[]> => {
    const response = await api.get('/admin/staff');
    return response.data;
  },
  getStaffAttendance: async (staffId: string) => {
    const response = await api.get(`/admin/staff/${staffId}/attendance`);
    return response.data;
  },
  fetchTodayAttendance: async () => {
    const response = await api.get('/admin/staff/attendance/today');
    return response.data;
  },
  fetchAttendanceByDate: async (date: string) => {
    const response = await api.get(`/admin/staff/attendance/date/${date}`);
    return response.data;
  },
  fetchAttendanceByMonth: async (year: number, month: number) => {
    const response = await api.get(`/admin/staff/attendance/month/${year}/${month}`);
    return response.data;
  },
  sendAttendanceReminders: async () => {
    const response = await api.post('/admin/staff/remind-attendance');
    return response.data;
  },
  generateAttendanceReport: async () => {
    const response = await api.post('/admin/staff/generate-report');
    return response.data;
  },
  getStaffTickets: async (staffId: string): Promise<Ticket[]> => {
    const response = await api.get(`/admin/staff/${staffId}/tickets`);
    return response.data;
  },
  reassignTicket: async (ticketId: string, staffId: string, notes?: string) => {
    const response = await api.post(`/admin/tickets/${ticketId}/reassign/${staffId}`, notes);
    return response.data;
  },
  getStaffPerformance: async (staffId: string) => {
    const response = await api.get(`/admin/staff/${staffId}/performance`);
    return response.data;
  }
};
