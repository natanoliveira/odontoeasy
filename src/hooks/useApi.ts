import { useState, useCallback } from 'react';
import { ApiResponse } from '../lib/types';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
}

export function useApi<TData, TArgs extends any[] = []>(
  apiFunction: (...args: TArgs) => Promise<ApiResponse<TData>>
): UseApiReturn<TData> {
  const [state, setState] = useState<UseApiState<TData>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: TArgs): Promise<TData> => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const response = await apiFunction(...args);
        
        if (response.success && response.data) {
          setState({
            data: response.data,
            loading: false,
            error: null,
          });
          return response.data;
        } else {
          throw new Error(response.error || response.message || 'API call failed');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setState({
          data: null,
          loading: false,
          error: errorMessage,
        });
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Specialized hooks for common patterns
export function useAsyncOperation<TData, TArgs extends any[] = []>(
  operation: (...args: TArgs) => Promise<ApiResponse<TData>>
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (...args: TArgs): Promise<TData | null> => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await operation(...args);
        
        if (response.success && response.data) {
          return response.data;
        } else {
          throw new Error(response.error || response.message || 'Operation failed');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [operation]
  );

  return {
    execute,
    loading,
    error,
    reset: () => setError(null),
  };
}

// Hook for handling form submissions
export function useFormSubmission<TData, TFormData>(
  submitFunction: (data: TFormData) => Promise<ApiResponse<TData>>,
  onSuccess?: (data: TData) => void,
  onError?: (error: string) => void
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (formData: TFormData): Promise<boolean> => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await submitFunction(formData);
        
        if (response.success && response.data) {
          onSuccess?.(response.data);
          return true;
        } else {
          const errorMessage = response.error || response.message || 'Submission failed';
          setError(errorMessage);
          onError?.(errorMessage);
          return false;
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        setError(errorMessage);
        onError?.(errorMessage);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [submitFunction, onSuccess, onError]
  );

  return {
    submit,
    loading,
    error,
    reset: () => setError(null),
  };
}