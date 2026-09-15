import prisma from '@/shared/prisma';

interface CreateJobInput {
  title: string;
  company_name: string;
  location: string;
  description: string;
  requirements: string;
  salary_min?: number;
  salary_max?: number;
  experience_level: string;
  category_id: number;
  employment_type: string;
  is_featured?: boolean;
  is_active?: boolean;
}

const createJob = async (input: CreateJobInput) => {
  const category = await prisma.category.findUnique({
    where: { id: input.category_id },
    select: { id: true },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return prisma.job.create({
    data: {
      title: input.title,
      company_name: input.company_name,
      location: input.location,
      description: input.description,
      requirements: input.requirements,
      salary_min: input.salary_min ?? null,
      salary_max: input.salary_max ?? null,
      experience_level: input.experience_level,
      category_id: input.category_id,
      employment_type: input.employment_type,
      is_featured: input.is_featured ?? false,
      is_active: input.is_active ?? true,
    },
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

export { createJob };
export type { CreateJobInput };
