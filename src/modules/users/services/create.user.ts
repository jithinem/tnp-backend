import bcrypt from 'bcrypt';
import prisma from '@/shared/prisma';

const createUser = async (payload: {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  is_active?: boolean;
}) => {
  const role = await prisma.role.findFirst({ where: { name: payload.role } });
  if (!role) {
    throw new Error('Role not found');
  }

  const password_hash = await bcrypt.hash(payload.password, 10);

  const user = await prisma.user.create({
    data: {
      first_name: payload.first_name,
      last_name: payload.last_name,
      email: payload.email,
      password_hash,
      role_id: role.id,
      is_active: payload.is_active ?? true,
      is_deleted: false,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      is_active: true,
      is_deleted: true,
      created_at: true,
      updated_at: true,
      role: { select: { id: true, name: true } },
    },
  });

  return user;
};

export { createUser };
