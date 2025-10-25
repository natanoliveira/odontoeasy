import { apiClient, ApiResponse } from '../lib/api';
import { Clinic, UpdateClinicData, Room, DashboardStats } from '../lib/types';

export interface ClinicSettings {
  workingHours: {
    monday: { start: string; end: string; active: boolean };
    tuesday: { start: string; end: string; active: boolean };
    wednesday: { start: string; end: string; active: boolean };
    thursday: { start: string; end: string; active: boolean };
    friday: { start: string; end: string; active: boolean };
    saturday: { start: string; end: string; active: boolean };
    sunday: { start: string; end: string; active: boolean };
  };
  appointmentSettings: {
    defaultDuration: number;
    allowOnlineBooking: boolean;
    confirmationRequired: boolean;
    reminderSettings: {
      email: boolean;
      sms: boolean;
      whatsapp: boolean;
      hoursBeore: number;
    };
  };
  paymentSettings: {
    acceptCash: boolean;
    acceptCard: boolean;
    acceptPix: boolean;
    defaultPaymentTerms: number;
  };
  notifications: {
    newAppointment: boolean;
    appointmentReminder: boolean;
    paymentDue: boolean;
    systemUpdates: boolean;
  };
}

export interface CreateRoomData {
  name: string;
  description?: string;
  color?: string;
  equipment: string[];
}

class ClinicService {
  async getCurrentClinic(): Promise<ApiResponse<Clinic>> {
    try {
      return await apiClient.get<Clinic>('/clinic');
    } catch (error) {
      console.error('Get current clinic error:', error);
      throw error;
    }
  }

  async updateClinic(data: UpdateClinicData): Promise<ApiResponse<Clinic>> {
    try {
      return await apiClient.put<Clinic>('/clinic', data);
    } catch (error) {
      console.error('Update clinic error:', error);
      throw error;
    }
  }

  async uploadLogo(file: File): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('logo', file);
      
