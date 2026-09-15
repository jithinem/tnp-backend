import prisma from '@/shared/prisma';

interface ListCategoriesQuery {
  page?: number;
  limit?: number;
}

const listCategories = async (query: ListCategoriesQuery) => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take: limit,
      orderBy: { id: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.category.count(),
  ]);

  return {
    items,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
};

export { listCategories };
export type { ListCategoriesQuery };
