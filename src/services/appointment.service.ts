import { apiClient, ApiResponse } from '../lib/api';
import { 
  Appointment, 
  CreateAppointmentData, 
  PaginatedResponse, 
  AppointmentStatus,
  CalendarEvent,
  AvailableSlot,
  BookingRequest
} from '../lib/types';

export interface AppointmentFilters {
  startDate?: string;
  endDate?: string;
  patientId?: string;
  professionalId?: string;
  roomId?: string;
  status?: AppointmentStatus;
  type?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AppointmentStats {
  total: number;
  today: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  noShows: number;
  averageDuration: number;
  totalRevenue: number;
  monthlyStats: Array<{
    month: string;
    appointments: number;
    revenue: number;
  }>;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  professionalId?: string;
  duration?: number;
}

class AppointmentService {
  async getAppointments(filters: AppointmentFilters = {}): Promise<ApiResponse<PaginatedResponse<Appointment>>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const queryString = params.toString();
      return await apiClient.get<PaginatedResponse<Appointment>>(
        `/appointments${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Get appointments error:', error);
      throw error;
    }
  }

  async getAppointmentById(id: string): Promise<ApiResponse<Appointment>> {
    try {
      return await apiClient.get<Appointment>(`/appointments/${id}`);
    } catch (error) {
      console.error('Get appointment by ID error:', error);
      throw error;
    }
  }

  async createAppointment(data: CreateAppointmentData): Promise<ApiResponse<Appointment>> {
    try {
      return await apiClient.post<Appointment>('/appointments', data);
    } catch (error) {
      console.error('Create appointment error:', error);
      throw error;
    }
  }

  async updateAppointment(id: string, data: Partial<CreateAppointmentData>): Promise<ApiResponse<Appointment>> {
    try {
      return await apiClient.put<Appointment>(`/appointments/${id}`, data);
    } catch (error) {
      console.error('Update appointment error:', error);
      throw error;
    }
  }

  async deleteAppointment(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<void>(`/appointments/${id}`);
    } catch (error) {
      console.error('Delete appointment error:', error);
      throw error;
    }
  }

  async updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<ApiResponse<Appointment>> {
    try {
      return await apiClient.patch<Appointment>(`/appointments/${id}/status`, { status });
    } catch (error) {
      console.error('Update appointment status error:', error);
      throw error;
    }
  }

  async confirmAppointment(id: string): Promise<ApiResponse<Appointment>> {
    try {
      return await apiClient.patch<Appointment>(`/appointments/${id}/confirm`);
    } catch (error) {
      console.error('Confirm appointment error:', error);
      throw error;
    }
  }

  async cancelAppointment(id: string, reason?: string): Promise<ApiResponse<Appointment>> {
    try {
      return await apiClient.patch<Appointment>(`/appointments/${id}/cancel`, { reason });
    } catch (error) {
      console.error('Cancel appointment error:', error);
      throw error;
    }
  }

  async rescheduleAppointment(id: string, newDate: string, newStartTime: string): Promise<ApiResponse<Appointment>> {
    try {
      return await apiClient.patch<Appointment>(`/appointments/${id}/reschedule`, {
        date: newDate,
        startTime: newStartTime
      });
    } catch (error) {
      console.error('Reschedule appointment error:', error);
      throw error;
    }
  }

  async getCalendarEvents(startDate: string, endDate: string): Promise<ApiResponse<CalendarEvent[]>> {
    try {
      return await apiClient.get<CalendarEvent[]>(
        `/appointments/calendar?startDate=${startDate}&endDate=${endDate}`
      );
    } catch (error) {
      console.error('Get calendar events error:', error);
      throw error;
    }
  }

  async getAvailableSlots(
    date: string, 
    professionalId?: string, 
    duration: number = 60
  ): Promise<ApiResponse<TimeSlot[]>> {
    try {
      const params = new URLSearchParams({
        date,
        duration: duration.toString()
      });
      
      if (professionalId) {
        params.append('professionalId', professionalId);
      }

      return await apiClient.get<TimeSlot[]>(`/appointments/available-slots?${params.toString()}`);
    } catch (error) {
      console.error('Get available slots error:', error);
      throw error;
    }
  }

  async getTodayAppointments(): Promise<ApiResponse<Appointment[]>> {
    try {
      return await apiClient.get<Appointment[]>('/appointments/today');
    } catch (error) {
      console.error('Get today appointments error:', error);
      throw error;
    }
  }

  async getUpcomingAppointments(days: number = 7): Promise<ApiResponse<Appointment[]>> {
    try {
      return await apiClient.get<Appointment[]>(`/appointments/upcoming?days=${days}`);
    } catch (error) {
      console.error('Get upcoming appointments error:', error);
      throw error;
    }
  }

  async getAppointmentStats(startDate?: string, endDate?: string): Promise<ApiResponse<AppointmentStats>> {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      
      const queryString = params.toString();
      return await apiClient.get<AppointmentStats>(
        `/appointments/stats${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Get appointment stats error:', error);
      throw error;
    }
  }

