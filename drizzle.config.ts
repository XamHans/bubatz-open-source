import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
// export default {
//   schema: "./modules/**/**/schema.ts",
//   out: './lib/db/migrations',
//   dialect: "postgresql", // "mysql" | "sqlite" | "postgresql"
//   dbCredentials: {
//     url: process.env.DATABASE_URL,
//   }
// } satisfies Config;

export default defineConfig({
  dialect: 'postgresql', // "mysql" | "sqlite" | "postgresql"
  schema: './lib/db/schema.ts',
  out: './lib/db/migrations',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
