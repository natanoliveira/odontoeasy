import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { createPatientSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';
import { AppointmentStatus } from '@prisma/client';

/**
 * API Route: /api/patients
 *
 * GET  - List all patients with pagination and filters
 * POST - Create a new patient
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get clinic ID from auth (currently mock)
    const clinicId = await getClinicId(req);

    if (req.method === 'GET') {
      // ================================
      // GET /api/patients
      // List patients with pagination
      // ================================

      const {
        page = '1',
        limit = '10',
        search = '',
        status = 'ACTIVE',
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      // Build where clause with filters
      const where: any = {
        clinicId,
        status: status as any,
      };

      // Add search functionality
      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
          { phone: { contains: search as string, mode: 'insensitive' } },
          { cpf: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      // Execute queries in parallel for performance
      const [patients, total] = await Promise.all([
        prisma.patient.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.patient.count({ where }),
      ]);

      // Pega a última visita do paciente na clinica
      const patientsWithLastVisit = await Promise.all(
        patients.map(async (patient) => {
          const visit = await prisma.appointment.findFirst({
            where: {
              patientId: patient.id,
              status: {
                in: [AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED],
              },
            },
            orderBy: { date: 'desc' },
          });

          return {
            ...patient,
            lastAppointment: visit || null,
          };
        })
      );

      const objResponse = {
        patients: patientsWithLastVisit,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          pages: Math.ceil(total / take),
        },
      }

      return res.status(200).json(objResponse);
    }

    if (req.method === 'POST') {
      // ================================
      // POST /api/patients
      // Create a new patient
      // ================================

      // Validate request body
      const validatedData = createPatientSchema.parse(req.body);

      // console.log(validatedData);
      // return;
      // Create patient
      const patient = await prisma.patient.create({
        data: {
          ...validatedData,
          clinicId,
          name: validatedData.name.toUpperCase(),
          address: validatedData.address?.toUpperCase(),
          birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : null,
        },
      });

      return res.status(201).json({ patient });
    }

    // Método não permitido
    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
