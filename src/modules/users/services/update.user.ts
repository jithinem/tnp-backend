import bcrypt from 'bcrypt';
import prisma from '@/shared/prisma';

const updateUser = async (id: number, payload: {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role?: string;
  is_active?: boolean;
}) => {
  const role = payload.role ? await prisma.role.findFirst({ where: { name: payload.role } }) : null;

  const data: Record<string, unknown> = { ...payload };
  delete data.password;

  if (payload.password) {
    data.password_hash = await bcrypt.hash(payload.password, 10);
  }

  if (role) {
    data.role_id = role.id;
  }

  const user = await prisma.user.update({
    where: { id },
    data,
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

export { updateUser };
