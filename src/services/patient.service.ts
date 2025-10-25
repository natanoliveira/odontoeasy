import { apiClient, ApiResponse } from '../lib/api';
import { Patient, CreatePatientData, PaginatedResponse, PatientStatus } from '../lib/types';

export interface PatientFilters {
  search?: string;
  status?: PatientStatus;
  gender?: string;
  ageRange?: [number, number];
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PatientStats {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
  averageAge: number;
  genderDistribution: {
    male: number;
    female: number;
    other: number;
  };
}

class PatientService {
  async getPatients(filters: PatientFilters = {}): Promise<ApiResponse<PaginatedResponse<Patient>>> {
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (Array.isArray(value)) {
            params.append(key, value.join(','));
          } else {
            params.append(key, value.toString());
          }
        }
      });

      const queryString = params.toString();
      return await apiClient.get<PaginatedResponse<Patient>>(
        `/patients${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Get patients error:', error);
      throw error;
    }
  }

  async getPatientById(id: string): Promise<ApiResponse<Patient>> {
    try {
      return await apiClient.get<Patient>(`/patients/${id}`);
    } catch (error) {
      console.error('Get patient by ID error:', error);
      throw error;
    }
  }

  async createPatient(data: CreatePatientData): Promise<ApiResponse<Patient>> {
    try {
      return await apiClient.post<Patient>('/patients', data);
    } catch (error) {
      console.error('Create patient error:', error);
      throw error;
    }
  }

  async updatePatient(id: string, data: Partial<CreatePatientData>): Promise<ApiResponse<Patient>> {
    try {
      return await apiClient.put<Patient>(`/patients/${id}`, data);
    } catch (error) {
      console.error('Update patient error:', error);
      throw error;
    }
  }

  async deletePatient(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<void>(`/patients/${id}`);
    } catch (error) {
      console.error('Delete patient error:', error);
      throw error;
    }
  }

  async archivePatient(id: string): Promise<ApiResponse<Patient>> {
    try {
      return await apiClient.patch<Patient>(`/patients/${id}/archive`);
    } catch (error) {
      console.error('Archive patient error:', error);
      throw error;
    }
  }

  async restorePatient(id: string): Promise<ApiResponse<Patient>> {
    try {
      return await apiClient.patch<Patient>(`/patients/${id}/restore`);
    } catch (error) {
      console.error('Restore patient error:', error);
      throw error;
    }
  }

  async getPatientHistory(id: string): Promise<ApiResponse<{
    appointments: any[];
    treatments: any[];
    documents: any[];
    payments: any[];
  }>> {
    try {
      return await apiClient.get(`/patients/${id}/history`);
    } catch (error) {
      console.error('Get patient history error:', error);
      throw error;
    }
  }

  async getPatientStats(): Promise<ApiResponse<PatientStats>> {
    try {
      return await apiClient.get<PatientStats>('/patients/stats');
    } catch (error) {
      console.error('Get patient stats error:', error);
      throw error;
    }
  }

  async searchPatients(query: string): Promise<ApiResponse<Patient[]>> {
    try {
      return await apiClient.get<Patient[]>(`/patients/search?q=${encodeURIComponent(query)}`);
    } catch (error) {
      console.error('Search patients error:', error);
      throw error;
    }
  }

  async uploadPatientPhoto(id: string, file: File): Promise<ApiResponse<{ url: string }>> {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      return await apiClient.upload<{ url: string }>(`/patients/${id}/photo`, formData);
    } catch (error) {
      console.error('Upload patient photo error:', error);
      throw error;
    }
  }

  async getPatientAppointments(id: string, filters?: {
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<ApiResponse<any[]>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      const queryString = params.toString();
      return await apiClient.get(
        `/patients/${id}/appointments${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Get patient appointments error:', error);
      throw error;
    }
  }

  async getPatientTreatments(id: string): Promise<ApiResponse<any[]>> {
    try {
      return await apiClient.get(`/patients/${id}/treatments`);
    } catch (error) {
      console.error('Get patient treatments error:', error);
      throw error;
    }
  }

  async addPatientNote(id: string, content: string): Promise<ApiResponse<any>> {
    try {
      return await apiClient.post(`/patients/${id}/notes`, { content });
    } catch (error) {
      console.error('Add patient note error:', error);
      throw error;
    }
  }

  async getPatientNotes(id: string): Promise<ApiResponse<any[]>> {
    try {
      return await apiClient.get(`/patients/${id}/notes`);
    } catch (error) {
      console.error('Get patient notes error:', error);
      throw error;
    }
  }

  async exportPatients(filters?: PatientFilters): Promise<ApiResponse<{ url: string }>> {
    try {
      const params = new URLSearchParams();
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (Array.isArray(value)) {
              params.append(key, value.join(','));
            } else {
              params.append(key, value.toString());
            }
          }
        });
      }

      const queryString = params.toString();
      return await apiClient.get<{ url: string }>(
        `/patients/export${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Export patients error:', error);
      throw error;
    }
  }

  async importPatients(file: File): Promise<ApiResponse<{
    success: number;
    errors: Array<{ row: number; message: string }>;
  }>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      return await apiClient.upload(`/patients/import`, formData);
    } catch (error) {
      console.error('Import patients error:', error);
      throw error;
    }
  }
}

export const patientService = new PatientService();