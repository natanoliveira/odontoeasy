import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { getClinicId } from '../../../middleware/auth';
import { parseForm, saveUploadedFile } from '../../../lib/upload';
import { File as FormidableFile } from 'formidable';

/**
 * API Route: /api/documents/upload
 *
 * POST - Upload a file and create document record
 *
 * This endpoint handles file upload AND document creation in one request
 */

// Disable Next.js body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const clinicId = await getClinicId(req);

    if (req.method === 'POST') {
      // ================================
      // POST /api/documents/upload
      // Upload file + create document
      // ================================

      const { fields, files } = await parseForm(req);

      // Get the uploaded file
      const fileArray = files.file;
      if (!fileArray || (Array.isArray(fileArray) && fileArray.length === 0)) {
        throw new ApiError(400, 'Arquivo não enviado');
      }

      const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

      // Extract fields
      const getField = (key: string): string | undefined => {
        const value = fields[key];
        if (!value) return undefined;
        return Array.isArray(value) ? value[0] : value;
      };

      const patientId = getField('patientId');
      const name = getField('name');
      const description = getField('description');
      const type = getField('type') || 'OTHER';
      const tagsField = getField('tags');

      // Validate required fields
      if (!name) {
        throw new ApiError(400, 'Descriçao do documento obrigatória');
      }

      // Validate document type
      const validTypes = ['XRAY', 'PHOTO', 'REPORT', 'CONSENT', 'INVOICE', 'OTHER'];
      if (!validTypes.includes(type)) {
        throw new ApiError(400, 'Tipo de documento inválido');
      }

      // Verify patient exists if patientId provided
      if (patientId) {
        const patient = await prisma.patient.findFirst({
          where: { id: patientId, clinicId },
        });

        if (!patient) {
          throw new ApiError(404, 'Paciente não encontrado');
        }
      }

      // Get user for document
      const clinicUser = await prisma.clinicUser.findFirst({
        where: { clinicId },
        include: { user: true },
      });

      if (!clinicUser) {
        throw new ApiError(500, 'Usuário não encontrado para clínica');
      }

      // Save uploaded file
      const uploadedFile = await saveUploadedFile(file as FormidableFile, type);

      // Parse tags
      let tags: string[] = [];
      if (tagsField) {
        try {
          tags = JSON.parse(tagsField);
        } catch {
          tags = tagsField.split(',').map((t) => t.trim());
        }
      }

      // Create document record in database
      const document = await prisma.document.create({
        data: {
          name,
          description: description || null,
          type: type as any,
          url: uploadedFile.url,
          size: uploadedFile.size,
          mimeType: uploadedFile.mimeType,
          tags,
          patientId: patientId || null,
          userId: clinicUser.user.id,
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
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      return res.status(201).json({
        success: true,
        document,
      });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
