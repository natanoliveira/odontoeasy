import { Patient, Appointment, Professional, Treatment } from '@prisma/client';

// ================================
// API RESPONSE TYPES
// ================================

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// ================================
// PATIENT TYPES
// ================================

export interface PatientWithRelations extends Patient {
  appointments?: Appointment[];
  treatments?: Treatment[];
  documents?: any[];
}

// ================================
// APPOINTMENT TYPES
// ================================

export interface AppointmentWithRelations extends Appointment {
  patient?: Patient;
  professional?: Professional;
  room?: any;
}

// ================================
// QUERY PARAMS
// ================================

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PatientQueryParams extends PaginationParams {
  search?: string;
  status?: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
}

export interface AppointmentQueryParams extends PaginationParams {
  date?: string;
  professionalId?: string;
  patientId?: string;
  status?: string;
  roomId?: string;
}

export interface ProfessionalQueryParams extends PaginationParams {
  status?: 'ACTIVE' | 'INACTIVE' | 'VACATION';
  specialty?: string;
}

export interface TreatmentQueryParams extends PaginationParams {
  patientId?: string;
  status?: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
}
