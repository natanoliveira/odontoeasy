import { apiClient, ApiResponse } from '../lib/api';
import { 
  Professional, 
  CreateProfessionalData, 
  PaginatedResponse, 
  ProfessionalStatus,
  Schedule
} from '../lib/types';

export interface ProfessionalFilters {
  search?: string;
  status?: ProfessionalStatus;
  specialty?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProfessionalStats {
  total: number;
  active: number;
  inactive: number;
  vacation: number;
  specialties: Array<{
    name: string;
    count: number;
  }>;
}

export interface WorkSchedule {
  professionalId: string;
  weeklySchedule: Array<{
    dayOfWeek: number; // 0 = Sunday, 1 = Monday, etc.
    startTime: string;
    endTime: string;
    breakStart?: string;
    breakEnd?: string;
    isActive: boolean;
  }>;
}

export interface ProfessionalAvailability {
  date: string;
  slots: Array<{
    startTime: string;
    endTime: string;
    available: boolean;
    appointmentId?: string;
  }>;
}

class ProfessionalService {
  async getProfessionals(filters: ProfessionalFilters = {}): Promise<ApiResponse<PaginatedResponse<Professional>>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value.toString());
        }
      });

      const queryString = params.toString();
      return await apiClient.get<PaginatedResponse<Professional>>(
        `/professionals${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Get professionals error:', error);
      throw error;
    }
  }

  async getProfessionalById(id: string): Promise<ApiResponse<Professional>> {
    try {
      return await apiClient.get<Professional>(`/professionals/${id}`);
    } catch (error) {
      console.error('Get professional by ID error:', error);
      throw error;
    }
  }

  async createProfessional(data: CreateProfessionalData): Promise<ApiResponse<Professional>> {
    try {
      return await apiClient.post<Professional>('/professionals', data);
    } catch (error) {
      console.error('Create professional error:', error);
      throw error;
    }
  }

  async updateProfessional(id: string, data: Partial<CreateProfessionalData>): Promise<ApiResponse<Professional>> {
    try {
      return await apiClient.put<Professional>(`/professionals/${id}`, data);
    } catch (error) {
      console.error('Update professional error:', error);
      throw error;
    }
  }

  async deleteProfessional(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<void>(`/professionals/${id}`);
    } catch (error) {
      console.error('Delete professional error:', error);
      throw error;
    }
  }

  async updateStatus(id: string, status: ProfessionalStatus): Promise<ApiResponse<Professional>> {
    try {
      return await apiClient.patch<Professional>(`/professionals/${id}/status`, { status });
    } catch (error) {
      console.error('Update professional status error:', error);
      throw error;
    }
  }

  async getActiveProfessionals(): Promise<ApiResponse<Professional[]>> {
    try {
      return await apiClient.get<Professional[]>('/professionals/active');
    } catch (error) {
      console.error('Get active professionals error:', error);
      throw error;
    }
  }

  async getProfessionalStats(): Promise<ApiResponse<ProfessionalStats>> {
    try {
      return await apiClient.get<ProfessionalStats>('/professionals/stats');
    } catch (error) {
      console.error('Get professional stats error:', error);
      throw error;
    }
  }

  async searchProfessionals(query: string): Promise<ApiResponse<Professional[]>> {
    try {
      return await apiClient.get<Professional[]>(`/professionals/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Search professionals error:', error);
      throw error;
    }
  }

  async uploadAvatar(id: string, file: File): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      return await apiClient.upload<{ url: string }>(`/professionals/${id}/avatar`, formData);
    } catch (error) {
      console.error('Upload professional avatar error:', error);
      throw error;
    }
  }

  // Schedule Management
  async getWorkSchedule(id: string): Promise<ApiResponse<WorkSchedule>> {
    try {
      return await apiClient.get<WorkSchedule>(`/professionals/${id}/schedule`);
    } catch (error) {
      console.error('Get work schedule error:', error);
      throw error;
    }
  }

  async updateWorkSchedule(id: string, schedule: WorkSchedule): Promise<ApiResponse<WorkSchedule>> {
    try {
      return await apiClient.put<WorkSchedule>(`/professionals/${id}/schedule`, schedule);
    } catch (error) {
      console.error('Update work schedule error:', error);
      throw error;
    }
  }

  async getAvailability(
    id: string, 
    startDate: string, 
    endDate: string
  ): Promise<ApiResponse<ProfessionalAvailability[]>> {
    try {
      return await apiClient.get<ProfessionalAvailability[]>(
        `/professionals/${id}/availability?startDate=${startDate}&endDate=${endDate}`
      );
    } catch (error) {
      console.error('Get professional availability error:', error);
      throw error;
    }
  }

  async blockTime(
    id: string, 
    date: string, 
    startTime: string, 
    endTime: string, 
    reason: string
  ): Promise<ApiResponse<Schedule>> {
    try {
      return await apiClient.post<Schedule>(`/professionals/${id}/block-time`, {
        date,
        startTime,
        endTime,
        reason
      });
    } catch (error) {
      console.error('Block time error:', error);
      throw error;
    }
  }

  async unblockTime(id: string, scheduleId: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<void>(`/professionals/${id}/block-time/${scheduleId}`);
    } catch (error) {
      console.error('Unblock time error:', error);
      throw error;
    }
  }

  async getBlockedTimes(id: string, startDate: string, endDate: string): Promise<ApiResponse<Schedule[]>> {
    try {
      return await apiClient.get<Schedule[]>(
        `/professionals/${id}/blocked-times?startDate=${startDate}&endDate=${endDate}`
      );
    } catch (error) {
      console.error('Get blocked times error:', error);
      throw error;
    }
  }

  // Performance and Statistics
  async getProfessionalAppointments(
    id: string, 
    filters?: {
      startDate?: string;
      endDate?: string;
      status?: string;
    }
  ): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const queryString = params.toString();
      return await apiClient.get(
        `/professionals/${id}/appointments${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Get professional appointments error:', error);
      throw error;
    }
  }

  async getProfessionalPerformance(
    id: string,
    startDate: string,
    endDate: string
  ): Promise<ApiResponse<{
    totalAppointments: number;
    completedAppointments: number;
    cancelledAppointments: number;
    noShows: number;
    totalRevenue: number;
    averageRating: number;
    patientsSeen: number;
    treatmentsCompleted: number;
  }>> {
    try {
      return await apiClient.get(
        `/professionals/${id}/performance?startDate=${startDate}&endDate=${endDate}`
      );
    } catch (error) {
      console.error('Get professional performance error:', error);
      throw error;
    }
  }

  async getSpecialties(): Promise<ApiResponse<string[]>> {
    try {
      return await apiClient.get<string[]>('/professionals/specialties');
    } catch (error) {
      console.error('Get specialties error:', error);
      throw error;
    }
  }

  async validateCRO(cro: string): Promise<ApiResponse<{
    valid: boolean;
    name?: string;
    specialty?: string;
    state?: string;
  }>> {
    try {
      return await apiClient.get(`/professionals/validate-cro?cro=${cro}`);
    } catch (error) {
      console.error('Validate CRO error:', error);
      throw error;
    }
  }

  // Vacation and Time Off
  async requestVacation(
    id: string,
    startDate: string,
    endDate: string,
    notes?: string
  ): Promise<ApiResponse<void>> {
    try {
      return await apiClient.post<void>(`/professionals/${id}/vacation`, {
        startDate,
        endDate,
        notes
      });
    } catch (error) {
      console.error('Request vacation error:', error);
      throw error;
    }
  }

  async getVacationRequests(id: string): Promise<ApiResponse<Array<{
    id: string;
    startDate: string;
    endDate: string;
    status: 'pending' | 'approved' | 'rejected';
    notes?: string;
    createdAt: string;
  }>>> {
    try {
      return await apiClient.get(`/professionals/${id}/vacation`);
    } catch (error) {
      console.error('Get vacation requests error:', error);
      throw error;
    }
  }

  async exportProfessionals(filters?: ProfessionalFilters): Promise<ApiResponse<{ url: string }>> {
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
        `/professionals/export${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Export professionals error:', error);
      throw error;
    }
  }
}

export const professionalService = new ProfessionalService();