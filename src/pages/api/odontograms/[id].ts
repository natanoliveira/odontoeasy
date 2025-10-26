import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { updateOdontogramSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/odontograms/[id]
 *
 * GET    - Get a specific odontogram
 * PUT    - Update odontogram
 * DELETE - Delete odontogram
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const clinicId = await getClinicId(req);

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid odontogram ID');
    }

    const existingOdontogram = await prisma.odontogram.findFirst({
      where: { id, clinicId },
    });

    if (!existingOdontogram) {
      throw new ApiError(404, 'Odontogram not found');
    }

    if (req.method === 'GET') {
      const odontogram = await prisma.odontogram.findUnique({
        where: { id },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              cpf: true,
              birthDate: true,
            },
          },
        },
      });

      return res.status(200).json({ odontogram });
    }

    if (req.method === 'PUT') {
      const validatedData = updateOdontogramSchema.parse(req.body);

      const odontogram = await prisma.odontogram.update({
        where: { id },
        data: validatedData,
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      });

      return res.status(200).json({ odontogram });
    }

    if (req.method === 'DELETE') {
      await prisma.odontogram.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Odontogram deleted successfully',
      });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
