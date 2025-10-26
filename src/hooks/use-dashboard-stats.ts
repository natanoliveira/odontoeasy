import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';

export interface DashboardStats {
  patients: {
    total: number;
    active: number;
  };
  professionals: {
    total: number;
  };
  appointments: {
    today: number;
    thisMonth: number;
    pending: number;
    completed: number;
  };
  revenue: {
    today: number;
    thisMonth: number;
  };
  treatments: {
    total: number;
    active: number;
  };
}

interface UseDashboardStatsResult {
  statsDash: DashboardStats | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

export function useDashboardStats(): UseDashboardStatsResult {
  const [statsDash, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.get<DashboardStats>('/dashboard/stats');
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch dashboard stats'));
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return {
    statsDash,
    loading,
    error,
    refetch: fetchStats,
  };
}
