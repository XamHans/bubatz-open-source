import { addMemberInputSchema, addMembershipPaymentSchema } from '@/modules/members/data-access/schema';
import { createSaleInputSchema, paymentMethods, SaleItemInsertSchema } from '@/modules/sales/data-access/schema';
import { faker } from '@faker-js/faker';
import * as dotenv from "dotenv";
import { Pool } from 'pg';

dotenv.config({ path: '../../.env' });

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });

const memberStatuses = ['ACTIVE', 'INACTIVE', 'PENDING'];
const paymentMethodsArray = paymentMethods.enumValues;
const fixedDates = ['1980-01-15', '1990-05-20', '2000-09-10', '1975-03-30', '1995-11-05'];

async function seedDatabase() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const createdMemberIds: string[] = [];
        for (let i = 0; i < 50; i++) {
            const firstName = faker.person.firstName();
            const lastName = faker.person.lastName();
            const member = addMemberInputSchema.parse({
                id: faker.string.uuid(),
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
                email: faker.internet.email(),
                phone: faker.phone.number(),
                street: faker.location.streetAddress(),
                city: faker.location.city(),
                zip: faker.location.zipCode(),
                birthday: faker.helpers.arrayElement(fixedDates),
                status: faker.helpers.arrayElement(memberStatuses),
                role: faker.helpers.arrayElement(['MEMBER', 'ADMIN'] as const),
            });

            const result = await client.query(`
                INSERT INTO protected.members (
                    id, first_name, last_name, full_name, email, phone, street, city, zip, 
                    birthday, status, role
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
                RETURNING id
            `, [
                member.id,
                member.firstName,
                member.lastName,
                member.fullName,
                member.email,
                member.phone,
                member.street,
                member.city,
                member.zip,
                member.birthday,
                member.status,
                member.role
            ]);

            createdMemberIds.push(result.rows[0].id);
        }

        console.log('Members seeded successfully.');

        // Create payments for the last 3 years
        const currentYear = new Date().getFullYear();
        const years = [currentYear - 2, currentYear - 1, currentYear];

        for (const memberId of createdMemberIds) {
            for (const year of years) {
                const payment = addMembershipPaymentSchema.parse({
                    memberId,
                    year: year.toString(),
                    amount: faker.number.float({ min: 50, max: 200, precision: 0.01 }),
                    paymentDate: faker.helpers.arrayElement(fixedDates),
                    paymentStatus: faker.helpers.arrayElement(['PAID', 'PENDING', 'OVERDUE'] as const),
                    paymentMethod: faker.helpers.arrayElement(paymentMethodsArray),
                    notes: faker.lorem.sentence(),
                });

                if (payment.paymentStatus !== 'PAID') {
                    payment.paymentDate = null;
                }

                await client.query(`
                    INSERT INTO protected.membership_payments (
                        member_id, year, amount, payment_date, payment_status, payment_method, notes
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, Object.values(payment));
            }
        }

        console.log('Payments seeded successfully.');

        // Create sales and sales items
        for (const memberId of createdMemberIds) {
            const numberOfSales = faker.number.int({ min: 1, max: 5 });
            for (let i = 0; i < numberOfSales; i++) {
                const sale = createSaleInputSchema.parse({
                    totalPrice: faker.number.float({ min: 10, max: 500, precision: 0.01 }),
                    paidVia: faker.helpers.arrayElement(paymentMethodsArray),
                    memberId: memberId,
                    salesById: faker.helpers.arrayElement(createdMemberIds), // Random seller
                });

                const saleResult = await client.query(`
                    INSERT INTO protected.sales (
                        total_price, paid_via, member_id, sales_by_id
                    ) VALUES ($1, $2, $3, $4)
                    RETURNING id
                `, Object.values(sale));

                const saleId = saleResult.rows[0].id;

                // Create 1-3 sales items for each sale
                const numberOfItems = faker.number.int({ min: 1, max: 3 });
                for (let j = 0; j < numberOfItems; j++) {
                    const saleItem = SaleItemInsertSchema.parse({
                        weightGrams: faker.number.float({ min: 1, max: 50, precision: 0.1 }),
                        price: faker.number.float({ min: 5, max: 100, precision: 0.01 }),
                        strainId: faker.number.int({ min: 1, max: 10 }), // Assuming you have 10 strains
                        saleId: saleId,
                    });

                    await client.query(`
                        INSERT INTO protected.sales_items (
                            weight_grams, price, strain_id, sale_id
                        ) VALUES ($1, $2, $3, $4)
                    `, Object.values(saleItem));
                }
            }
        }

        console.log('Sales and sales items seeded successfully.');

        // Update current year payment status for members
        await client.query(`
            UPDATE protected.members m
            SET current_year_paid = EXISTS (
                SELECT 1 FROM protected.membership_payments mp
                WHERE mp.member_id = m.id 
                AND mp.year = $1 
                AND mp.payment_status = 'PAID'
            ),
            last_payment_date = (
                SELECT MAX(payment_date) 
                FROM protected.membership_payments mp
                WHERE mp.member_id = m.id 
                AND mp.payment_status = 'PAID'
            )
        `, [currentYear.toString()]);

        console.log('Member payment statuses updated.');

        await client.query('COMMIT');
        console.log('Database seeded successfully!');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error seeding database:', err);
    } finally {
        client.release();
        await pool.end();
    }
}

seedDatabase().catch(console.error);