import prisma from '@/shared/prisma';

interface ListJobsQuery {
  page?: number;
  limit?: number;
  category_id?: number;
  is_active?: boolean;
  is_featured?: boolean;
  employment_type?: string;
  search?: string;
  application_status?: string;
  user_id?: number;
}

const listJobs = async (query: ListJobsQuery) => {
  const page = query.page ?? 1;
  const limit = query.limit ?? 10;
  const skip = (page - 1) * limit;

  const where: {
    category_id?: number;
    is_active?: boolean;
    is_featured?: boolean;
    employment_type?: string;
    OR?: Array<{ title?: { contains: string; mode: 'insensitive' }; company_name?: { contains: string; mode: 'insensitive' }; location?: { contains: string; mode: 'insensitive' } }>;
    id?: { in?: number[]; notIn?: number[] };
  } = {};

  if (query.category_id !== undefined) {
    where.category_id = query.category_id;
  }

  // Default to showing only active jobs unless explicitly requested otherwise
  if (query.is_active === undefined) {
    where.is_active = true;
  } else {
    where.is_active = query.is_active;
  }

  if (query.is_featured !== undefined) {
    where.is_featured = query.is_featured;
  }

  if (query.employment_type) {
    where.employment_type = query.employment_type;
  }
  if (query.search?.trim()) {
    const search = query.search.trim();
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { company_name: { contains: search, mode: 'insensitive' } },
      { location: { contains: search, mode: 'insensitive' } },
    ];
  }

  // Handle application status filter
  if (query.application_status === 'not-applied' && query.user_id) {
    const applications = await prisma.application.findMany({
      where: {
        user_id: query.user_id,
      },
      select: { job_id: true },
    });

    const appliedJobIds = applications.map((app) => app.job_id);
    where.id = { notIn: appliedJobIds };
  } else if (query.application_status === 'applied' && query.user_id) {
    const applications = await prisma.application.findMany({
      where: {
        user_id: query.user_id,
      },
      select: { job_id: true },
    });

    const appliedJobIds = applications.map((app) => app.job_id);
    where.id = { in: appliedJobIds };
  } else if (query.application_status && query.user_id) {
    const applications = await prisma.application.findMany({
      where: {
        user_id: query.user_id,
        status: query.application_status as 'PENDING' | 'SHORTLISTED' | 'REJECTED',
      },
      select: { job_id: true },
    });

    const appliedJobIds = applications.map((app) => app.job_id);
    where.id = { in: appliedJobIds };
  }

  const [items, total] = await Promise.all([
    prisma.job.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.job.count({ where }),
  ]);

  return {
    items,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit),
  };
};

export { listJobs };
export type { ListJobsQuery };
