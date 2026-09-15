import prisma from '@/shared/prisma';

interface UpdateApplicationInput {
  job_id?: number;
  cover_letter?: string | null;
  resume_url?: string | null;
  status?: 'PENDING' | 'SHORTLISTED' | 'REJECTED';
}

const updateApplication = async (
  applicationId: number,
  input: UpdateApplicationInput,
  userId: number,
  role: string | null,
) => {
  const existing = await prisma.application.findUnique({
    where: { id: applicationId },
    select: {
      id: true,
      user_id: true,
      job_id: true,
      status: true,
    },
  });

  if (!existing) {
    throw new Error('Application not found');
  }

  if (role !== 'admin' && existing.user_id !== userId) {
    throw new Error('Unauthorized');
  }

  if (input.job_id && input.job_id !== existing.job_id) {
    const job = await prisma.job.findUnique({
      where: { id: input.job_id },
      select: { id: true, is_active: true },
    });

    if (!job || !job.is_active) {
      throw new Error('Job not found or inactive');
    }

    const duplicate = await prisma.application.findUnique({
      where: {
        job_id_user_id: {
          job_id: input.job_id,
          user_id: existing.user_id,
        },
      },
      select: { id: true },
    });

    if (duplicate && duplicate.id !== existing.id) {
      throw new Error('Application already submitted');
    }
  }

  return prisma.application.update({
    where: { id: applicationId },
    data: {
      job_id: input.job_id ?? existing.job_id,
      cover_letter: input.cover_letter ?? undefined,
      resume_url: input.resume_url ?? undefined,
      status: input.status ?? undefined,
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

export { updateApplication };
export type { UpdateApplicationInput };
