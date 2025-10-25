// Main services export file
export { authService } from './auth.service';
export { patientService } from './patient.service';
export { appointmentService } from './appointment.service';
export { professionalService } from './professional.service';
export { clinicService } from './clinic.service';
export { documentService } from './document.service';
export { paymentService } from './payment.service';
export { odontogramService } from './odontogram.service';

// Types exports
export type { 
  LoginCredentials,
  GoogleAuthResponse,
  AuthResponse,
  RegisterData
} from './auth.service';

export type {
  PatientFilters,
  PatientStats
} from './patient.service';

export type {
  AppointmentFilters,
  AppointmentStats,
  TimeSlot
} from './appointment.service';

export type {
  ProfessionalFilters,
  ProfessionalStats,
  WorkSchedule,
  ProfessionalAvailability
} from './professional.service';

export type {
  ClinicSettings,
  CreateRoomData
} from './clinic.service';

export type {
  DocumentFilters,
  CreateDocumentData,
  DocumentStats
} from './document.service';

export type {
  PaymentFilters,
  CreatePaymentData,
  PaymentStats,
  StripePaymentIntent
} from './payment.service';

export type {
  ToothData,
  ToothCondition,
  ToothTreatment,
  OdontogramData,
  OdontogramTemplate
} from './odontogram.service';

// Service hooks for React (optional - can be added later)
// These would use React Query or SWR for caching and state management