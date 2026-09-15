import bcrypt from 'bcrypt';
import prisma from '@/shared/prisma';

const seedUsers = async () => {
  const adminRole = await prisma.role.findUnique({
    where: { name: 'admin' },
    select: { id: true },
  });

  const applicantRole = await prisma.role.findUnique({
    where: { name: 'applicant' },
    select: { id: true },
  });

  if (!adminRole || !applicantRole) {
    throw new Error(
      'Required roles not found. Please run seedRoles before seedUsers.',
    );
  }

  const adminPassword = await bcrypt.hash('Admin@123', 10);
  const applicantPassword = await bcrypt.hash('Applicant@123', 10);

  const users = [
    {
      first_name: 'Admin',
      last_name: 'User',
      email: 'admin@example.com',
      phone_number: '1234567890',
      password_hash: adminPassword,
      role_id: adminRole.id,
    },
    {
      first_name: 'John',
      last_name: 'Applicant',
      email: 'john@example.com',
      phone_number: '0987654321',
      password_hash: applicantPassword,
      role_id: applicantRole.id,
    },
  ];

  for (const user of users) {
    const existing = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    if (existing) continue;

    await prisma.user.create({
      data: user,
    });
    console.log(`User '${user.email}' created successfully.`);
  }
};

export { seedUsers };