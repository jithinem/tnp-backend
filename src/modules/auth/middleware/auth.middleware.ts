import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '@/shared/prisma';

interface AuthenticatedUser {
  id: number;
  email?: string;
  role?: string | null;
}

interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

const authMiddleware = async (
  request: AuthenticatedRequest,
  response: Response,
  next: NextFunction,
): Promise<void> => {
  const auth = request.headers.authorization;
  const bearerToken = auth?.startsWith('Bearer ')
    ? auth.slice(7)
    : null;

  if (!bearerToken) {
    response.status(401).json({
      success: false,
      message: 'Missing access token',
      data: null,
    });

    return;
  }

  try {
    const payload = jwt.verify(
      bearerToken,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as jwt.JwtPayload;

    if (!payload.sub) {
      response.status(401).json({
        success: false,
        message: 'Invalid access token',
        data: null,
      });

      return;
    }

    const userId = Number(payload.sub);

    if (Number.isNaN(userId)) {
      response.status(401).json({
        success: false,
        message: 'Invalid access token',
        data: null,
      });

      return;
    }

    // Check if user is still active
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { is_active: true, is_deleted: true },
    });

    if (!user || !user.is_active || user.is_deleted) {
      response.status(401).json({
        success: false,
        message: 'User account is inactive or deleted',
        data: null,
      });

      return;
    }

    request.user = {
      id: userId,
      email: typeof payload.email === 'string' ? payload.email : undefined,
      role: typeof payload.role === 'string' ? payload.role : null,
    };

    next();
  } catch {
    response.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
      data: null,
    });
  }
};

export { authMiddleware };
export type { AuthenticatedRequest, AuthenticatedUser };
