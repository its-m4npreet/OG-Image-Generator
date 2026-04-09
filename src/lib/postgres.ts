import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var __ogStudioPgPool: Pool | undefined;
}

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set");
}

export const pool = global.__ogStudioPgPool ?? new Pool({
  connectionString: databaseUrl,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

if (process.env.NODE_ENV !== "production") {
  global.__ogStudioPgPool = pool;
}
