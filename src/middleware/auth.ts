import { NextApiRequest, NextApiResponse } from 'next';
import { ApiError } from './errorHandler';

/**
 * Temporary mock auth middleware
 * TODO: Replace with NextAuth.js integration after setup
 *
 * For now, this returns a mock session with clinic context
 */
export async function requireAuth(
  req: NextApiRequest,
  res: NextApiResponse,
  allowedRoles?: string[]
) {
  // TODO: Implement real authentication with NextAuth
  // For now, return mock clinic ID for development

  // Mock session - replace this with real auth
  const mockSession = {
    user: {
      id: 'mock-user-id',
      email: 'admin@clinicasorriso.com.br',
      name: 'Dr. Carlos Roberto Silva',
      role: 'CLINIC_ADMIN',
    },
    clinicId: 'mock-clinic-id', // This will come from database lookup in real implementation
  };

  // In real implementation:
  // const session = await getServerSession(req, res, authOptions);
  // if (!session) {
  //   throw new ApiError(401, 'Unauthorized');
  // }
  // if (allowedRoles && !allowedRoles.includes(session.user.role)) {
  //   throw new ApiError(403, 'Forbidden');
  // }

  return mockSession;
}

/**
 * Get clinic ID for the current request
 * This will be properly implemented with auth
 */
export async function getClinicId(req: NextApiRequest): Promise<string> {
  // TODO: Get from authenticated user's clinic association
  // For development, get the first clinic from database
  const { prisma } = await import('../lib/prisma');

  const clinic = await prisma.clinic.findFirst({
    where: { status: 'ACTIVE' },
  });

  if (!clinic) {
    throw new ApiError(500, 'No active clinic found');
  }

  return clinic.id;
}
