import type { Request, Response } from 'express';

import { resetPassword } from '@/modules/auth/services/reset.password';

interface ResetPasswordBody {
  email: string;
  otp: string;
  password: string;
}

const resetPasswordController = async (
  request: Request<{}, {}, ResetPasswordBody>,
  response: Response,
): Promise<Response> => {
  try {
    await resetPassword(request.body);

    return response.status(200).json({
      success: true,
      message: 'Password reset successfully',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error during password reset';

    if (message === 'OTP not found' || message === 'Invalid OTP') {
      return response.status(400).json({
        success: false,
        message,
        data: null,
      });
    }

    if (message === 'OTP expired') {
      return response.status(410).json({
        success: false,
        message,
        data: null,
      });
    }

    return response.status(400).json({
      success: false,
      message,
      data: null,
    });
  }
};

export { resetPasswordController };
