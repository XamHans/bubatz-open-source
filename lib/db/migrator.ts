import { logger } from '@/logger';
import 'dotenv/config';
import { migrate } from 'drizzle-orm/mysql2/migrator';
import { client, db } from './db';

async function runMigrations() {
  // This will run migrations on the database, skipping the ones already applied
  await migrate(db, { migrationsFolder: './lib/db/migrations' });
  // Don't forget to close the connection, otherwise the script will hang
  await client.end();
  logger.info('Migrations completed');
}

runMigrations().catch(console.error);