      return await apiClient.upload<{ url: string }>('/clinic/logo', formData);
    } catch (error) {
      console.error('Upload clinic logo error:', error);
      throw error;
    }
  }

  // Settings Management
  async getSettings(): Promise<ApiResponse<ClinicSettings>> {
    try {
      return await apiClient.get<ClinicSettings>('/clinic/settings');
    } catch (error) {
      console.error('Get clinic settings error:', error);
      throw error;
    }
  }

  async updateSettings(settings: Partial<ClinicSettings>): Promise<ApiResponse<ClinicSettings>> {
    try {
      return await apiClient.put<ClinicSettings>('/clinic/settings', settings);
    } catch (error) {
      console.error('Update clinic settings error:', error);
      throw error;
    }
  }

  // Room Management
  async getRooms(): Promise<ApiResponse<Room[]>> {
    try {
      return await apiClient.get<Room[]>('/clinic/rooms');
    } catch (error) {
      console.error('Get rooms error:', error);
      throw error;
    }
  }

  async createRoom(data: CreateRoomData): Promise<ApiResponse<Room>> {
    try {
      return await apiClient.post<Room>('/clinic/rooms', data);
    } catch (error) {
      console.error('Create room error:', error);
      throw error;
    }
  }

  async updateRoom(id: string, data: Partial<CreateRoomData>): Promise<ApiResponse<Room>> {
    try {
      return await apiClient.put<Room>(`/clinic/rooms/${id}`, data);
    } catch (error) {
      console.error('Update room error:', error);
      throw error;
    }
  }

  async deleteRoom(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<void>(`/clinic/rooms/${id}`);
    } catch (error) {
      console.error('Delete room error:', error);
      throw error;
    }
  }

  async getRoomAvailability(roomId: string, date: string): Promise<ApiResponse<Array<{
    startTime: string;
    endTime: string;
    available: boolean;
    appointmentId?: string;
  }>>> {
    try {
      return await apiClient.get(`/clinic/rooms/${roomId}/availability?date=${date}`);
    } catch (error) {
      console.error('Get room availability error:', error);
      throw error;
    }
  }

  // Dashboard and Statistics
  async getDashboardStats(period?: 'today' | 'week' | 'month' | 'year'): Promise<ApiResponse<DashboardStats>> {
    try {
      const params = period ? `?period=${period}` : '';
      return await apiClient.get<DashboardStats>(`/clinic/dashboard/stats${params}`);
    } catch (error) {
      console.error('Get dashboard stats error:', error);
      throw error;
    }
  }

  async getRevenueStats(startDate: string, endDate: string): Promise<ApiResponse<{
    totalRevenue: number;
    paidAmount: number;
    pendingAmount: number;
    overDueAmount: number;
    dailyRevenue: Array<{
      date: string;
      revenue: number;
      appointments: number;
    }>;
    paymentMethods: Array<{
      method: string;
      amount: number;
      count: number;
    }>;
  }>> {
    try {
      return await apiClient.get(
        `/clinic/stats/revenue?startDate=${startDate}&endDate=${endDate}`
      );
    } catch (error) {
      console.error('Get revenue stats error:', error);
      throw error;
    }
  }

  async getAppointmentStats(period: 'today' | 'week' | 'month' | 'year' = 'month'): Promise<ApiResponse<{
    total: number;
    completed: number;
    cancelled: number;
    noShows: number;
    pending: number;
    confirmed: number;
    byStatus: Array<{
      status: string;
      count: number;
      percentage: number;
    }>;
    byType: Array<{
      type: string;
      count: number;
      revenue: number;
    }>;
    byProfessional: Array<{
      professionalId: string;
      professionalName: string;
      appointments: number;
      revenue: number;
    }>;
  }>> {
    try {
      return await apiClient.get(`/clinic/stats/appointments?period=${period}`);
    } catch (error) {
      console.error('Get appointment stats error:', error);
      throw error;
    }
  }

  async getPatientStats(): Promise<ApiResponse<{
    total: number;
    active: number;
    newThisMonth: number;
    averageAge: number;
    genderDistribution: {
      male: number;
      female: number;
      other: number;
    };
    topTreatments: Array<{
      treatment: string;
      count: number;
      revenue: number;
    }>;
  }>> {
    try {
      return await apiClient.get('/clinic/stats/patients');
    } catch (error) {
      console.error('Get patient stats error:', error);
      throw error;
    }
  }

  // Working Hours and Schedule
  async getWorkingHours(): Promise<ApiResponse<ClinicSettings['workingHours']>> {
    try {
      return await apiClient.get('/clinic/working-hours');
    } catch (error) {
      console.error('Get working hours error:', error);
      throw error;
    }
  }

  async updateWorkingHours(workingHours: ClinicSettings['workingHours']): Promise<ApiResponse<void>> {
    try {
      return await apiClient.put('/clinic/working-hours', { workingHours });
    } catch (error) {
      console.error('Update working hours error:', error);
      throw error;
    }
  }

  async getHolidays(): Promise<ApiResponse<Array<{
    id: string;
    date: string;
    name: string;
    recurring: boolean;
  }>>> {
    try {
      return await apiClient.get('/clinic/holidays');
    } catch (error) {
      console.error('Get holidays error:', error);
      throw error;
    }
  }

  async addHoliday(holiday: {
    date: string;
    name: string;
    recurring?: boolean;
  }): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post('/clinic/holidays', holiday);
    } catch (error) {
      console.error('Add holiday error:', error);
      throw error;
    }
  }

  async deleteHoliday(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete(`/clinic/holidays/${id}`);
    } catch (error) {
      console.error('Delete holiday error:', error);
      throw error;
    }
  }

  // Public clinic information for booking
  async getPublicInfo(clinicId: string): Promise<ApiResponse<{
    id: string;
    name: string;
    description?: string;
    phone?: string;
    email?: string;
    address?: string;
    logo?: string;
    workingHours: ClinicSettings['workingHours'];
    services: Array<{
      id: string;
      name: string;
      duration: number;
      price?: number;
    }>;
    professionals: Array<{
      id: string;
      name: string;
      specialty: string;
      photo?: string;
    }>;
  }>> {
    try {
      return await apiClient.get(`/public/clinics/${clinicId}`);
    } catch (error) {
      console.error('Get public clinic info error:', error);
      throw error;
    }
  }

  // Backup and Export
  async exportData(options: {
    includePatients?: boolean;
    includeAppointments?: boolean;
    includeTreatments?: boolean;
    includeDocuments?: boolean;
    startDate?: string;
    endDate?: string;
  }): Promise<ApiResponse<{ url: string }>> {
    try {
      return await apiClient.post<{ url: string }>('/clinic/export', options);
    } catch (error) {
      console.error('Export clinic data error:', error);
      throw error;
    }
  }

  async importData(file: File, dataType: 'patients' | 'appointments' | 'professionals'): Promise<ApiResponse<{
    success: number;
    errors: Array<{ row: number; message: string }>;
  }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('dataType', dataType);
      
      return await apiClient.upload('/clinic/import', formData);
    } catch (error) {
      console.error('Import clinic data error:', error);
      throw error;
    }
  }

  // Notifications
  async getNotifications(): Promise<ApiResponse<Array<{
    id: string;
    type: string;
    title: string;
    message: string;
    read: boolean;
    createdAt: string;
    data?: Record<string, any>;
  }>>> {
    try {
      return await apiClient.get('/clinic/notifications');
    } catch (error) {
      console.error('Get notifications error:', error);
      throw error;
    }
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.patch(`/clinic/notifications/${id}/read`);
    } catch (error) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    try {
      return await apiClient.patch('/clinic/notifications/read-all');
    } catch (error) {
      console.error('Mark all notifications as read error:', error);
      throw error;
    }
  }
}

export const clinicService = new ClinicService();