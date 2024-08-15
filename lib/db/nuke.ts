import { env } from '@/env.mjs';
import { Pool } from 'pg';
import readline from 'readline';

// Use a connection string

const connectionString = env.DATABASE_URL;
const pool = new Pool({ connectionString });

// Specify the schemas to be deleted
const schemasToDelete = ['public', 'protected', 'drizzle', 'next_auth'];

async function clearDatabase() {
    const client = await pool.connect();
    try {
        // Disable foreign key checks
        await client.query('SET session_replication_role = replica;');

        for (const schema of schemasToDelete) {
            console.log(`Clearing schema: ${schema}`);

            // Drop all tables in the schema
            const tablesRes = await client.query(`
        SELECT tablename FROM pg_tables
        WHERE schemaname = $1
      `, [schema]);

            for (const row of tablesRes.rows) {
                await client.query(`DROP TABLE IF EXISTS "${schema}"."${row.tablename}" CASCADE`);
                console.log(`Dropped table: ${schema}.${row.tablename}`);
            }

            // Drop all sequences in the schema
            const sequencesRes = await client.query(`
        SELECT sequence_name FROM information_schema.sequences
        WHERE sequence_schema = $1
      `, [schema]);

            for (const row of sequencesRes.rows) {
                await client.query(`DROP SEQUENCE IF EXISTS "${schema}"."${row.sequence_name}" CASCADE`);
                console.log(`Dropped sequence: ${schema}.${row.sequence_name}`);
            }

            // Drop all types in the schema
            const typesRes = await client.query(`
        SELECT typname FROM pg_type
        JOIN pg_namespace ON pg_type.typnamespace = pg_namespace.oid
        WHERE nspname = $1 AND typtype = 'e'
      `, [schema]);

            for (const row of typesRes.rows) {
                await client.query(`DROP TYPE IF EXISTS "${schema}"."${row.typname}" CASCADE`);
                console.log(`Dropped type: ${schema}.${row.typname}`);
            }

            // Drop the schema itself (except 'public')
            if (schema !== 'public') {
                await client.query(`DROP SCHEMA IF EXISTS "${schema}" CASCADE`);
                console.log(`Dropped schema: ${schema}`);
            } else {
                console.log(`Skipped dropping 'public' schema as it's protected`);
            }
        }

        // Re-enable foreign key checks
        await client.query('SET session_replication_role = DEFAULT;');

        console.log('Database clearing completed.');
    } catch (err) {
        console.error('Error clearing database:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

function prompt(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer);
        });
    });
}

async function main() {
    console.log('WARNING: This script will delete ALL tables, sequences, types, and schemas (except public) in the database.');
    console.log('Targeted schemas:', schemasToDelete.join(', '));
    console.log('This action is irreversible. Make sure you have a backup if needed.');
    const answer = await prompt('Are you sure you want to proceed? (yes/no): ');

    if (answer.toLowerCase() === 'yes') {
        await clearDatabase();
    } else {
        console.log('Operation cancelled.');
    }
}

main().catch(console.error);