  async sendReminder(id: string, type: 'sms' | 'email' | 'whatsapp' = 'email'): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(`/appointments/${id}/reminder`, { type });
    } catch (error) {
      console.error('Send reminder error:', error);
      throw error;
    }
  }

  async bulkSendReminders(date: string, type: 'sms' | 'email' | 'whatsapp' = 'email'): Promise<ApiResponse<{
    sent: number;
    failed: number;
  }>> {
    try {
      return await apiClient.post(`/appointments/bulk-reminders`, { date, type });
    } catch (error) {
      console.error('Bulk send reminders error:', error);
      throw error;
    }
  }

  async checkIn(id: string): Promise<ApiResponse<Appointment>> {
    try {
      return await apiClient.patch<Appointment>(`/appointments/${id}/check-in`);
    } catch (error) {
      console.error('Check-in appointment error:', error);
      throw error;
    }
  }

  async complete(id: string, notes?: string): Promise<ApiResponse<Appointment>> {
    try {
      return await apiClient.patch<Appointment>(`/appointments/${id}/complete`, { notes });
    } catch (error) {
      console.error('Complete appointment error:', error);
      throw error;
    }
  }

  async addNotes(id: string, notes: string): Promise<ApiResponse<Appointment>> {
    try {
      return await apiClient.patch<Appointment>(`/appointments/${id}/notes`, { notes });
    } catch (error) {
      console.error('Add appointment notes error:', error);
      throw error;
    }
  }

  // Public booking methods
  async getPublicAvailableSlots(
    clinicId: string,
    date: string,
    serviceType?: string
  ): Promise<ApiResponse<AvailableSlot[]>> {
    try {
      const params = new URLSearchParams({ date });
      if (serviceType) params.append('serviceType', serviceType);
      
      return await apiClient.get<AvailableSlot[]>(
        `/public/clinics/${clinicId}/available-slots?${params.toString()}`
      );
    } catch (error) {
      console.error('Get public available slots error:', error);
      throw error;
    }
  }

  async createPublicBooking(data: BookingRequest): Promise<ApiResponse<{ appointmentId: string; message: string }>> {
    try {
      return await apiClient.post(`/public/bookings`, data);
    } catch (error) {
      console.error('Create public booking error:', error);
      throw error;
    }
  }

  async getClinicServices(clinicId: string): Promise<ApiResponse<Array<{
    id: string;
    name: string;
    duration: number;
    price?: number;
  }>>> {
    try {
      return await apiClient.get(`/public/clinics/${clinicId}/services`);
    } catch (error) {
      console.error('Get clinic services error:', error);
      throw error;
    }
  }

  async exportAppointments(filters?: AppointmentFilters): Promise<ApiResponse<{ url: string }>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            params.append(key, value.toString());
          }
        });
      }

      const queryString = params.toString();
      return await apiClient.get<{ url: string }>(
        `/appointments/export${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Export appointments error:', error);
      throw error;
    }
  }

  async getAppointmentConflicts(data: CreateAppointmentData): Promise<ApiResponse<{
    hasConflicts: boolean;
    conflicts: Array<{
      type: 'professional' | 'room' | 'patient';
      conflictingAppointment: Appointment;
    }>;
  }>> {
    try {
      return await apiClient.post('/appointments/check-conflicts', data);
    } catch (error) {
      console.error('Check appointment conflicts error:', error);
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();