## Local development

### Prerequisites

* Node.js (your project currently uses Prisma 7, so use a recent Node version that satisfies the Prisma engine requirements).
* PostgreSQL running locally (Homebrew service is fine).
* A local database created for the app.

### Environment variables

Create a file `.env.local` in the project root:

```
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/knit_tracker?schema=public"
```

Replace `USER`, `PASSWORD`, and database name with your local values.

### Install dependencies

```
npm install
```

### Generate Prisma Client

If you changed `prisma/schema.prisma` or pulled changes that touched Prisma, regenerate the client:

```
npx prisma generate
```

### Run migrations (create/update tables)

Apply migrations to your local database:

```
npx prisma migrate dev
```

### Start the app

Run Next.js in dev mode:

```
npm run dev
```

Open:

* [http://localhost:3000](http://localhost:3000)

---

## Local database workflow

### Check current migration status

```
npx prisma migrate status
```

### Reset the local database (wipe all data)

This drops data and recreates the schema from migrations:

```
npm run db:reset
```

Note: this is intended for local development only.

### Seed the local database (add demo data)

```
npm run db:seed
```

### Reset + seed (fresh demo data)

```
npm run db:reset:seed
```

### View data with Prisma Studio

```
npx prisma studio
```

---

## Notes

* Keep `prisma/migrations/` committed to git. Migrations are the source of truth for evolving the schema.
* If you see Prisma errors after changing schema, run `npx prisma generate` again.
* If API endpoints fail with “column/table does not exist”, run `npx prisma migrate dev` (or `npm run db:reset` if you want a clean slate).
