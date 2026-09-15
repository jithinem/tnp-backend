
import type { Request, Response } from 'express';

import { userLogin } from '@/modules/auth/services/user.login';
import { getRefreshCookieOptions } from '@/utils/cookies';
import { issueTokens } from '@/modules/auth/services/token';
// import { setUserCache } from '@/modules/user/services/user.cache';

interface LoginBody {
  email: string;
  password: string;
}

const userLoginController = async (
  request: Request<{}, {}, LoginBody>,
  response: Response,
): Promise<Response> => {
  try {
    const { email, password } = request.body;

    const user = await userLogin({ email, password });

    const { accessToken, refreshToken } = await issueTokens(user);

    response.cookie(
      'refresh_token',
      refreshToken,
      getRefreshCookieOptions(),
    );

    const { password_hash: _password_hash, ...safeUser } = user;

    // await setUserCache(safeUser);

    return response.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        accessToken,
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
    const message =
      error instanceof Error
        ? error.message
        : 'Unknown error during login';

    return response.status(401).json({
      success: false,
      message,
      data: null,
    });
  }
};

export { userLoginController };

