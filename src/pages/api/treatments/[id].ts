import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { updateTreatmentSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/treatments/[id]
 *
 * GET    - Get a specific treatment
 * PUT    - Update treatment (including status changes)
 * DELETE - Delete treatment
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const clinicId = await getClinicId(req);

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid treatment ID');
    }

    // Verify treatment exists and belongs to clinic
    const existingTreatment = await prisma.treatment.findFirst({
      where: { id, clinicId },
    });

    if (!existingTreatment) {
      throw new ApiError(404, 'Treatment not found');
    }

    if (req.method === 'GET') {
      // ================================
      // GET /api/treatments/[id]
      // Get treatment with full details
      // ================================

      const treatment = await prisma.treatment.findUnique({
        where: { id },
        include: {
          patient: true,
          appointment: {
            include: {
              professional: true,
            },
          },
        },
      });

      return res.status(200).json({ treatment });
    }

    if (req.method === 'PUT') {
      // ================================
      // PUT /api/treatments/[id]
      // Update treatment
      // ================================

      const validatedData = updateTreatmentSchema.parse(req.body);

      const treatment = await prisma.treatment.update({
        where: { id },
        data: validatedData,
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

      return res.status(200).json({ treatment });
    }

    if (req.method === 'DELETE') {
      // ================================
      // DELETE /api/treatments/[id]
      // Delete treatment
      // ================================

      await prisma.treatment.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Treatment deleted successfully',
      });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
