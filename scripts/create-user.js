const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

function generateId() {
    return crypto.randomBytes(12).toString('hex').substring(0, 25);
}

function hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
}

async function createUser(email, name, password) {
    try {
        const userId = generateId();
        const passwordHash = hashPassword(password);

        const result = await pool.query(
            `INSERT INTO users (id, email, name, password, timezone, createdAt, updatedAt) 
       VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) 
       RETURNING id, email, name, createdAt`,
            [userId, email, name, passwordHash, 'UTC']
        );

        console.log('User created successfully:');
        console.log(JSON.stringify(result.rows[0], null, 2));
    } catch (error) {
        console.error('Error creating user:', error.message);
    } finally {
        await pool.end();
    }
}

// Get email and password from command line args
const email = process.argv[2] || 'huih1108@gmail.com';
const name = process.argv[3] || email.split('@')[0];
const password = process.argv[4] || 'password123';

console.log(`Creating user: ${email} with name: ${name}`);
createUser(email, name, password);
