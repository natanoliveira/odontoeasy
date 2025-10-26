import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { createTreatmentSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/treatments
 *
 * GET  - List treatments with filters
 * POST - Create a new treatment
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const clinicId = await getClinicId(req);

    if (req.method === 'GET') {
      // ================================
      // GET /api/treatments
      // List treatments with filters
      // ================================

      const {
        page = '1',
        limit = '20',
        patientId,
        status,
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      // Build where clause
      const where: any = {
        clinicId,
      };

      if (patientId) {
        where.patientId = patientId as string;
      }

      if (status) {
        where.status = status as any;
      }

      // Execute queries in parallel
      const [treatments, total] = await Promise.all([
        prisma.treatment.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
            appointment: {
              select: {
                id: true,
                date: true,
                startTime: true,
                endTime: true,
                professional: {
                  select: {
                    id: true,
                    name: true,
                    specialty: true,
                  },
                },
              },
            },
          },
        }),
        prisma.treatment.count({ where }),
      ]);

      return res.status(200).json({
        treatments,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          pages: Math.ceil(total / take),
        },
      });
    }

    if (req.method === 'POST') {
      // ================================
      // POST /api/treatments
      // Create a new treatment
      // ================================

      const validatedData = createTreatmentSchema.parse(req.body);

      // Verify patient exists and belongs to clinic
      const patient = await prisma.patient.findFirst({
        where: { id: validatedData.patientId, clinicId },
      });

      if (!patient) {
        throw new ApiError(404, 'Patient not found');
      }

      // If appointmentId provided, verify it exists
      if (validatedData.appointmentId) {
        const appointment = await prisma.appointment.findFirst({
          where: { id: validatedData.appointmentId, clinicId },
        });

        if (!appointment) {
          throw new ApiError(404, 'Appointment not found');
        }
      }

      // Create treatment
      const treatment = await prisma.treatment.create({
        data: {
          ...validatedData,
          clinicId,
        },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
            },
          },
        },
      });

      return res.status(201).json({ treatment });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    handleError(error, res);
  }
}
