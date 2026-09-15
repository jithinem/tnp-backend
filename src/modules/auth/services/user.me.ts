import prisma from '@/shared/prisma';
import { userSelect } from '@/modules/users/services/user.select';

interface MeUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  profile_photo: string | null;
  role: { id: number; name: string } | null;
  is_active: boolean;
}

const userMe = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: userSelect,
  });

  if (!user) {
    throw new Error('User not found');
  }

  if (!user.is_active) {
    throw new Error('User account is inactive');
  }

  if (user.is_deleted) {
    throw new Error('User account is deleted');
  }

  const safeUser: MeUser = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    profile_photo: user.profile_photo,
    role: user.role,
    is_active: user.is_active,
  };

  return safeUser;
};

export { userMe };
