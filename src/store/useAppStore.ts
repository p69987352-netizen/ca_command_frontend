import { create } from 'zustand';
import { Ticket, Staff } from '../types';
import { apiClient } from '../services/apiClient';

interface AppState {
  tickets: Ticket[];
  staff: Staff[];
  activeFilter: string;
  isLoading: boolean;
  error: string | null;
  
  setActiveFilter: (filter: string) => void;
  fetchData: () => Promise<void>;
  
  // Actions that mutate state and refresh
  approveTicket: (ticketId: string, feeAmount: number, adminNotes: string) => Promise<void>;
  assignTicket: (ticketId: string, staffId: string, payload: any) => Promise<void>;
  deliverTicket: (ticketId: string, closingMessage: string) => Promise<void>;
  getStaffDocumentUrl: (ticketId: string) => Promise<string>;
  requestChanges: (ticketId: string, changeRequest: string) => Promise<void>;
  requestCredentials: (ticketId: string, label: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  tickets: [],
  staff: [],
  activeFilter: 'ALL',
  isLoading: false,
  error: null,

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  fetchData: async () => {
    set({ isLoading: true, error: null });
    try {
      const [tickets, staff] = await Promise.all([
        apiClient.fetchTickets(),
        apiClient.fetchStaff()
      ]);
      // Sort tickets by updated/created date descending
      const sortedTickets = tickets.sort((a, b) => {
        const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
        const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
        return dateB - dateA;
      });
      set({ tickets: sortedTickets, staff, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Failed to fetch data', isLoading: false });
    }
  },

  approveTicket: async (ticketId, feeAmount, adminNotes) => {
    await apiClient.approveTicket(ticketId, feeAmount, adminNotes);
    await get().fetchData();
  },

  assignTicket: async (ticketId, staffId, payload) => {
    await apiClient.assignTicket(ticketId, staffId, payload);
    await get().fetchData();
  },

  deliverTicket: async (ticketId, closingMessage) => {
    await apiClient.deliverTicket(ticketId, closingMessage);
    await get().fetchData();
  },
  getStaffDocumentUrl: async (ticketId) => {
    return await apiClient.getStaffDocumentUrl(ticketId);
  },

  requestChanges: async (ticketId, changeRequest) => {
    await apiClient.requestStaffChanges(ticketId, changeRequest);
    await get().fetchData();
  },

  requestCredentials: async (ticketId, label) => {
    await apiClient.requestCredentials(ticketId, label);
    await get().fetchData();
  }
}));
