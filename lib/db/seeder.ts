
import { env } from '@/env.mjs';
import { addMemberInputSchema, addMembershipPaymentSchema } from '@/modules/members/data-access/schema';
import { faker } from '@faker-js/faker';
import { Pool } from 'pg';

// Use a connection string
const connectionString = env.DATABASE_URL;

const pool = new Pool({ connectionString });

const memberStatuses = ['ACTIVE', 'INACTIVE', 'PENDING'];
const paymentMethods = ['CREDIT_CARD', 'BANK_TRANSFER', 'CASH', 'PAYPAL'];

// Fixed array of date strings
const fixedDates = [
    '1980-01-15',
    '1990-05-20',
    '2000-09-10',
    '1975-03-30',
    '1995-11-05'
];

async function seedDatabase() {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Create 50 members
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
                    paymentMethod: faker.helpers.arrayElement(paymentMethods),
                    notes: faker.lorem.sentence(),
                });

                // Adjust payment date for pending and overdue payments
                if (payment.paymentStatus !== 'PAID') {
                    payment.paymentDate = null;
                }

                await client.query(`
                    INSERT INTO protected.membership_payments (
                        member_id, year, amount, payment_date, payment_status, payment_method, notes
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
                `, [
                    payment.memberId,
                    payment.year,
                    payment.amount,
                    payment.paymentDate,
                    payment.paymentStatus,
                    payment.paymentMethod,
                    payment.notes
                ]);
            }
        }

        console.log('Payments seeded successfully.');

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