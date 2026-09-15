
import type { Request, Response } from 'express';

import { rotateAccessTokenFromRefresh } from '@/modules/auth/services/token';

const refreshTokenController = async (
  request: Request,
  response: Response,
): Promise<Response> => {
  const refreshToken = request.cookies?.refresh_token;

  if (!refreshToken) {
    return response.status(401).json({
      success: false,
      message: 'Missing refresh token',
      data: null,
    });
  }

  try {
    const rotated = await rotateAccessTokenFromRefresh(refreshToken);

    if (!rotated) {
      return response.status(401).json({
        success: false,
        message: 'Invalid refresh token or user account is inactive',
        data: null,
      });
    }

    return response.status(200).json({
      success: true,
      message: 'Token refreshed',
      data: rotated,
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    return response.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token',
      data: null,
    });
  }
};

export { refreshTokenController };

