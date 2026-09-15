import prisma from '@/shared/prisma';

const listAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { id: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
};

export { listAllCategories };
