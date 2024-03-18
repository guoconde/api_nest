// eslint-disable-next-line import/no-extraneous-dependencies
import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'node:crypto';
import { execSync } from 'node:child_process';

const prisma = new PrismaClient();

const generateUniqueDatabaseURL = (schemaId: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schemaId);

  return url.toString();
};

const schemaId = randomUUID();

beforeAll(async () => {
  await prisma.$connect();

  const databaseURL = generateUniqueDatabaseURL(schemaId);

  process.env.DATABASE_URL = databaseURL;

  execSync('npx prisma migrate deploy');
});

afterAll(async () => {
  prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS ${schemaId} CASCADE`);

  await prisma.$disconnect();
});
