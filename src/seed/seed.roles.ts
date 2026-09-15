import prisma from '@/shared/prisma';

const seedRoles = async () => {
  const roles = ['admin', 'applicant'] as const;

  for (const name of roles) {
    const existing = await prisma.role.findUnique({
      where: { name },
      select: { id: true },
    });

    if (existing) continue;

    await prisma.role.create({
      data: { name },
    });
    console.log(`Role '${name}' created successfully.`);
  }
};

export { seedRoles };