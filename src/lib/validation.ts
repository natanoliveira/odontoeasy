import { z } from 'zod';

// ================================
// PATIENT SCHEMAS
// ================================

export const createPatientSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().nullable(),
  phone: z.string().optional().nullable(),
  cpf: z.string().optional().nullable(),
  birthDate: z.string().optional().nullable(),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional().nullable(),
  address: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  zipCode: z.string().optional().nullable(),
  emergencyContact: z.string().optional().nullable(),
  medicalHistory: z.any().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updatePatientSchema = createPatientSchema.partial();

// ================================
// APPOINTMENT SCHEMAS
// ================================

export const createAppointmentSchema = z.object({
  patientId: z.string().cuid('Patient ID inválido'),
  professionalId: z.string().cuid('Professional ID inválido'),
  roomId: z.string().cuid().optional().nullable(),
  title: z.string().min(3, 'Título muito curto').optional().nullable(),
  description: z.string().optional().nullable(),
  date: z.string().datetime('Data inválida'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  duration: z.number().min(15, 'Duração mínima 15 minutos').max(480, 'Duração máxima 8 horas'),
  type: z.string().min(3, 'Tipo deve ter no mínimo 3 caracteres'),
  value: z.number().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial().extend({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED', 'NO_SHOW', 'URGENT']).optional(),
});

// ================================
// PROFESSIONAL SCHEMAS
// ================================

export const createProfessionalSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().email('Email inválido').optional().nullable(),
  phone: z.string().optional().nullable(),
  cro: z.string().min(3, 'CRO é obrigatório'),
  specialty: z.string().min(3, 'Especialidade obrigatória'),
  color: z.string().optional().default('#3b82f6'),
  workDays: z.array(z.string()),
  workStart: z.string().optional().default('08:00'),
  workEnd: z.string().optional().default('18:00'),
  notes: z.string().optional().nullable(),
  avatar: z.string().optional().nullable(),
});

export const updateProfessionalSchema = createProfessionalSchema.partial();

// ================================
// TREATMENT SCHEMAS
// ================================

export const createTreatmentSchema = z.object({
  patientId: z.string().cuid(),
  appointmentId: z.string().cuid().optional().nullable(),
  name: z.string().min(3, 'Nome do tratamento obrigatório'),
  description: z.string().optional().nullable(),
  tooth: z.string().optional().nullable(),
  value: z.number().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateTreatmentSchema = createTreatmentSchema.partial().extend({
  status: z.enum(['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED']).optional(),
});

// ================================
// ROOM SCHEMAS
// ================================

export const createRoomSchema = z.object({
  name: z.string().min(3, 'Nome da sala obrigatório'),
  description: z.string().optional().nullable(),
  color: z.string().optional().default('#3b82f6'),
  equipment: z.array(z.string()).optional().default([]),
  status: z.enum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'UNAVAILABLE']).optional().default('AVAILABLE'),
});

export const updateRoomSchema = createRoomSchema.partial();

// ================================
// SCHEDULE SCHEMAS
// ================================

export const createScheduleSchema = z.object({
  professionalId: z.string().cuid().optional().nullable(),
  date: z.string().datetime('Data inválida'),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, 'Formato de hora inválido (HH:MM)'),
  available: z.boolean().optional().default(true),
  type: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
});

export const updateScheduleSchema = createScheduleSchema.partial();

// ================================
// DOCUMENT SCHEMAS
// ================================

export const createDocumentSchema = z.object({
  patientId: z.string().cuid().optional().nullable(),
  name: z.string().min(3, 'Nome do documento obrigatório'),
  description: z.string().optional().nullable(),
  url: z.string().min(1, 'URL do arquivo obrigatória'),
  size: z.number().positive().optional().nullable(),
  mimeType: z.string().optional().nullable(),
  type: z.enum(['XRAY', 'PHOTO', 'REPORT', 'CONSENT', 'INVOICE', 'OTHER']),
  tags: z.array(z.string()).optional().default([]),
});

export const updateDocumentSchema = createDocumentSchema.partial();

// ================================
// NOTE SCHEMAS
// ================================

export const createNoteSchema = z.object({
  content: z.string().min(1, 'Conteúdo da nota obrigatório'),
  type: z.enum(['GENERAL', 'PATIENT', 'APPOINTMENT', 'TREATMENT', 'REMINDER']).optional().default('GENERAL'),
  entityId: z.string().optional().nullable(),
  entityType: z.string().optional().nullable(),
});

export const updateNoteSchema = createNoteSchema.partial();

// ================================
// ODONTOGRAM SCHEMAS
// ================================

export const createOdontogramSchema = z.object({
  patientId: z.string().cuid('Patient ID inválido'),
  data: z.record(z.object({
    number: z.number(),
    condition: z.string(),
    notes: z.string().optional(),
  })),
  notes: z.string().optional().nullable(),
});

export const updateOdontogramSchema = createOdontogramSchema.partial().extend({
  patientId: z.string().cuid().optional(),
});

// ================================
// UTILITY TYPES
// ================================

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type CreateAppointmentInput = z.infer<typeof createAppointmentSchema>;
export type UpdateAppointmentInput = z.infer<typeof updateAppointmentSchema>;
export type CreateProfessionalInput = z.infer<typeof createProfessionalSchema>;
export type UpdateProfessionalInput = z.infer<typeof updateProfessionalSchema>;
export type CreateTreatmentInput = z.infer<typeof createTreatmentSchema>;
export type UpdateTreatmentInput = z.infer<typeof updateTreatmentSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;
export type CreateScheduleInput = z.infer<typeof createScheduleSchema>;
export type UpdateScheduleInput = z.infer<typeof updateScheduleSchema>;
export type CreateNoteInput = z.infer<typeof createNoteSchema>;
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>;
export type CreateOdontogramInput = z.infer<typeof createOdontogramSchema>;
export type UpdateOdontogramInput = z.infer<typeof updateOdontogramSchema>;
