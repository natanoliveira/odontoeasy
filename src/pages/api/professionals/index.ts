import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError } from '../../../middleware/errorHandler';
import { createProfessionalSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/professionals
 *
 * GET  - List all professionals with filters
 * POST - Create a new professional
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const clinicId = await getClinicId(req);

    if (req.method === 'GET') {
      // ================================
      // GET /api/professionals
      // List professionals with filters
      // ================================

      const {
        page = '1',
        limit = '10',
        status = 'ACTIVE',
        specialty,
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      // Build where clause
      const where: any = {
        clinicId,
        status: status as any,
      };

      // Add specialty filter if provided
      if (specialty) {
        where.specialty = { contains: specialty as string, mode: 'insensitive' };
      }

      // Execute queries in parallel
      const [professionals, total] = await Promise.all([
        prisma.professional.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.professional.count({ where }),
      ]);

      return res.status(200).json({
        professionals,
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
      // POST /api/professionals
      // Create a new professional
      // ================================

      const validatedData = createProfessionalSchema.parse(req.body);

      const professional = await prisma.professional.create({
        data: {
          ...validatedData,
          clinicId,
        },
      });

      return res.status(201).json({ professional });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    handleError(error, res);
  }
}
