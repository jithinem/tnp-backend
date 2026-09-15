import prisma from '@/shared/prisma';

interface CreateApplicationInput {
  job_id: number;
  cover_letter?: string | null;
  resume_url?: string | null;
  status?: 'PENDING' | 'SHORTLISTED' | 'REJECTED';
}

const createApplication = async (
  input: CreateApplicationInput,
  userId: number,
) => {
  const job = await prisma.job.findUnique({
    where: { id: input.job_id },
    select: { id: true, is_active: true },
  });

  if (!job || !job.is_active) {
    throw new Error('Job not found or inactive');
  }

  const existing = await prisma.application.findUnique({
    where: {
      job_id_user_id: {
        job_id: input.job_id,
        user_id: userId,
      },
    },
    select: { id: true },
  });

  if (existing) {
    throw new Error('Application already submitted');
  }

  return prisma.application.create({
    data: {
      job_id: input.job_id,
      user_id: userId,
      cover_letter: input.cover_letter ?? null,
      resume_url: input.resume_url ?? null,
      status: input.status ?? 'PENDING',
    },
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

export { createApplication };
export type { CreateApplicationInput };
