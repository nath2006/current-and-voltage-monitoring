import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const rawHost = process.env.DATABASE_HOST || "localhost";
const [parsedHost, parsedPort] = rawHost.split(":");
const host = parsedHost || "localhost";
const port = Number(process.env.DATABASE_PORT || parsedPort || 3306);

const adapter = new PrismaMariaDb({
  host,
  port,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
