import prisma from '@/shared/prisma';

interface ListUsersQuery {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  is_active?: boolean;
}

const listUsers = async (query: ListUsersQuery) => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: {
    role?: { name?: string };
    OR?: Array<Record<string, unknown>>;
    is_active?: boolean;
    is_deleted?: boolean;
  } = {
    is_deleted: false,
  };

  if (query.role) {
    where.role = { name: query.role };
  }

  if (typeof query.is_active === 'boolean') {
    where.is_active = query.is_active;
  }

  if (query.search) {
    where.OR = [
      { first_name: { contains: query.search, mode: 'insensitive' } },
      { last_name: { contains: query.search, mode: 'insensitive' } },
      { email: { contains: query.search, mode: 'insensitive' } },
    ];
  }

  const [items, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        role: { select: { id: true, name: true } },
      },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    items,
    rows: items,
    data: items,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
};

export { listUsers };
export type { ListUsersQuery };
