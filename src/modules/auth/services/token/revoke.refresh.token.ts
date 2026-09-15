import prisma from '@/shared/prisma';
import { sha256 } from '@/utils/hash';

const revokeRefreshToken = async (refreshToken: string) => {
  const tokenHash = sha256(refreshToken);
  await prisma.refreshToken.updateMany({
    where: { token_hash: tokenHash, revoked_at: null },
    data: { revoked_at: new Date() },
  });
};

export { revokeRefreshToken };

