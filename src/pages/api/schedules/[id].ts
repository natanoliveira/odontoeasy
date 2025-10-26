import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { updateScheduleSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/schedules/[id]
 *
 * GET    - Get a specific schedule
 * PUT    - Update schedule
 * DELETE - Delete schedule
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const clinicId = await getClinicId(req);

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid schedule ID');
    }

    const existingSchedule = await prisma.schedule.findFirst({
      where: { id, clinicId },
    });

    if (!existingSchedule) {
      throw new ApiError(404, 'Schedule not found');
    }

    if (req.method === 'GET') {
      const schedule = await prisma.schedule.findUnique({
        where: { id },
        include: {
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

      return res.status(200).json({ schedule });
    }

    if (req.method === 'PUT') {
      const validatedData = updateScheduleSchema.parse(req.body);

      // Verify professional if updating
      if (validatedData.professionalId) {
        const professional = await prisma.professional.findFirst({
          where: { id: validatedData.professionalId, clinicId },
        });

        if (!professional) {
          throw new ApiError(404, 'Professional não encontrado');
        }
      }

      const schedule = await prisma.schedule.update({
        where: { id },
        data: {
          ...validatedData,
          date: validatedData.date ? new Date(validatedData.date) : undefined,
        },
        include: {
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

      return res.status(200).json({ schedule });
    }

    if (req.method === 'DELETE') {
      await prisma.schedule.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Schedule deleted successfully',
      });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
