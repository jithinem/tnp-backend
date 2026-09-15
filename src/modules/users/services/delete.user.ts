import prisma from '@/shared/prisma';

const deleteUser = async (id: number) => {
  await prisma.user.update({
    where: { id },
    data: {
      is_deleted: true,
      is_active: false,
    },
  });
};

export { deleteUser };
