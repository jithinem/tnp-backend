import type { Request, Response } from 'express';

import { userSignup } from '@/modules/auth/services/user.signup';

interface SignupBody {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

const userSignupController = async (
  request: Request<{}, {}, SignupBody>,
  response: Response,
): Promise<Response> => {
  try {
    const user = await userSignup(request.body);

    const { password_hash: _password_hash, ...safeUser } = user as typeof user & {
      password_hash?: string;
    };

    return response.status(201).json({
      success: true,
      message: 'Applicant registered successfully',
      data: {
        user: {
          id: safeUser.id,
          first_name: safeUser.first_name,
          last_name: safeUser.last_name,
          email: safeUser.email,
          profile_photo: safeUser.profile_photo,
          role: safeUser.role?.name ?? null,
          is_active: safeUser.is_active,
          is_deleted: safeUser.is_deleted,
          created_at: safeUser.created_at,
          updated_at: safeUser.updated_at,
        },
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error during signup';

    if (message === 'Email already registered') {
      return response.status(409).json({
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

export { userSignupController };
