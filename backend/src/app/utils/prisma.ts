import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DB_URI || process.env.DATABASE_URL;

const isRemoteDb =
  connectionString?.includes("supabase.com") ||
  connectionString?.includes("sslmode=require") ||
  process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString,
  max: Number(process.env.DB_POOL_MAX || 10),
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
  ssl: isRemoteDb ? { rejectUnauthorized: false } : undefined,
});
const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });
