import { seedRoles } from '@/seed/seed.roles';
import { seedUsers } from './seed.users';
import { seedCategories } from './seed.categories';

const seedDb = async () => {
  try {
    await seedRoles();
    await seedUsers();
    await seedCategories();
    // Other seeders...
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error seeding database';

    console.error('Error seeding database:', message);
  }
};

export { seedDb };