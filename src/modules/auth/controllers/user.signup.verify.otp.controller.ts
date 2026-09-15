import type { Request, Response } from 'express';

import { verifySignupOtp } from '@/modules/auth/services/user.signup.verify.otp';

interface VerifySignupOtpBody {
  email: string;
  otp: string;
}

const userSignupVerifyOtpController = async (
  request: Request<{}, {}, VerifySignupOtpBody>,
  response: Response,
): Promise<Response> => {
  try {
    const user = await verifySignupOtp(request.body);

    return response.status(200).json({
      success: true,
      message: 'OTP verified successfully and account activated',
      data: {
        user: {
          id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role?.name ?? null,
          is_active: user.is_active,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error during OTP verification';

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

export { userSignupVerifyOtpController };
