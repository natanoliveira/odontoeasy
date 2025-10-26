import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { createRoomSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/rooms
 *
 * GET  - List rooms with filters
 * POST - Create a new room
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const clinicId = await getClinicId(req);

    if (req.method === 'GET') {
      // ================================
      // GET /api/rooms
      // List rooms with filters
      // ================================

      const {
        page = '1',
        limit = '20',
        status,
        search,
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      // Build where clause
      const where: any = {
        clinicId,
      };

      if (status) {
        where.status = status as any;
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      // Execute queries in parallel
      const [rooms, total] = await Promise.all([
        prisma.room.findMany({
          where,
          skip,
          take,
          orderBy: { name: 'asc' },
          include: {
            _count: {
              select: { appointments: true },
            },
          },
        }),
        prisma.room.count({ where }),
      ]);

      return res.status(200).json({
        rooms,
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
      // POST /api/rooms
      // Create a new room
      // ================================

      const validatedData = createRoomSchema.parse(req.body);

      // Create room
      const room = await prisma.room.create({
        data: {
          ...validatedData,
          clinicId,
        },
      });

      return res.status(201).json({ room });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
