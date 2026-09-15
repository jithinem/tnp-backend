import prisma from '@/shared/prisma';

const deleteCategory = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  const jobCount = await prisma.job.count({
    where: { category_id: id },
  });

  if (jobCount > 0) {
    throw new Error('Cannot delete category with jobs');
  }

  return prisma.category.delete({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
};

export { deleteCategory };
