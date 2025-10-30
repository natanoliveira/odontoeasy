import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';

export interface Odontogram {
  id: string;
  patientId: string;
  data: {
    teeth: Record<string, {
      notes: string;
      conditions: string[];
      treatments: string[];
    }>;
    version: string;
    lastUpdated: string;
  };
  notes?: string;
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
}

interface UseOdontogramsOptions {
  patientId?: string;
}

interface UseOdontogramsResult {
  odontograms: Odontogram[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createOdontogram: (data: Partial<Odontogram>) => Promise<Odontogram>;
  updateOdontogram: (id: string, data: Partial<Odontogram>) => Promise<Odontogram>;
  deleteOdontogram: (id: string) => Promise<void>;
}

export function useOdontograms(options: UseOdontogramsOptions = {}): UseOdontogramsResult {
  const [odontograms, setOdontograms] = useState<Odontogram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchOdontograms = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {};
      if (options.patientId) params.patientId = options.patientId;

      const data = await apiClient.get<{
        odontograms: Odontogram[];
      }>('/odontograms', { params });

      setOdontograms(data.odontograms);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch odontograms'));
      console.error('Error fetching odontograms:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOdontogram = async (data: Partial<Odontogram>): Promise<Odontogram> => {
    const response = await apiClient.post<{ odontogram: Odontogram }>('/odontograms', data);
    await fetchOdontograms(); // Refresh list
    return response.odontogram;
  };

  const updateOdontogram = async (id: string, data: Partial<Odontogram>): Promise<Odontogram> => {
    const response = await apiClient.put<{ odontogram: Odontogram }>(`/odontograms/${id}`, data);
    await fetchOdontograms(); // Refresh list
    return response.odontogram;
  };

  const deleteOdontogram = async (id: string): Promise<void> => {
    await apiClient.delete(`/odontograms/${id}`);
    await fetchOdontograms(); // Refresh list
  };

  useEffect(() => {
    fetchOdontograms();
  }, [options.patientId]);

  return {
    odontograms,
    loading,
    error,
    refetch: fetchOdontograms,
    createOdontogram,
    updateOdontogram,
    deleteOdontogram,
  };
}
