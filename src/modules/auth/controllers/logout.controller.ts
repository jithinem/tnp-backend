import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { revokeRefreshToken } from '@/modules/auth/services/token';
// import { deleteUserCache } from '@/modules/user/services/user.cache';

const logoutController = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const refreshToken = request.cookies?.refresh_token;

  const auth = request.headers.authorization;

  const bearerToken = auth?.startsWith('Bearer ')
    ? auth.slice(7)
    : null;

  let userId: number | null = null;

  if (bearerToken) {
    try {
      const payload = jwt.verify(
        bearerToken,
        process.env.ACCESS_TOKEN_SECRET!,
      ) as jwt.JwtPayload;

      if (payload.sub) {
        userId = Number(payload.sub);
      }
    } catch {
      // Ignore invalid or expired access token
    }
  }

  if (!userId && refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as jwt.JwtPayload;

      if (payload.sub) {
        userId = Number(payload.sub);
      }
    } catch {
      // Ignore invalid or expired refresh token
    }
  }

  if (refreshToken) {
    try {
      await revokeRefreshToken(refreshToken);
    } catch {
      // Ignore revoke errors during logout
    }
  }

  // if (userId) {
  //   try {
  //     await deleteUserCache(userId);
  //   } catch {
  //     // Ignore cache deletion errors during logout
  //   }
  // }

  const isProd = (process.env.NODE_ENV ?? 'development') === 'production';

  response.clearCookie('refresh_token', {
    path: '/',
    httpOnly: true,
    sameSite: 'lax',
    secure: isProd,
  });

  return response.status(200).json({
    success: true,
    message: 'Logged out',
    data: {
      ok: true,
    },
  });
};

export { logoutController };