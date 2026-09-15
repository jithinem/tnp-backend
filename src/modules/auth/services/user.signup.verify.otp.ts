import prisma from '@/shared/prisma';
import { sha256 } from '@/utils/hash';
import { userSelect } from '@/modules/users/services/user.select';

interface VerifySignupOtpInput {
  email: string;
  otp: string;
}

const verifySignupOtp = async ({ email, otp }: VerifySignupOtpInput) => {
  const normalizedEmail = email.trim().toLowerCase();

  const otpRecord = await prisma.otp.findFirst({
    where: {
      email: normalizedEmail,
      purpose: 'EMAIL_VERIFICATION',
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

  // const hardcodedOtp = '121212';
  const hardcodedOtp = otp;
  const otpHash = sha256(hardcodedOtp);

  if (otpRecord.otp_hash !== otpHash && otpRecord.otp_hash !== sha256(otp.trim())) {
    await prisma.otp.update({
      where: { id: otpRecord.id },
      data: { attempts: { increment: 1 } },
    });

    throw new Error('Invalid OTP');
  }

  const user = await prisma.user.update({
    where: { email: normalizedEmail },
    data: {
      is_active: true,
      updated_at: new Date(),
    },
    select: userSelect,
  });

  await prisma.otp.update({
    where: { id: otpRecord.id },
    data: {
      verified_at: new Date(),
      attempts: { increment: 1 },
    },
  });

  return user;
};

export { verifySignupOtp };
export type { VerifySignupOtpInput };
