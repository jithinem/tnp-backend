import prisma from '@/shared/prisma';

interface UpdateJobInput {
  title?: string;
  company_name?: string;
  location?: string;
  description?: string;
  requirements?: string;
  salary_min?: number;
  salary_max?: number;
  experience_level?: string;
  category_id?: number;
  employment_type?: string;
  is_featured?: boolean;
  is_active?: boolean;
}

const updateJob = async (id: number, input: UpdateJobInput) => {
  const existing = await prisma.job.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new Error('Job not found');
  }

  if (input.category_id) {
    const category = await prisma.category.findUnique({
      where: { id: input.category_id },
      select: { id: true },
    });

    if (!category) {
      throw new Error('Category not found');
    }
  }

  return prisma.job.update({
    where: { id },
    data: input,
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

export { updateJob };
export type { UpdateJobInput };
