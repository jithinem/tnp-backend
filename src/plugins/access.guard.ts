import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import prisma from '@/shared/prisma';

type JwtPayload = {
  sub?: number;
  email?: string;
  role?: string | null;
};

const getBearerToken = (request: Request): string | null => {
  const auth = request.headers.authorization;

  if (!auth) {
    return null;
  }

  const [scheme, token] = auth.split(' ');

  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }

  return token;
};

const accessGuard = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  const token = getBearerToken(request);

  if (!token) {
    return response.status(401).json({
      success: false,
      message: 'Missing access token',
      data: null,
    });
  }

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
      throw new Error('ACCESS_TOKEN_SECRET is not configured');
    }

    const payload = jwt.verify(token, secret) as JwtPayload;

    if (
      payload.sub == null ||
      Number.isNaN(Number(payload.sub)) ||
      Number(payload.sub) <= 0
    ) {
      return response.status(401).json({
        success: false,
        message: 'Invalid access token',
        data: null,
      });
    }

    const userId = Number(payload.sub);

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        role: true,
      },
    });


    if (!user) {
      return response.status(401).json({
        success: false,
        message: 'Unauthorized',
        data: null,
      });
    }

    if (user.is_deleted || !user.is_active) {
      return response.status(403).json({
        success: false,
        message: 'User is inactive or deleted',
        data: null,
      });
    }

    request.authUser = payload;
    request.authUserDetails = user;

    return next();
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: 'Invalid or expired access token',
      data: null,
    });
  }
};

export { accessGuard };