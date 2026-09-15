import bcrypt from 'bcrypt';
import prisma from '@/shared/prisma';
import { sha256 } from '@/utils/hash';

interface ForgotPasswordInput {
  email: string;
}

const forgotPassword = async ({ email }: ForgotPasswordInput) => {
  const normalizedEmail = email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: {
      id: true,
      is_active: true,
      is_deleted: true,
    },
  });

  if (!user || user.is_deleted) {
    throw new Error('Email not registered');
  }

  if (!user.is_active) {
    throw new Error('Account is inactive');
  }

  await prisma.otp.deleteMany({
    where: {
      email: normalizedEmail,
      purpose: 'PASSWORD_RESET',
      verified_at: null,
    },
  });

  const otp = '121212';
  const otpHash = sha256(otp);
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

  await prisma.otp.create({
    data: {
      email: normalizedEmail,
      purpose: 'PASSWORD_RESET',
      otp_hash: otpHash,
      expires_at: expiresAt,
      user_id: user.id,
      attempts: 0,
    },
  });

  return { email: normalizedEmail };
};

export { forgotPassword };
export type { ForgotPasswordInput };
