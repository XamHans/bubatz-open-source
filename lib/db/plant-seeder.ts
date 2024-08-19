import {
    createBatchInputSchema,
    createPlantInputSchema,
    createStrainInputSchema,
} from '@/modules/plants/data-access/schema';
import { faker } from '@faker-js/faker';
import * as dotenv from "dotenv";
import { Pool } from 'pg';

dotenv.config({ path: '../../.env' });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

const growthStages = ['SEEDLING', 'VEGETATIVE', 'FLOWERING', 'HARVESTING'];

async function seedDatabase() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const createdStrainIds: number[] = [];
        for (let i = 0; i < 10; i++) {
            const strain = createStrainInputSchema.parse({
                id: i,
                name: faker.commerce.productName(),
                description: faker.lorem.sentence(),
                thc: faker.number.float({ min: 0, max: 30, multipleOf: 0.1 }),
                cbd: faker.number.float({ min: 0, max: 20, multipleOf: 0.1 }),
                currentPricePerGram: faker.number.float({ min: 5, max: 20, multipleOf: 0.01 }).toString(),
                amountAvailable: faker.number.float({ min: 0, max: 1000, multipleOf: 0.1 }).toString(),
            });

            console.log('Strain:', strain);
            const result = await client.query(`
                INSERT INTO protected.strains (
                    id, name, description, thc, cbd,current_price_per_gram, amount_available
                ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id
            `, Object.values(strain));

            createdStrainIds.push(result.rows[0].id);
        }

        console.log('Strains seeded successfully.');

        // Create 5 batches
        const createdBatchIds: string[] = [];
        for (let i = 0; i < 5; i++) {
            const startDate = faker.date.past();
            const endDate = faker.date.future({ refDate: startDate });
            const batch = createBatchInputSchema.parse({
                name: `Batch ${i + 1}`,
                strainId: faker.helpers.arrayElement(createdStrainIds), // Convert to string if necessary
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                currentGrowthStage: faker.helpers.arrayElement(growthStages),
                otherDetails: {},
            });

            console.log('Batch:', batch);
            const result = await client.query(`
                INSERT INTO protected.batches (
                    name, strain_id, start_date, end_date, current_growth_stage, other_details
                ) VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING id
            `, Object.values(batch));

            createdBatchIds.push(result.rows[0].id);
        }

        console.log('Batches seeded successfully.');

        // Create 20-50 plants per batch
        for (const batchId of createdBatchIds) {
            const numberOfPlants = faker.number.int({ min: 20, max: 50 });
            for (let i = 0; i < numberOfPlants; i++) {
                const plant = createPlantInputSchema.parse({
                    name: `Plant ${i + 1}`,
                    batchId: batchId,
                    position: `Row ${faker.number.int({ min: 1, max: 10 })}, Column ${faker.number.int({ min: 1, max: 10 })}`,
                    health: faker.helpers.arrayElement(['HEALTHY', 'STRESSED', 'DISEASED']),
                    yield: faker.number.float({ min: 0, max: 100, multipleOf: 0.1 }).toString(),
                });

                await client.query(`
                    INSERT INTO protected.plants (
                        name, batch_id, position, health, yield
                    ) VALUES ($1, $2, $3, $4, $5)
                `, Object.values(plant));
            }
        }

        console.log('Plants seeded successfully.');

        await client.query('COMMIT');
        console.log('Database seeded successfully with plants, batches, and strains!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error seeding database:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seedDatabase().catch(console.error);