import prisma from '@/shared/prisma';

const applicantDashboardStats = async (userId: number) => {
  const [
    profile,
    applications,
    summary,
    recentApplications,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId, is_deleted: false },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        profile_photo: true,
        is_active: true,
        role: { select: { id: true, name: true } },
      },
    }),
    prisma.application.findMany({
      where: { user_id: userId },
      orderBy: { applied_at: 'desc' },
      take: 10,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            company_name: true,
            location: true,
            employment_type: true,
            is_active: true,
            category: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    }),
    prisma.application.groupBy({
      by: ['status'],
      where: { user_id: userId },
      _count: { status: true },
    }),
    prisma.application.findMany({
      where: { user_id: userId },
      orderBy: { applied_at: 'desc' },
      take: 5,
      include: {
        job: { select: { id: true, title: true, company_name: true, is_active: true } },
      },
    }),
  ]);

  if (!profile) {
    throw new Error('User not found');
  }

  const statusSummary = summary.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row._count.status;
    return acc;
  }, {});

  return {
    profile,
    applicationsCount: applications.length,
    statusSummary,
    recentApplications,
    applications,
  };
};

export { applicantDashboardStats };
