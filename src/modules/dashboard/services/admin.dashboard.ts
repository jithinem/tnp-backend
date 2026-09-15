import prisma from '@/shared/prisma';

const adminDashboardStats = async () => {
  const [
    totalUsers,
    totalApplicants,
    totalJobs,
    activeJobs,
    totalApplications,
    applicationsByStatus,
    recentApplications,
  ] = await Promise.all([
    prisma.user.count({ where: { is_deleted: false } }),
    prisma.user.count({ where: { role: { name: 'applicant' }, is_deleted: false } }),
    prisma.job.count(),
    prisma.job.count({ where: { is_active: true } }),
    prisma.application.count(),
    prisma.application.groupBy({
      by: ['status'],
      _count: { status: true },
    }),
    prisma.application.findMany({
      orderBy: { applied_at: 'desc' },
      take: 5,
      include: {
        job: { select: { id: true, title: true, company_name: true, is_active: true } },
        user: { select: { id: true, first_name: true, last_name: true, email: true } },
      },
    }),
  ]);

  const byStatus = applicationsByStatus.reduce<Record<string, number>>((acc, row) => {
    acc[row.status] = row._count.status;
    return acc;
  }, {});

  return {
    totals: {
      users: totalUsers,
      applicants: totalApplicants,
      jobs: totalJobs,
      activeJobs,
      applications: totalApplications,
    },
    applicationsByStatus: byStatus,
    recentApplications,
  };
};

export { adminDashboardStats };
