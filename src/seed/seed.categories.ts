import prisma from '@/shared/prisma';

const seedCategories = async () => {
  const categories = [
    'Software Development',
    'Design',
    'Marketing',
    'Finance',
    'Human Resources',
    'Sales',
  ] as const;

  for (const name of categories) {
    const existing = await prisma.category.findUnique({
      where: { name },
      select: { id: true },
    });

    if (existing) continue;

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');

    await prisma.category.create({
      data: {
        name,
        slug,
      },
    });

    console.log(`Category '${name}' created successfully.`);
  }
};

export { seedCategories };