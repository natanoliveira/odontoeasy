import { apiClient, ApiResponse } from '../lib/api';
import { Document, DocumentType, PaginatedResponse } from '../lib/types';

export interface DocumentFilters {
  patientId?: string;
  type?: DocumentType;
  tags?: string[];
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateDocumentData {
  name: string;
  description?: string;
  type: DocumentType;
  patientId?: string;
  tags: string[];
}

export interface DocumentStats {
  total: number;
  byType: Array<{
    type: DocumentType;
    count: number;
  }>;
  totalSize: number;
  recentUploads: number;
}

class DocumentService {
  async getDocuments(filters: DocumentFilters = {}): Promise<ApiResponse<PaginatedResponse<Document>>> {
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
      return await apiClient.get<PaginatedResponse<Document>>(
        `/documents${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Get documents error:', error);
      throw error;
    }
  }

  async getDocumentById(id: string): Promise<ApiResponse<Document>> {
    try {
      return await apiClient.get<Document>(`/documents/${id}`);
    } catch (error) {
      console.error('Get document by ID error:', error);
      throw error;
    }
  }

  async uploadDocument(
    file: File, 
    data: CreateDocumentData,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<Document>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', data.name);
      formData.append('type', data.type);
      formData.append('tags', JSON.stringify(data.tags));
      
      if (data.description) {
        formData.append('description', data.description);
      }
      
      if (data.patientId) {
        formData.append('patientId', data.patientId);
      }

      // For progress tracking, we would need to implement XMLHttpRequest
      // For now, using the standard upload method
      return await apiClient.upload<Document>('/documents/upload', formData);
    } catch (error) {
      console.error('Upload document error:', error);
      throw error;
    }
  }

  async uploadMultipleDocuments(
    files: File[],
    commonData: Omit<CreateDocumentData, 'name'>,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<{ successful: Document[]; failed: Array<{ file: string; error: string }> }>> {
    try {
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append(`files`, file);
      });
      
      formData.append('type', commonData.type);
      formData.append('tags', JSON.stringify(commonData.tags));
      
      if (commonData.description) {
        formData.append('description', commonData.description);
      }
      
      if (commonData.patientId) {
        formData.append('patientId', commonData.patientId);
      }

      return await apiClient.upload('/documents/upload-multiple', formData);
    } catch (error) {
      console.error('Upload multiple documents error:', error);
      throw error;
    }
  }

  async updateDocument(id: string, data: Partial<CreateDocumentData>): Promise<ApiResponse<Document>> {
    try {
      return await apiClient.put<Document>(`/documents/${id}`, data);
    } catch (error) {
      console.error('Update document error:', error);
      throw error;
    }
  }

  async deleteDocument(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<void>(`/documents/${id}`);
    } catch (error) {
      console.error('Delete document error:', error);
      throw error;
    }
  }

  async deleteMultipleDocuments(ids: string[]): Promise<ApiResponse<{
    deleted: string[];
    failed: Array<{ id: string; error: string }>;
  }>> {
    try {
      return await apiClient.post('/documents/delete-multiple', { ids });
    } catch (error) {
      console.error('Delete multiple documents error:', error);
      throw error;
    }
  }

  async getDocumentUrl(id: string): Promise<ApiResponse<{ url: string; expiresAt: string }>> {
    try {
      return await apiClient.get<{ url: string; expiresAt: string }>(`/documents/${id}/url`);
    } catch (error) {
      console.error('Get document URL error:', error);
      throw error;
    }
  }

  async downloadDocument(id: string): Promise<void> {
    try {
      const response = await apiClient.get<{ url: string }>(`/documents/${id}/download`);
      if (response.success && response.data.url) {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = ''; // The filename will be determined by the server
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error('Download document error:', error);
      throw error;
    }
  }

  async getPatientDocuments(patientId: string, type?: DocumentType): Promise<ApiResponse<Document[]>> {
    try {
      const params = type ? `?type=${type}` : '';
      return await apiClient.get<Document[]>(`/patients/${patientId}/documents${params}`);
    } catch (error) {
      console.error('Get patient documents error:', error);
      throw error;
    }
  }

  async shareDocument(id: string, options: {
    expiresInHours?: number;
    password?: string;
    allowDownload?: boolean;
  }): Promise<ApiResponse<{ shareUrl: string; expiresAt: string }>> {
    try {
      return await apiClient.post(`/documents/${id}/share`, options);
    } catch (error) {
      console.error('Share document error:', error);
      throw error;
    }
  }

  async getSharedDocument(shareToken: string, password?: string): Promise<ApiResponse<{
    document: Document;
    url: string;
  }>> {
    try {
      const data = password ? { password } : {};
      return await apiClient.post(`/documents/shared/${shareToken}`, data);
    } catch (error) {
      console.error('Get shared document error:', error);
      throw error;
    }
  }

  async getDocumentStats(): Promise<ApiResponse<DocumentStats>> {
    try {
      return await apiClient.get<DocumentStats>('/documents/stats');
    } catch (error) {
      console.error('Get document stats error:', error);
      throw error;
    }
  }

  async searchDocuments(query: string, filters?: {
    type?: DocumentType;
    patientId?: string;
    tag?: string;
  }): Promise<ApiResponse<Document[]>> {
    try {
      const params = new URLSearchParams({ q: query });
      
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
      }

      return await apiClient.get<Document[]>(`/documents/search?${params.toString()}`);
    } catch (error) {
      console.error('Search documents error:', error);
      throw error;
    }
  }

  async getTags(): Promise<ApiResponse<Array<{ tag: string; count: number }>>> {
    try {
      return await apiClient.get('/documents/tags');
    } catch (error) {
      console.error('Get document tags error:', error);
      throw error;
    }
  }

  async addTag(documentId: string, tag: string): Promise<ApiResponse<Document>> {
    try {
      return await apiClient.post<Document>(`/documents/${documentId}/tags`, { tag });
    } catch (error) {
      console.error('Add document tag error:', error);
      throw error;
    }
  }

  async removeTag(documentId: string, tag: string): Promise<ApiResponse<Document>> {
    try {
      return await apiClient.delete<Document>(`/documents/${documentId}/tags/${encodeURIComponent(tag)}`);
    } catch (error) {
      console.error('Remove document tag error:', error);
      throw error;
    }
  }

  async getDocumentVersions(id: string): Promise<ApiResponse<Array<{
    id: string;
    version: number;
    url: string;
    size: number;
    createdAt: string;
    createdBy: string;
  }>>> {
    try {
      return await apiClient.get(`/documents/${id}/versions`);
    } catch (error) {
      console.error('Get document versions error:', error);
      throw error;
    }
  }

  async createDocumentVersion(id: string, file: File, notes?: string): Promise<ApiResponse<Document>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (notes) {
        formData.append('notes', notes);
      }

      return await apiClient.upload<Document>(`/documents/${id}/versions`, formData);
    } catch (error) {
      console.error('Create document version error:', error);
      throw error;
    }
  }

  async getStorageUsage(): Promise<ApiResponse<{
    totalUsed: number;
    totalLimit: number;
    byType: Array<{
      type: DocumentType;
      size: number;
      count: number;
    }>;
    largestFiles: Array<{
      id: string;
      name: string;
      size: number;
      type: DocumentType;
    }>;
  }>> {
    try {
      return await apiClient.get('/documents/storage');
    } catch (error) {
      console.error('Get storage usage error:', error);
      throw error;
    }
  }

  async exportDocuments(filters?: DocumentFilters): Promise<ApiResponse<{ url: string }>> {
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
        `/documents/export${queryString ? `?${queryString}` : ''}`
      );
    } catch (error) {
      console.error('Export documents error:', error);
      throw error;
    }
  }

  // OCR and Text Extraction
  async extractText(id: string): Promise<ApiResponse<{ text: string; confidence: number }>> {
    try {
      return await apiClient.post(`/documents/${id}/extract-text`);
    } catch (error) {
      console.error('Extract text from document error:', error);
      throw error;
    }
  }

  // Image Processing
  async processImage(id: string, operations: {
    resize?: { width: number; height: number };
    rotate?: number;
    crop?: { x: number; y: number; width: number; height: number };
    brightness?: number;
    contrast?: number;
  }): Promise<ApiResponse<{ url: string }>> {
    try {
      return await apiClient.post(`/documents/${id}/process-image`, operations);
    } catch (error) {
      console.error('Process image error:', error);
      throw error;
    }
  }
}

export const documentService = new DocumentService();