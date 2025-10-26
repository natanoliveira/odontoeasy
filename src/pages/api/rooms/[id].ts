import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { updateRoomSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/rooms/[id]
 *
 * GET    - Get a specific room with appointments
 * PUT    - Update room
 * DELETE - Delete room (if no appointments)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const clinicId = await getClinicId(req);

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid room ID');
    }

    // Verify room exists and belongs to clinic
    const existingRoom = await prisma.room.findFirst({
      where: { id, clinicId },
    });

    if (!existingRoom) {
      throw new ApiError(404, 'Room not found');
    }

    if (req.method === 'GET') {
      // ================================
      // GET /api/rooms/[id]
      // Get room with appointments
      // ================================

      const room = await prisma.room.findUnique({
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
              professional: {
                select: {
                  id: true,
                  name: true,
                  specialty: true,
                },
              },
            },
          },
          _count: {
            select: { appointments: true },
          },
        },
      });

      return res.status(200).json({ room });
    }

    if (req.method === 'PUT') {
      // ================================
      // PUT /api/rooms/[id]
      // Update room
      // ================================

      const validatedData = updateRoomSchema.parse(req.body);

      const room = await prisma.room.update({
        where: { id },
        data: validatedData,
      });

      return res.status(200).json({ room });
    }

    if (req.method === 'DELETE') {
      // ================================
      // DELETE /api/rooms/[id]
      // Delete if no appointments
      // ================================

      // Check if room has appointments
      const appointmentCount = await prisma.appointment.count({
        where: { roomId: id },
      });

      if (appointmentCount > 0) {
        throw new ApiError(
          400,
          `Cannot delete room with ${appointmentCount} appointments. Set status to UNAVAILABLE instead.`
        );
      }

      // Delete room
      await prisma.room.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Room deleted successfully',
      });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
