// Database Types based on Prisma Schema

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  role: UserRole;
  provider?: string;
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  CLINIC_ADMIN = 'CLINIC_ADMIN',
  DENTIST = 'DENTIST',
  ASSISTANT = 'ASSISTANT'
}

export interface Clinic {
  id: string;
  name: string;
  cnpj?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  logo?: string;
  description?: string;
  settings?: Record<string, any>;
  status: ClinicStatus;
  subscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ClinicStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  TRIAL = 'TRIAL'
}

export interface Patient {
  id: string;
  clinicId: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: Date;
  gender?: Gender;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
  medicalHistory?: Record<string, any>;
  notes?: string;
  status: PatientStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER'
}

export enum PatientStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  ARCHIVED = 'ARCHIVED'
}

export interface Professional {
  id: string;
  clinicId: string;
  name: string;
  email?: string;
  phone?: string;
  cro: string;
  specialty: string;
  color: string;
  avatar?: string;
  status: ProfessionalStatus;
  startDate?: Date;
  workDays: string[];
  workStart?: string;
  workEnd?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ProfessionalStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  VACATION = 'VACATION'
}

export interface Appointment {
  id: string;
  clinicId: string;
  patientId: string;
  professionalId: string;
  userId?: string;
  roomId?: string;
  title?: string;
  description?: string;
  date: Date;
  startTime: string;
  endTime: string;
  duration: number;
  type: string;
  status: AppointmentStatus;
  value?: number;
  notes?: string;
  reminderSent: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  patient?: Patient;
  professional?: Professional;
  room?: Room;
}

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  NO_SHOW = 'NO_SHOW',
  URGENT = 'URGENT'
}

export interface Treatment {
  id: string;
  clinicId: string;
  patientId: string;
  appointmentId?: string;
  name: string;
  description?: string;
  tooth?: string;
  status: TreatmentStatus;
  startDate?: Date;
  endDate?: Date;
  value?: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TreatmentStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED'
}

export interface Room {
  id: string;
  clinicId: string;
  name: string;
  description?: string;
  color: string;
  equipment: string[];
  status: RoomStatus;
  createdAt: Date;
  updatedAt: Date;
}

export enum RoomStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  MAINTENANCE = 'MAINTENANCE',
  UNAVAILABLE = 'UNAVAILABLE'
}

export interface Document {
  id: string;
  clinicId: string;
  patientId?: string;
  userId?: string;
  name: string;
  description?: string;
  type: DocumentType;
  url: string;
  size?: number;
  mimeType?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export enum DocumentType {
  XRAY = 'XRAY',
  PHOTO = 'PHOTO',
  REPORT = 'REPORT',
  CONSENT = 'CONSENT',
  INVOICE = 'INVOICE',
  OTHER = 'OTHER'
}

export interface Payment {
  id: string;
  clinicId: string;
  subscriptionId?: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  stripeId?: string;
  description?: string;
  paidAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  CANCELED = 'CANCELED'
}

export interface Subscription {
  id: string;
  clinicId?: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  stripeId?: string;
  customerId?: string;
  priceId?: string;
  startDate: Date;
  endDate?: Date;
  cancelAt?: Date;
  features?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionPlan {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE'
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID',
  TRIALING = 'TRIALING'
}

export interface Schedule {
  id: string;
  clinicId: string;
  professionalId?: string;
  date: Date;
  startTime: string;
  endTime: string;
  available: boolean;
  type?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Odontogram {
  id: string;
  clinicId: string;
  patientId: string;
  data: Record<string, any>;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Request/Response Types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

// Form Types
export interface CreatePatientData {
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
  gender?: Gender;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  emergencyContact?: string;
  medicalHistory?: Record<string, any>;
  notes?: string;
}

export interface CreateAppointmentData {
  patientId: string;
  professionalId: string;
  roomId?: string;
  title?: string;
  description?: string;
  date: string;
  startTime: string;
  endTime: string;
  type: string;
  value?: number;
  notes?: string;
}

export interface CreateProfessionalData {
  name: string;
  email?: string;
  phone?: string;
  cro: string;
  specialty: string;
  color?: string;
  startDate?: string;
  workDays: string[];
  workStart?: string;
  workEnd?: string;
  notes?: string;
}

export interface UpdateClinicData {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  website?: string;
  description?: string;
}

// Dashboard Statistics
export interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  todayAppointments: number;
  monthlyRevenue: number;
  pendingAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
  activePatients: number;
  newPatientsThisMonth: number;
  averageAppointmentValue: number;
}

// Calendar Event Type
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  patient?: string;
  professional?: string;
  status: AppointmentStatus;
  type: string;
}

// Public booking types
export interface AvailableSlot {
  date: string;
  time: string;
  professionalId: string;
  professionalName: string;
  duration: number;
}

export interface BookingRequest {
  clinicId: string;
  professionalId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  startTime: string;
  type: string;
  notes?: string;
}