import prisma from '@/shared/prisma';

const deleteApplication = async (applicationId: number, userId: number, role: string | null) => {
  const existing = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      user_id: true,
    },
  });

  if (!existing) {
    throw new Error('Application not found');
  }

  if (role !== 'admin' && existing.user_id !== userId) {
    throw new Error('Unauthorized');
  }

  return prisma.application.delete({
    where: { id: applicationId },
    include: {
      job: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });
};

export { deleteApplication };
