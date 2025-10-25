import { apiClient, ApiResponse } from '../lib/api';
import { Odontogram } from '../lib/types';

export interface ToothData {
  number: number;
  conditions: ToothCondition[];
  treatments: ToothTreatment[];
  notes?: string;
  color?: string;
  status: 'healthy' | 'treated' | 'needs_treatment' | 'missing' | 'extracted';
}

export interface ToothCondition {
  id: string;
  type: 'caries' | 'filling' | 'crown' | 'root_canal' | 'implant' | 'bridge' | 'other';
  surface?: string[]; // mesial, distal, buccal, lingual, occlusal
  severity?: 'mild' | 'moderate' | 'severe';
  date: string;
  description?: string;
  color?: string;
}

export interface ToothTreatment {
  id: string;
  type: 'restoration' | 'extraction' | 'cleaning' | 'whitening' | 'orthodontics' | 'surgery' | 'other';
  status: 'planned' | 'in_progress' | 'completed' | 'canceled';
  plannedDate?: string;
  completedDate?: string;
  description?: string;
  cost?: number;
  professionalId?: string;
}

export interface OdontogramData {
  teeth: Record<string, ToothData>;
  legend: {
    colors: Record<string, string>;
    symbols: Record<string, string>;
  };
  lastUpdated: string;
  notes?: string;
}

export interface OdontogramTemplate {
  id: string;
  name: string;
  description?: string;
  data: OdontogramData;
  isDefault: boolean;
  createdAt: string;
}

class OdontogramService {
  async getPatientOdontogram(patientId: string): Promise<ApiResponse<Odontogram>> {
    try {
      return await apiClient.get<Odontogram>(`/patients/${patientId}/odontogram`);
    } catch (error) {
      console.error('Get patient odontogram error:', error);
      throw error;
    }
  }

  async createOdontogram(patientId: string, data: OdontogramData): Promise<ApiResponse<Odontogram>> {
    try {
      return await apiClient.post<Odontogram>('/odontograms', {
        patientId,
        data
      });
    } catch (error) {
      console.error('Create odontogram error:', error);
      throw error;
    }
  }

  async updateOdontogram(id: string, data: Partial<OdontogramData>): Promise<ApiResponse<Odontogram>> {
    try {
      return await apiClient.put<Odontogram>(`/odontograms/${id}`, { data });
    } catch (error) {
      console.error('Update odontogram error:', error);
      throw error;
    }
  }

  async updateTooth(
    odontogramId: string, 
    toothNumber: number, 
    toothData: Partial<ToothData>
  ): Promise<ApiResponse<Odontogram>> {
    try {
      return await apiClient.patch<Odontogram>(`/odontograms/${odontogramId}/teeth/${toothNumber}`, toothData);
    } catch (error) {
      console.error('Update tooth error:', error);
      throw error;
    }
  }

  async addCondition(
    odontogramId: string, 
    toothNumber: number, 
    condition: Omit<ToothCondition, 'id'>
  ): Promise<ApiResponse<Odontogram>> {
    try {
      return await apiClient.post<Odontogram>(
        `/odontograms/${odontogramId}/teeth/${toothNumber}/conditions`, 
        condition
      );
    } catch (error) {
      console.error('Add tooth condition error:', error);
      throw error;
    }
  }

  async updateCondition(
    odontogramId: string, 
    toothNumber: number, 
    conditionId: string,
    condition: Partial<ToothCondition>
  ): Promise<ApiResponse<Odontogram>> {
    try {
      return await apiClient.put<Odontogram>(
        `/odontograms/${odontogramId}/teeth/${toothNumber}/conditions/${conditionId}`,
        condition
      );
    } catch (error) {
      console.error('Update tooth condition error:', error);
      throw error;
    }
  }

  async removeCondition(
    odontogramId: string, 
    toothNumber: number, 
    conditionId: string
  ): Promise<ApiResponse<Odontogram>> {
    try {
      return await apiClient.delete<Odontogram>(
        `/odontograms/${odontogramId}/teeth/${toothNumber}/conditions/${conditionId}`
      );
    } catch (error) {
      console.error('Remove tooth condition error:', error);
      throw error;
    }
  }

