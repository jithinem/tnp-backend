import prisma from '@/shared/prisma';

const getCategory = async (id: number) => {
  const category = await prisma.category.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  if (!category) {
    throw new Error('Category not found');
  }

  return category;
};

export { getCategory };
