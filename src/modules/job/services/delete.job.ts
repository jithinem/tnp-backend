import prisma from '@/shared/prisma';

const deleteJob = async (id: number) => {
  const existing = await prisma.job.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new Error('Job not found');
  }

  return prisma.job.delete({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
};

export { deleteJob };
