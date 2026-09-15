import bcrypt from 'bcrypt';
import prisma from '@/shared/prisma';
import { userSelect } from '@/modules/users/services/user.select';

interface LoginInput {
  email: string;
  password: string;
}

const userLogin = async ({ email, password }: LoginInput) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
      is_deleted: false,
      is_active: true,
    },
    select: {
      ...userSelect,
      password_hash: true,
    },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return user;
};

export { userLogin };
export type { LoginInput };