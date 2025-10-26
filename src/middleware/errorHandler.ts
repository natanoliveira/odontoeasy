import { NextApiResponse } from 'next';

/**
 * Custom API Error class for handling application-specific errors
 */
export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Global error handler for API routes
 * Handles both ApiError instances and generic errors
 *
 * @param error - The error to handle
 * @param res - Next.js API response object
 */
export function handleError(error: unknown, res: NextApiResponse) {
  console.error('API Error:', error);

  // Handle custom ApiError
  if (error instanceof ApiError) {
    return res.status(error.statusCode).json({
      error: error.message,
      statusCode: error.statusCode,
    });
  }

  // Handle Zod validation errors
  if (error && typeof error === 'object' && 'issues' in error) {
    return res.status(400).json({
      error: 'Validation failed',
      details: error,
    });
  }

  // Handle generic errors
  if (error instanceof Error) {
    return res.status(500).json({
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }

  // Handle unknown error types
  return res.status(500).json({
    error: 'Unknown error occurred',
  });
}
