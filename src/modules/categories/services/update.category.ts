import prisma from '@/shared/prisma';

interface UpdateCategoryInput {
  name?: string;
}

const slugify = (value: string): string => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};

const updateCategory = async (id: number, input: UpdateCategoryInput) => {
  const existing = await prisma.category.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existing) {
    throw new Error('Category not found');
  }

  const name = input.name ?? '';
  const data = input.name
    ? {
        name: input.name,
        slug: slugify(input.name),
      }
    : {};

  const duplicate = await prisma.category.findFirst({
    where: {
      OR: [
        { name: data.name ?? undefined },
        { slug: data.slug ?? undefined },
      ],
      NOT: {
        id,
      },
    },
    select: { id: true },
  });

  if (duplicate) {
    throw new Error('Category already exists');
  }

  return prisma.category.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });
};

export { updateCategory };
export type { UpdateCategoryInput };
