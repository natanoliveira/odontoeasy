import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';
import { handleError, ApiError } from '../../../middleware/errorHandler';
import { applyCors } from '../../../middleware/cors';
import jwt from 'jsonwebtoken';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().optional(), // Optional for now since seed has no passwords
});

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

/**
 * API Route: /api/auth/login
 *
 * POST - Authenticate user with email (password optional for now)
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Apply CORS
  const handled = await applyCors(req, res);
  if (handled) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  try {
    const { email } = loginSchema.parse(req.body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        clinics: {
          include: {
            clinic: true,
          },
        },
      },
    });

    if (!user) {
      throw new ApiError(401, 'Credenciais inválidas');
    }

    // Check if user has at least one clinic
    if (user.clinics.length === 0) {
      throw new ApiError(403, 'Usuário não possui clínicas associadas');
    }

    // Get the first clinic (you can add logic to select clinic later)
    const clinicUser = user.clinics[0];

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        clinicId: clinicUser.clinicId,
        role: clinicUser.role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Return user data and token
    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        // phone: user.phone,
        role: clinicUser.role,
        clinicId: clinicUser.clinicId,
        clinicName: clinicUser.clinic.name,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
}
