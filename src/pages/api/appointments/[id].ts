import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { updateAppointmentSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/appointments/[id]
 *
 * GET    - Get a specific appointment
 * PUT    - Update appointment (including status changes)
 * DELETE - Cancel appointment (set status to CANCELED)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const clinicId = await getClinicId(req);

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid appointment ID');
    }

    // Verify appointment exists and belongs to clinic
    const existingAppointment = await prisma.appointment.findFirst({
      where: { id, clinicId },
    });

    if (!existingAppointment) {
      throw new ApiError(404, 'Appointment not found');
    }

    if (req.method === 'GET') {
      // ================================
      // GET /api/appointments/[id]
      // Get appointment with full details
      // ================================

      const appointment = await prisma.appointment.findUnique({
        where: { id },
        include: {
          patient: true,
          professional: true,
          room: true,
          treatments: true,
        },
      });

      return res.status(200).json({ appointment });
    }

    if (req.method === 'PUT') {
      // ================================
      // PUT /api/appointments/[id]
      // Update appointment
      // ================================

      const validatedData = updateAppointmentSchema.parse(req.body);

      // If updating time/date, check for conflicts
      if (validatedData.date || validatedData.startTime || validatedData.endTime) {
        const appointmentDate = validatedData.date
          ? new Date(validatedData.date)
          : existingAppointment.date;
        const nextDay = new Date(appointmentDate);
        nextDay.setDate(nextDay.getDate() + 1);

        const startTime = validatedData.startTime || existingAppointment.startTime;
        const endTime = validatedData.endTime || existingAppointment.endTime;
        const professionalId = validatedData.professionalId || existingAppointment.professionalId;

        const conflictingAppointments = await prisma.appointment.findMany({
          where: {
            id: { not: id }, // Exclude current appointment
            professionalId,
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
                  { startTime: { lte: startTime } },
                  { endTime: { gt: startTime } },
                ],
              },
              {
                AND: [
                  { startTime: { lt: endTime } },
                  { endTime: { gte: endTime } },
                ],
              },
              {
                AND: [
                  { startTime: { gte: startTime } },
                  { endTime: { lte: endTime } },
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
      }

      // Update appointment
      const appointment = await prisma.appointment.update({
        where: { id },
        data: {
          ...validatedData,
          date: validatedData.date ? new Date(validatedData.date) : undefined,
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

      return res.status(200).json({ appointment });
    }

    if (req.method === 'DELETE') {
      // ================================
      // DELETE /api/appointments/[id]
      // Cancel appointment
      // ================================

      const appointment = await prisma.appointment.update({
        where: { id },
        data: { status: 'CANCELED' },
      });

      return res.status(200).json({
        success: true,
        message: 'Appointment canceled successfully',
        appointment,
      });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
