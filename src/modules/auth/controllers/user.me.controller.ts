import type { Response } from 'express';

import { userMe } from '@/modules/auth/services/user.me';
import type { AuthenticatedRequest } from '@/modules/auth/middleware/auth.middleware';

const userMeController = async (
  request: AuthenticatedRequest,
  response: Response,
): Promise<Response> => {
  try {
    const userId = request.user?.id;

    if (!userId) {
      return response.status(401).json({
        success: false,
        message: 'Invalid or expired access token',
        data: null,
      });
    }

    const user = await userMe(userId);

    return response.status(200).json({
      success: true,
      message: 'User profile fetched successfully',
      data: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        profile_photo: user.profile_photo,
        role: user.role?.name ?? null,
        is_active: user.is_active,
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error while fetching user profile';

    if (message === 'User not found') {
      return response.status(404).json({
        success: false,
        message,
        data: null,
      });
    }

    if (message === 'User account is inactive' || message === 'User account is deleted') {
      return response.status(403).json({
        success: false,
        message,
        data: null,
      });
    }

    return response.status(401).json({
      success: false,
      message,
      data: null,
    });
  }
};

export { userMeController };
