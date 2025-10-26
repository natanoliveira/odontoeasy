import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { updateNoteSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/notes/[id]
 *
 * GET    - Get a specific note
 * PUT    - Update note
 * DELETE - Delete note
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const clinicId = await getClinicId(req);

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid note ID');
    }

    // Verify note exists and belongs to clinic user
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        user: {
          clinics: {
            some: { clinicId },
          },
        },
      },
    });

    if (!existingNote) {
      throw new ApiError(404, 'Note not found');
    }

    if (req.method === 'GET') {
      const note = await prisma.note.findUnique({
        where: { id },
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

      return res.status(200).json({ note });
    }

    if (req.method === 'PUT') {
      const validatedData = updateNoteSchema.parse(req.body);

      const note = await prisma.note.update({
        where: { id },
        data: validatedData,
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

      return res.status(200).json({ note });
    }

    if (req.method === 'DELETE') {
      await prisma.note.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Note deleted successfully',
      });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
