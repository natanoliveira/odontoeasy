import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { createDocumentSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';

/**
 * API Route: /api/documents
 *
 * GET  - List documents with filters
 * POST - Create a new document
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const clinicId = await getClinicId(req);

    if (req.method === 'GET') {
      // ================================
      // GET /api/documents
      // List documents with filters
      // ================================

      const {
        page = '1',
        limit = '20',
        patientId,
        type,
        search,
      } = req.query;

      const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
      const take = parseInt(limit as string);

      // Build where clause
      const where: any = {
        clinicId,
      };

      if (patientId) {
        where.patientId = patientId as string;
      }

      if (type) {
        where.type = type as any;
      }

      if (search) {
        where.OR = [
          { name: { contains: search as string, mode: 'insensitive' } },
          { description: { contains: search as string, mode: 'insensitive' } },
        ];
      }

      // Execute queries in parallel
      const [documents, total] = await Promise.all([
        prisma.document.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            patient: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
        prisma.document.count({ where }),
      ]);

      return res.status(200).json({
        documents,
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
      // POST /api/documents
      // Create a new document
      // ================================

      const validatedData = createDocumentSchema.parse(req.body);

      // Verify patient exists if patientId provided
      if (validatedData.patientId) {
        const patient = await prisma.patient.findFirst({
          where: { id: validatedData.patientId, clinicId },
        });

        if (!patient) {
          throw new ApiError(404, 'Paciente não encontrado');
        }
      }

      // Get first user from clinic for now (temporary until real auth)
      const clinicUser = await prisma.clinicUser.findFirst({
        where: { clinicId },
        include: { user: true },
      });

      if (!clinicUser) {
        throw new ApiError(500, 'No user found for clinic');
      }

      // Create document
      const document = await prisma.document.create({
        data: {
          ...validatedData,
          clinicId,
          userId: clinicUser.user.id,
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
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(201).json({ document });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
