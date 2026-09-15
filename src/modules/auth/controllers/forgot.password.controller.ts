import type { Request, Response } from 'express';

import { forgotPassword } from '@/modules/auth/services/forgot.password';

interface ForgotPasswordBody {
  email: string;
}

const forgotPasswordController = async (
  request: Request<{}, {}, ForgotPasswordBody>,
  response: Response,
): Promise<Response> => {
  try {
    await forgotPassword(request.body);

    return response.status(200).json({
      success: true,
      message: 'Password reset OTP has been sent to your email',
      data: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error during password reset request';

    if (message === 'Email not registered' || message === 'Account is inactive') {
      return response.status(404).json({
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

export { forgotPasswordController };
