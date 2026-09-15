import prisma from '@/shared/prisma';

const getJob = async (id: number) => {
  const job = await prisma.job.findUnique({
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

  if (!job) {
    throw new Error('Job not found');
  }

  return job;
};

export { getJob };
