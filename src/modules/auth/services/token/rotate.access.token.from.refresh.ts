import jwt from 'jsonwebtoken';

import prisma from '@/shared/prisma';
import { sha256 } from '@/utils/hash';

import { ACCESS_EXPIRES_IN } from './config';

const rotateAccessTokenFromRefresh = async (refreshToken: string) => {
  let payload: jwt.JwtPayload;

  try {
    payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!,
    ) as jwt.JwtPayload;
  } catch {
    return null;
  }

  const userId = payload?.sub;

  if (!userId) {
    return null;
  }

  const existing = await prisma.refreshToken.findUnique({
    where: {
      token_hash: sha256(refreshToken),
    },
    include: {
      users: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!existing) {
    return null;
  }

  if (existing.revoked_at) {
    return null;
  }

  if (existing.expiry_date.getTime() < Date.now()) {
    return null;
  }

  // Check if user is still active
  if (!existing.users.is_active || existing.users.is_deleted) {
    return null;
  }

  const accessToken = jwt.sign(
    {
      sub: existing.users.id,
      email: existing.users.email,
      role: existing.users.role?.name ?? null,
    },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: ACCESS_EXPIRES_IN,
    },
  );

  return {
    accessToken,
  };
};

export { rotateAccessTokenFromRefresh };

