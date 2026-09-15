import bcrypt from 'bcrypt';
import prisma from '@/shared/prisma';
import { sha256 } from '@/utils/hash';

interface ResetPasswordInput {
  email: string;
  otp: string;
  password: string;
}

const resetPassword = async ({
  email,
  otp,
  password,
}: ResetPasswordInput) => {
  const normalizedEmail = email.trim().toLowerCase();

  const otpRecord = await prisma.otp.findFirst({
    where: {
      email: normalizedEmail,
      purpose: 'PASSWORD_RESET',
      verified_at: null,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  if (!otpRecord) {
    throw new Error('OTP not found');
  }

  if (otpRecord.expires_at.getTime() < Date.now()) {
    throw new Error('OTP expired');
  }

  const otpHash = sha256(otp);

  if (otpRecord.otp_hash !== otpHash && otpRecord.otp_hash !== sha256(otp.trim())) {
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    throw new Error('Invalid OTP');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.update({
    where: { email: normalizedEmail },
    data: {
      password_hash: passwordHash,
      updated_at: new Date(),
    },
  });

  await prisma.otp.update({
    where: { id: otpRecord.id },
    data: {
      verified_at: new Date(),
      attempts: { increment: 1 },
    },
  });

  return { email: normalizedEmail };
};

export { resetPassword };
export type { ResetPasswordInput };