  async addTreatment(
    odontogramId: string, 
    toothNumber: number, 
    treatment: Omit<ToothTreatment, 'id'>
  ): Promise<ApiResponse<Odontogram>> {
    try {
      return await apiClient.post<Odontogram>(
        `/odontograms/${odontogramId}/teeth/${toothNumber}/treatments`,
        treatment
      );
    } catch (error) {
      console.error('Add tooth treatment error:', error);
      throw error;
    }
  }

  async updateTreatment(
    odontogramId: string, 
    toothNumber: number, 
    treatmentId: string,
    treatment: Partial<ToothTreatment>
  ): Promise<ApiResponse<Odontogram>> {
    try {
      return await apiClient.put<Odontogram>(
        `/odontograms/${odontogramId}/teeth/${toothNumber}/treatments/${treatmentId}`,
        treatment
      );
    } catch (error) {
      console.error('Update tooth treatment error:', error);
      throw error;
    }
  }

  async removeTreatment(
    odontogramId: string, 
    toothNumber: number, 
    treatmentId: string
  ): Promise<ApiResponse<Odontogram>> {
    try {
      return await apiClient.delete<Odontogram>(
        `/odontograms/${odontogramId}/teeth/${toothNumber}/treatments/${treatmentId}`
      );
    } catch (error) {
      console.error('Remove tooth treatment error:', error);
      throw error;
    }
  }

  async getOdontogramHistory(patientId: string): Promise<ApiResponse<Array<{
    id: string;
    date: string;
    changes: Array<{
      toothNumber: number;
      changeType: 'condition_added' | 'condition_removed' | 'treatment_added' | 'treatment_updated';
      description: string;
      user: string;
    }>;
  }>>> {
    try {
      return await apiClient.get(`/patients/${patientId}/odontogram/history`);
    } catch (error) {
      console.error('Get odontogram history error:', error);
      throw error;
    }
  }

  async exportOdontogram(id: string, format: 'pdf' | 'png' | 'svg' = 'pdf'): Promise<ApiResponse<{ url: string }>> {
    try {
      return await apiClient.get<{ url: string }>(`/odontograms/${id}/export?format=${format}`);
    } catch (error) {
      console.error('Export odontogram error:', error);
      throw error;
    }
  }

  async shareOdontogram(id: string, options: {
    expiresInHours?: number;
    allowEdit?: boolean;
    watermark?: boolean;
  }): Promise<ApiResponse<{ shareUrl: string; expiresAt: string }>> {
    try {
      return await apiClient.post(`/odontograms/${id}/share`, options);
    } catch (error) {
      console.error('Share odontogram error:', error);
      throw error;
    }
  }

  // Templates
  async getTemplates(): Promise<ApiResponse<OdontogramTemplate[]>> {
    try {
      return await apiClient.get<OdontogramTemplate[]>('/odontograms/templates');
    } catch (error) {
      console.error('Get odontogram templates error:', error);
      throw error;
    }
  }

  async createTemplate(template: Omit<OdontogramTemplate, 'id' | 'createdAt'>): Promise<ApiResponse<OdontogramTemplate>> {
    try {
      return await apiClient.post<OdontogramTemplate>('/odontograms/templates', template);
    } catch (error) {
      console.error('Create odontogram template error:', error);
      throw error;
    }
  }

  async updateTemplate(id: string, template: Partial<OdontogramTemplate>): Promise<ApiResponse<OdontogramTemplate>> {
    try {
      return await apiClient.put<OdontogramTemplate>(`/odontograms/templates/${id}`, template);
    } catch (error) {
      console.error('Update odontogram template error:', error);
      throw error;
    }
  }

