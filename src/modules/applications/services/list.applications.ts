import prisma from '@/shared/prisma';

interface ListApplicationsQuery {
  page?: number;
  limit?: number;
  job_id?: number;
  user_id?: number;
  status?: 'PENDING' | 'SHORTLISTED' | 'REJECTED';
  search?: string;
  applied_date_from?: string;
  applied_date_to?: string;
}

const listApplications = async (query: ListApplicationsQuery) => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: {
    job_id?: number;
    user_id?: number;
    status?: 'PENDING' | 'SHORTLISTED' | 'REJECTED';
    OR?: Array<{
      job?: { title?: { contains: string; mode: 'insensitive' }; company_name?: { contains: string; mode: 'insensitive' } };
      user?: { first_name?: { contains: string; mode: 'insensitive' }; last_name?: { contains: string; mode: 'insensitive' }; email?: { contains: string; mode: 'insensitive' } };
    }>;
    applied_at?: { gte?: Date; lte?: Date };
  } = {};

  if (query.job_id !== undefined) {
    where.job_id = query.job_id;
  }

  if (query.user_id !== undefined) {
    where.user_id = query.user_id;
  }

  if (query.status !== undefined) {
    where.status = query.status;
  }

  if (query.search?.trim()) {
    const search = query.search.trim();
    where.OR = [
      { job: { title: { contains: search, mode: 'insensitive' } } },
      { job: { company_name: { contains: search, mode: 'insensitive' } } },
      { user: { first_name: { contains: search, mode: 'insensitive' } } },
      { user: { last_name: { contains: search, mode: 'insensitive' } } },
      { user: { email: { contains: search, mode: 'insensitive' } } },
    ];
  }

  if (query.applied_date_from || query.applied_date_to) {
    where.applied_at = {};
    if (query.applied_date_from) {
      where.applied_at.gte = new Date(query.applied_date_from);
    }
    if (query.applied_date_to) {
      const toDate = new Date(query.applied_date_to);
      toDate.setHours(23, 59, 59, 999);
      where.applied_at.lte = toDate;
    }
  }

  const [items, total] = await Promise.all([
    prisma.application.findMany({
      where,
      skip,
      take: limit,
      orderBy: { applied_at: 'desc' },
      include: {
        user: { select: { id: true, first_name: true, last_name: true, email: true, phone_number: true, profile_photo: true } },
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
    }),
    prisma.application.count({ where }),
  ]);

  return {
    items,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
};

export { listApplications };
export type { ListApplicationsQuery };
