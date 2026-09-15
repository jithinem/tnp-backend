import prisma from '@/shared/prisma';
import { userSelect } from '@/modules/users/services/user.select';

const getApplicationDetails = async (
  applicationId: number,
  userId: number,
  role: string | null,
) => {
  const application = await prisma.application.findUnique({
    where: { id: applicationId },
    include: {
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
      user: {
        select: userSelect,
      },
    },
  });

  if (!application) {
    throw new Error('Application not found');
  }

  if (role !== 'admin' && application.user_id !== userId) {
    throw new Error('Unauthorized');
  }

  return application;
};

export { getApplicationDetails };
