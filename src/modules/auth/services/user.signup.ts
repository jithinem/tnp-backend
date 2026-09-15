import bcrypt from 'bcrypt';
import prisma from '@/shared/prisma';
import { userSelect } from '@/modules/users/services/user.select';
import { sha256 } from '@/utils/hash';

interface SignupInput {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone_number?: string;
}

const userSignup = async ({
  first_name,
  last_name,
  email,
  password,
  phone_number,
}: SignupInput) => {
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: {
      email: normalizedEmail,
    },
    select: {
      id: true,
    },
  });

  if (existingUser) {
    throw new Error('Email already registered');
  }

  const applicantRole = await prisma.role.findUnique({
    where: {
      name: 'applicant',
    },
    select: {
      id: true,
    },
  });

  if (!applicantRole) {
    throw new Error('Applicant role not found');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      first_name,
      last_name,
      email: normalizedEmail,
      phone_number: phone_number || null,
      password_hash: passwordHash,
      role_id: applicantRole.id,
      is_active: false,
      is_deleted: false,
    },
    select: userSelect,
  });

  const otpHash = sha256('121212');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 10);

  await prisma.otp.create({
    data: {
      email: normalizedEmail,
      purpose: 'EMAIL_VERIFICATION',
      otp_hash: otpHash,
      expires_at: expiresAt,
      user_id: user.id,
      attempts: 0,
    },
  });

  return user;
};

export { userSignup };
export type { SignupInput };
