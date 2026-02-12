#!/bin/sh
set -e

if [ -z "${DATABASE_URL:-}" ]; then
  echo "DATABASE_URL is required"
  exit 1
fi

WAIT_ATTEMPTS="${WAIT_ATTEMPTS:-60}"
WAIT_INTERVAL="${WAIT_INTERVAL:-2}"

echo "Waiting for database..."
node <<'NODE'
const { Client } = require('pg');
const url = process.env.DATABASE_URL;
const attempts = Number(process.env.WAIT_ATTEMPTS || 60);
const interval = Number(process.env.WAIT_INTERVAL || 2) * 1000;

async function wait() {
  for (let i = 1; i <= attempts; i++) {
    try {
      const client = new Client({ connectionString: url });
      await client.connect();
      await client.end();
      console.log('Database is ready');
      return;
    } catch (e) {
      if (i === attempts) {
        console.error('Database not ready:', e.message);
        process.exit(1);
      }
      await new Promise((r) => setTimeout(r, interval));
    }
  }
}

wait().catch((e) => {
  console.error('Database wait failed:', e);
  process.exit(1);
});
NODE

if [ "${RUN_MIGRATIONS:-1}" != "0" ]; then
  echo "Generating Prisma Client..."
  npx prisma generate
  echo "Running migrations..."
  npx prisma migrate deploy
fi

if [ "${RUN_SEED:-0}" = "1" ]; then
  echo "Running seed..."
  npm run db:seed
fi

exec "$@"
