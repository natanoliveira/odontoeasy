import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { createScheduleSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/schedules
 *
 * GET  - List schedules with filters (professionalId, date, available)
 * POST - Create a new schedule
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const clinicId = await getClinicId(req);

    if (req.method === 'GET') {
      const {
        page = '1',
        limit = '50',
        professionalId,
        date,
        available,
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = { clinicId };

      if (professionalId) {
        where.professionalId = professionalId as string;
      }

      if (date) {
        const targetDate = new Date(date as string);
        const nextDay = new Date(targetDate);
        nextDay.setDate(nextDay.getDate() + 1);
        where.date = { gte: targetDate, lt: nextDay };
      }

      if (available !== undefined) {
        where.available = available === 'true';
      }

      const [schedules, total] = await Promise.all([
        prisma.schedule.findMany({
          where,
          skip,
          take,
          orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
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
        }),
        prisma.schedule.count({ where }),
      ]);

      return res.status(200).json({
        schedules,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          pages: Math.ceil(total / take),
        },
      });
    }

    if (req.method === 'POST') {
      const validatedData = createScheduleSchema.parse(req.body);

      // Verify professional exists if provided
      if (validatedData.professionalId) {
        const professional = await prisma.professional.findFirst({
          where: { id: validatedData.professionalId, clinicId },
        });

        if (!professional) {
          throw new ApiError(404, 'Professional não encontrado');
        }
      }

      const schedule = await prisma.schedule.create({
        data: {
          ...validatedData,
          clinicId,
          date: new Date(validatedData.date),
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

      return res.status(201).json({ schedule });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
