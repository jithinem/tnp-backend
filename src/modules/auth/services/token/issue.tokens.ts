
import jwt from 'jsonwebtoken';

import prisma from '@/shared/prisma';
import { sha256 } from '@/utils/hash';

import { ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN } from './config';
import { getRefreshExpiryDate } from './get.refresh.expiry.date';

interface TokenUser {
  id: number;
  email: string;
  role?: {
    name: string;
  } | null;
}

const issueTokens = async (user: TokenUser) => {
  const accessToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role?.name ?? null,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: ACCESS_EXPIRES_IN,
    },
  );

  const refreshToken = jwt.sign(
    {
      sub: user.id,
      email: user.email,
    },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: REFRESH_EXPIRES_IN,
    },
  );

  await prisma.refreshToken.create({
    data: {
      token_hash: sha256(refreshToken),
      user_id: user.id,
      expiry_date: getRefreshExpiryDate(),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

export { issueTokens };

