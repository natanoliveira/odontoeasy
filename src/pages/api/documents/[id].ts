import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { updateDocumentSchema } from '../../../lib/validation';
import { getClinicId } from '../../../middleware/auth';
import { deleteUploadedFile } from '../../../lib/upload';

/**
 * API Route: /api/documents/[id]
 *
 * GET    - Get a specific document
 * PUT    - Update document metadata
 * DELETE - Delete document
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const clinicId = await getClinicId(req);

    if (!id || typeof id !== 'string') {
      throw new ApiError(400, 'Invalid document ID');
    }

    // Verify document exists and belongs to clinic
    const existingDocument = await prisma.document.findFirst({
      where: { id, clinicId },
    });

    if (!existingDocument) {
      throw new ApiError(404, 'Document not found');
    }

    if (req.method === 'GET') {
      // ================================
      // GET /api/documents/[id]
      // Get document with full details
      // ================================

      const document = await prisma.document.findUnique({
        where: { id },
        include: {
          patient: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              cpf: true,
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

      return res.status(200).json({ document });
    }

    if (req.method === 'PUT') {
      // ================================
      // PUT /api/documents/[id]
      // Update document metadata
      // ================================

      const validatedData = updateDocumentSchema.parse(req.body);

      // If updating patientId, verify patient exists
      if (validatedData.patientId) {
        const patient = await prisma.patient.findFirst({
          where: { id: validatedData.patientId, clinicId },
        });

        if (!patient) {
          throw new ApiError(404, 'Paciente não encontrado');
        }
      }

      const document = await prisma.document.update({
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
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(200).json({ document });
    }

    if (req.method === 'DELETE') {
      // ================================
      // DELETE /api/documents/[id]
      // Delete document and file
      // ================================

      // Delete physical file if it's a local upload
      if (existingDocument.url.startsWith('/uploads/')) {
        await deleteUploadedFile(existingDocument.url);
      }

      // Delete database record
      await prisma.document.delete({
        where: { id },
      });

      return res.status(200).json({
        success: true,
        message: 'Document deleted successfully',
      });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
