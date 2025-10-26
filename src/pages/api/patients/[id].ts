import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { updatePatientSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/patients/[id]
 *
 * GET    - Get a specific patient with related data
 * PUT    - Update a patient
 * DELETE - Archive a patient (soft delete)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const clinicId = await getClinicId(req);

    // Validate ID parameter
    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid patient ID');
    }

    // Verify patient exists and belongs to clinic
    const existingPatient = await prisma.patient.findFirst({
      where: { id, clinicId },
    });

    if (!existingPatient) {
      throw new ApiError(404, 'Patient not found');
    }

    if (req.method === 'GET') {
      // ================================
      // GET /api/patients/[id]
      // Get patient with related data
      // ================================

      const patient = await prisma.patient.findUnique({
        where: { id },
        include: {
          appointments: {
            take: 10,
            orderBy: { date: 'desc' },
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
          },
          treatments: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
          documents: {
            take: 10,
            orderBy: { createdAt: 'desc' },
          },
          odontograms: {
            take: 1,
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      return res.status(200).json({ patient });
    }

    if (req.method === 'PUT') {
      // ================================
      // PUT /api/patients/[id]
      // Update patient information
      // ================================

      // Validate request body
      const validatedData = updatePatientSchema.parse(req.body);

      // Update patient
      const patient = await prisma.patient.update({
        where: { id },
        data: {
          ...validatedData,
          birthDate: validatedData.birthDate ? new Date(validatedData.birthDate) : undefined,
        },
      });

      return res.status(200).json({ patient });
    }

    if (req.method === 'DELETE') {
      // ================================
      // DELETE /api/patients/[id]
      // Soft delete - set status to ARCHIVED
      // ================================

      // Soft delete by changing status
      const patient = await prisma.patient.update({
        where: { id },
        data: { status: 'ARCHIVED' },
      });

      return res.status(200).json({
        success: true,
        message: 'Patient archived successfully',
        patient,
      });
    }

    // Method not allowed
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    handleError(error, res);
  }
}
