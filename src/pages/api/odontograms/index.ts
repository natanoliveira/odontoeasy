import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { createOdontogramSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/odontograms
 *
 * GET  - List odontograms with filters
 * POST - Create a new odontogram
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const clinicId = await getClinicId(req);

    if (req.method === 'GET') {
      const {
        page = '1',
        limit = '20',
        patientId,
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      const where: any = { clinicId };

      if (patientId) {
        where.patientId = patientId as string;
      }

      const [odontograms, total] = await Promise.all([
        prisma.odontogram.findMany({
          where,
          skip,
          take,
          orderBy: { updatedAt: 'desc' },
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
        }),
        prisma.odontogram.count({ where }),
      ]);

      return res.status(200).json({
        odontograms,
        pagination: {
          total,
          page: parseInt(page as string),
          limit: parseInt(limit as string),
          pages: Math.ceil(total / take),
        },
      });
    }

    if (req.method === 'POST') {
      const validatedData = createOdontogramSchema.parse(req.body);

      // Verify patient exists
      const patient = await prisma.patient.findFirst({
        where: { id: validatedData.patientId, clinicId },
      });

      if (!patient) {
        throw new ApiError(404, 'Paciente não encontrado');
      }

      const odontogram = await prisma.odontogram.create({
        data: {
          ...validatedData,
          clinicId,
        },
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

      return res.status(201).json({ odontogram });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
