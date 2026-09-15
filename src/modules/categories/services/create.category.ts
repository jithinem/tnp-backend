import prisma from '@/shared/prisma';

interface CreateCategoryInput {
  name: string;
}

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

const createCategory = async ({ name }: CreateCategoryInput) => {
  const slug = slugify(name);

  const existing = await prisma.category.findFirst({
    where: {
      OR: [
        { name },
        { slug },
      ],
    },
    select: { id: true },
  });

  if (existing) {
    throw new Error('Category already exists');
  }

  return prisma.category.create({
    data: {
      name,
      slug,
    },
  });
};

export { createCategory };
export type { CreateCategoryInput };
