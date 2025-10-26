import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';

export interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  cro: string;
  specialty: string;
  color: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE';
  startDate?: string;
  workDays?: string[];
  workStart?: string;
  workEnd?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface UseProfessionalsResult {
  professionals: Professional[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createProfessional: (data: Partial<Professional>) => Promise<Professional>;
  updateProfessional: (id: string, data: Partial<Professional>) => Promise<Professional>;
  deleteProfessional: (id: string) => Promise<void>;
}

export function useProfessionals(): UseProfessionalsResult {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchProfessionals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<{ professionals: Professional[] }>('/professionals');
      setProfessionals(data.professionals);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch professionals'));
    } finally {
      setLoading(false);
    }
  };

  const createProfessional = async (data: Partial<Professional>): Promise<Professional> => {
    const response = await apiClient.post<{ professional: Professional }>('/professionals', data);
    await fetchProfessionals();
    return response.professional;
  };

  const updateProfessional = async (id: string, data: Partial<Professional>): Promise<Professional> => {
    const response = await apiClient.put<{ professional: Professional }>(`/professionals/${id}`, data);
    await fetchProfessionals();
    return response.professional;
  };

  const deleteProfessional = async (id: string): Promise<void> => {
    await apiClient.delete(`/professionals/${id}`);
    await fetchProfessionals();
  };

  useEffect(() => {
    fetchProfessionals();
  }, []);

  return {
    professionals,
    loading,
    error,
    refetch: fetchProfessionals,
    createProfessional,
    updateProfessional,
    deleteProfessional,
  };
}
