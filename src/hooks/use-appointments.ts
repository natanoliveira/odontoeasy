import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';

export interface Appointment {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  notes?: string;
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  professional?: {
    id: string;
    name: string;
    specialty: string;
    color: string;
  };
  treatment?: {
    id: string;
    name: string;
    description?: string;
  };
  room?: {
    id: string;
    name: string;
  };
}

interface UseAppointmentsOptions {
  date?: string;
  status?: string;
  professionalId?: string;
  patientId?: string;
  limit?: number;
}

interface UseAppointmentsResult {
  appointments: Appointment[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createAppointment: (data: Partial<Appointment>) => Promise<Appointment>;
  updateAppointment: (id: string, data: Partial<Appointment>) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export function useAppointments(options: UseAppointmentsOptions = {}): UseAppointmentsResult {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {};
      if (options.date) params.date = options.date;
      if (options.status) params.status = options.status;
      if (options.professionalId) params.professionalId = options.professionalId;
      if (options.patientId) params.patientId = options.patientId;
      if (options.limit) params.limit = options.limit.toString();

      const data = await apiClient.get<{
        appointments: Appointment[];
        pagination: any;
      }>('/appointments', { params });

      setAppointments(data.appointments);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch appointments'));
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const createAppointment = async (data: Partial<Appointment>): Promise<Appointment> => {
    const response = await apiClient.post<{ appointment: Appointment }>('/appointments', data);
    await fetchAppointments(); // Refresh list
    return response.appointment;
  };

  const updateAppointment = async (id: string, data: Partial<Appointment>): Promise<Appointment> => {
    const response = await apiClient.put<{ appointment: Appointment }>(`/appointments/${id}`, data);
    await fetchAppointments(); // Refresh list
    return response.appointment;
  };

  const deleteAppointment = async (id: string): Promise<void> => {
    await apiClient.delete(`/appointments/${id}`);
    await fetchAppointments(); // Refresh list
  };

  useEffect(() => {
    fetchAppointments();
  }, [options.date, options.status, options.professionalId, options.patientId, options.limit]);

  return {
    appointments,
    loading,
    error,
    refetch: fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    pagination,
  };
}

// Helper hook for today's appointments
export function useTodayAppointments(): UseAppointmentsResult {
  const today = new Date().toISOString().split('T')[0];
  return useAppointments({ date: today, limit: 10 });
}
