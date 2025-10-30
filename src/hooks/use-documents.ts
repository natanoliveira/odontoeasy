import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';

export interface Document {
  id: string;
  name: string;
  description?: string;
  type: 'XRAY' | 'PHOTO' | 'PRESCRIPTION' | 'REPORT' | 'CONTRACT' | 'OTHER';
  url: string;
  size: number;
  mimeType: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  patient: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface UseDocumentsOptions {
  page?: number;
  limit?: number;
  type?: string;
  patientId?: string;
}

interface UseDocumentsResult {
  documents: Document[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  createDocument: (data: Partial<Document>) => Promise<Document>;
  updateDocument: (id: string, data: Partial<Document>) => Promise<Document>;
  deleteDocument: (id: string) => Promise<void>;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export function useDocuments(options: UseDocumentsOptions = {}): UseDocumentsResult {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: Record<string, string> = {};
      if (options.page) params.page = options.page.toString();
      if (options.limit) params.limit = options.limit.toString();
      if (options.type) params.type = options.type;
      if (options.patientId) params.patientId = options.patientId;

      const data = await apiClient.get<{
        documents: Document[];
        pagination: any;
      }>('/documents', { params });

      setDocuments(data.documents);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch documents'));
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDocument = async (data: Partial<Document>): Promise<Document> => {
    const response = await apiClient.post<{ document: Document }>('/documents', data);
    await fetchDocuments(); // Refresh list
    return response.document;
  };

  const updateDocument = async (id: string, data: Partial<Document>): Promise<Document> => {
    const response = await apiClient.put<{ document: Document }>(`/documents/${id}`, data);
    await fetchDocuments(); // Refresh list
    return response.document;
  };

  const deleteDocument = async (id: string): Promise<void> => {
    await apiClient.delete(`/documents/${id}`);
    await fetchDocuments(); // Refresh list
  };

  useEffect(() => {
    fetchDocuments();
  }, [options.page, options.limit, options.type, options.patientId]);

  return {
    documents,
    loading,
    error,
    refetch: fetchDocuments,
    createDocument,
    updateDocument,
    deleteDocument,
    pagination,
  };
}
