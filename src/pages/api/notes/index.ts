import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { createNoteSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/notes
 *
 * GET  - List notes with filters
 * POST - Create a new note
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const clinicId = await getClinicId(req);

    if (req.method === 'GET') {
      const {
        page = '1',
        limit = '50',
        type,
        entityId,
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = {};

      if (type) {
        where.type = type as any;
      }

      if (entityId) {
        where.entityId = entityId as string;
      }

      // Filter by clinic users
      const clinicUsers = await prisma.clinicUser.findMany({
        where: { clinicId },
        select: { userId: true },
      });

      where.userId = {
        in: clinicUsers.map(cu => cu.userId),
      };

      const [notes, total] = await Promise.all([
        prisma.note.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
        prisma.note.count({ where }),
      ]);

      return res.status(200).json({
        notes,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          pages: Math.ceil(total / take),
        },
      });
    }

    if (req.method === 'POST') {
      const validatedData = createNoteSchema.parse(req.body);

      // Get user for note
      const clinicUser = await prisma.clinicUser.findFirst({
        where: { clinicId },
        include: { user: true },
      });

      if (!clinicUser) {
        throw new ApiError(500, 'No user found for clinic');
      }

      const note = await prisma.note.create({
        data: {
          ...validatedData,
          userId: clinicUser.user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(201).json({ note });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
