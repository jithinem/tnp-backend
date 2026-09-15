import 'dotenv/config';
import path from 'node:path';
import { defineConfig } from 'prisma/config';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is not defined in .env');
}

export default defineConfig({
  schema: path.join(process.cwd(), 'prisma'),
  datasource: {
    url: databaseUrl,
  },
});

