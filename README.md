# TNP Backend

Express and Prisma backend API.

## Requirements

- Node.js 18+
- PostgreSQL

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/DATABASE"
   ACCESS_TOKEN_SECRET="your-access-secret"
   REFRESH_TOKEN_SECRET="your-refresh-secret"
   NODE_ENV="development"
   PORT=5001
   CORS_ORIGIN="http://localhost:3000"
   ```

3. Generate Prisma Client and apply migrations:

   ```bash
   npm run prisma:generate
   npm run migrate:deploy
   ```

## Run

Development mode:

```bash
npm run dev
```

The API runs at `http://localhost:5001` by default. Health check: `GET /health`.

## Production

```bash
npm run dev
```

The database is seeded automatically when the server starts.