  async deleteTemplate(id: string): Promise<ApiResponse<void>> {
    try {
      return await apiClient.delete<void>(`/odontograms/templates/${id}`);
    } catch (error) {
      console.error('Delete odontogram template error:', error);
      throw error;
    }
  }

  async applyTemplate(odontogramId: string, templateId: string): Promise<ApiResponse<Odontogram>> {
    try {
      return await apiClient.post<Odontogram>(`/odontograms/${odontogramId}/apply-template`, {
        templateId
      });
    } catch (error) {
      console.error('Apply odontogram template error:', error);
      throw error;
    }
  }

  // Utilities
  async getToothInfo(toothNumber: number): Promise<ApiResponse<{
    number: number;
    name: string;
    type: 'incisor' | 'canine' | 'premolar' | 'molar';
    surfaces: string[];
    commonConditions: string[];
    commonTreatments: string[];
  }>> {
    try {
      return await apiClient.get(`/odontograms/tooth-info/${toothNumber}`);
    } catch (error) {
      console.error('Get tooth info error:', error);
      throw error;
    }
  }

  async getConditionTypes(): Promise<ApiResponse<Array<{
    type: string;
    name: string;
    color: string;
    description: string;
    commonSurfaces: string[];
  }>>> {
    try {
      return await apiClient.get('/odontograms/condition-types');
    } catch (error) {
      console.error('Get condition types error:', error);
      throw error;
    }
  }

  async getTreatmentTypes(): Promise<ApiResponse<Array<{
    type: string;
    name: string;
    description: string;
    averageCost: number;
    averageDuration: number;
  }>>> {
    try {
      return await apiClient.get('/odontograms/treatment-types');
    } catch (error) {
      console.error('Get treatment types error:', error);
      throw error;
    }
  }

  async validateOdontogram(data: OdontogramData): Promise<ApiResponse<{
    valid: boolean;
    errors: Array<{
      field: string;
      message: string;
      toothNumber?: number;
    }>;
    warnings: Array<{
      field: string;
      message: string;
      toothNumber?: number;
    }>;
  }>> {
    try {
      return await apiClient.post('/odontograms/validate', { data });
    } catch (error) {
      console.error('Validate odontogram error:', error);
      throw error;
    }
  }

  // AI and Analysis
  async analyzeOdontogram(id: string): Promise<ApiResponse<{
    riskAssessment: {
      overall: 'low' | 'medium' | 'high';
      cariesRisk: 'low' | 'medium' | 'high';
      periodontalRisk: 'low' | 'medium' | 'high';
    };
    recommendations: Array<{
      toothNumber?: number;
      priority: 'low' | 'medium' | 'high' | 'urgent';
      type: 'preventive' | 'treatment' | 'monitoring';
      description: string;
      estimatedCost?: number;
    }>;
    statistics: {
      healthyTeeth: number;
      treatedTeeth: number;
      teethNeedingTreatment: number;
      missingTeeth: number;
      totalConditions: number;
      completedTreatments: number;
      pendingTreatments: number;
    };
  }>> {
    try {
      return await apiClient.post(`/odontograms/${id}/analyze`);
    } catch (error) {
      console.error('Analyze odontogram error:', error);
      throw error;
    }
  }

  async generateTreatmentPlan(id: string, preferences?: {
    maxCost?: number;
    timeframe?: number; // in months
    priority?: 'cost' | 'time' | 'health';
  }): Promise<ApiResponse<{
    plan: Array<{
      phase: number;
      treatments: Array<{
        toothNumber: number;
        treatmentType: string;
        description: string;
        estimatedCost: number;
        estimatedDuration: number;
        priority: 'low' | 'medium' | 'high' | 'urgent';
      }>;
      totalCost: number;
      estimatedDuration: number;
    }>;
    totalCost: number;
    totalDuration: number;
    notes: string[];
  }>> {
    try {
      return await apiClient.post(`/odontograms/${id}/treatment-plan`, preferences || {});
    } catch (error) {
      console.error('Generate treatment plan error:', error);
      throw error;
    }
  }
}

export const odontogramService = new OdontogramService();