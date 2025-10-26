import formidable, { File as FormidableFile } from 'formidable';
import { NextApiRequest } from 'next';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Document type to folder mapping
const DOCUMENT_TYPE_FOLDERS: Record<string, string> = {
  XRAY: 'xrays',
  PHOTO: 'photos',
  REPORT: 'reports',
  CONSENT: 'consents',
  INVOICE: 'invoices',
  OTHER: 'others',
};

// Allowed MIME types
const ALLOWED_MIME_TYPES = [
  // Images
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  // Documents
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  // Medical images
  'application/dicom',
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export interface UploadedFile {
  filename: string;
  originalFilename: string;
  filepath: string;
  url: string;
  size: number;
  mimeType: string;
}

/**
 * Parse multipart form data with file upload
 */
export async function parseForm(req: NextApiRequest): Promise<{
  fields: formidable.Fields;
  files: formidable.Files;
}> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'temp');

  // Ensure temp directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: MAX_FILE_SIZE,
    filter: (part) => {
      return part.mimetype ? ALLOWED_MIME_TYPES.includes(part.mimetype) : false;
    },
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

/**
 * Save uploaded file to appropriate folder
 */
export async function saveUploadedFile(
  file: FormidableFile,
  documentType: string = 'OTHER'
): Promise<UploadedFile> {
  const folder = DOCUMENT_TYPE_FOLDERS[documentType] || 'others';
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'documents', folder);

  // Ensure directory exists
  await fs.mkdir(uploadDir, { recursive: true });

  // Generate unique filename
  const ext = path.extname(file.originalFilename || '');
  const hash = crypto.randomBytes(16).toString('hex');
  const filename = `${Date.now()}-${hash}${ext}`;
  const filepath = path.join(uploadDir, filename);

  // Move file from temp to final location
  await fs.copyFile(file.filepath, filepath);
  await fs.unlink(file.filepath); // Delete temp file

  // Return file info
  return {
    filename,
    originalFilename: file.originalFilename || filename,
    filepath,
    url: `/uploads/documents/${folder}/${filename}`,
    size: file.size,
    mimeType: file.mimetype || 'application/octet-stream',
  };
}

/**
 * Delete uploaded file
 */
export async function deleteUploadedFile(url: string): Promise<void> {
  try {
    const filepath = path.join(process.cwd(), 'public', url);
    await fs.unlink(filepath);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

/**
 * Validate file type
 */
export function isValidFileType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.includes(mimeType);
}

/**
 * Get file extension from MIME type
 */
export function getExtensionFromMimeType(mimeType: string): string {
  const mimeMap: Record<string, string> = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'image/webp': '.webp',
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'application/dicom': '.dcm',
  };
  return mimeMap[mimeType] || '';
}
