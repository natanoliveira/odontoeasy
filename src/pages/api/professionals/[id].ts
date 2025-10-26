import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { updateProfessionalSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/professionals/[id]
 *
 * GET    - Get a specific professional with appointments
 * PUT    - Update a professional
 * DELETE - Delete a professional (if no appointments)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const clinicId = await getClinicId(req);

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid professional ID');
    }

    // Verify professional exists and belongs to clinic
    const existingProfessional = await prisma.professional.findFirst({
      where: { id, clinicId },
    });

    if (!existingProfessional) {
      throw new ApiError(404, 'Professional not found');
    }

    if (req.method === 'GET') {
      // ================================
      // GET /api/professionals/[id]
      // Get professional with appointments
      // ================================

      const professional = await prisma.professional.findUnique({
        where: { id },
        include: {
          appointments: {
            take: 10,
            orderBy: { date: 'desc' },
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
          },
          schedules: {
            take: 10,
            orderBy: { date: 'desc' },
          },
        },
      });

      return res.status(200).json({ professional });
    }

    if (req.method === 'PUT') {
      // ================================
      // PUT /api/professionals/[id]
      // Update professional
      // ================================

      const validatedData = updateProfessionalSchema.parse(req.body);

      const professional = await prisma.professional.update({
        where: { id },
        data: validatedData,
      });

      return res.status(200).json({ professional });
    }

    if (req.method === 'DELETE') {
      // ================================
      // DELETE /api/professionals/[id]
      // Delete if no appointments
      // ================================

      // Check if professional has appointments
      const appointmentCount = await prisma.appointment.count({
        where: { professionalId: id },
      });

      if (appointmentCount > 0) {
        throw new ApiError(
          400,
          `Cannot delete professional with ${appointmentCount} appointments. Set status to INACTIVE instead.`
        );
      }

      // Delete professional
      await prisma.professional.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Professional deleted successfully',
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    handleError(error, res);
  }
}
