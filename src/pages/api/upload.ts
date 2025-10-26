import { NextApiRequest, NextApiResponse } from 'next';
import { handleError, ApiError } from '../../middleware/errorHandler';
import { getClinicId } from '../../middleware/auth';
import { parseForm, saveUploadedFile } from '../../lib/upload';
import { File as FormidableFile } from 'formidable';

/**
 * API Route: /api/upload
 *
 * POST - Upload a file
 *
 * This endpoint handles file uploads and returns the file URL
 * Files are stored in /public/uploads/documents/{type}/
 */

// Disable Next.js body parser for this route
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Verify clinic access
    await getClinicId(req);

    if (req.method === 'POST') {
      // ================================
      // POST /api/upload
      // Upload a file
      // ================================

      const { fields, files } = await parseForm(req);

      // Get the uploaded file
      const fileArray = files.file;
      if (!fileArray || (Array.isArray(fileArray) && fileArray.length === 0)) {
        throw new ApiError(400, 'No file uploaded');
      }

      const file = Array.isArray(fileArray) ? fileArray[0] : fileArray;

      // Get document type from fields
      const documentTypeArray = fields.type;
      const documentType = Array.isArray(documentTypeArray)
        ? documentTypeArray[0]
        : documentTypeArray || 'OTHER';

      // Validate document type
      const validTypes = ['XRAY', 'PHOTO', 'REPORT', 'CONSENT', 'INVOICE', 'OTHER'];
      if (!validTypes.includes(documentType)) {
        throw new ApiError(400, 'Invalid document type');
      }

      // Save file
      const uploadedFile = await saveUploadedFile(file as FormidableFile, documentType);

      return res.status(200).json({
        success: true,
        file: {
          url: uploadedFile.url,
          filename: uploadedFile.filename,
          originalFilename: uploadedFile.originalFilename,
          size: uploadedFile.size,
          mimeType: uploadedFile.mimeType,
        },
      });
    }

    return res.status(405).json({ error: 'Método não permitido' });
  } catch (error) {
    handleError(error, res);
  }
}
