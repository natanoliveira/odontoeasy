import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { createAppointmentSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/appointments
 *
 * GET  - List appointments with multiple filters
 * POST - Create a new appointment (with conflict validation)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const clinicId = await getClinicId(req);

    if (req.method === 'GET') {
      // ================================
      // GET /api/appointments
      // List appointments with filters
      // ================================

      const {
        page = '1',
        limit = '20',
        date,
        professionalId,
        patientId,
        status,
        roomId,
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      // Build where clause
      const where: any = {
        clinicId,
      };

      // Add filters
      if (date) {
        const targetDate = new Date(date as string);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);

        where.date = {
          gte: targetDate,
          lt: nextDay,
        };
      }

      if (professionalId) {
        where.professionalId = professionalId as string;
      }

      if (patientId) {
        where.patientId = patientId as string;
      }

      if (status) {
        where.status = status as any;
      }

      if (roomId) {
        where.roomId = roomId as string;
      }

      // Execute queries in parallel
      const [appointments, total] = await Promise.all([
        prisma.appointment.findMany({
          where,
          skip,
          take,
          orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
              },
            },
            professional: {
              select: {
                id: true,
                name: true,
                specialty: true,
                color: true,
              },
            },
            room: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        }),
        prisma.appointment.count({ where }),
      ]);

      return res.status(200).json({
        appointments,
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
      // POST /api/appointments
      // Create appointment with conflict check
      // ================================

      const validatedData = createAppointmentSchema.parse(req.body);

      // Verify patient exists
      const patient = await prisma.patient.findFirst({
        where: { id: validatedData.patientId, clinicId },
      });

      if (!patient) {
        throw new ApiError(404, 'Paciente não encontrado');
      }

      // Verify professional exists
      const professional = await prisma.professional.findFirst({
        where: { id: validatedData.professionalId, clinicId },
      });

      if (!professional) {
        throw new ApiError(404, 'Professional não encontrado');
      }

      // Check for time conflicts
      const appointmentDate = new Date(validatedData.date);
      const nextDay = new Date(appointmentDate);
      nextDay.setDate(nextDay.getDate() + 1);

      const conflictingAppointments = await prisma.appointment.findMany({
        where: {
          professionalId: validatedData.professionalId,
          date: {
            gte: appointmentDate,
            lt: nextDay,
          },
          status: {
            notIn: ['CANCELED', 'NO_SHOW'],
          },
          OR: [
            {
              AND: [
                { startTime: { lte: validatedData.startTime } },
                { endTime: { gt: validatedData.startTime } },
              ],
            },
            {
              AND: [
                { startTime: { lt: validatedData.endTime } },
                { endTime: { gte: validatedData.endTime } },
              ],
            },
            {
              AND: [
                { startTime: { gte: validatedData.startTime } },
                { endTime: { lte: validatedData.endTime } },
              ],
            },
          ],
        },
      });

      if (conflictingAppointments.length > 0) {
        throw new ApiError(
          409,
          `Time conflict: Professional already has an appointment from ${conflictingAppointments[0].startTime} to ${conflictingAppointments[0].endTime}`
        );
      }

      // Create appointment
      const appointment = await prisma.appointment.create({
        data: {
          ...validatedData,
          clinicId,
          date: new Date(validatedData.date),
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
          professional: {
            select: {
              id: true,
              name: true,
              specialty: true,
              color: true,
            },
          },
        },
      });

      return res.status(201).json({ appointment });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
