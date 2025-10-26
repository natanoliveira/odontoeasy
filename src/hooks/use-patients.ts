import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import { Appointment } from '@prisma/client';

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf?: string;
  birthDate?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  notes?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  createdAt: string;
  updatedAt: string;
  lastAppointment: {
    id: string,
    clinicId: string,
    patientId: string,
    professionalId: string,
    userId: string,
    roomId: string,
    title: string,
    description: string,
    date: Date,
    startTime: string,
    endTime: string,
    duration: string,
    type: string,
    status: string,
    value: string,
    notes: string,
    reminderSent: false,
    createdAt: Date,
    updatedAt: Date
  };
}

interface UsePatientsOptions {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

interface UsePatientsResult {
  patients: Patient[];
  loading: boolean;
  error: Error | null;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
  refetch: () => Promise<void>;
  createPatient: (data: Partial<Patient>) => Promise<Patient>;
  updatePatient: (id: string, data: Partial<Patient>) => Promise<Patient>;
  deletePatient: (id: string) => Promise<void>;
}

export function usePatients(options: UsePatientsOptions = {}): UsePatientsResult {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {};
      if (options.page) params.page = options.page.toString();
      if (options.limit) params.limit = options.limit.toString();
      if (options.search) params.search = options.search;
      if (options.status) params.status = options.status;

      const data = await apiClient.get<{
        patients: Patient[];
        pagination: any;
      }>('/patients', { params });

      setPatients(data.patients);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch patients'));
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const createPatient = async (data: Partial<Patient>): Promise<Patient> => {
    const response = await apiClient.post<{ patient: Patient }>('/patients', data);
    await fetchPatients(); // Refresh list
    return response.patient;
  };

  const updatePatient = async (id: string, data: Partial<Patient>): Promise<Patient> => {
    const response = await apiClient.put<{ patient: Patient }>(`/patients/${id}`, data);
    await fetchPatients(); // Refresh list
    return response.patient;
  };

  const deletePatient = async (id: string): Promise<void> => {
    await apiClient.delete(`/patients/${id}`);
    await fetchPatients(); // Refresh list
  };

  useEffect(() => {
    fetchPatients();
  }, [options.page, options.limit, options.search, options.status]);

  return {
    patients,
    loading,
    error,
    pagination,
    refetch: fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
}
